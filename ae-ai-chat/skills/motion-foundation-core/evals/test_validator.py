"""Deterministic contract tests. Synthetic evidence is not media inspection."""
from pathlib import Path
from copy import deepcopy
import json,subprocess,sys,tempfile,unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from validate_plan import validate

BASE=json.loads((ROOT/'assets'/'example-create-plan.json').read_text(encoding='utf-8'))

def checked_fixture():
    plan=deepcopy(BASE)
    for l in plan['scenes'][0]['layers']:
        l['text']['fit']={'status':'verified','evidence':'Synthetic unit-test evidence only; not a real render.'}
    plan['reviews']={k:{'status':'pass','evidence':['Synthetic contract fixture, not a production preview.']} for k in BASE['reviews']}
    return plan

def source_fixture():
    p=deepcopy(BASE)
    p['task']['kind']='edit_existing'
    p['source']={'status':'provided','preserve_original':True,'assets':[{'id':'S1','file_ref':'synthetic-fixture.mp4','inspected':True,'evidence':'Synthetic test record, not an actual video.','metadata':{'width':1080,'height':1920,'fps_num':30000,'fps_den':1001,'duration_frames':180},'visual_samples':[{'frame':0,'observation':'Synthetic fixture observation.'}],'audio':{'present':True,'handling':'preserve'}}]}
    p['scenes'][0]['origin']='source';p['scenes'][0]['source_asset_ids']=['S1']
    p['scenes'][0]['source_mapping']={'mode':'native','output_bbox':[0,0,1080,1920],'reason':'Synthetic identity mapping.'}
    return p

class ContractTests(unittest.TestCase):
    def assert_code(self,p,code,export=False):
        r=validate(p);self.assertIn(code,[x['code'] for x in r['export_errors' if export else 'edit_errors']]);return r
    def test_edit_can_pass_before_preview(self):self.assertTrue(validate(BASE)['ready_to_edit'])
    def test_export_requires_preview(self):self.assertFalse(validate(BASE)['ready_to_export'])
    def test_full_synthetic_contract_can_pass(self):self.assertTrue(validate(checked_fixture())['ready_to_export'])
    def test_missing_source(self):
        p=deepcopy(BASE);p['task']['kind']='edit_existing';p['source']['status']='missing';self.assert_code(p,'source_missing')
    def test_uninspected_source(self):
        p=source_fixture();p['source']['assets'][0]['inspected']=False;self.assert_code(p,'source_uninspected')
    def test_metadata_is_not_visual_inspection(self):
        p=source_fixture();p['source']['assets'][0]['visual_samples']=[];self.assert_code(p,'visual_audit')
    def test_audio_replacement_requires_authorization(self):
        p=source_fixture();p['source']['assets'][0]['audio']['handling']='replace_authorized';self.assert_code(p,'audio_authorization')
    def test_keep_source_original(self):
        p=source_fixture();p['source']['preserve_original']=False;self.assert_code(p,'preserve_source')
    def test_source_mapping_required(self):
        p=source_fixture();del p['scenes'][0]['source_mapping'];self.assert_code(p,'source_mapping')
    def test_source_sample_bounds(self):
        p=source_fixture();p['source']['assets'][0]['visual_samples'][0]['frame']=180;self.assert_code(p,'visual_sample_bounds')
    def test_rational_fps_preserved(self):self.assertTrue(validate(source_fixture())['ready_to_edit'])
    def test_grid_equation(self):
        p=deepcopy(BASE);p['design']['grid']['column_width']=140;self.assert_code(p,'grid_width')
    def test_text_outside_content(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][0]['bbox'][0]=950;self.assert_code(p,'essential_outside_safe')
    def test_text_explicit_lines_height(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][0]['bbox'][3]=80;self.assert_code(p,'text_height')
    def test_text_overlap(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][1]['bbox']=deepcopy(p['scenes'][0]['layers'][0]['bbox']);self.assert_code(p,'text_overlap')
    def test_intentional_overlap_is_recorded(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][1]['bbox']=deepcopy(p['scenes'][0]['layers'][0]['bbox']);p['scenes'][0]['layers'][1]['overlap_intent']='Explicit text layering in a designed title treatment.';self.assertTrue(validate(p)['ready_to_edit'])
    def test_protected_region(self):
        p=deepcopy(BASE);p['scenes'][0]['protected_regions']=[{'id':'logo','bbox':[72,432,100,100],'reason':'Preserve logo.'}];self.assert_code(p,'protected_overlap')
    def test_timeline_gap(self):
        p=deepcopy(BASE);p['scenes'][0]['start']=1;self.assert_code(p,'timeline_gap_overlap')
    def test_timeline_total(self):
        p=deepcopy(BASE);p['output']['total_frames']=200;self.assert_code(p,'timeline_length')
    def test_duplicate_layer_id(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][1]['id']=p['scenes'][0]['layers'][0]['id'];self.assert_code(p,'layer_id')
    def test_keyframe_off_by_one(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][0]['motion']['keyframes'][0]['frame']=180;self.assert_code(p,'keyframe_frame')
    def test_missing_motion_purpose(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][0]['motion']['purpose']='';self.assert_code(p,'motion_intent')
    def test_hold_not_actually_stable(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][0]['motion']['keyframes'][1]['frame']=90;self.assert_code(p,'unstable_text_hold')
    def test_unexplained_text_distortion(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][0]['motion']['keyframes'].append({'frame':90,'property':'scale','value':[110,80]});self.assert_code(p,'text_distortion')
    def test_placeholder_final(self):
        p=checked_fixture();p['claims']=[{'text':'Revenue increases XX%.','status':'placeholder','visible_label':'MINH HỌA'}];self.assert_code(p,'placeholder_final',True)
    def test_template_placeholders_need_visible_label(self):
        p=checked_fixture();p['task']['deliverable']='template';p['scenes'][0]['layers'][1]['text']['content']='MINH HỌA\nVí dụ bố cục.';p['claims']=[{'text':'XX%','status':'placeholder','visible_label':'MINH HỌA'}];self.assertTrue(validate(p)['ready_to_export'])
    def test_fact_requires_evidence(self):
        p=checked_fixture();p['claims']=[{'text':'Actual business improvement 35%.','status':'verified'}];self.assert_code(p,'claim_evidence',True)
    def test_forged_ready_flag_is_ignored(self):
        p=deepcopy(BASE);p['ready_to_export']=True;self.assertFalse(validate(p)['ready_to_export'])
    def test_plan_only_does_not_authorize_export(self):
        p=checked_fixture();p['task']['deliverable']='plan';self.assert_code(p,'plan_only',True)
    def test_cta_stays_to_end(self):
        p=deepcopy(BASE);p['scenes'][0]['layers'][-1]['motion']['hold'][1]=150;self.assert_code(p,'cta_end_hold')
    def test_unknown_source_type_does_not_crash(self):
        p=source_fixture();p['scenes'][0]['source_asset_ids']=[{}];self.assert_code(p,'unknown_source')
    def test_invalid_root_does_not_crash(self):self.assertFalse(validate([])['ready_to_edit'])
    def test_no_global_font_measurement_claim(self):self.assertIn('does not inspect',validate(BASE)['limits'])
    def test_wrapper_blocks_command(self):
        with tempfile.TemporaryDirectory(prefix='motion-core-test-') as tmp:
            tmp=Path(tmp);plan=tmp/'plan.json';marker=tmp/'ran.txt';p=deepcopy(BASE);p['source']['status']='missing';plan.write_text(json.dumps(p),encoding='utf-8')
            r=subprocess.run([sys.executable,str(ROOT/'scripts'/'gated_command.py'),'--phase','edit',str(plan),'--',sys.executable,'-c','from pathlib import Path; import sys; Path(sys.argv[1]).write_text("ran")',str(marker)],capture_output=True)
            self.assertEqual(r.returncode,3);self.assertFalse(marker.exists())
    def test_wrapper_runs_authorized_edit_command(self):
        with tempfile.TemporaryDirectory(prefix='motion-core-test-') as tmp:
            tmp=Path(tmp);marker=tmp/'ran.txt'
            r=subprocess.run([sys.executable,str(ROOT/'scripts'/'gated_command.py'),'--phase','edit',str(ROOT/'assets'/'example-create-plan.json'),'--',sys.executable,'-c','from pathlib import Path; import sys; Path(sys.argv[1]).write_text("ran")',str(marker)],capture_output=True)
            self.assertEqual(r.returncode,0);self.assertEqual(marker.read_text(),'ran')
    def test_wrapper_blocks_plan_only_execution(self):
        with tempfile.TemporaryDirectory(prefix='motion-core-test-') as tmp:
            tmp=Path(tmp);plan=tmp/'plan.json';marker=tmp/'ran.txt';p=deepcopy(BASE);p['task']['deliverable']='plan';plan.write_text(json.dumps(p),encoding='utf-8')
            r=subprocess.run([sys.executable,str(ROOT/'scripts'/'gated_command.py'),'--phase','edit',str(plan),'--',sys.executable,'-c','from pathlib import Path; import sys; Path(sys.argv[1]).write_text("ran")',str(marker)],capture_output=True)
            self.assertEqual(r.returncode,4);self.assertFalse(marker.exists())

if __name__=='__main__':unittest.main(verbosity=2)

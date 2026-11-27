"""Validate declared motion specifications; no media inspection is performed."""
import argparse
import json
import math
from pathlib import Path
import sys


def num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)


def integer(v):
    return isinstance(v, int) and not isinstance(v, bool)


def filled(v):
    return isinstance(v, str) and bool(v.strip()) and v.strip().lower() not in {'todo', 'tbd', '[fill]', '[điền]'}


def rectangle(v, degenerate=False):
    return isinstance(v, list) and len(v) == 4 and all(num(x) for x in v) and (v[2] >= 0 and v[3] >= 0 and v[2] + v[3] > 0 if degenerate else v[2] > 0 and v[3] > 0)


def contains(a, b):
    return b[0] >= a[0] and b[1] >= a[1] and b[0]+b[2] <= a[0]+a[2]+0.001 and b[1]+b[3] <= a[1]+a[3]+0.001


def intersects(a, b):
    return a[0] < b[0]+b[2] and b[0] < a[0]+a[2] and a[1] < b[1]+b[3] and b[1] < a[1]+a[3]


def validate(plan):
    edit_errors, export_errors, warnings = [], [], []
    def fail(code, path, message, export=False):
        (export_errors if export else edit_errors).append({'code': code, 'path': path, 'message': message})
    if not isinstance(plan, dict):
        return {'schema_version':'1.0','ready_to_edit':False,'ready_to_export':False,'edit_errors':[{'code':'object','path':'$','message':'Plan must be an object.'}],'export_errors':[],'warnings':[],'limits':'Declared specifications only; no media inspection.'}
    if plan.get('schema_version') != '1.0':
        fail('version','schema_version','Use schema version 1.0.')
    task = plan.get('task', {})
    if not isinstance(task, dict): task = {}
    kind = task.get('kind')
    deliverable = task.get('deliverable')
    if kind not in {'create_new','edit_existing'}: fail('task_kind','task.kind','Choose create_new or edit_existing.')
    if deliverable not in {'plan','template','final_video'}: fail('deliverable','task.deliverable','Choose plan, template or final_video.')
    for key in ['objective','audience','scope']:
        if not filled(task.get(key)): fail('brief','task.'+key,'Describe '+key+'.')

    output = plan.get('output', {})
    if not isinstance(output, dict): output = {}
    for key in ['width','height','fps_num','fps_den','total_frames']:
        if not integer(output.get(key)) or output[key] <= 0: fail('output','output.'+key,'A positive integer is required.')
    width, height, total = output.get('width',0), output.get('height',0), output.get('total_frames',0)
    dims_ok = all(integer(x) and x > 0 for x in [width,height,total])

    source = plan.get('source', {})
    if not isinstance(source, dict): source = {}
    source_status = source.get('status')
    if source_status not in {'new','provided','missing'}: fail('source_status','source.status','Declare new, provided or missing.')
    if source_status == 'missing': fail('source_missing','source','Required source is not available; keep the task at provisional planning.')
    if kind == 'edit_existing' and source_status != 'provided': fail('source_required','source','Existing video edits require inspected provided source.')
    if kind == 'edit_existing' and source.get('preserve_original') is not True: fail('preserve_source','source.preserve_original','Keep the source original and write a distinct output.')
    assets = source.get('assets', [])
    if not isinstance(assets, list): assets = []; fail('assets','source.assets','Use an array.')
    if source_status == 'provided' and not assets: fail('source_assets','source.assets','Provided source needs at least one asset.')
    asset_ids = set()
    for i, asset in enumerate(assets):
        path = f'source.assets[{i}]'
        if not isinstance(asset,dict): fail('asset',path,'Use an object.'); continue
        aid = asset.get('id')
        if not filled(aid) or aid in asset_ids: fail('asset_id',path+'.id','Asset IDs must be nonempty and unique.')
        else: asset_ids.add(aid)
        if not filled(asset.get('file_ref')): fail('file_ref',path+'.file_ref','Reference the actual source file or provider ID.')
        if asset.get('inspected') is not True: fail('source_uninspected',path+'.inspected','Inspect the source before editing; do not infer its contents.')
        if not filled(asset.get('evidence')): fail('source_evidence',path+'.evidence','Record the actual inspection method/evidence.')
        metadata = asset.get('metadata', {})
        if not isinstance(metadata,dict): metadata={}
        for key in ['width','height','fps_num','fps_den','duration_frames']:
            if not integer(metadata.get(key)) or metadata[key] <= 0: fail('source_metadata',path+'.metadata.'+key,'Record positive probed metadata.')
        samples = asset.get('visual_samples', [])
        if not isinstance(samples,list) or not samples: fail('visual_audit',path+'.visual_samples','Record at least one actual visual observation; choose more as needed.')
        else:
            for j,sample in enumerate(samples):
                if not isinstance(sample,dict) or not integer(sample.get('frame')) or sample['frame'] < 0 or not filled(sample.get('observation')):
                    fail('visual_sample',path+f'.visual_samples[{j}]','Include frame and observed content.')
                elif integer(metadata.get('duration_frames')) and sample['frame'] >= metadata['duration_frames']:
                    fail('visual_sample_bounds',path+f'.visual_samples[{j}]','Frame is outside the declared source.')
        audio = asset.get('audio', {})
        if not isinstance(audio,dict): audio={}
        if not isinstance(audio.get('present'),bool): fail('audio_audit',path+'.audio.present','Declare whether audio is present.')
        elif audio['present']:
            if audio.get('handling') not in {'preserve','replace_authorized'}: fail('audio_handling',path+'.audio.handling','Preserve audio or record authorized replacement.')
            if audio.get('handling') == 'replace_authorized' and not filled(audio.get('authorization')): fail('audio_authorization',path+'.audio.authorization','Record the user instruction authorizing replacement.')

    design = plan.get('design', {})
    if not isinstance(design,dict): design={}
    if design.get('coordinate_basis') != 'comp_bbox': fail('coordinate_basis','design.coordinate_basis','Use comp_bbox and resolve anchor/Position during implementation.')
    safe = design.get('safe_bbox')
    safe_ok = rectangle(safe)
    if not safe_ok: fail('safe_bbox','design.safe_bbox','Provide [x,y,w,h].')
    elif dims_ok and not contains([0,0,width,height],safe): fail('safe_bounds','design.safe_bbox','The content region must fit the output canvas.')
    if not filled(design.get('font_family')): fail('font','design.font_family','Select a font with the required glyphs.')
    if not isinstance(design.get('palette'),dict) or not design['palette']: fail('palette','design.palette','Declare design colors.')
    grid = design.get('grid', {})
    if not isinstance(grid,dict): grid={}
    grid_ok = integer(grid.get('columns')) and grid.get('columns',0)>0 and num(grid.get('gutter')) and grid['gutter']>=0 and num(grid.get('column_width')) and grid['column_width']>0
    if not grid_ok: fail('grid','design.grid','Declare columns, gutter and column_width.')
    elif safe_ok and abs(grid['columns']*grid['column_width']+(grid['columns']-1)*grid['gutter']-safe[2]) > .01:
        fail('grid_width','design.grid','Columns and gutters do not fill the declared safe width.')

    scenes = plan.get('scenes', [])
    if not isinstance(scenes,list) or not scenes: scenes=[];fail('scenes','scenes','Provide at least one scene.')
    scene_ids=set();cursor=0;all_text=[]
    for i, scene in enumerate(scenes):
        path=f'scenes[{i}]'
        if not isinstance(scene,dict): fail('scene',path,'Use an object.'); continue
        sid=scene.get('id')
        if not filled(sid) or sid in scene_ids: fail('scene_id',path+'.id','Scene IDs must be unique.')
        else: scene_ids.add(sid)
        start,end=scene.get('start'),scene.get('end')
        timing=integer(start) and integer(end) and start>=0 and end>start
        if not timing: fail('scene_timing',path,'Use a nonempty [start,end) frame interval.');duration=0
        else:
            duration=end-start
            if start!=cursor: fail('timeline_gap_overlap',path+'.start','Scene intervals must be contiguous and ordered.')
            cursor=end
        for field in ['intent','layout','layout_reason']:
            if not filled(scene.get(field)): fail('scene_semantics',path+'.'+field,'Describe '+field+'.')
        origin=scene.get('origin')
        if origin not in {'generated','source'}:fail('scene_origin',path+'.origin','Choose generated or source.')
        source_refs=scene.get('source_asset_ids',[])
        if not isinstance(source_refs,list):source_refs=[];fail('source_refs',path+'.source_asset_ids','Use an array.')
        if origin=='source' and not source_refs:fail('source_refs',path+'.source_asset_ids','Reference inspected source assets.')
        for ref in source_refs:
            if not isinstance(ref,str) or ref not in asset_ids:fail('unknown_source',path+'.source_asset_ids','Unknown asset ID: '+str(ref))
        if origin=='source':
            mapping=scene.get('source_mapping',{})
            if not isinstance(mapping,dict) or mapping.get('mode') not in {'contain','cover','native','custom'} or not rectangle(mapping.get('output_bbox')) or not filled(mapping.get('reason')):
                fail('source_mapping',path+'.source_mapping','Declare source-to-output placement and the crop/fit decision.')
        regions=scene.get('protected_regions',[])
        if not isinstance(regions,list):regions=[];fail('protected_regions',path+'.protected_regions','Use an array of regions mapped into output space.')
        for j,region in enumerate(regions):
            if not isinstance(region,dict) or not filled(region.get('id')) or not rectangle(region.get('bbox')) or not filled(region.get('reason')):fail('protected_region',path+f'.protected_regions[{j}]','Provide ID, output bbox and reason.')
        layers=scene.get('layers',[])
        if not isinstance(layers,list) or not layers:layers=[];fail('layers',path+'.layers','Provide at least one layer.')
        layer_ids=set();z_values=set()
        for j,layer in enumerate(layers):
            lp=path+f'.layers[{j}]'
            if not isinstance(layer,dict):fail('layer',lp,'Use an object.');continue
            lid=layer.get('id')
            if not filled(lid) or lid in layer_ids:fail('layer_id',lp+'.id','Layer IDs must be unique in a scene.')
            else:layer_ids.add(lid)
            lk=layer.get('kind')
            if lk not in {'text','shape','line','media'}:fail('layer_kind',lp+'.kind','Choose text, shape, line or media.')
            z=layer.get('z')
            if not integer(z) or z in z_values:fail('z_order',lp+'.z','Use a unique integer z per layer.')
            else:z_values.add(z)
            box=layer.get('bbox');box_ok=rectangle(box,lk=='line')
            if not box_ok:fail('bbox',lp+'.bbox','Provide valid bbox x/y/w/h.')
            if not isinstance(layer.get('essential'),bool):fail('essential',lp+'.essential','Declare whether this information is essential.')
            if layer.get('essential') and safe_ok and box_ok and not contains(safe,box):fail('essential_outside_safe',lp+'.bbox','Essential information lies outside the declared content region.')
            if not filled(layer.get('meaning')):fail('layer_meaning',lp+'.meaning','Explain the role of this layer.')
            if box_ok and lk!='media' and layer.get('role')!='background':
                for region in regions:
                    if isinstance(region,dict) and rectangle(region.get('bbox')) and intersects(box,region['bbox']):
                        fail('protected_overlap',lp+'.bbox','Overlay intersects protected source region '+str(region.get('id'))+'.')
            if lk=='text':
                txt=layer.get('text',{})
                if not isinstance(txt,dict):txt={}
                content=txt.get('content')
                if not filled(content):fail('text_content',lp+'.text.content','Provide the actual text.')
                else:all_text.append(content)
                fs,lead=txt.get('font_size'),txt.get('leading')
                if not num(fs) or fs<=0 or not num(lead) or lead<fs:fail('type_metrics',lp+'.text','Use positive size and leading at least font size.')
                lines=content.count('\n')+1 if isinstance(content,str) else 0
                if not integer(txt.get('max_lines')) or txt['max_lines']<lines:fail('text_lines',lp+'.text.max_lines','Explicit line breaks exceed the declared limit.')
                if box_ok and num(lead) and lines*lead>box[3]+.001:fail('text_height',lp+'.bbox','The explicit lines do not fit the allocated height.')
                if txt.get('align') not in {'left','center','right'}:fail('text_align',lp+'.text.align','Declare paragraph alignment.')
                fit=txt.get('fit',{})
                if not isinstance(fit,dict):fit={}
                if fit.get('status')=='failed':fail('text_fit_failed',lp+'.text.fit','Repair text fitting before implementation.')
                elif fit.get('status') not in {'estimated','verified'}:fail('text_fit_status',lp+'.text.fit','Declare estimated or verified fit.')
                if fit.get('status')!='verified' or not filled(fit.get('evidence')):
                    warnings.append({'code':'text_fit_pending','path':lp+'.text.fit','message':'Fit is not verified with evidence; export remains blocked.'})
                    fail('text_fit_unverified',lp+'.text.fit','Measure/check fit with the actual font and record evidence.',True)
            motion=layer.get('motion',{})
            if not isinstance(motion,dict):motion={}
            for field in ['purpose','anchor_basis','easing']:
                if not filled(motion.get(field)):fail('motion_intent',lp+'.motion.'+field,'Describe '+field+'.')
            intervals={}
            for field in ['entry','hold','exit']:
                interval=motion.get(field)
                if field=='exit' and interval is None:continue
                valid=isinstance(interval,list) and len(interval)==2 and all(integer(v) for v in interval) and 0<=interval[0]<=interval[1]<=duration
                if not valid:fail('motion_interval',lp+'.motion.'+field,'Use a local [start,end] range within the scene.')
                else:intervals[field]=interval
            if 'hold' in intervals:
                if intervals['hold'][1]<=intervals['hold'][0]:fail('hold',lp+'.motion.hold','Provide a nonempty stable interval.')
                if 'entry' in intervals and intervals['entry'][1]>intervals['hold'][0]:fail('entry_hold_overlap',lp+'.motion','Entry must settle before the stable read state.')
                if 'exit' in intervals and intervals['exit'][0]<intervals['hold'][1]:fail('hold_exit_overlap',lp+'.motion','Exit cannot begin before the declared read state ends.')
                if layer.get('role')=='cta' and i==len(scenes)-1 and (intervals['hold'][1]!=duration or motion.get('exit') is not None):
                    fail('cta_end_hold',lp+'.motion','Keep the final CTA readable to the last frame unless the user brief explicitly changes the ending.')
            keys=motion.get('keyframes',[])
            if not isinstance(keys,list) or not keys:keys=[];fail('keyframes',lp+'.motion.keyframes','Provide actual property/value/frame keyframes, including static state.')
            prev={}
            for ki,key in enumerate(keys):
                kp=lp+f'.motion.keyframes[{ki}]'
                if not isinstance(key,dict):fail('keyframe',kp,'Use an object.');continue
                frame,prop=key.get('frame'),key.get('property');value=key.get('value')
                if not integer(frame) or not 0<=frame<duration:fail('keyframe_frame',kp,'Keyframe must be a visible local frame.')
                if not filled(prop):fail('keyframe_property',kp,'Provide the animated property.');continue
                if integer(frame) and frame<prev.get(prop,-1):fail('keyframe_order',kp,'Sort keyframes for each property by frame.')
                if integer(frame):prev[prop]=frame
                if 'value' not in key:fail('keyframe_value',kp,'Provide value.')
                if prop in {'opacity','path_end'} and (not num(value) or not 0<=value<=100):fail('keyframe_range',kp,'Opacity and path_end use 0 to 100.')
                if prop in {'position','scale'}:
                    if not isinstance(value,list) or len(value) not in {2,3} or not all(num(x) for x in value):fail('keyframe_vector',kp,'Provide a finite 2D/3D vector.')
                    elif prop=='scale' and lk=='text' and abs(value[0]-value[1])>.001 and not filled(motion.get('deformation_intent')):fail('text_distortion',kp,'Explain intentional text deformation; do not stretch text to reflow.')
            if lk=='text' and 'hold' in intervals:
                hold=intervals['hold']
                for prop in ['position','scale','opacity','font_size','tracking']:
                    pk=[k for k in keys if isinstance(k,dict) and k.get('property')==prop and integer(k.get('frame')) and 'value' in k]
                    pk.sort(key=lambda k:k['frame'])
                    for a,b in zip(pk,pk[1:]):
                        if a['value']!=b['value'] and max(a['frame'],hold[0])<min(b['frame'],hold[1]):
                            fail('unstable_text_hold',lp+'.motion.hold','Text transform changes across the declared stable read interval.')
                            break
        text_layers=[l for l in layers if isinstance(l,dict) and l.get('kind')=='text' and rectangle(l.get('bbox'))]
        for ai,a in enumerate(text_layers):
            for b in text_layers[ai+1:]:
                if intersects(a['bbox'],b['bbox']) and not filled(a.get('overlap_intent')) and not filled(b.get('overlap_intent')):
                    fail('text_overlap',path+'.layers','Text boxes overlap without intentional layering: '+str(a.get('id'))+' and '+str(b.get('id'))+'.')
        trans=scene.get('transition_out',{})
        if not isinstance(trans,dict) or not filled(trans.get('style')) or not filled(trans.get('reason')):fail('transition',path+'.transition_out','Declare transition or hold/cut, with reason.')
    if dims_ok and cursor!=total:fail('timeline_length','scenes','Scene intervals must cover output.total_frames exactly.')

    claims=plan.get('claims',[])
    if not isinstance(claims,list):claims=[];fail('claims','claims','Use an array, empty when no factual/data claims are made.')
    for i,claim in enumerate(claims):
        cp=f'claims[{i}]'
        if not isinstance(claim,dict) or not filled(claim.get('text')):fail('claim',cp,'Record the claim.');continue
        status=claim.get('status')
        if status not in {'verified','example','placeholder'}:fail('claim_status',cp+'.status','Choose verified, example or placeholder.')
        if status=='verified' and not filled(claim.get('evidence')):fail('claim_evidence',cp+'.evidence','Record the claim source before final export.',True)
        if status=='placeholder' and deliverable!='template':fail('placeholder_final',cp,'Replace placeholders before final export or explicitly deliver a template.',True)
        if status in {'example','placeholder'}:
            label=claim.get('visible_label')
            if not filled(label) or not any(label in text for text in all_text):fail('claim_label',cp+'.visible_label','The example/template label must appear in declared on-screen text.',True)

    if deliverable=='plan':fail('plan_only','task.deliverable','A plan-only request does not authorize final video export.',True)
    reviews=plan.get('reviews',{})
    if not isinstance(reviews,dict):reviews={}
    for field in ['preview','readability','source_preservation','audio','data','format','transitions','cta']:
        check=reviews.get(field,{})
        if not isinstance(check,dict):check={}
        status=check.get('status');evidence=check.get('evidence',[])
        if field!='preview' and status=='not_applicable' and filled(check.get('reason')):continue
        if status!='pass' or not isinstance(evidence,list) or not any(filled(e) for e in evidence):fail('review_pending','reviews.'+field,'Record a passed real check and evidence, or a justified not_applicable.',True)
    return {'schema_version':'1.0','ready_to_edit':not edit_errors,'ready_to_export':not edit_errors and not export_errors,'edit_errors':edit_errors,'export_errors':export_errors,'warnings':warnings,'limits':'This validates declared specification consistency only; it does not inspect source, measure fonts, render AE or authenticate evidence.'}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plan',type=Path)
    parser.add_argument('--phase',choices=['edit','export'],default='edit')
    parser.add_argument('--report',type=Path)
    args=parser.parse_args()
    try:plan=json.loads(args.plan.read_text(encoding='utf-8-sig'));report=validate(plan)
    except (OSError,ValueError,TypeError) as exc:
        report={'ready_to_edit':False,'ready_to_export':False,'error':str(exc)}
    result=json.dumps(report,ensure_ascii=False,indent=2)
    if args.report:args.report.write_text(result+'\n',encoding='utf-8')
    print(result)
    return 0 if report.get('ready_to_'+args.phase) else 1


if __name__=='__main__':
    raise SystemExit(main())

#!/usr/bin/env python3
"""Portable descriptive motion grammar. Standard library only; does not render video."""
from pathlib import Path
import argparse, datetime, gzip, hashlib, io, json, math, random, re, sys

ROOT = Path(__file__).resolve().parents[1]
REG = json.loads((ROOT/'data/registry.json').read_text(encoding='utf-8-sig'))
AXES = ('families','groupings','traversals','temporals','compositions')
ENGINES = {
 'spec':('2d','2.5d','3d'), 'after-effects-2d':('2d',),
 'after-effects':('2d','2.5d'), 'after-effects-advanced':('2d','2.5d','3d'),
 'after-effects-c4d':('2d','2.5d','3d'), 'gsap':('2d','2.5d'),
 'remotion':('2d','2.5d'), 'threejs':('2d','2.5d','3d'),
 'blender':('2d','2.5d','3d'), 'cinema4d':('2d','2.5d','3d'),
 'premiere':('2d',), 'capcut':('2d',)}

class MotionError(ValueError): pass
def canonical(o): return json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def sha(path):
 h=hashlib.sha256()
 with Path(path).open('rb') as f:
  for block in iter(lambda:f.read(1024*1024),b''): h.update(block)
 return h.hexdigest()
def emit(o,path=None):
 s=json.dumps(o,ensure_ascii=False,indent=2)+'\n'
 if path: Path(path).write_text(s,encoding='utf-8')
 else: print(s,end='')
def number_id(value):
 if not isinstance(value,str) or not re.fullmatch(r'MT-[0-9]{7}',value): raise MotionError('INVALID_ID: expected MT-0000000..MT-0999999')
 n=int(value[3:])
 if n>=1000000: raise MotionError('OUT_OF_RANGE: indexed IDs end at MT-0999999')
 return n
def split_id(value):
 n=number_id(value); c=n%10;n//=10;t=n%10;n//=10;o=n%10;n//=10;g=n%10;f=n//10
 return f,g,o,t,c
def make_id(f,g,o,t,c):
 if not (0<=f<100 and all(0<=v<10 for v in (g,o,t,c))):raise MotionError('INVALID_FACTORS')
 return f'MT-{((((f*10+g)*10+o)*10+t)*10+c):07d}'
def definitions(value): return [REG[k][i] for k,i in zip(AXES,split_id(value))]
def record(value):
 f,g,o,t,c=definitions(value)
 dimension=f['dimension']
 coords={'canvas':'Normalized anchors [0,1], origin top-left, x right, y down; final glyph positions require actual font metrics. Local offsets use nominal em, not a claim of measured cap height.', 'world':'Right-handed, x right, y up, z toward camera; 1wu = 1 nominal em; adapt units and axis signs explicitly.'}
 timeline={'local_progress':'u=clamp((frame-start_i)/enterFrames,0,1); v=selected temporal curve(u); apply the family equation to v, using s=clamp(v,0,1) wherever specified.', 'delays':'start_i=activation_rank_i*staggerFrames; nominal stagger=round(.055*fps), at least one frame. Refit or split the scene if the resulting timing is too long.', 'entrance_seconds_per_unit':t['enter_seconds'],'reading_hold_seconds_initial_heuristic':2.0,'exit_seconds':t['exit_seconds'],'reading_rule':'Global read hold begins after the last unit reaches its final read pose. Extend for text complexity, audience and real voice cues; two seconds is an editable starting point, not a reading-speed standard.', 'temporal_definition':t['description'],'action_phase':f.get('action_phase','enter'),'phase_note':'For a shot-scope operator use one shared rig; unit traversal controls visibility/accent only. Portal transit is an exit action after reading.'}
 space=None
 if dimension!='2d':
  space={'representation':('receiver mesh with volumetric letter recesses' if f['id']=='F096' else 'receiver mesh with raised volumetric letter relief' if f['id']=='F095' else 'extruded glyph mesh with real side faces and valid counters') if dimension=='3d' else 'flat text-bearing plane/surface; no glyph side volume', 'depth_em':.16 if dimension=='3d' else 0,'bevel_em':.015 if dimension=='3d' else 0,'camera':'One perspective camera, initial position (0,0,12) wu aimed at origin, vertical FOV 35deg, near .1/far100wu. Refit distance after shaping: distance=frame_height_world/(2*tan(FOV_y/2)). Orthographic families override projection and fit scale.', 'lighting':'Initial key/fill/rim relative intensities 1/.35/.5; key at (4,6,7), fill(-4,2,6), rim(0,3,-3)wu. These are authored starting values; adjust contrast and material response.', 'material':'Initial base #F4EEE2, roughness .4, metallic .15, opacity1; verify actual renderer color/energy behavior.', 'geometry_checks':'Preserve shaping, diacritics and counters; verify bevel clearance, normals, UVs, clipping and backfaces. A camera-facing plane is not solid glyph geometry.'}
 read_pose=f['read_pose']
 if t['slug']=='hold-accent':read_pose+=' Timing profile T09 adds one optional 4 percent scale accent during the reading interval; this interval is near-stable rather than fully static. Remove the accent for critical or dense reading.'
 return {'schema_version':'2.0','id':value,'title':f['title']+' / '+g['slug']+' / '+o['slug']+' / '+t['slug']+' / '+c['slug'],'dimension':dimension,'factors':{'family':f['id'],'grouping':g['id'],'traversal':o['id'],'temporal':t['id'],'composition':c['id']},'operation':{'name':f['title'],'mechanism':f['description'],'movement_equation':f['movement_equation'],'scope':f['scope'],'channels':f['channels'],'output_channels':f['output_channels'],'channel_interpretation':f['sample_semantics']},'grouping':g,'activation':o,'composition':c,'coordinates':coords,'timeline_template':timeline,'read_pose':read_pose,'exit':f['exit'],'scene_3d':space,'conditions':{'required_assets_or_rigs':f['requirements'],'text_boundaries':g['method'],'layout':'Resolve actual font shaping, line breaks, measured bounds and safe insets before rendering. Layout anchors are initial suggestions, not fitted typography.','degeneracy':'Different IDs can yield identical motion on one unit, short text or zero amplitude. Conditional metadata/assets must be supplied or an explicitly labeled fallback selected.'},'mix_and_customize':{'family_specific':f['mix_guidance'],'construction':'Keep a primary action; add independent channels or stage actions sequentially. Declare transform hierarchy, channel ownership, shared camera scope, phase boundaries and final neutral/rest values. For conflicting channels choose override/add/multiply deliberately.','extension':'You may define new paths, deformations, relations or scene topology beyond this catalog; record parent IDs, equations, parameters, seed, constraints and semantic reason.'},'fallbacks':{'reduced':'Remove camera travel, oscillation and deformation; use a brief fade or cut with the same text and sufficient stable reading time.','static':'Show complete exact text in the fitted final layout, retaining labels, values, units and qualifiers.'},'content_invariants':['Preserve exact text, spaces and punctuation.','Keep grapheme combining marks with their base.','Do not fabricate intermediate prices, percentages or claims.','Keep negation and qualifiers readable with their associated statement.'],'lineage':{'technical_basis':f['technical_basis'],'kind':'original authored composition; cited sources support underlying techniques, not this exact preset'},'validation_state':'described_not_rendered_or_visually_reviewed'}

def generate():
 catalog=ROOT/'catalog';catalog.mkdir(exist_ok=True)
 manifest={'schema_version':'2.0','skill_name':'motion-text-custom','language':'en','record_detail':'self_contained_expanded_specification','address_count':1000000,'family_count':100,'axes_cardinality':[100,10,10,10,10],'record_kind':'descriptive_compositional_recipe_addresses','distinct_visual_output_count':None,'rendered_count':0,'visually_reviewed_count':0,'registry_sha256':sha(ROOT/'data/registry.json'),'shards':[]}
 for f in range(100):
  path=catalog/f'family-{f:03d}.jsonl.gz'
  with path.open('wb') as raw:
   with gzip.GzipFile(filename='',mode='wb',fileobj=raw,compresslevel=6,mtime=0) as gz:
    for suffix in range(10000):
     value=f'MT-{f*10000+suffix:07d}'
     gz.write((canonical(record(value))+'\n').encode('utf-8'))
  manifest['shards'].append({'file':path.name,'records':10000,'first_id':f'MT-{f*10000:07d}','last_id':f'MT-{f*10000+9999:07d}','bytes':path.stat().st_size,'sha256':sha(path)})
  if f%10==9:print(f'Generated {(f+1)*10000:,} recipe addresses',file=sys.stderr,flush=True)
 emit(manifest,catalog/'manifest.json')
 return {'generated':1000000,'shards':100,'manifest':str(catalog/'manifest.json')}

def segment(text,grouping,explicit=None):
 if explicit is not None:
  if not isinstance(explicit,list) or not explicit or any(not isinstance(x,str) or x=='' for x in explicit):raise MotionError('INVALID_GROUPS: nonempty list of nonempty strings required')
  if ''.join(explicit)!=text:raise MotionError('CONTENT_MISMATCH: groups must concatenate exactly to source text, including whitespace and punctuation')
  if grouping['slug']=='paired' and len(explicit)!=2:raise MotionError('PAIRED_REQUIRES_TWO_GROUPS')
  # Exact UAX29 boundary validation belongs to the caller segmenter. Reject obvious orphan marks.
  import unicodedata
  if grouping['slug']=='grapheme' and any(unicodedata.combining(x[0]) or x[0]=='\u200d' for x in explicit):raise MotionError('BROKEN_GRAPHEME: group starts with combining mark or joiner')
  return explicit,[], 'caller_supplied_boundaries_not_UAX29_certified_by_Python'
 mode=grouping['slug']
 if mode=='block':return [text],[], 'exact_whole_text'
 if mode=='word':return re.findall(r'\s*\S+\s*',text),[], 'orthographic_whitespace_tokens_not_semantic_words'
 if mode=='balanced':
  words=re.findall(r'\s*\S+\s*',text)
  return [''.join(words[i:i+3]) for i in range(0,len(words),3)],[], 'mechanical_chunks_max3_tokens'
 if mode=='paragraph':return [m.group() for m in re.finditer(r'.+?(?:\n\s*\n|\Z)',text,re.S)],[], 'blank_line_paragraphs'
 if mode=='sentence':
  parts=[m.group() for m in re.finditer(r'.+?(?:[.!?â€¦](?:\s+|$)|\Z)',text,re.S)]
  return parts, ['verify_sentence_abbreviations_and_numeric_punctuation'], 'provisional_regex_sentences'
 missing={'grapheme':'require_UAX29_grapheme_boundaries','line':'require_measured_line_boundaries','phrase':'require_phrase_boundaries','semantic':'require_semantic_span_boundaries','paired':'require_two_contrast_groups'}
 return None,[missing[mode]],'unresolved_no_silent_fallback'

def anchors(composition,n):
 slug=composition['slug'];a=composition['anchor_normalized'];result=[]
 for i in range(n):
  x,y=a
  if slug=='stack':y=min(.88,.18+i*.65/max(n-1,1))
  elif slug in ('two-columns','split-compare'):x=.25 if i%2==0 else .75;y=.35+(i//2)*.12
  elif slug=='radial':
   theta=-math.pi/2+2*math.pi*i/max(n,1);x=.5+.27*math.cos(theta);y=.5+.27*math.sin(theta)
  elif slug=='diagonal':x=.2+.6*i/max(n-1,1);y=.25+.5*i/max(n-1,1)
  else:x=x+(i-(n-1)/2)*.035 if slug=='center' else x+i*.035
  result.append([round(x,6),round(y,6)])
 return result

def ordering(n,order,positions,seed,priorities):
 ids=list(range(n));slug=order['slug']
 if slug=='reverse':ids.reverse()
 elif slug=='center-out':ids.sort(key=lambda i:(abs(i-(n-1)/2),i))
 elif slug=='edges-in':ids.sort(key=lambda i:(-abs(i-(n-1)/2),i))
 elif slug=='odd-even':ids=ids[::2]+ids[1::2]
 elif slug=='even-odd':ids=ids[1::2]+ids[::2]
 elif slug=='seeded':random.Random(seed).shuffle(ids)
 elif slug=='radial':ids.sort(key=lambda i:((positions[i][0]-.5)**2+(positions[i][1]-.5)**2,i))
 elif slug=='diagonal':ids.sort(key=lambda i:(sum(positions[i]),i))
 elif slug=='semantic-priority':
  if priorities is None:return None,['require_semantic_priorities']
  if not isinstance(priorities,list) or len(priorities)!=n or any(not isinstance(x,(int,float)) or not math.isfinite(x) for x in priorities):raise MotionError('INVALID_PRIORITIES: one finite priority per group required')
  ids.sort(key=lambda i:(-priorities[i],i))
 return ids,[]

def curve(name,u):
 u=max(0.,min(1.,u))
 if name=='cubic_out':return 1-(1-u)**3
 if name=='smoothstep':return u*u*(3-2*u)
 if name=='anticipation':return -.08*math.sin(math.pi*u/.2) if u<.2 else 1-(1-(u-.2)/.8)**3
 if name=='damped_spring':return 1 if u==1 else 1-math.exp(-6*u)*math.cos(8*u)
 if name=='steps5':return math.floor(u*5)/5
 if name=='two_beat':return .7*(u/.4) if u<.4 else (.7 if u<.58 else .7+.3*(u-.58)/.42)
 if name=='sine_out':return math.sin(u*math.pi/2)
 if name=='impact_decay':return 1 if u==1 else (1-(1-u)**3)+.08*math.sin(4*math.pi*u)*(1-u)
 return u

def resolve(value,text,engine='spec',fps=30.,hold=2.,seed=0,groups=None,priorities=None,assets=(),width=1920,height=1080,scene_seconds=None):
 if not isinstance(text,str) or not text.strip():raise MotionError('EMPTY_TEXT')
 for name,num in [('fps',fps),('hold',hold),('width',width),('height',height)]:
  if isinstance(num,bool) or not isinstance(num,(int,float)) or not math.isfinite(num) or num<=0:raise MotionError(f'INVALID_{name.upper()}: finite positive number required')
 if fps>240:raise MotionError('INVALID_FPS: supported range (0,240]')
 if engine not in ENGINES:raise MotionError('UNKNOWN_ENGINE: '+engine)
 f,g,o,t,c=definitions(value)
 if f['dimension'] not in ENGINES[engine]:raise MotionError(f"UNSUPPORTED_DIMENSION: {engine} does not implement {f['dimension']}; choose another renderer or explicit fallback ID")
 parts,missing,segmentation=segment(text,g,groups)
 if parts is not None and ''.join(parts)!=text:raise MotionError('INTERNAL_SEGMENTATION_CONTENT_LOSS')
 missing += [r for r in f['requirements'] if r not in assets]
 if engine.startswith('after-effects-') and f['dimension']=='3d' and f['requirements']:missing.append('verify_renderer_specific_custom_rig_support')
 n=len(parts) if parts is not None else 0
 pos=anchors(c,n);order,order_missing=ordering(n,o,pos,seed,priorities);missing+=order_missing
 enter=max(1,round(t['enter_seconds']*fps));exitf=max(1,round(t['exit_seconds']*fps));holdf=max(1,round(hold*fps));stagger=max(1,round(.055*fps))
 # Cap stagger budget to 40% of read-hold; never make entrance arbitrarily long for long text.
 if n>1:stagger=min(stagger,max(1,round(.4*holdf/(n-1))))
 entrance=enter+(n-1)*stagger if n else enter
 total=entrance+holdf+exitf
 if scene_seconds is not None:
  if not isinstance(scene_seconds,(int,float)) or not math.isfinite(scene_seconds) or scene_seconds<=0:raise MotionError('INVALID_SCENE_SECONDS')
  if round(scene_seconds*fps)<total:raise MotionError(f'INSUFFICIENT_SCENE_TIME: need {total} frames ({total/fps:.3f}s) including full read hold')
  requested=round(scene_seconds*fps);holdf+=requested-total;total=requested
 warnings=[]
 if g['slug']=='block' or n==1:warnings.append('degenerate_traversal_single_unit')
 if c['slug']=='split-compare' and n<2:missing.append('comparison_requires_at_least_two_groups')
 if c['slug'] in ('radial','diagonal') and n>12:warnings.append('decorative_layout_may_be_unreadable_for_long_text')
 if any(x<0 or x>1 or y<0 or y>1 for x,y in pos):warnings.append('anchor_outside_canvas_requires_relayout')
 if any(ch in text for ch in '0123456789%â‚«$â‚¬'):warnings.append('keep_numeric_value_unit_qualifier_in_same_read_window; no invented counter_values')
 local=[]
 if order is not None:
  ranks={unit:rank for rank,unit in enumerate(order)}
  for i,p in enumerate(parts or []):
   start=ranks[i]*stagger;end=start+enter
   samples=[]
   for fraction in (0,.25,.5,.75,1):
    q=curve(t['curve'],fraction);values={}
    if f.get('intrinsic_response') and t['curve']=='damped_spring':q=fraction
    for ch in f['channels']:
     mapped=q
     if ch['path'].startswith(('opacity','mask.','stroke.','geometry.assembly','geometry.clip','fill.','path.progress','deformation.progress','layout.','accent.progress')):mapped=max(0,min(1,mapped))
     v=ch['start']+(ch['hold']-ch['start'])*mapped
     values[ch['path']]=round(v,7)
    samples.append({'frame':start+round(fraction*enter),'local_u':fraction,'eased_progress':round(q,7),'channels':values})
   local.append({'index':i,'text':p,'activation_rank':ranks[i],'anchor_normalized':pos[i],'enter_frames':[start,end],'operator_control_samples':samples if f['scope']=='unit' else [],'sample_status':'rig_control_values_only; evaluate movement_equation for geometric output','visibility_progress_samples':[{'frame':start,'opacity':0},{'frame':end,'opacity':1}]})
 source_set=set(f['technical_basis'])
 full_sources={s['id']:s for s in json.loads((ROOT/'data/sources.json').read_text(encoding='utf-8-sig'))['sources']}
 rig=None
 if f['scope']!='unit':
  rig={'scope':f['scope'],'frames':([entrance+holdf,total] if f.get('action_phase')=='exit' else [0,entrance]),'channels':f['channels'],'curve':t['curve'],'single_rig':True,'unit_traversal_role':'visibility_or_accent_only'}
 geometry={'representation':('engraved_receiver_mesh' if f['id']=='F096' else 'embossed_receiver_mesh' if f['id']=='F095' else 'extruded_glyph_mesh') if f['dimension']=='3d' else ('textured_glyph_plane' if f['dimension']=='2.5d' else 'shaped_text_on_canvas'),'depth_em':.16 if f['dimension']=='3d' else 0,'bevel_em':.015 if f['dimension']=='3d' else 0,'requirements':'shape text, preserve glyph/diacritic grouping, verify topology and counters'}
 spatial=None
 if f['dimension']!='2d':spatial={'world_units':'1wu = 1 nominal em; adapter must convert to target engine','axes':'right-handed, x right, y up, z toward camera','camera':{'projection':('orthographic' if f['slug']=='orthographic-card-stack' else 'perspective'),'position_wu':[0,0,12],'target_wu':[0,0,0],'fov_y_deg':35,'aspect':width/height,'near_wu':.1,'far_wu':100,'fit_status':'requires_actual_font_bounds_and_framing'},'lights':[{'role':'key','position_wu':[4,6,7],'relative_intensity':1},{'role':'fill','position_wu':[-4,2,6],'relative_intensity':.35},{'role':'rim','position_wu':[0,3,-3],'relative_intensity':.5}],'material':{'base_color':'#F4EEE2','roughness':.4,'metallic':.15,'opacity':1},'shadow_receiver':'required only when recipe uses projected shadow'}
 return {'schema_version':'2.0','id':value,'kind':'expanded_descriptive_motion_blueprint','source_text':text,'content_invariants':['exact_text','punctuation_and_whitespace','numeric_values_units_and_qualifiers','diacritics_with_base'],'locale':'und','engine':engine,'dimension':f['dimension'],'factors':record(value)['factors'],'canvas':{'width_px':width,'height_px':height,'origin':'top_left','axes':'x right, y down'},'fps':fps,'seed':seed,'grouping':g,'segmentation_provenance':segmentation,'groups':parts,'traversal':{'definition':o,'activation_order':order},'composition':c,'operator':f,'detailed_catalog_specification':record(value),'geometry':geometry,'space3d':spatial,'rig_timeline':rig,'unit_timeline':local,'timeline':{'interval_convention':'[start,end); end is first frame after phase','enter_frames':[0,entrance],'read_hold_frames':[entrance,entrance+holdf],'hold_accent_frame':entrance+holdf//2 if t['slug']=='hold-accent' else None,'hold_accent_spec':{'scale_peak':1.04,'return_scale':1,'duration_frames':max(2,round(.25*fps))} if t['slug']=='hold-accent' else None,'exit_frames':[entrance+holdf,total],'exit_operator':f['exit'],'total_frames':total,'total_seconds':total/fps,'curve':t['curve'],'enter_per_unit_frames':enter,'stagger_frames':stagger},'fallbacks':{'reduced':{'operator':'fade_or_cut','camera_motion':'none','keep_exact_text':True,'read_hold_seconds':holdf/fps},'static':{'operator':'none','text':text,'keep_labels_and_units':True},'dimension_fallback':'requires explicit new recipe ID with parent/reason; no silent remapping'},'applicability':{'status':'conditional' if missing else 'ready_for_implementation','missing_requirements':sorted(set(missing)),'degenerate':n==1,'warnings':warnings},'lineage':{'technical_basis':[full_sources[s] for s in sorted(source_set)],'design_inference':f['design_inference']},'validation':{'state':'described_only','content_preserved':True,'layout_measured':False,'assets_declared_not_verified':list(assets),'engine_project_generated':False,'rendered':False,'visually_reviewed':False,'required_visual_checks':['first_visible','max_displacement','midpoint','start_hold','end_hold','exit','diacritics','bounds','occlusion','contrast']}}

def custom(parents,stages,rationale,seed=0,engine='spec'):
 if not parents or not isinstance(parents,list):raise MotionError('CUSTOM_REQUIRES_PARENTS')
 for p in parents:number_id(p)
 if not isinstance(rationale,str) or not rationale.strip():raise MotionError('CUSTOM_REQUIRES_RATIONALE')
 if not isinstance(stages,list) or len(stages)<2:raise MotionError('CUSTOM_REQUIRES_AT_LEAST_TWO_STAGES')
 if engine not in ENGINES:raise MotionError('UNKNOWN_ENGINE')
 parsed=[];requirements=[];clock=0.
 for i,s in enumerate(stages):
  if not isinstance(s,dict):raise MotionError('INVALID_CUSTOM_STAGE')
  fid=s.get('family');duration=s.get('duration_seconds')
  if not isinstance(fid,str) or not re.fullmatch(r'F\d{3}',fid) or int(fid[1:])>=100:raise MotionError('INVALID_CUSTOM_FAMILY')
  if isinstance(duration,bool) or not isinstance(duration,(int,float)) or not math.isfinite(duration) or duration<=0:raise MotionError('INVALID_CUSTOM_DURATION')
  family=REG['families'][int(fid[1:])]
  if family['dimension'] not in ENGINES[engine]:raise MotionError('UNSUPPORTED_DIMENSION_IN_CUSTOM')
  blend=s.get('blend','override')
  if blend not in ('override','add','multiply'):raise MotionError('INVALID_BLEND')
  try:canonical(s.get('parameters',{}))
  except (ValueError,TypeError):raise MotionError('INVALID_CUSTOM_PARAMETERS: finite JSON values required')
  parsed.append({'index':i,'family':fid,'mechanism':family['slug'],'start_seconds':clock,'end_seconds':clock+duration,'phase':s.get('phase','enter'),'blend':blend,'parameters':s.get('parameters',{}),'transition':s.get('transition','sequential_rest_boundary'),'scope':family['scope']})
  clock+=duration;requirements+=family['requirements']
 payload={'schema_version':'2.0','parent_ids':parents,'stages':parsed,'change_rationale':rationale,'seed':seed,'engine':engine,'content_invariants':['preserve_exact_source_text_when_resolved','no_invented_price_or_count'],'requirements':sorted(set(requirements)),'novelty_status':'author_proposed_choreography_not_proven_unique','validation_state':'described_only_not_rendered'}
 return {'id':'CUST-'+hashlib.sha256(canonical(payload).encode()).hexdigest()[:24],**payload}

def query(domain=None,dimension=None,engine='spec',motion=None,limit=5):
 if engine not in ENGINES:raise MotionError('UNKNOWN_ENGINE')
 if limit<1 or limit>100:raise MotionError('INVALID_LIMIT')
 domains=json.loads((ROOT/'data/domains.json').read_text(encoding='utf-8-sig'))
 profile=next((d for d in domains['profiles'] if d['id']==domain),None) if domain else None
 if domain and profile is None:raise MotionError('UNKNOWN_DOMAIN: '+domain)
 shortlist=[]
 preferred=profile['preferred_families'] if profile else []
 fs=sorted(REG['families'],key=lambda f:(0 if f['id'] in preferred else 1,preferred.index(f['id']) if f['id'] in preferred else int(f['id'][1:])))
 for f in fs:
  if dimension and f['dimension']!=dimension:continue
  if f['dimension'] not in ENGINES[engine]:continue
  if motion and motion.lower() not in (f['slug']+' '+f['description']).lower():continue
  fid=int(f['id'][1:]);g=1;t=0;c=0
  if profile:g=profile.get('default_grouping',1);t=profile.get('default_temporal',0);c=profile.get('default_composition',0)
  shortlist.append({'id':make_id(fid,g,0,t,c),'family':f['slug'],'dimension':f['dimension'],'why_fit':profile['selection_rationale'] if profile and f['id'] in preferred else 'Mechanism matches the filters; verify its semantic fit and brief-specific constraints.','mechanism':f['description'],'constraints':f['requirements']+(profile['invariants'] if profile else []),'implementation_state':'described_only'})
  if len(shortlist)>=limit:break
 return {'domain':profile,'engine':engine,'shortlist':shortlist,'ranking_basis':'authored editorial heuristics; not market popularity evidence'}

def validate(full=False):
 manifest_path=ROOT/'catalog/manifest.json'
 if not manifest_path.exists():raise MotionError('CATALOG_NOT_MATERIALIZED: use generate for full catalog; registry resolve/query remain available')
 m=json.loads(manifest_path.read_text());seen=bytearray(1000000);count=0;errors=[]
 if m.get('address_count')!=1000000 or len(m.get('shards',[]))!=100:errors.append('invalid_manifest_cardinality')
 if m['registry_sha256']!=sha(ROOT/'data/registry.json'):errors.append('registry_hash_mismatch')
 for shard in m['shards']:
  path=ROOT/'catalog'/shard['file']
  if not path.exists():errors.append('missing:'+shard['file']);continue
  if sha(path)!=shard['sha256']:errors.append('hash:'+shard['file'])
  if full:
   rows=0
   with gzip.open(path,'rt',encoding='utf-8') as f:
    for line in f:
     row=json.loads(line);n=number_id(row.get('id'));expected=record(row['id'])
     if row!=expected:raise MotionError('RECORD_SCHEMA_OR_DEFINITION_MISMATCH:'+row['id'])
     if seen[n]:raise MotionError('DUPLICATE_ID:'+row['id'])
     seen[n]=1;count+=1;rows+=1
     if count%100000==0:print(f'Validated {count:,} detailed records',file=sys.stderr,flush=True)
   if rows!=shard['records']:errors.append('row_count:'+shard['file'])
 if full and (count!=1000000 or sum(seen)!=1000000):errors.append('not_exactly_one_million_unique_ids')
 return {'passed':not errors,'full_scan':full,'records_read':count,'unique_ids':sum(seen) if full else None,'shards_checked':len(m['shards']),'hashes_verified':not any(x.startswith('hash:') for x in errors),'errors':errors,'rendered_count':0,'visually_reviewed_count':0,'checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}

def selftest():
 checks=[]
 def ok(name,condition):
  if not condition:raise AssertionError(name)
  checks.append(name)
 def fails(name,fn,token):
  try:fn()
  except MotionError as e:ok(name,token in str(e));return
  raise AssertionError(name+' did not reject')
 text='From $1,299.00, save up to 20% - selected products only.'
 a=resolve(make_id(0,1,0,0,0),text,engine='remotion',fps=30)
 ok('exact_numeric_text_and_whitespace',a['source_text']==text and ''.join(a['groups'])==text)
 b=resolve(make_id(0,1,1,0,0),text,fps=30)
 ok('traversal_changes_unit_activation',a['traversal']['activation_order']!=b['traversal']['activation_order'])
 c=resolve(make_id(0,1,0,1,0),text,fps=30)
 ok('temporal_changes_actual_frame_and_curve',a['timeline']['enter_per_unit_frames']!=c['timeline']['enter_per_unit_frames'] and a['unit_timeline'][0]['operator_control_samples'][1]['channels']!=c['unit_timeline'][0]['operator_control_samples'][1]['channels'])
 d=resolve(make_id(0,1,0,0,0),text,fps=60,hold=3)
 ok('fps_and_hold_change_actual_frame_plan',d['timeline']['read_hold_frames'][1]-d['timeline']['read_hold_frames'][0]==180)
 fails('unsupported_3d_engine_rejected',lambda:resolve(make_id(70,1,0,0,0),'FUTURE',engine='gsap'),'UNSUPPORTED_DIMENSION')
 fails('nonpositive_fps',lambda:resolve(make_id(0,1,0,0,0),'x',fps=0),'INVALID_FPS')
 fails('insufficient_scene',lambda:resolve(make_id(0,1,0,0,0),'x',scene_seconds=.1),'INSUFFICIENT')
 fails('exact_boundary_mismatch',lambda:resolve(make_id(0,0,0,0,0),'a\u0301',groups=['a','x']),'CONTENT_MISMATCH')
 fails('combining_mark_split_rejected',lambda:resolve(make_id(0,0,0,0,0),'a\u0301',groups=['a','\u0301']),'BROKEN_GRAPHEME')
 q=resolve(make_id(0,0,0,0,0),'a\u0301')
 ok('missing_grapheme_segmentation_is_conditional',q['groups'] is None and q['applicability']['status']=='conditional')
 q=resolve(make_id(0,0,0,0,0),'a\u0301',groups=['a\u0301'])
 ok('provided_combining_cluster_preserved',q['groups']==['a\u0301'])
 q=resolve(make_id(0,8,6,0,0),'One')
 ok('one_unit_degeneracy_reported',q['applicability']['degenerate'])
 stages=[{'family':'F012','duration_seconds':.5},{'family':'F070','duration_seconds':.7}]
 cu=custom([make_id(12,1,0,0,0)],stages,'Reveal into solid volume while retaining a stable reading phase',7)
 ok('custom_deterministic',cu==custom([make_id(12,1,0,0,0)],stages,'Reveal into solid volume while retaining a stable reading phase',7))
 ok('custom_outside_index',cu['id'].startswith('CUST-') and cu['parent_ids'])
 fails('custom_3d_unsupported',lambda:custom([make_id(0,1,0,0,0)],stages,'test',0,'remotion'),'UNSUPPORTED')
 for n in (0,1,9999,10000,699999,700000,999999):ok('id_roundtrip_'+str(n),make_id(*split_id(f'MT-{n:07d}'))==f'MT-{n:07d}')
 return {'passed':True,'checks':checks,'count':len(checks),'scope':'CLI behavior/content/time/constraints, not rendering or visual legibility'}

def parser():
 p=argparse.ArgumentParser(description=__doc__);s=p.add_subparsers(dest='command',required=True)
 r=s.add_parser('resolve');r.add_argument('id');r.add_argument('--text',required=True);r.add_argument('--engine',default='spec',choices=ENGINES);r.add_argument('--fps',type=float,default=30);r.add_argument('--hold',type=float,default=2);r.add_argument('--seed',type=int,default=0);r.add_argument('--width',type=int,default=1920);r.add_argument('--height',type=int,default=1080);r.add_argument('--groups-json');r.add_argument('--groups-file');r.add_argument('--priorities-file');r.add_argument('--assets',default='');r.add_argument('--scene-seconds',type=float);r.add_argument('--out')
 q=s.add_parser('query');q.add_argument('--domain');q.add_argument('--dimension',choices=['2d','2.5d','3d']);q.add_argument('--engine',default='spec',choices=ENGINES);q.add_argument('--motion');q.add_argument('--limit',type=int,default=5);q.add_argument('--out')
 q=s.add_parser('describe');q.add_argument('id');q.add_argument('--out')
 q=s.add_parser('sample');q.add_argument('--count',type=int,default=10);q.add_argument('--seed',type=int,default=0);q.add_argument('--out')
 q=s.add_parser('generate');q.add_argument('--out')
 q=s.add_parser('validate');q.add_argument('--full',action='store_true');q.add_argument('--out')
 q=s.add_parser('selftest');q.add_argument('--out')
 q=s.add_parser('custom');q.add_argument('--parents',nargs='+',required=True);q.add_argument('--stages-file',required=True);q.add_argument('--rationale',required=True);q.add_argument('--seed',type=int,default=0);q.add_argument('--engine',choices=ENGINES,default='spec');q.add_argument('--out')
 return p
def main():
 if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
 a=parser().parse_args()
 try:
  if a.command=='resolve':
   if a.groups_file and a.groups_json:raise MotionError('CHOOSE_ONE_GROUP_INPUT')
   groups=json.loads(a.groups_json) if a.groups_json else (json.loads(Path(a.groups_file).read_text(encoding='utf-8-sig')) if a.groups_file else None)
   priorities=json.loads(Path(a.priorities_file).read_text(encoding='utf-8-sig')) if a.priorities_file else None
   result=resolve(a.id,a.text,a.engine,a.fps,a.hold,a.seed,groups,priorities,[x for x in a.assets.split(',') if x],a.width,a.height,a.scene_seconds)
  elif a.command=='query':result=query(a.domain,a.dimension,a.engine,a.motion,a.limit)
  elif a.command=='describe':result=record(a.id)
  elif a.command=='sample':
   if not 1<=a.count<=1000:raise MotionError('SAMPLE_COUNT_1_TO_1000')
   result={'seed':a.seed,'records':[record(f'MT-{n:07d}') for n in random.Random(a.seed).sample(range(1000000),a.count)]}
  elif a.command=='generate':result=generate()
  elif a.command=='validate':result=validate(a.full)
  elif a.command=='selftest':result=selftest()
  else:result=custom(a.parents,json.loads(Path(a.stages_file).read_text(encoding='utf-8-sig')),a.rationale,a.seed,a.engine)
  emit(result,a.out)
  if result.get('passed') is False:sys.exit(1)
 except (MotionError,json.JSONDecodeError,OSError) as e:
  emit({'error':str(e),'status':'rejected','rendered':False},getattr(a,'out',None));sys.exit(2)
if __name__=='__main__':main()

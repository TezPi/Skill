"""Numerically re-check Pillar 2 tables: cubic-bezier peak velocity/time/range, spatial arcs, spring zeta/overshoot/settle.
Rows flagged CHECK are listed in ../ERRATA.md (only ease-in-out-sine). Usage: python3 verify_motion_math.py"""
import math
N=20000
def bez(p,u):
    x1,y1,x2,y2=p
    f=lambda a,b:3*(1-u)**2*u*a+3*(1-u)*u**2*b+u**3
    return f(x1,x2),f(y1,y2)
def stats(p):
    pts=[bez(p,i/N) for i in range(N+1)]
    best=(0,0)
    for (xa,ya),(xb,yb) in zip(pts,pts[1:]):
        if xb-xa>1e-12:
            v=(yb-ya)/(xb-xa)
            if v>best[0]: best=(v,(xa+xb)/2)
    ys=[y for _,y in pts]
    return best[0],best[1],min(ys),max(ys)
def y_at(p,x):
    lo,hi=0,1
    for _ in range(60):
        m=(lo+hi)/2
        if bez(p,m)[0]<x: lo=m
        else: hi=m
    return bez(p,lo)[1]
T={ # name: (curve, claimed vpeak, claimed tpeak, claimed ymin, ymax)
'sine':((0.445,0.05,0.55,0.95),1.56,.5,0,1),'s50':((.5,0,.5,1),2,.5,0,1),'66':((.66,0,.34,1),2.94,.5,0,1),
'75':((.75,0,.25,1),4,.5,0,1),'80':((.8,0,.2,1),5,.5,0,1),'90':((.9,0,.1,1),10,.5,0,1),
'outcubic':((.215,.61,.355,1),2.84,0,0,1),'20-80':((.2,0,.2,1),2.5,.17,0,1),'15-85':((.15,0,.15,1),2.8,.12,0,1),
'10-90':((.1,0,.1,1),3.33,.07,0,1),'ios':((.32,.72,0,1),4.22,.16,0,1),'m3dec':((.05,.7,.1,1),14,0,0,1),
'80-20':((.8,0,.8,1),2.5,.83,0,1),'m3acc':((.3,0,.8,.15),4.25,1,0,1),'outback':((.34,1.56,.64,1),4.59,0,0,1.098),
'inback':((.36,0,.66,-.56),4.59,1,-.098,1),'inoutback':((.68,-.6,.32,1.6),5,.5,-.105,1.105)}
print(f"{'curve':10} {'Vpk claim':>9} {'Vpk real':>8} {'tpk claim':>9} {'tpk real':>8} {'ymin':>7} {'ymax':>7}")
for k,(p,v,t,a,b) in T.items():
    V,tp,mn,mx=stats(p)
    flag='' if abs(V-v)/v<.03 and abs(tp-t)<.03 and abs(mn-a)<.005 and abs(mx-b)<.005 else '  <-- CHECK'
    print(f"{k:10} {v:9.2f} {V:8.2f} {t:9.2f} {tp:8.2f} {mn:7.3f} {mx:7.3f}{flag}")
# arcs: x,y progress at time t=0.5 and max bow (distance from diagonal / diag len?)
A={'quarter':((.47,0,.745,.715),(.39,.575,.565,1),29.1,73.6,31.4),'soft':((.5,0,.5,1),(.15,0,.15,1),50,83.9,32.4),
'parab':((.55,.085,.68,.53),(.25,.46,.45,.94),25.6,77.1,36.5),'swoop':((.2,0,.2,1),(.8,0,.8,1),81.4,18.6,44.4),
'jhook':((.85,0,.85,1),(.34,1.56,.64,1),16.1,108.7,66.6)}
for k,(px,py,cx,cy,bow) in A.items():
    X=y_at(px,.5)*100;Y=y_at(py,.5)*100
    mb=max(abs(y_at(px,t/400)-y_at(py,t/400)) for t in range(401))*100
    print(f"arc {k:8} X@.5 {cx:6.1f}/{X:6.1f}  Y@.5 {cy:6.1f}/{Y:6.1f}  maxbow(|x-y|) claim {bow}/{mb:5.1f}")
# springs
S={'snappy':(1,400,28,4.6,353),'ios':(1,280,27.4,1.1,377),'saas':(1,300,24,4.9,411),'crit':(1,200,28.3,0,612),
'playful':(1,250,14,21.2,673),'heavy':(2,90,24,.2,902),'remdef':(1,100,10,16.3,950),'elastic':(1,180,8,37.5,1163)}
for k,(m,kk,c,ov,st) in S.items():
    z=c/(2*math.sqrt(kk*m)); w=math.sqrt(kk/m)
    o=math.exp(-math.pi*z/math.sqrt(1-z*z))*100 if z<1 else 0
    # simulate settle 1%
    x,v,dt,last=0.0,0.0,1e-4,0
    for i in range(int(5/dt)):
        a=(-kk*(x-1)-c*v)/m; v+=a*dt; x+=v*dt
        if abs(x-1)>0.01: last=i*dt
    print(f"spring {k:8} zeta {z:.2f} overshoot claim {ov}/{o:.1f}%  settle claim {st}/{last*1000:.0f}ms")

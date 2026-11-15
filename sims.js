/* Figuras interactivas de Mecánica de Máquinas. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- Mecánica de Máquinas: figuras interactivas ---- */
const NQ=x=>{const r=Math.round(x*1000)/1000;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(3).replace(/0+$/,'')).replace('.',',');};
const N1=x=>(Math.abs(x)<1e-9?0:x).toFixed(1).replace('.',',');
const N2=x=>(Math.abs(x)<1e-9?0:x).toFixed(2).replace('.',',');
const Eje=(a,x0,y0,w,h,xlab,ylab)=>{a.line(x0,y0,x0+w,y0,C.muted,1.5);a.line(x0,y0,x0,y0-h,C.muted,1.5);
 if(xlab)a.txt(xlab,x0+w,y0+30,C.muted,11,'right');if(ylab)a.txt(ylab,x0-2,y0-h-8,C.muted,11);};
const ticks=(max,n)=>{const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),c=[1,2,2.5,5,10].find(k=>k*p>=raw)*p;const o=[];for(let v=c;v<=max*1.0001;v+=c)o.push(v);return o;};
const Barra=(a,p,q,col,w)=>{a.line(p[0],p[1],q[0],q[1],col||C.text,w||5);};
const Pin=(a,p,col)=>{a.circ(p[0],p[1],5,C.bg,true);a.circ(p[0],p[1],5,col||C.text,false);};
const Tierra=(a,x,y,col)=>{const c=col||C.muted;a.line(x-14,y,x+14,y,c,2);for(let i=-3;i<=3;i++)a.line(x+i*4,y,x+i*4-5,y+8,c,1.2);};
const V2=(x,y)=>[x,y];
const sub=(p,q)=>[p[0]-q[0],p[1]-q[1]];
const nrm=p=>Math.hypot(p[0],p[1]);

/* T1 · Grübler y Grashof */
SIMS.grubler=el=>build(el,{w:660,h:400,
 selects:[{k:'m',v:'cuad',l:'mecanismo',opts:[['cuad','cuadrilátero articulado'],['bmc','manivela-biela-corredera'],['leva','leva-seguidor (par superior)'],['cinco','cadena de 5 barras']]}],
 sliders:[{k:'a',v:40,min:20,max:160,step:5,l:'barra a (manivela)',u:'mm'},{k:'b',v:90,min:20,max:200,step:5,l:'barra b (acoplador)',u:'mm'},
  {k:'c',v:100,min:20,max:200,step:5,l:'barra c (balancín)',u:'mm'},{k:'d',v:120,min:20,max:220,step:5,l:'barra d (bastidor)',u:'mm'},
  {k:'th',v:60,min:0,max:360,step:2,l:'ángulo de la manivela',u:'°'}],
 draw(a){a.clear();
  const cfg={cuad:{n:4,pi:4,ps:0,nom:'cuadrilátero articulado'},
             bmc:{n:4,pi:4,ps:0,nom:'manivela-biela-corredera'},
             leva:{n:3,pi:2,ps:1,nom:'leva-seguidor'},
             cinco:{n:5,pi:5,ps:0,nom:'cadena de 5 barras'}}[a.st.m];
  const gdl=3*(cfg.n-1)-2*cfg.pi-cfg.ps;
  // dibujo
  const cx=80,cy=330,S=1.45;
  const th=a.st.th*Math.PI/180;
  if(a.st.m==='cuad'||a.st.m==='cinco'){
    const A=[cx+a.st.a*S*Math.cos(th), cy-a.st.a*S*Math.sin(th)];
    const O4=[cx+a.st.d*S, cy];
    const dAO=nrm(sub(O4,A))/S;
    let B=null;
    if(dAO<=a.st.b+a.st.c && dAO>=Math.abs(a.st.b-a.st.c)){
      const dd=dAO*S, x=(a.st.b*a.st.b-a.st.c*a.st.c+dAO*dAO)/(2*dAO)*S, h=Math.sqrt(Math.max(0,a.st.b*a.st.b*S*S-x*x));
      const u=[(O4[0]-A[0])/dd,(O4[1]-A[1])/dd];
      const P=[A[0]+x*u[0],A[1]+x*u[1]];
      B=[P[0]+h*u[1],P[1]-h*u[0]];}
    Tierra(a,cx,cy+6);Tierra(a,O4[0],cy+6);
    a.line(cx,cy,O4[0],cy,C.muted,2,[6,4]);
    Barra(a,[cx,cy],A,C.a,6); Pin(a,[cx,cy],C.a);
    if(B){Barra(a,A,B,C.c,6);Barra(a,B,O4,C.e,6);Pin(a,A,C.c);Pin(a,B,C.e);Pin(a,O4,C.e);
      a.txt('A',A[0]+8,A[1]-8,C.muted,12);a.txt('B',B[0]+8,B[1]-8,C.muted,12);}
    else {Pin(a,A,C.c);a.txt('posición imposible con estas longitudes',cx,cy-150,C.b,13);}
    a.txt('O₂',cx-18,cy+22,C.muted,12);a.txt('O₄',O4[0]-6,cy+22,C.muted,12);
    a.txt('2',((cx+A[0])/2)+8,((cy+A[1])/2),C.a,12);
    if(B){a.txt('3',(A[0]+B[0])/2+8,(A[1]+B[1])/2,C.c,12);a.txt('4',(B[0]+O4[0])/2+8,(B[1]+O4[1])/2,C.e,12);}
    a.txt('1',(cx+O4[0])/2,cy+22,C.muted,12);
  } else if(a.st.m==='bmc'){
    const r=a.st.a*S, L=a.st.b*S*1.6, yb=cy-60;
    const A=[cx+r*Math.cos(th), yb-r*Math.sin(th)];
    const xp=A[0]+Math.sqrt(Math.max(0,L*L-(A[1]-yb)*(A[1]-yb)));
    Tierra(a,cx,yb+6);
    a.line(cx-20,yb+70,cx+420,yb+70,C.muted,1.5);
    a.g.strokeStyle=C.muted;a.g.lineWidth=1.2;a.g.setLineDash([5,4]);a.g.beginPath();a.g.moveTo(cx,yb);a.g.lineTo(cx+420,yb);a.g.stroke();a.g.setLineDash([]);
    Barra(a,[cx,yb],A,C.a,6);Barra(a,A,[xp,yb],C.c,6);
    a.g.fillStyle=C.e;a.g.fillRect(xp-22,yb-16,44,32);
    Pin(a,[cx,yb],C.a);Pin(a,A,C.c);Pin(a,[xp,yb],C.bg);
    a.txt('2',(cx+A[0])/2+8,(yb+A[1])/2,C.a,12);a.txt('3',(A[0]+xp)/2,(A[1]+yb)/2-10,C.c,12);a.txt('4',xp,yb+34,C.e,12,'center');
    a.txt('carrera = 2r = '+NQ(2*a.st.a)+' mm',cx,yb+96,C.muted,12);
  } else if(a.st.m==='leva'){
    const ox=cx+130, oy=cy-40, R=52, e=18;
    const s=R+e*Math.sin(th);
    a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
    for(let t=0;t<=2*Math.PI+0.01;t+=0.02){const rr=R+e*Math.sin(t+th);
      const X=ox+rr*Math.cos(t),Y=oy-rr*Math.sin(t);t===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}
    a.g.closePath();a.g.stroke();
    a.circ(ox,oy,4,C.a,true);Tierra(a,ox,oy+90);
    a.line(ox,oy-s,ox,oy-s-90,C.c,6);
    a.circ(ox,oy-s,8,C.c,false);
    a.g.fillStyle=C.muted;a.g.globalAlpha=.25;a.g.fillRect(ox-16,oy-s-92,32,26);a.g.globalAlpha=1;
    a.txt('seguidor',ox+24,oy-s-70,C.c,12);
    a.txt('leva (par superior)',ox+70,oy+20,C.a,12);
    a.txt('elevación s = '+NQ(s-R+e)+' px',ox-120,oy+90,C.muted,12);
  }
  // panel GDL
  const bx=380,by=60;
  a.txt('Ecuación de Grübler',bx,by-22,C.text,13);
  [['eslabones n',cfg.n],['pares inferiores pᵢ',cfg.pi],['pares superiores pₛ',cfg.ps]].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*24,C.muted,12);a.txt(String(d[1]),bx+200,by+i*24,C.text,12,'right');});
  a.txt('GDL = 3(n−1) − 2pᵢ − pₛ',bx,by+88,C.a,13);
  a.txt('= 3·'+(cfg.n-1)+' − '+(2*cfg.pi)+' − '+cfg.ps+' = '+gdl,bx,by+112,C.a,15);
  const colg=gdl===1?C.c:(gdl<=0?C.b:C.e);
  a.txt(gdl===1?'✓ desmodrómico: una entrada basta':(gdl<=0?'estructura (no es un mecanismo)':'hacen falta '+gdl+' entradas'),bx,by+138,colg,12);
  // Grashof
  let gr='';
  if(a.st.m==='cuad'||a.st.m==='bmc'){
    const L=[a.st.a,a.st.b,a.st.c,a.st.d].sort((p,q)=>p-q);
    const ok=L[0]+L[3]<=L[1]+L[2];
    const mins=Math.min(a.st.a,a.st.b,a.st.c,a.st.d);
    let tipo;
    if(!ok)tipo='doble balancín (no hay manivela)';
    else if(mins===a.st.d)tipo='doble manivela';
    else if(mins===a.st.b)tipo='doble balancín (la corta es el acoplador)';
    else tipo='manivela-balancín';
    gr=`<b>Grashof</b>: a+d = ${NQ(L[0]+L[3])} y b+c = ${NQ(L[1]+L[2])} ⇒ ${ok?'se cumple ✓':'NO se cumple ✗'} · ${tipo}.<br>`;}
  a.html(`<b>${cfg.nom}</b> · ${gr}GDL = 3(${cfg.n}−1) − 2·${cfg.pi} − ${cfg.ps} = <b>${gdl}</b>.
  ${gdl===1?'Con un solo grado de libertad, imponiendo el giro de la manivela queda determinado todo el movimiento.':(gdl<=0?'Con GDL ≤ 0 no hay movimiento relativo posible: es una estructura.':'Con varios grados de libertad hacen falta tantos accionamientos como GDL.')}<br>
  <span class="hint">Cambia las longitudes y observa cuándo el cuadrilátero deja de poder cerrarse o deja de tener manivela: ésa es la ley de Grashof en acción.</span>`);}});

/* T2 · Cinemática: velocidades y CIR */
SIMS.cinematica=el=>build(el,{w:660,h:420,
 selects:[{k:'ver',v:'vel',l:'mostrar',opts:[['vel','vectores velocidad'],['cir','centro instantáneo I₂₄'],['acel','aceleraciones']]}],
 sliders:[{k:'th',v:90,min:0,max:360,step:2,l:'ángulo θ₂',u:'°'},{k:'w2',v:5,min:1,max:20,step:0.5,l:'ω₂',u:'rad/s'},
  {k:'r2',v:100,min:40,max:160,step:5,l:'O₂A',u:'mm'},{k:'r3',v:300,min:150,max:380,step:5,l:'AB',u:'mm'},
  {k:'r4',v:250,min:100,max:340,step:5,l:'O₄B',u:'mm'},{k:'r1',v:350,min:200,max:420,step:5,l:'O₂O₄',u:'mm'}],
 draw(a){a.clear();
  const S=0.78, th=a.st.th*Math.PI/180, w2=a.st.w2;
  const O2=[60,340], O4=[60+a.st.r1*S,340];
  const A=[O2[0]+a.st.r2*S*Math.cos(th), O2[1]-a.st.r2*S*Math.sin(th)];
  const dv=sub(O4,A), d=nrm(dv)/S;
  let B=null, ok=(d<=a.st.r3+a.st.r4 && d>=Math.abs(a.st.r3-a.st.r4));
  let w3=0,w4=0,al3=0,al4=0;
  if(ok){
    const x=(a.st.r3*a.st.r3-a.st.r4*a.st.r4+d*d)/(2*d), h=Math.sqrt(Math.max(0,a.st.r3*a.st.r3-x*x));
    const u=[dv[0]/(d*S),dv[1]/(d*S)];
    const P=[A[0]+x*S*u[0],A[1]+x*S*u[1]];
    B=[P[0]+h*S*u[1],P[1]-h*S*u[0]];
    // en metros, y hacia arriba positivo
    const rBA=[(B[0]-A[0])/S/1000, -(B[1]-A[1])/S/1000];
    const rBO=[(B[0]-O4[0])/S/1000, -(B[1]-O4[1])/S/1000];
    const vA=[-w2*(a.st.r2/1000)*Math.sin(th), w2*(a.st.r2/1000)*Math.cos(th)];
    // vA + w3 k x rBA = w4 k x rBO  →  [-rBA_y, rBO_y ; rBA_x, -rBO_x][w3;w4] = -vA
    const M=[[-rBA[1],rBO[1]],[rBA[0],-rBO[0]]];
    const det=M[0][0]*M[1][1]-M[0][1]*M[1][0];
    w3=(-vA[0]*M[1][1]+vA[1]*M[0][1])/det;
    w4=(-M[0][0]*vA[1]+M[1][0]*vA[0])/det;
    const aA=[-w2*w2*(a.st.r2/1000)*Math.cos(th), -w2*w2*(a.st.r2/1000)*Math.sin(th)];
    const rhs=[-aA[0]+w3*w3*rBA[0]-w4*w4*rBO[0], -aA[1]+w3*w3*rBA[1]-w4*w4*rBO[1]];
    al3=(rhs[0]*M[1][1]-rhs[1]*M[0][1])/det;
    al4=(M[0][0]*rhs[1]-M[1][0]*rhs[0])/det;
    // dibujo
    Tierra(a,O2[0],O2[1]+6);Tierra(a,O4[0],O4[1]+6);
    a.line(O2[0],O2[1],O4[0],O4[1],C.muted,2,[6,4]);
    Barra(a,O2,A,C.a,6);Barra(a,A,B,C.c,6);Barra(a,B,O4,C.e,6);
    Pin(a,O2,C.a);Pin(a,A,C.c);Pin(a,B,C.e);Pin(a,O4,C.e);
    a.txt('A',A[0]+9,A[1]-9,C.muted,12);a.txt('B',B[0]+9,B[1]-9,C.muted,12);
    a.txt('O₂',O2[0]-20,O2[1]+22,C.muted,12);a.txt('O₄',O4[0]-8,O4[1]+22,C.muted,12);
    const vA_m=nrm(vA), vB_m=Math.abs(w4)*nrm(rBO);
    if(a.st.ver==='vel'){
      const k=110;
      a.arrow(A[0],A[1],A[0]+vA[0]*k,A[1]-vA[1]*k,C.f,2.6);
      const lx=A[0]+vA[0]*k, ly=A[1]-vA[1]*k;
      a.txt('v_A = '+N2(vA_m)+' m/s',Math.max(8,lx-10),ly+20,C.f,12);
      const vB=[-w4*rBO[1], w4*rBO[0]];
      a.arrow(B[0],B[1],B[0]+vB[0]*k,B[1]-vB[1]*k,C.f,2.6);
      a.txt('v_B = '+N2(vB_m)+' m/s',Math.max(8,B[0]+vB[0]*k-10),B[1]-vB[1]*k+20,C.f,12);
    } else if(a.st.ver==='cir'){
      // I24 = interseccion O2A con O4B
      const p1=O2,d1=sub(A,O2),p2=O4,d2=sub(B,O4);
      const den=d1[0]*d2[1]-d1[1]*d2[0];
      if(Math.abs(den)>1e-6){
        const t=((p2[0]-p1[0])*d2[1]-(p2[1]-p1[1])*d2[0])/den;
        const I=[p1[0]+t*d1[0],p1[1]+t*d1[1]];
        a.line(O2[0],O2[1],I[0],I[1],C.b,1.4,[5,4]);
        a.line(O4[0],O4[1],I[0],I[1],C.b,1.4,[5,4]);
        a.line(A[0],A[1],I[0],I[1],C.b,1,[3,3]);
        a.circ(I[0],I[1],7,C.b,true);
        a.txt('I₂₄',I[0]+10,I[1]-8,C.b,13);
        a.txt('ω₂·O₂I = ω₄·O₄I',I[0]+10,I[1]+12,C.muted,11);}
    } else {
      const k=28;
      const aAx=aA[0],aAy=aA[1];
      a.arrow(A[0],A[1],A[0]+aAx*k,A[1]-aAy*k,C.d,2.6);
      a.txt('a_A = '+N2(nrm(aA))+' m/s²',A[0]+aAx*k+6,A[1]-aAy*k,C.d,12);
      const anB=[-w4*w4*rBO[0],-w4*w4*rBO[1]], atB=[-al4*rBO[1],al4*rBO[0]];
      a.arrow(B[0],B[1],B[0]+anB[0]*k,B[1]-anB[1]*k,C.d,2.2);
      a.txt('normal',B[0]+anB[0]*k+4,B[1]-anB[1]*k,C.d,11);
      a.arrow(B[0],B[1],B[0]+atB[0]*k,B[1]-atB[1]*k,C.b,2.2);
      a.txt('tangencial',B[0]+atB[0]*k+4,B[1]-atB[1]*k,C.b,11);}
  } else {
    Tierra(a,O2[0],O2[1]+6);Tierra(a,O4[0],O4[1]+6);
    Barra(a,O2,A,C.a,6);Pin(a,A,C.a);
    a.txt('con estas longitudes el mecanismo no puede cerrarse en esta posición',O2[0],140,C.b,13);}
  const bx=380,by=50;
  a.txt('Resultados en esta posición',bx,by-20,C.text,13);
  [['ω₂ (entrada)',NQ(w2)+' rad/s'],['ω₃',ok?NQ(Math.abs(w3))+' rad/s':'—'],['ω₄',ok?NQ(Math.abs(w4))+' rad/s':'—'],
   ['α₂',0+' rad/s²'],['α₃',ok?NQ(al3)+' rad/s²':'—'],['α₄',ok?NQ(al4)+' rad/s²':'—']].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*23,C.muted,12);a.txt(d[1],bx+200,by+i*23,C.text,12,'right');});
  a.html(`Cuadrilátero O₂ABO₄ con O₂A = ${a.st.r2} mm, AB = ${a.st.r3} mm, O₄B = ${a.st.r4} mm y bastidor ${a.st.r1} mm, girando la manivela a ω₂ = ${NQ(w2)} rad/s (α₂ = 0).<br>
  ${ok?`En θ₂ = ${a.st.th}°: <b>ω₃ = ${NQ(Math.abs(w3))} rad/s</b>, <b>ω₄ = ${NQ(Math.abs(w4))} rad/s</b>, α₃ = ${NQ(al3)} rad/s² y <b>α₄ = ${NQ(al4)} rad/s²</b>. Todo sale de v_B = v_A + ω₃ × r_BA y de su homóloga en aceleraciones.`:'En esta posición las longitudes no permiten cerrar el cuadrilátero: la barra no llega.'}<br>
  <span class="hint">Cambia a «centro instantáneo» y verás que I₂₄ está donde se cortan las prolongaciones de O₂A y O₄B: con él, ω₄ sale de una simple proporción de distancias.</span>`);}});

/* T3 · Volante de inercia */
SIMS.volante=el=>build(el,{w:660,h:430,
 sliders:[{k:'n',v:300,min:60,max:1500,step:10,l:'velocidad media',u:'rpm'},{k:'E',v:1250,min:100,max:5000,step:50,l:'ΔEc máxima en el ciclo',u:'J'},
  {k:'d',v:2,min:0.5,max:10,step:0.1,l:'coeficiente de fluctuación δ',u:'%'},{k:'Jm',v:0.8,min:0,max:20,step:0.1,l:'inercia del mecanismo',u:'kg·m²'},
  {k:'e',v:30,min:10,max:120,step:5,l:'espesor del volante',u:'mm'}],
 draw(a){a.clear();
  const wm=2*Math.PI*a.st.n/60, de=a.st.d/100, rho=7850;
  const JG=a.st.E/(de*wm*wm), Jv=Math.max(0,JG-a.st.Jm);
  const R=Math.pow(2*Jv/(rho*Math.PI*a.st.e/1000),0.25), masa=rho*Math.PI*R*R*a.st.e/1000;
  const wmax=wm*(1+de/2), wmin=wm*(1-de/2);
  const x0=60,y0=150,wv=320,hv=110;
  a.line(x0,y0,x0+wv,y0,C.muted,1.4);a.line(x0,y0-hv/2-14,x0,y0+hv/2+14,C.muted,1.4);
  a.txt('Mm + Mr',x0+4,y0-hv/2-20,C.muted,11);
  const f=t=>Math.sin(2*Math.PI*t)+0.45*Math.sin(4*Math.PI*t+1);
  a.g.fillStyle=C.a;a.g.globalAlpha=0.16;a.g.beginPath();a.g.moveTo(x0,y0);
  for(let i=0;i<=240;i++){const t=i/240,v=f(t);a.g.lineTo(x0+t*wv,y0-(v>0?v:0)*hv/3);}
  a.g.lineTo(x0+wv,y0);a.g.closePath();a.g.fill();a.g.globalAlpha=1;
  a.g.strokeStyle=C.a;a.g.lineWidth=2.6;a.g.beginPath();
  for(let i=0;i<=240;i++){const t=i/240;const X=x0+t*wv,Y=y0-f(t)*hv/3;i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}
  a.g.stroke();
  a.txt('área sombreada = energía que acelera',x0+wv,y0-hv/2-6,C.muted,11,'right');
  a.txt('en régimen, área + = área −',x0+wv,y0+hv/2+10,C.muted,11,'right');
  // curva omega
  const y1=320, hv2=64;
  a.line(x0,y1,x0+wv,y1,C.muted,1.4);
  a.txt('ω(θ₂)',x0+4,y1-hv2-18,C.c,11);
  a.txt('θ₂ (un ciclo)',x0+wv,y1+22,C.muted,11,'right');
  let acc=0; const pts=[];
  for(let i=0;i<=240;i++){acc+=f(i/240)/240;pts.push(acc);}
  const mx=Math.max(...pts),mn=Math.min(...pts);
  a.g.strokeStyle=C.c;a.g.lineWidth=2.6;a.g.beginPath();
  pts.forEach((v,i)=>{const X=x0+i/240*wv, Y=y1-hv2/2-((v-(mx+mn)/2)/((mx-mn)/2))*hv2/2;i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});
  a.g.stroke();
  a.line(x0,y1-hv2/2,x0+wv,y1-hv2/2,C.muted,1,[5,4]);
  a.line(x0,y1-hv2,x0+wv,y1-hv2,C.muted,1,[2,4]);
  a.txt('ω_max',x0-6,y1-hv2+4,C.muted,10,'right');
  a.txt('ω_media',x0-6,y1-hv2/2+4,C.muted,10,'right');
  a.txt('ω_min',x0-6,y1+4,C.muted,10,'right');
  // volante
  const vx=520,vy=130,Rp=Math.min(88,28+R*78);
  a.g.fillStyle=C.e;a.g.globalAlpha=0.14;a.circ(vx,vy,Rp,C.e,true);a.g.globalAlpha=1;
  a.circ(vx,vy,Rp,C.e,false);
  for(let i=0;i<6;i++){const t=i*Math.PI/3;a.line(vx+11*Math.cos(t),vy+11*Math.sin(t),vx+Rp*Math.cos(t),vy+Rp*Math.sin(t),C.e,2);}
  a.circ(vx,vy,11,C.text,true);
  a.txt('R = '+N2(R)+' m · '+N1(masa)+' kg',vx,vy+Rp+22,C.e,13,'center');
  const bx=424,by=268;
  [['ω media',N1(wm)+' rad/s'],['ω_max − ω_min',N2(wmax-wmin)+' rad/s'],['J necesario',N1(JG)+' kg·m²'],['J del volante',N1(Jv)+' kg·m²'],['masa del disco',N1(masa)+' kg']].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*24,C.muted,12);a.txt(d[1],bx+200,by+i*24,C.text,12,'right');});
  a.html(`Con n = ${a.st.n} rpm ⇒ ω<sub>m</sub> = ${N1(wm)} rad/s, ΔE<sub>c,max</sub> = ${a.st.E} J y δ = ${NQ(a.st.d)} %:<br>
  <b>J<sub>G</sub> = ΔE<sub>c,max</sub> / (δ·ω<sub>m</sub>²) = ${N1(JG)} kg·m²</b> ⇒ descontando la del mecanismo, el volante necesita <b>${N1(Jv)} kg·m²</b>.<br>
  Disco de acero de ${a.st.e} mm de espesor: R = (2J/ρπe)<sup>1/4</sup> = <b>${N2(R)} m</b> y <b>${N1(masa)} kg</b>. La velocidad oscila entre ${N1(wmin)} y ${N1(wmax)} rad/s.<br>
  <span class="hint">Baja δ a la mitad: J se duplica, pero el radio sólo crece un 19 % porque va con R⁴. La masa, en cambio, se dispara.</span>`);}});

/* T4 · Vibraciones */
SIMS.vibracion=el=>build(el,{w:660,h:420,
 selects:[{k:'v',v:'resp',l:'ver',opts:[['resp','respuesta libre en el tiempo'],['amp','amplificación frente a r'],['tr','transmisibilidad (aislamiento)']]}],
 sliders:[{k:'m',v:60,min:5,max:3000,step:5,l:'masa',u:'kg'},{k:'k',v:282,min:5,max:3000,step:1,l:'rigidez',u:'kN/m'},
  {k:'xi',v:5,min:0,max:120,step:1,l:'amortiguamiento ξ',u:'%'},{k:'fe',v:50,min:1,max:200,step:1,l:'frecuencia de excitación',u:'Hz'}],
 draw(a){a.clear();
  const m=a.st.m, k=a.st.k*1000, xi=a.st.xi/100;
  const wn=Math.sqrt(k/m), fn=wn/(2*Math.PI), we=2*Math.PI*a.st.fe, r=we/wn;
  const amp=1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*xi*r,2));
  const tr=Math.sqrt(1+Math.pow(2*xi*r,2))/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*xi*r,2));
  const cc=2*Math.sqrt(k*m), c=xi*cc, wa=wn*Math.sqrt(Math.max(0,1-xi*xi));
  const x0=60,y0=240,wv=420,hv=200;
  if(a.st.v==='resp'){
    a.line(x0,y0,x0+wv,y0,C.muted,1.4);a.line(x0,y0-hv/2,x0,y0+hv/2,C.muted,1.4);
    a.txt('t',x0+wv,y0+22,C.muted,11,'right');a.txt('x(t)',x0+4,y0-hv/2-8,C.muted,11);
    const T=xi<1?Math.min(12/ (xi*wn||1), 8*2*Math.PI/wn):6/(xi*wn);
    a.g.strokeStyle=C.a;a.g.lineWidth=2.6;a.g.beginPath();
    for(let i=0;i<=400;i++){const t=T*i/400;
      let x;
      if(xi<1)x=Math.exp(-xi*wn*t)*Math.cos(wa*t);
      else if(Math.abs(xi-1)<1e-6)x=(1+wn*t)*Math.exp(-wn*t);
      else {const s1=-wn*(xi-Math.sqrt(xi*xi-1)), s2=-wn*(xi+Math.sqrt(xi*xi-1));
        x=(s2*Math.exp(s1*t)-s1*Math.exp(s2*t))/(s2-s1);}
      const X=x0+i/400*wv, Y=y0-x*hv/2.4;i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}
    a.g.stroke();
    if(xi<1&&xi>0){a.g.strokeStyle=C.muted;a.g.lineWidth=1.3;a.g.setLineDash([4,3]);
      [1,-1].forEach(s=>{a.g.beginPath();for(let i=0;i<=200;i++){const t=T*i/200;const X=x0+i/200*wv,Y=y0-s*Math.exp(-xi*wn*t)*hv/2.4;i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}a.g.stroke();});
      a.g.setLineDash([]);a.txt('envolvente e^(−ξωₙt)',x0+wv-6,y0-hv/2+14,C.muted,11,'right');}
    const tipo=xi<1?(xi===0?'sin amortiguar: oscila indefinidamente':'subcrítico ξ < 1: oscila y se extingue'):(Math.abs(xi-1)<0.01?'CRÍTICO ξ = 1: vuelve sin oscilar, lo más rápido posible':'sobreamortiguado ξ > 1: vuelve sin oscilar, más lento');
    a.txt(tipo,x0,y0+hv/2+26,xi<1?C.a:(Math.abs(xi-1)<0.01?C.c:C.e),13);
    a.txt('duración mostrada: '+N2(T)+' s',x0+wv,y0+hv/2+26,C.muted,11,'right');
  } else {
    const fun=a.st.v==='amp'?(rr=>1/Math.sqrt(Math.pow(1-rr*rr,2)+Math.pow(2*xi*rr,2)))
                            :(rr=>Math.sqrt(1+Math.pow(2*xi*rr,2))/Math.sqrt(Math.pow(1-rr*rr,2)+Math.pow(2*xi*rr,2)));
    const rmax=5, ymax=Math.min(6,Math.max(2.4,fun(1)*1.15));
    Eje(a,x0,y0+hv/2,wv,hv,'r = ωₑ/ωₙ',a.st.v==='amp'?'Aₑ/A_est':'TR');
    ticks(rmax,5).forEach(v=>{const X=x0+v/rmax*wv;a.line(X,y0+hv/2,X,y0+hv/2+4,C.muted,1);a.txt(NQ(v),X,y0+hv/2+18,C.muted,10,'center');});
    ticks(ymax,4).forEach(v=>{const Y=y0+hv/2-v/ymax*hv;a.line(x0-4,Y,x0,Y,C.muted,1);a.txt(NQ(v),x0-7,Y+4,C.muted,10,'right');});
    const px=rr=>x0+rr/rmax*wv, py=v=>y0+hv/2-Math.min(v,ymax)/ymax*hv;
    a.line(px(1),y0+hv/2,px(1),y0+hv/2-hv,C.muted,1,[4,3]);
    a.txt('r = 1 resonancia',px(1)+5,y0-hv/2-6,C.muted,11);
    if(a.st.v==='tr'){a.line(px(Math.SQRT2),y0+hv/2,px(Math.SQRT2),y0+hv/2-hv,C.b,1.4,[5,4]);
      a.txt('r = √2',px(Math.SQRT2)+5,y0+hv/2-hv+16,C.b,11);
      a.line(x0,py(1),x0+wv,py(1),C.b,1.2,[4,3]);
      a.g.fillStyle=C.c;a.g.globalAlpha=0.1;a.g.fillRect(px(Math.SQRT2),py(1),wv-(px(Math.SQRT2)-x0),y0+hv/2-py(1));a.g.globalAlpha=1;
      a.txt('zona de aislamiento (TR < 1)',px(Math.SQRT2)+10,py(1)+26,C.c,11);}
    [0.05,0.1,0.25,0.5,1].forEach(z=>{
      a.g.strokeStyle=Math.abs(z-xi)<0.02?C.a:C.grid;a.g.lineWidth=Math.abs(z-xi)<0.02?2.8:1.3;a.g.beginPath();
      for(let i=0;i<=400;i++){const rr=rmax*i/400;
        const v=a.st.v==='amp'?1/Math.sqrt(Math.pow(1-rr*rr,2)+Math.pow(2*z*rr,2)):Math.sqrt(1+Math.pow(2*z*rr,2))/Math.sqrt(Math.pow(1-rr*rr,2)+Math.pow(2*z*rr,2));
        i===0?a.g.moveTo(px(rr),py(v)):a.g.lineTo(px(rr),py(v));}
      a.g.stroke();});
    a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
    for(let i=0;i<=400;i++){const rr=rmax*i/400;i===0?a.g.moveTo(px(rr),py(fun(rr))):a.g.lineTo(px(rr),py(fun(rr)));}
    a.g.stroke();
    if(r<=rmax){a.circ(px(r),py(a.st.v==='amp'?amp:tr),7,C.f,true);
      a.txt((a.st.v==='amp'?'A/A_est = ':'TR = ')+N2(a.st.v==='amp'?amp:tr),px(r)+10,py(a.st.v==='amp'?amp:tr)-8,C.f,13);}
  }
  const bx=505,by=300;
  [['ωₙ',N1(wn)+' rad/s'],['fₙ',N2(fn)+' Hz'],['r = ωₑ/ωₙ',N2(r)],['ξ',N1(xi*100)+' %'],['TR',N2(tr)]].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*22,C.muted,12);a.txt(d[1],bx+135,by+i*22,C.text,12,'right');});
  a.html(`m = ${a.st.m} kg y k = ${a.st.k} kN/m ⇒ <b>ωₙ = √(k/m) = ${N1(wn)} rad/s = ${N2(fn)} Hz</b>; c<sub>c</sub> = 2√(km) = ${N1(cc)} N·s/m, c = ${N1(c)} N·s/m.<br>
  Con excitación a ${a.st.fe} Hz ⇒ r = <b>${N2(r)}</b> y <b>TR = ${N2(tr)}</b> ${tr<1?`✓ se transmite sólo el ${N1(tr*100)} % (atenúa un ${N1((1-tr)*100)} %)`:`✗ se AMPLIFICA ×${N2(tr)}: hace falta r > √2`}.<br>
  <span class="hint">Sube la rigidez y mira qué pasa: con apoyos más duros ωₙ crece, r baja y el aislamiento empeora. Lo que aísla es un apoyo BLANDO.</span>`);}});

/* T5a · Geometría del engranaje */
SIMS.engranaje=el=>build(el,{w:660,h:430,
 sliders:[{k:'m',v:2.5,min:1,max:8,step:0.25,l:'módulo m',u:'mm'},{k:'z1',v:35,min:12,max:60,step:1,l:'dientes z₁',u:''},
  {k:'z2',v:60,min:12,max:90,step:1,l:'dientes z₂',u:''},{k:'al',v:20,min:14.5,max:25,step:0.5,l:'ángulo de presión',u:'°'},
  {k:'T',v:28.1,min:1,max:200,step:0.1,l:'par en la rueda 1',u:'N·m'}],
 draw(a){a.clear();
  const m=a.st.m,z1=a.st.z1,z2=a.st.z2,al=a.st.al*Math.PI/180;
  const rp1=m*z1/2, rp2=m*z2/2, rb1=rp1*Math.cos(al), rb2=rp2*Math.cos(al);
  const ra1=rp1+m, rd1=rp1-1.25*m, ra2=rp2+m, rd2=rp2-1.25*m;
  const C0=rp1+rp2, p=Math.PI*m;
  const eps=(1/(2*Math.PI))*(z1*Math.sqrt(Math.max(0,Math.pow(ra1/rb1,2)-1))+z2*Math.sqrt(Math.max(0,Math.pow(ra2/rb2,2)-1))-(z1+z2)*Math.tan(al));
  const Ft=a.st.T/(rp1/1000), Fr=Ft*Math.tan(al), F=Ft/Math.cos(al);
  const S=Math.min(1.45, 350/(rp1+C0+rp2), 150/Math.max(rp1,rp2));
  const c1=[24+rp1*S,215], c2=[24+rp1*S+C0*S,215];
  const dib=(c,rp,rb,ra,rd,z,col)=>{
    a.circ(c[0],c[1],rp*S,col,false);
    a.g.setLineDash([4,3]);a.circ(c[0],c[1],rb*S,C.muted,false);a.g.setLineDash([]);
    a.circ(c[0],c[1],ra*S,C.grid,false);a.circ(c[0],c[1],rd*S,C.grid,false);
    a.g.strokeStyle=col;a.g.lineWidth=1.6;
    for(let i=0;i<z;i++){const t=2*Math.PI*i/z;
      a.g.beginPath();a.g.moveTo(c[0]+rd*S*Math.cos(t),c[1]+rd*S*Math.sin(t));
      a.g.lineTo(c[0]+ra*S*Math.cos(t),c[1]+ra*S*Math.sin(t));a.g.stroke();}
    a.circ(c[0],c[1],3,C.text,true);};
  dib(c1,rp1,rb1,ra1,rd1,z1,C.a); dib(c2,rp2,rb2,ra2,rd2,z2,C.e);
  // punto primitivo y linea de accion
  const P=[c1[0]+rp1*S,c1[1]];
  a.circ(P[0],P[1],5,C.f,true);a.txt('P',P[0]-4,P[1]-12,C.f,13);
  const L=96;
  a.line(P[0]-L*Math.cos(al),P[1]+L*Math.sin(al),P[0]+L*Math.cos(al),P[1]-L*Math.sin(al),C.f,2);
  a.txt('línea de acción ('+NQ(a.st.al)+'°)',P[0]+L*Math.cos(al)+6,P[1]-L*Math.sin(al)-4,C.f,11);
  a.line(c1[0],c1[1],c2[0],c2[1],C.muted,1.2,[5,4]);
  a.txt('C = '+NQ(C0)+' mm',(c1[0]+c2[0])/2,c1[1]-10,C.muted,11,'center');
  a.txt('r_p',c1[0],c1[1]-rp1*S-6,C.a,11,'center');
  a.txt('r_b',c1[0]-rb1*S*0.72,c1[1]+rb1*S*0.72,C.muted,10,'right');
  // panel
  const bx=420,by=46;
  a.txt('Rueda 1 (z = '+z1+', m = '+NQ(m)+')',bx,by-20,C.text,12);
  [['r_p = mz/2',NQ(rp1)+' mm'],['p = πm',NQ(p)+' mm'],['r_b = r_p cos α',NQ(rb1)+' mm'],['r_a = r_p + m',NQ(ra1)+' mm'],
   ['r_d = r_p − 1,25m',NQ(rd1)+' mm'],['C = m(z₁+z₂)/2',NQ(C0)+' mm'],['relación z₂/z₁',N2(z2/z1)],['coef. engrane ε',N2(eps)]].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*23,C.muted,12);a.txt(d[1],bx+230,by+i*23,i===7?(eps>1.2?C.c:C.b):C.text,12,'right');});
  a.txt('Fuerzas con T = '+NQ(a.st.T)+' N·m',bx,by+208,C.text,12);
  [['F_t = T/r_p',N1(Ft)+' N'],['F_r = F_t·tan α',N1(Fr)+' N'],['F = F_t/cos α',N1(F)+' N']].forEach((d,i)=>{
    a.txt(d[0],bx,by+228+i*22,C.muted,12);a.txt(d[1],bx+230,by+228+i*22,C.a,12,'right');});
  a.html(`m = ${NQ(m)} mm, z₁ = ${z1}, z₂ = ${z2}, α = ${NQ(a.st.al)}° ⇒ r<sub>p1</sub> = <b>${NQ(rp1)} mm</b>, r<sub>b1</sub> = ${NQ(rb1)} mm, r<sub>a1</sub> = ${NQ(ra1)} mm, r<sub>d1</sub> = ${NQ(rd1)} mm y C = <b>${NQ(C0)} mm</b>.<br>
  Coeficiente de engrane <b>ε = ${N2(eps)}</b> ${eps>1.2?'✓ correcto (más de una pareja en contacto buena parte del ciclo)':(eps>1?'⚠ justo por encima de 1: conviene subirlo':'✗ menor que 1: el engrane se interrumpiría')}.<br>
  Con T = ${NQ(a.st.T)} N·m: F<sub>t</sub> = <b>${N1(Ft)} N</b>, F<sub>r</sub> = ${N1(Fr)} N y resultante ${N1(F)} N sobre la línea de acción.<br>
  <span class="hint">Baja el número de dientes del piñón y mira ε: con pocos dientes cae por debajo de 1,2 y aparecen además los problemas de penetración e interferencia.</span>`);}});

/* T5b · Tren epicicloidal (Willis) */
SIMS.willis=el=>build(el,{w:660,h:400,
 selects:[{k:'fijo',v:'corona',l:'elemento fijo',opts:[['corona','corona fija (entra el planeta)'],['planeta','planeta fijo (entra la corona)'],['brazo','brazo fijo (tren ordinario)']]}],
 sliders:[{k:'z1',v:30,min:12,max:60,step:1,l:'dientes del planeta z₁',u:''},{k:'z3',v:70,min:40,max:140,step:1,l:'dientes de la corona z₃',u:''},
  {k:'win',v:1500,min:100,max:3000,step:50,l:'velocidad de entrada',u:'rpm'},{k:'t',v:0,min:0,max:360,step:3,l:'giro (animación)',u:'°'}],
 draw(a){a.clear();
  const z1=a.st.z1, z3=a.st.z3, z2=(z3-z1)/2;
  const valido=z2>=8 && Number.isInteger(z2*2)/1;
  const win=a.st.win;
  let wc=0,wout=0,rel='',salida='';
  const k=-z3/z1; // (w1-wc)/(w3-wc) = -z3/z1
  if(a.st.fijo==='corona'){wc=win/(1-k); wout=wc; rel='ω_c/ω₁ = 1/(1+z₃/z₁)'; salida='brazo portasatélites';}
  else if(a.st.fijo==='planeta'){wc=win*k/(k-1); wout=wc; rel='ω_c/ω₃ = 1/(1+z₁/z₃)'; salida='brazo portasatélites';}
  else {wout=win/k; rel='ω₃/ω₁ = −z₁/z₃ (tren ordinario)'; salida='corona';}
  const i=win/wout;
  // dibujo
  const cx=200,cy=205,S=Math.min(2.7,165/(z3/2));
  const r1=z1/2*S, r3=z3/2*S, r2=z2/2*S;
  const t=a.st.t*Math.PI/180;
  const tc=(a.st.fijo==='brazo')?0:t*wc/win;
  a.circ(cx,cy,r3,C.e,false); a.circ(cx,cy,r3+8,C.e,false);
  a.g.strokeStyle=C.e;a.g.lineWidth=1.2;
  for(let i2=0;i2<z3;i2++){const q=2*Math.PI*i2/z3+((a.st.fijo==='planeta')?t*wout/win:0);
    a.line(cx+r3*Math.cos(q),cy+r3*Math.sin(q),cx+(r3-5)*Math.cos(q),cy+(r3-5)*Math.sin(q),C.e,1.2);}
  a.g.fillStyle=C.a;a.g.globalAlpha=.12;a.circ(cx,cy,r1,C.a,true);a.g.globalAlpha=1;
  a.circ(cx,cy,r1,C.a,false);
  for(let i2=0;i2<z1;i2++){const q=2*Math.PI*i2/z1+((a.st.fijo==='corona')?t:0);
    a.line(cx+r1*Math.cos(q),cy+r1*Math.sin(q),cx+(r1+5)*Math.cos(q),cy+(r1+5)*Math.sin(q),C.a,1.2);}
  for(let s=0;s<3;s++){const q=tc+2*Math.PI*s/3;
    const px=cx+(r1+r2)*Math.cos(q), py=cy+(r1+r2)*Math.sin(q);
    a.line(cx,cy,px,py,C.c,4);
    a.circ(px,py,r2,C.c,false);a.circ(px,py,3,C.c,true);}
  a.circ(cx,cy,7,C.text,true);
  a.txt('planeta  z₁ = '+z1,cx,cy+r3+24,C.a,12,'center');
  a.txt('corona  z₃ = '+z3,cx,cy-r3-20,C.e,12,'center');
  a.txt('satélites  z₂ = '+NQ(z2),cx,cy+r3+42,C.c,12,'center');
  // panel
  const bx=420,by=60;
  a.txt('Fórmula de Willis',bx,by-24,C.text,13);
  a.txt('(ω₁ − ω_c)/(ω₃ − ω_c) = −z₃/z₁',bx,by,C.a,12);
  [['z₂ = (z₃ − z₁)/2',NQ(z2)],['relación −z₃/z₁',N2(k)],['entrada',NQ(Math.round(win))+' rpm'],['salida: '+salida,NQ(Math.round(wout*10)/10)+' rpm'],['reducción i',N2(i)]].forEach((d,j)=>{
    a.txt(d[0],bx,by+30+j*24,C.muted,11.5);a.txt(d[1],bx+215,by+30+j*24,C.text,12,'right');});
  const mont=[2,3,4,5].filter(n=>(z1+z3)%n===0);
  a.txt('nº de satélites posible: '+(mont.length?mont.join(', '):'—'),bx,by+170,C.muted,11);
  a.txt(valido?'✓ geometría compatible (z₁ + 2z₂ = z₃)':'✗ z₂ no es válido con estos dientes',bx,by+192,valido?C.c:C.b,12);
  a.html(`Planeta z₁ = ${z1}, satélites z₂ = <b>${NQ(z2)}</b> (de z₁ + 2z₂ = z₃) y corona z₃ = ${z3}.<br>
  Con <b>${{corona:'la corona fija',planeta:'el planeta fijo',brazo:'el brazo fijo'}[a.st.fijo]}</b> y ${win} rpm de entrada, Willis da ${rel} ⇒ salida por el <b>${salida}</b> a <b>${NQ(Math.round(wout*10)/10)} rpm</b> (reducción ${N2(i)}:1).<br>
  La condición de montaje exige que (z₁ + z₃)/n sea entero: con estos dientes valen ${mont.length?mont.join(', '):'—'} satélites.<br>
  <span class="hint">Cambia el elemento fijo sin tocar los dientes: el mismo tren da reducciones completamente distintas. Ésa es la base de las cajas automáticas.</span>`);}});

/* T6 · Correa plana */
SIMS.correa=el=>build(el,{w:660,h:400,
 sliders:[{k:'d',v:100,min:40,max:200,step:5,l:'polea conductora d',u:'mm'},{k:'D',v:400,min:60,max:600,step:10,l:'polea conducida D',u:'mm'},
  {k:'C',v:500,min:200,max:900,step:10,l:'distancia entre centros',u:'mm'},{k:'H',v:4,min:0.5,max:20,step:0.1,l:'potencia',u:'CV'},
  {k:'n',v:1000,min:200,max:3000,step:50,l:'velocidad del motor',u:'rpm'},{k:'mu',v:0.2,min:0.05,max:0.6,step:0.01,l:'coef. de rozamiento μ',u:''}],
 draw(a){a.clear();
  const d=a.st.d/1000, D=a.st.D/1000, Cc=a.st.C/1000, H=a.st.H*735.5, n=a.st.n, mu=a.st.mu;
  const w1=2*Math.PI*n/60, T1=H/w1, v=w1*d/2;
  const al=Math.asin(Math.min(1,(D-d)/(2*Cc)));
  const phid=Math.PI-2*al, phiD=Math.PI+2*al;
  const L=d/2*phid+D/2*phiD+2*Math.sqrt(Math.max(0,Cc*Cc-Math.pow((D-d)/2,2)));
  const dF=2*T1/d;
  const E=Math.exp(mu*phid);
  const FB=dF/(E-1), FA=FB*E;
  const i=D/d, w2=w1/i, T2=T1*i;
  // dibujo
  const tot=a.st.d/2+a.st.C+a.st.D/2;
  const S=Math.min(0.40, 350/tot, 130/(a.st.D/2));
  const c1=[26+a.st.d/2*S,210], c2=[26+(a.st.d/2+a.st.C)*S,210];
  const r1=a.st.d/2*S, r2=a.st.D/2*S;
  a.circ(c1[0],c1[1],r1,C.a,false);a.circ(c1[0],c1[1],3,C.text,true);
  a.circ(c2[0],c2[1],r2,C.e,false);a.circ(c2[0],c2[1],3,C.text,true);
  const be=Math.asin(Math.min(1,(r2-r1)/(c2[0]-c1[0])));
  const tu=[Math.sin(be),-Math.cos(be)], td=[Math.sin(be),Math.cos(be)];
  a.line(c1[0]+r1*tu[0],c1[1]+r1*tu[1],c2[0]+r2*tu[0],c2[1]+r2*tu[1],C.c,3);
  a.line(c1[0]+r1*td[0],c1[1]+r1*td[1],c2[0]+r2*td[0],c2[1]+r2*td[1],C.c,3);
  a.txt('F_A = '+N1(FA)+' N  (tirante)',c1[0]-4,c1[1]-r2-26,C.b,12);
  a.txt('F_B = '+N1(FB)+' N  (flojo)',c1[0]-4,c1[1]+r2+40,C.muted,12);
  a.txt('d = '+a.st.d+' mm',c1[0],c1[1]+r1+18,C.a,11,'center');
  a.txt('φ_d = '+N1(phid*180/Math.PI)+'°',c1[0],c1[1]+r1+34,C.a,11,'center');
  a.txt('D = '+a.st.D+' mm',c2[0],c2[1]+r2+18,C.e,11,'center');
  a.txt('φ_D = '+N1(phiD*180/Math.PI)+'°',c2[0],c2[1]+r2+34,C.e,11,'center');
  // panel
  const bx=404,by=160;
  [['par T₁ = H/ω',N2(T1)+' N·m'],['F_A − F_B = 2T/d',N1(dF)+' N'],['F_A/F_B = e^(μφ)',N2(E)],
   ['velocidad de la correa',N2(v)+' m/s'],['longitud L',N1(L*1000)+' mm'],['relación i = D/d',N2(i)],['par en la conducida',N1(T2)+' N·m']].forEach((q,j2)=>{
    a.txt(q[0],bx,by+j2*23,C.muted,12);a.txt(q[1],bx+215,by+j2*23,C.text,12,'right');});
  a.html(`Con ${NQ(a.st.H)} CV a ${n} rpm: T₁ = <b>${N2(T1)} N·m</b> y la correa debe transmitir F<sub>A</sub> − F<sub>B</sub> = 2T/d = <b>${N1(dF)} N</b>.<br>
  El ángulo que manda es el de la polea <b>pequeña</b>: φ<sub>d</sub> = ${N1(phid*180/Math.PI)}° = ${N2(phid)} rad ⇒ e^(μφ) = ${N2(E)} ⇒ <b>F<sub>A</sub> = ${N1(FA)} N</b> y <b>F<sub>B</sub> = ${N1(FB)} N</b> en el límite del deslizamiento.<br>
  Longitud de correa ${N1(L*1000)} mm · relación i = D/d = ${N2(i)} ⇒ la conducida gira a ${N1(w2*60/2/Math.PI)} rpm con ${N1(T2)} N·m.<br>
  <span class="hint">Acerca las poleas (baja C) y verás caer φ<sub>d</sub>: menos abrazamiento significa menos capacidad antes de patinar, y hacen falta tensiones mucho mayores.</span>`);}});

/* T7 · Ejes: fuerzas y reacciones */
SIMS.ejes=el=>build(el,{w:660,h:400,
 sliders:[{k:'L',v:300,min:150,max:600,step:10,l:'distancia entre apoyos',u:'mm'},{k:'xp',v:150,min:20,max:580,step:10,l:'posición de la polea',u:'mm'},
  {k:'FA',v:1643,min:0,max:4000,step:10,l:'F_A (ramal tirante)',u:'N'},{k:'FB',v:1081,min:0,max:4000,step:10,l:'F_B (ramal flojo)',u:'N'},
  {k:'xg',v:400,min:20,max:700,step:10,l:'posición del engranaje',u:'mm'},{k:'Fg',v:642,min:0,max:3000,step:10,l:'F_t del engranaje',u:'N'}],
 draw(a){a.clear();
  const L=a.st.L, xp=Math.min(a.st.xp,L), xg=a.st.xg, Fp=a.st.FA+a.st.FB, Fg=a.st.Fg, Fr=Fg*Math.tan(20*Math.PI/180);
  // reacciones (plano vertical: polea hacia abajo; engranaje radial hacia abajo)
  const RB=(Fp*xp+Fr*xg)/L, RA=Fp+Fr-RB;
  const S=Math.min(0.72, 520/Math.max(L,xg)); const x0=70,y0=170;
  a.line(x0,y0,x0+Math.max(L,xg)*S+30,y0,C.text,8);
  // apoyos
  [[0,'A',RA],[L,'B',RB]].forEach(([x,lab,R])=>{
    const X=x0+x*S;
    a.g.fillStyle=C.e;a.g.beginPath();a.g.moveTo(X,y0+6);a.g.lineTo(X-14,y0+30);a.g.lineTo(X+14,y0+30);a.g.closePath();a.g.fill();
    Tierra(a,X,y0+32,C.muted);
    a.txt(lab,X,y0+62,C.e,13,'center');
    a.arrow(X,y0+26,X,y0-14,C.c,2.6);
    a.txt(N1(R)+' N',X,y0-22,C.c,12,'center');});
  // polea
  const Xp=x0+xp*S;
  a.circ(Xp,y0,22,C.a,false);a.circ(Xp,y0,4,C.text,true);
  a.arrow(Xp,y0-26,Xp,y0+58,C.a,2.8);
  a.txt('F_A + F_B = '+N1(Fp)+' N',Xp+8,y0+74,C.a,12);
  a.txt('polea',Xp,y0-34,C.a,11,'center');
  // engranaje
  const Xg=x0+xg*S;
  a.g.fillStyle=C.f;a.g.globalAlpha=.2;a.g.fillRect(Xg-9,y0-34,18,68);a.g.globalAlpha=1;
  a.g.strokeStyle=C.f;a.g.lineWidth=2;a.g.strokeRect(Xg-9,y0-34,18,68);
  a.arrow(Xg,y0-40,Xg,y0+22,C.f,2.6);
  a.txt('F_r = '+N1(Fr)+' N',Xg+10,y0+40,C.f,12);
  a.txt('engranaje',Xg,y0-50,C.f,11,'center');
  if(xg>L)a.txt('(en voladizo)',Xg,y0-66,C.b,11,'center');
  // panel
  const bx=70,by=300;
  a.txt('Equilibrio en el plano vertical',bx,by-16,C.text,13);
  [['Carga de la polea  F_A + F_B',N1(Fp)+' N'],['Par de la polea  (F_A − F_B)·d/2','(no carga el eje)'],
   ['Radial del engranaje  F_t·tan 20°',N1(Fr)+' N'],['Reacción en A',N1(RA)+' N'],['Reacción en B',N1(RB)+' N']].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*24,C.muted,12);a.txt(d[1],bx+360,by+i*24,i>=3?C.c:C.text,12,'right');});
  a.html(`La polea carga el eje con la <b>suma</b> de los ramales, F<sub>A</sub> + F<sub>B</sub> = <b>${N1(Fp)} N</b> (el par lo da la diferencia, ${N1(a.st.FA-a.st.FB)} N).<br>
  El engranaje añade su componente radial F<sub>r</sub> = F<sub>t</sub>·tan 20° = ${N1(Fr)} N ${xg>L?'<b>en voladizo</b>, lo que descarga A y recarga B':''}.<br>
  Tomando momentos: <b>R<sub>A</sub> = ${N1(RA)} N</b> y <b>R<sub>B</sub> = ${N1(RB)} N</b> ${RA<0?'(R<sub>A</sub> sale negativa: el apoyo A tira hacia abajo)':''}.<br>
  <span class="hint">Mueve el engranaje más allá del apoyo B: el voladizo descarga A hasta invertir su reacción. Después hay que componer con el plano horizontal: R = √(R_V² + R_H²).</span>`);}});

/* T8 · Levas */
SIMS.leva=el=>build(el,{w:660,h:450,
 selects:[{k:'c',v:'cicl',l:'curva de enlace',opts:[['cicl','cicloidal'],['arm','armónica'],['par','parabólica'],['rec','velocidad constante']]}],
 sliders:[{k:'L',v:25,min:5,max:60,step:1,l:'elevación L',u:'mm'},{k:'b',v:120,min:30,max:180,step:5,l:'ángulo de subida β',u:'°'},
  {k:'n',v:300,min:30,max:1200,step:10,l:'velocidad de la leva',u:'rpm'},{k:'Rb',v:40,min:15,max:90,step:1,l:'radio de base',u:'mm'},
  {k:'th',v:60,min:0,max:360,step:2,l:'posición θ',u:'°'}],
 draw(a){a.clear();
  const L=a.st.L/1000, b=a.st.b*Math.PI/180, w=2*Math.PI*a.st.n/60, Rb=a.st.Rb;
  const S=(x)=>{ // x en [0,1] -> s/L, v adim, a adim
    if(a.st.c==='cicl')return [x-Math.sin(2*Math.PI*x)/(2*Math.PI), 1-Math.cos(2*Math.PI*x), 2*Math.PI*Math.sin(2*Math.PI*x)];
    if(a.st.c==='arm')return [(1-Math.cos(Math.PI*x))/2, Math.PI/2*Math.sin(Math.PI*x), Math.PI*Math.PI/2*Math.cos(Math.PI*x)];
    if(a.st.c==='par')return x<0.5?[2*x*x,4*x,4]:[1-2*(1-x)*(1-x),4*(1-x),-4];
    return [x,1,0];};
  const vmax={cicl:2,arm:Math.PI/2,par:2,rec:1}[a.st.c]*L*w/b;
  const amax={cicl:2*Math.PI,arm:Math.PI*Math.PI/2,par:4,rec:Infinity}[a.st.c]*L*w*w/(b*b);
  // diagrama s,v,a
  const x0=60,wv=320;
  const val=(t,idx)=>{const ph=t*360;
    if(ph<a.st.b)return S(ph/a.st.b)[idx];
    if(ph<a.st.b+60)return idx===0?1:0;
    if(ph<a.st.b+150){const x=(ph-a.st.b-60)/90, r=S(x); return idx===0?1-r[0]:-r[idx]*Math.pow(a.st.b/90,idx);}
    return 0;};
  const maxOf=idx=>{let m=0;for(let i=0;i<=360;i++)m=Math.max(m,Math.abs(val(i/360,idx)));return m||1;};
  const trace=(y0,hv,idx,col,lab)=>{
    const mx=maxOf(idx)*1.12;
    a.line(x0,y0,x0+wv,y0,C.muted,1.3);
    a.txt(lab,x0+4,y0-hv-4,col,11);
    a.g.strokeStyle=col;a.g.lineWidth=2.6;a.g.beginPath();
    for(let i=0;i<=360;i++){const t=i/360, v=val(t,idx);
      const X=x0+t*wv, Y=y0-v/mx*hv;
      i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}
    a.g.stroke();
    const t0=a.st.th/360; a.line(x0+t0*wv,y0-hv,x0+t0*wv,y0+hv*0.75,C.f,1.2,[3,3]);};
  trace(110,66,0,C.a,'s(θ)  ·  L = '+a.st.L+' mm');
  trace(215,52,1,C.c,'v(θ)');
  trace(320,52,2,C.e,'a(θ)');
  a.txt('subida β = '+a.st.b+'°',x0+a.st.b/360*wv/2,404,C.muted,10,'center');
  a.txt('detención',x0+(a.st.b+30)/360*wv,420,C.muted,10,'center');
  a.txt('bajada 90°',x0+(a.st.b+105)/360*wv,404,C.muted,10,'center');
  a.line(x0+a.st.b/360*wv,56,x0+a.st.b/360*wv,386,C.muted,1,[3,3]);
  a.line(x0+(a.st.b+60)/360*wv,56,x0+(a.st.b+60)/360*wv,386,C.muted,1,[3,3]);
  a.line(x0+(a.st.b+150)/360*wv,56,x0+(a.st.b+150)/360*wv,386,C.muted,1,[3,3]);
  // perfil de la leva
  const cx=510,cy=160,Sc=1.1;
  const sAt=ph=>{if(ph<a.st.b)return S(ph/a.st.b)[0]*a.st.L;
    if(ph<a.st.b+60)return a.st.L;
    if(ph<a.st.b+150)return (1-S((ph-a.st.b-60)/90)[0])*a.st.L;
    return 0;};
  a.g.strokeStyle=C.a;a.g.lineWidth=2.6;a.g.beginPath();
  for(let i=0;i<=360;i++){const ph=i, rr=(Rb+sAt(ph))*Sc*0.75;
    const q=-(ph-a.st.th)*Math.PI/180;
    const X=cx+rr*Math.cos(q), Y=cy-rr*Math.sin(q);
    i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}
  a.g.closePath();a.g.stroke();
  a.g.setLineDash([4,3]);a.circ(cx,cy,Rb*Sc*0.75,C.muted,false);a.g.setLineDash([]);
  a.circ(cx,cy,4,C.text,true);
  const sNow=sAt(a.st.th), rNow=(Rb+sNow)*Sc*0.75;
  a.line(cx,cy-rNow,cx,cy-rNow-70,C.c,6);
  a.circ(cx,cy-rNow,7,C.c,false);
  a.txt('seguidor',cx+14,cy-rNow-50,C.c,11);
  a.txt('s = '+NQ(sNow)+' mm',cx,cy+120,C.a,13,'center');
  a.txt('radio base '+a.st.Rb+' mm',cx,cy+140,C.muted,11,'center');
  const nom={cicl:'Cicloidal',arm:'Armónica',par:'Parabólica',rec:'Velocidad constante'}[a.st.c];
  const cont={cicl:'aceleración NULA en los extremos ✓ enlaza con detenciones sin salto',arm:'la aceleración salta en los extremos del tramo',par:'la aceleración salta 3 veces: sobreaceleración infinita',rec:'aceleración INFINITA en los extremos ✗ impacto'}[a.st.c];
  a.html(`<b>${nom}</b> · L = ${a.st.L} mm en β = ${a.st.b}° a ${a.st.n} rpm (ω = ${NQ(w)} rad/s):<br>
  v<sub>max</sub> = <b>${NQ(vmax)} m/s</b> · a<sub>max</sub> = <b>${isFinite(amax)?NQ(amax)+' m/s²':'∞'}</b> · ${cont}.<br>
  <span class="hint">Compara las cuatro curvas mirando la fila de la aceleración: la parabólica tiene el máximo más bajo, pero sólo la cicloidal llega a cero en los extremos. Por eso es la que se usa junto a detenciones.</span>`);}});

/* ---- Tren de engranajes de dos etapas, paso a paso: i = z₂/z₁, n = n₁/i, M = M₁·i ---- */
SIMS.trenPaso=el=>build(el,{w:660,h:400,
 sliders:[{k:'paso',v:0,min:0,max:6,step:1,l:'paso de la resolución (0 = problema)',u:''}],
 draw(a){a.clear();const p=a.st.paso;
  // radios: 1 diente ≈ 2 px de paso; el número de dientes de cada rueda se marca con trazos
  const G=[{x:90,y:130,z:20,r:28,c:C.f,lab:'z₁ = 20'},
           {x:202,y:130,z:60,r:84,c:C.b,lab:'z₂ = 60'},
           {x:360,y:130,z:15,r:21,c:C.b,lab:'z₃ = 15'},
           {x:444,y:130,z:45,r:63,c:C.c,lab:'z₄ = 45'}];
  G.forEach(g=>{
    a.g.strokeStyle=g.c;a.g.lineWidth=1.5;a.g.beginPath();a.g.arc(g.x,g.y,g.r,0,2*Math.PI);a.g.stroke();
    for(let k=0;k<g.z;k++){const t=2*Math.PI*k/g.z;
      a.line(g.x+(g.r-3)*Math.cos(t),g.y+(g.r-3)*Math.sin(t),g.x+(g.r+3)*Math.cos(t),g.y+(g.r+3)*Math.sin(t),g.c,2);}
    a.circ(g.x,g.y,3,C.text,true);
    a.txt(g.lab,g.x,g.y+g.r+16,g.c,12,'center');
  });
  a.txt('etapa 1',146,34,C.muted,12,'center');
  a.txt('etapa 2',404,34,C.muted,12,'center');
  a.line(202,130,360,130,C.muted,1);  // unión esquemática: z₂ y z₃ van en el mismo eje
  // cálculo
  a.txt('Motor: n₁ = 1800 rpm, M₁ = 30 N·m (ideal, sin pérdidas)',40,270,C.muted,12,'left');
  if(p>=1)a.txt('Etapa 1: i₁₂ = z₂/z₁ = 60/20 = 3',40,296,C.f,13,'left');
  if(p>=2)a.txt('Eje intermedio: n₂ = n₁/i₁₂ = 1800/3 = 600 rpm (z₃ gira igual que z₂)',40,318,C.text,12,'left');
  if(p>=3)a.txt('Etapa 2: i₃₄ = z₄/z₃ = 45/15 = 3',40,340,C.c,13,'left');
  if(p>=4)a.txt('Salida: n₄ = n₃/i₃₄ = 600/3 = 200 rpm   (i total = 9)',40,362,C.c,13,'left');
  if(p>=5)a.txt('Par: M₄ = M₁ · i = 30 · 9 = 270 N·m',40,386,C.a,13,'left');
  const T=[
   'Tren de engranajes de dos etapas. El motor gira a n₁ = 1800 rpm con un par M₁ = 30 N·m. Las ruedas tienen z₁ = 20, z₂ = 60, z₃ = 15 y z₄ = 45 dientes. Se piden la velocidad y el par de salida, sin pérdidas.',
   'Cada engrane exterior de la primera etapa tiene una relación de transmisión i = z_conducida/z_conductora. Aquí i₁₂ = 60/20 = 3: la rueda grande gira tres veces más despacio. Los dientes marcados en cada rueda tienen el mismo paso, así que el número de dientes da la relación.',
   'z₂ y z₃ están sobre el mismo eje intermedio (en el dibujo, unidos por la línea gris), así que giran igual. La velocidad del eje intermedio es n₂ = n₁/i₁₂ = 1800/3 = 600 rpm.',
   'La segunda etapa usa z₃ como rueda conductora y z₄ como conducida: i₃₄ = 45/15 = 3. Las relaciones se multiplican porque las etapas están en serie.',
   'Velocidad de salida: n₄ = n₃/i₃₄ = 600/3 = 200 rpm. La relación total es i = 3 · 3 = 9, y la velocidad final es 1800/9 = 200 rpm.',
   'Par de salida: sin pérdidas, la potencia se conserva, así que el par se multiplica por la relación: M₄ = M₁ · i = 30 · 9 = 270 N·m. Reducir velocidad aumenta el par en la misma proporción.',
   'Comprobación: P₁ = ω₁M₁ = 188,5 rad/s · 30 N·m ≈ 5,65 kW, y P₄ = ω₄M₄ = 20,9 rad/s · 270 N·m ≈ 5,65 kW. El eje de salida gira en el mismo sentido que el de entrada, porque cada engrane exterior invierte el sentido y hay dos. Con rendimiento real, el par sería algo menor.'
  ];
  a.html(`<div>${T[p]}</div>`);
 }});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();

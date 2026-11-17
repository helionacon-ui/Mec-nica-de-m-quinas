/* Mecánica de Máquinas: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function circInt(p0,r0,p1,r1,up){var dx=p1[0]-p0[0],dy=p1[1]-p0[1],d=Math.hypot(dx,dy),a=(r0*r0-r1*r1+d*d)/(2*d),h=Math.sqrt(Math.max(0,r0*r0-a*a)),xm=p0[0]+a*dx/d,ym=p0[1]+a*dy/d;return up?[xm-h*dy/d,ym+h*dx/d]:[xm+h*dy/d,ym-h*dx/d];}
function pin(D,x,y,c){D.ring(x,y,7,c||C.w,2);D.dot(x,y,2.5,c||C.w);}
function ground(D,x,y){D.path([[x,y],[x-12,y+18],[x+12,y+18]],C.mut,1.6);for(var k=-12;k<=12;k+=6)D.line(x+k,y+18,x+k-6,y+26,C.mut,1);}

/* T1 cuadrilátero articulado */
M.reg('mm-t1',M.base({title:'Cuadrilátero articulado: 1 grado de libertad',H:540,dur:16,caps:[[5,'Cuatro barras (una es el bastidor fijo) unidas por cuatro pares de rotación.'],[11,'Criterio de Grübler: <i>GDL = 3(n − 1) − 2j₁ − j₂ = 3·3 − 2·4 = 1</i>. Basta un motor en la manivela para fijar la posición de todo el mecanismo.'],[99,'Ley de Grashof: si la barra más corta más la más larga no supera a las otras dos, la más corta puede dar vueltas completas (manivela).']]},
 function(D,t){var s=60,O2=[160,330],O4=[160+4*s,330],a=1.2*s,b=3.6*s,c=2.6*s,th=t*1.2,A=[O2[0]+a*Math.cos(th),O2[1]-a*Math.sin(th)],B=circInt(A,b,O4,c,false);
  var tr=[];for(var k=0;k<60;k++){var tt=th-k*0.06,AA=[O2[0]+a*Math.cos(tt),O2[1]-a*Math.sin(tt)],BB=circInt(AA,b,O4,c,false);tr.push([(AA[0]+BB[0])/2,(AA[1]+BB[1])/2-30]);}
  D.line(O2[0],O2[1],O4[0],O4[1],C.mut,3,[8,5]);D.line(O2[0],O2[1],A[0],A[1],C.m,6);D.line(A[0],A[1],B[0],B[1],C.f,6);D.line(O4[0],O4[1],B[0],B[1],C.g,6);
  ground(D,O2[0],O2[1]);ground(D,O4[0],O4[1]);[O2,O4,A,B].forEach(function(p){pin(D,p[0],p[1]);});
  D.text('manivela (2)',O2[0]-20,O2[1]+50,{s:14,c:C.m});D.text('biela (3)',(A[0]+B[0])/2,(A[1]+B[1])/2-12,{s:14,c:C.f,a:'center'});D.text('balancín (4)',O4[0]+20,O4[1]+50,{s:14,c:C.g});
  D.text('GDL = 3(4 − 1) − 2·4 = 1',W/2,480,{it:true,s:22,a:'center',c:C.m,bold:true});}));

/* T2 biela-manivela */
var r2=1,l2=3.2;function xp(th){return r2*Math.cos(th)+Math.sqrt(l2*l2-Math.pow(r2*Math.sin(th),2));}
M.reg('mm-t2',M.base({title:'Mecanismo biela-manivela: posición y velocidad',H:560,dur:16,caps:[[5,'La manivela gira a velocidad constante y la biela convierte el giro en el movimiento alternativo del pistón.'],[11,'La posición del pistón no es una senoide pura: la biela finita la deforma. La velocidad (abajo) se anula en los puntos muertos.'],[99,'<i>x = r cos θ + √(l² − r² sen² θ)</i>. Derivando se obtienen la velocidad y la aceleración: es el análisis cinemático por el método analítico.']]},
 function(D,t){var th=t*1.4,s=55,O=[110,170],A=[O[0]+s*r2*Math.cos(th),O[1]-s*r2*Math.sin(th)],P=[O[0]+s*xp(th),O[1]];
  D.ring(O[0],O[1],s*r2,C.grid,1);D.line(O[0],O[1],A[0],A[1],C.m,6);D.line(A[0],A[1],P[0],P[1],C.f,6);D.rect(P[0]-22,P[1]-18,44,36,C.g,RG(C.g,.3),2);D.line(O[0]+s*2.1,P[1]+20,O[0]+s*4.4,P[1]+20,C.mut,2);D.line(O[0]+s*2.1,P[1]-20,O[0]+s*4.4,P[1]-20,C.mut,2);
  ground(D,O[0],O[1]);[O,A].forEach(function(p){pin(D,p[0],p[1]);});pin(D,P[0],P[1]);
  var B=U.axes(D,{xr:[0,4*Math.PI],yr:[-1.3,1.3],xt:[],yt:[-1,1],yd:0,xl:'θ',yl:''},{x:80,y:260,w:480,h:190,grid:true}),tm=th%(4*Math.PI);
  var p1=[],p2=[];for(var q=0;q<=tm;q+=0.03){p1.push([B.X(q),B.Y(xp(q)-3.05)]);var h=1e-3;p2.push([B.X(q),B.Y((xp(q+h)-xp(q-h))/(2*h))]);}D.path(p1,C.g,2.4);D.path(p2,C.hl,2.4);
  D.text('x − x̄',B.X(0.2),B.Y(1.2),{s:14,c:C.g});D.text('v = dx/dθ',B.X(2),B.Y(1.2),{s:14,c:C.hl});
  D.text('θ = '+nf((th*180/Math.PI)%360,0)+'°    x = '+nf(xp(th),3)+'·r',W/2,505,{it:true,s:20,a:'center',c:C.m});}));

/* T3 volante de inercia */
M.reg('mm-t3',M.curva({title:'Volante de inercia: fluctuación de velocidad',H:540,dur:18,p:[1,8],ax:{xr:[0,4*Math.PI],yr:[90,110],xt:[],yt:[95,100,105],yd:0,xl:'θ',yl:'ω (rad/s)'},h:300,
 f:function(x,I){return 100+8/I*Math.sin(2*x)+3/I*Math.sin(x+0.5);},
 read:function(I){var d=2*(8+3)/I;return ['inercia del volante ×'+nf(I,1)+'    ω_{máx} − ω_{mín} ≈ '+nf(d,2)+' rad/s','grado de irregularidad δ = (ω_{máx} − ω_{mín})/ω_{media} ≈ '+nf(d/100*100,2)+' %'];},
 caps:[[6,'En un motor de explosión el par no es constante: la velocidad del eje sube y baja a lo largo del ciclo.'],[12,'Un volante almacena energía cinética cuando sobra par y la devuelve cuando falta: <i>ΔE = I·ω²·δ</i>.'],[99,'Al aumentar su momento de inercia la fluctuación se reduce: el grado de irregularidad δ es inversamente proporcional a I.']]}));

/* T4 resonancia en vibraciones forzadas */
M.reg('mm-t4',M.curva({title:'Vibraciones forzadas: factor de amplificación',H:540,dur:18,p:[0.5,0.05],ax:{xr:[0,3],yr:[0,8],xt:[0.5,1,1.5,2,2.5,3],yt:[1,2,4,6,8],xd:1,yd:0,xl:'r = ω/ωₙ',yl:'X/X_{st}'},h:300,
 f:function(r,z){return 1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*z*r,2));},
 read:function(z){return ['ζ = '+nf(z,2)+'    pico ≈ 1/(2ζ) = '+nf(1/(2*z),2),'r > √2: la amplitud baja de la estática (aislamiento de vibraciones)'];},
 caps:[[6,'Un sistema masa-muelle-amortiguador excitado a frecuencia ω responde con una amplitud que depende de <i>r = ω/ωₙ</i>.'],[12,'Cerca de <i>r = 1</i> (resonancia) la amplitud se dispara. Con poco amortiguamiento el pico llega a <i>1/(2ζ)</i>.'],[99,'Para aislar una máquina hay que trabajar con <i>r &gt; √2</i>: ahí el sistema transmite menos que la fuerza estática.']]}));

/* T5 engranajes */
function gear(D,cx,cy,R,z,a,col){var p=[];for(var i=0;i<z*4;i++){var ang=a+i*2*Math.PI/(z*4),rr=(i%4<2)?R+R*0.08:R-R*0.08;p.push([cx+rr*Math.cos(ang),cy-rr*Math.sin(ang)]);}D.path(p.concat([p[0]]),col,2,RG(col,.2));D.dot(cx,cy,5,col);D.line(cx,cy,cx+R*0.7*Math.cos(a),cy-R*0.7*Math.sin(a),col,2.4);}
M.reg('mm-t5',M.base({title:'Engranajes: relación de transmisión',H:520,dur:16,caps:[[5,'Dos ruedas dentadas engranan: el piñón (z₁ = 12) mueve a la rueda (z₂ = 30). En el punto de contacto, las dos tienen la misma velocidad lineal.'],[11,'Como los dientes pasan de uno en uno, <i>i = ω₁/ω₂ = z₂/z₁ = 2,5</i>: la rueda grande gira 2,5 veces más despacio y en sentido contrario.'],[99,'La potencia se conserva (salvo pérdidas): si baja la velocidad, sube el par en la misma proporción, <i>M₂ = i·M₁</i>.']]},
 function(D,t){var m=8,z1=12,z2=30,R1=m*z1/2,R2=m*z2/2,cx1=150,cy=260,cx2=cx1+R1+R2,a1=t*1.5;gear(D,cx1,cy,R1,z1,a1,C.m);gear(D,cx2,cy,R2,z2,-a1*z1/z2+Math.PI/z2,C.f);
  D.text('z₁ = 12',cx1,cy+R1+34,{s:16,a:'center',c:C.m});D.text('z₂ = 30',cx2,cy+R2+30,{s:16,a:'center',c:C.f});
  D.text('i = z₂/z₁ = 2,5      ω₂ = ω₁/2,5      M₂ = 2,5·M₁',W/2,480,{it:true,s:20,a:'center',c:C.m});}));

/* T6 transmisión por correa */
M.reg('mm-t6',M.base({title:'Transmisión por correa',H:520,dur:16,caps:[[5,'La polea motriz (d₁ = 100 mm) arrastra a la conducida (d₂ = 250 mm) mediante la correa. Sin deslizamiento, la velocidad lineal de la correa es la misma en ambas.'],[11,'Relación de transmisión: <i>n₁/n₂ = d₂/d₁ = 2,5</i>. El ramal tenso tira y el flojo vuelve.'],[99,'La potencia transmitida es <i>P = (T₁ − T₂)·v</i>. La relación máxima de tensiones la limita el rozamiento: <i>T₁/T₂ = e^{μθ}</i>.']]},
 function(D,t){var c1=[160,260],r1=50,c2=[440,260],r2=110,a=t*2;D.ring(c1[0],c1[1],r1,C.m,3);D.ring(c2[0],c2[1],r2,C.f,3);
  [[c1,r1,a,C.m],[c2,r2,a*r1/r2,C.f]].forEach(function(q){for(var k=0;k<3;k++){var ang=q[2]+k*2.094;D.line(q[0][0],q[0][1],q[0][0]+q[1]*Math.cos(ang),q[0][1]-q[1]*Math.sin(ang),q[3],2);}D.dot(q[0][0],q[0][1],5,q[3]);});
  var d=c2[0]-c1[0],al=Math.asin((r2-r1)/d),tp1=[c1[0]-r1*Math.sin(al),c1[1]-r1*Math.cos(al)],tp2=[c2[0]-r2*Math.sin(al),c2[1]-r2*Math.cos(al)],bt1=[c1[0]-r1*Math.sin(al),c1[1]+r1*Math.cos(al)],bt2=[c2[0]-r2*Math.sin(al),c2[1]+r2*Math.cos(al)];
  D.line(tp1[0],tp1[1],tp2[0],tp2[1],C.g,4);D.line(bt1[0],bt1[1],bt2[0],bt2[1],C.mut,3);D.text('ramal tenso T₁',(tp1[0]+tp2[0])/2,(tp1[1]+tp2[1])/2-12,{s:14,a:'center',c:C.g});D.text('ramal flojo T₂',(bt1[0]+bt2[0])/2,(bt1[1]+bt2[1])/2+24,{s:14,a:'center',c:C.mut});
  for(var k=0;k<6;k++){var u=((t*0.35+k/6)%1);D.dot(lerp(tp1[0],tp2[0],u),lerp(tp1[1],tp2[1],u),4,C.g);}
  D.text('n₁/n₂ = d₂/d₁ = 250/100 = 2,5',W/2,470,{it:true,s:21,a:'center',c:C.m});}));

/* T7 torsión de un eje */
M.reg('mm-t7',M.base({title:'Ejes: torsión y ángulo girado',H:520,dur:16,caps:[[5,'Un eje empotrado en un extremo recibe un par T en el otro. Las generatrices rectas se convierten en hélices.'],[11,'El ángulo girado crece linealmente con el par y la longitud: <i>φ = T·L/(G·J)</i>, con <i>J = πd⁴/32</i>.'],[99,'La tensión tangencial máxima está en la superficie: <i>τ = T·r/J = 16T/(πd³)</i>. Al dimensionar se limitan tanto τ como el ángulo por metro.']]},
 function(D,t){var T=lerp(0,1,U.pp(t,16)),x0=100,x1=520,cy=250,R=55,phi=T*1.1;D.rect(70,cy-90,30,180,C.mut,RG(C.mut,.4),2);D.rect(x0,cy-R,x1-x0,2*R,C.w,RG(C.f,.12),2);
  for(var k=-2;k<=2;k++){var p=[];for(var x=x0;x<=x1;x+=4){var ang=k*0.5+phi*(x-x0)/(x1-x0);var y=cy-R*Math.sin(ang);if(Math.cos(ang)>0)p.push([x,y]);else{if(p.length>1)D.path(p,C.m,2);p=[];}}if(p.length>1)D.path(p,C.m,2);}
  D.ring(x1+30,cy,40,C.g,2);D.arrow(x1+30+40*Math.cos(0.5),cy-40*Math.sin(0.5),x1+30+40*Math.cos(0.5+1.4),cy-40*Math.sin(0.5+1.4),C.g,2.4);D.text('T',x1+80,cy-34,{it:true,s:20,c:C.g});
  D.text('T = '+nf(T*500,0)+' N·m     φ = TL/(GJ) = '+nf(phi*57.3,1)+'°',W/2,420,{it:true,s:21,a:'center',c:C.m});D.text('τ_{máx} = 16T/(πd³)',W/2,456,{it:true,s:19,a:'center'});}));

/* T8 leva y seguidor */
var h8=40,r0=70;function sl(f){f=((f%(2*Math.PI))+2*Math.PI)%(2*Math.PI);if(f<Math.PI)return h8/2*(1-Math.cos(f));if(f<1.25*Math.PI)return h8;if(f<2*Math.PI-0.25*Math.PI)return h8/2*(1+Math.cos((f-1.25*Math.PI)/(0.5*Math.PI)*Math.PI));return 0;}
M.reg('mm-t8',M.base({title:'Leva y seguidor: diagrama de desplazamientos',H:560,dur:16,caps:[[5,'La leva gira a velocidad constante y su perfil empuja al seguidor. El perfil se diseña a partir de la ley de desplazamiento deseada.'],[11,'Fases: subida (ley armónica), detención arriba, bajada y detención abajo.'],[99,'Leyes con aceleración finita en los extremos (cicloidal) evitan golpes a alta velocidad; la armónica tiene saltos de aceleración en los extremos.']]},
 function(D,t){var th=t*1.3,cx=150,cy=300,pts=[];for(var f=0;f<=6.3;f+=0.03){var r=r0+sl(f),ang=f+th+Math.PI/2;pts.push([cx+r*Math.cos(ang),cy-r*Math.sin(ang)]);}
  D.path(pts,C.m,2.4,RG(C.m,.2));D.dot(cx,cy,5,C.m);var s=sl(-th),fy=cy-r0-s;D.line(cx,fy-10,cx,fy-150,C.f,6);D.ring(cx,fy-8,9,C.f,2.4);D.rect(cx-14,fy-150,28,10,C.f,RG(C.f,.3),1.6);
  var A=U.axes(D,{xr:[0,2*Math.PI],yr:[0,50],xt:[Math.PI,2*Math.PI],xf:function(v){return v<4?'180°':'360°';},yt:[20,40],yd:0,xl:'θ',yl:'s (mm)'},{x:320,y:140,w:270,h:200,grid:true}),tm=th%(2*Math.PI),p=[];
  for(var q=0;q<=tm;q+=0.02)p.push([A.X(q),A.Y(sl(-q+0)*1)]);U.plotf(D,A,function(q){return sl(q);},C.mut,1.2,0.4);var p2=[];for(var q2=0;q2<=tm;q2+=0.02)p2.push([A.X(q2),A.Y(sl(q2))]);D.path(p2,C.f,2.6);D.dot(A.X(tm),A.Y(sl(tm)),5,C.f);
  D.text('s = '+nf(sl(tm),1)+' mm    carrera h = 40 mm',W/2,500,{it:true,s:20,a:'center',c:C.m});}));
})();

/* SYNTHWAVE.FM™ / Animação original procedural — sem faixas musicais, sem imagens genéricas.
   O canvas desenha frequências, partículas e reflexos. Pausa fora de tela e respeita movimento reduzido. */
(()=>{'use strict';
 const canvas=document.getElementById('sw-hero-canvas');
 if(!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return;
 const hero=canvas.closest('.hero');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const colors=['122,221,255','250,105,193','165,129,254'];
 const dots=Array.from({length:55},(_,i)=>({
   x:((i*283+79)%971)/971,y:((i*167+41)%907)/907,
   r:(i%4===0?1.8:.9),speed:(i%5+1)*.0007,shift:i*11.43
 }));
 let w=0,h=0,dpr=1,visible=true,raf=0,time=0,frameCount=0,ro;
 const sizes=()=>{
   const rect=canvas.getBoundingClientRect();
   dpr=Math.min(devicePixelRatio||1,2);
   w=Math.max(1,rect.width);h=Math.max(1,rect.height);
   canvas.width=Math.ceil(w*dpr);canvas.height=Math.ceil(h*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
 };
 const render=(ms)=>{
   if(!visible||document.hidden)return;
   time=ms/1000;
   ctx.clearRect(0,0,w,h);
   const offX=w*.69,offY=h*.43,R=Math.min(w,h)*.33;
   const glow=ctx.createRadialGradient(offX,offY,0,offX,offY,R*1.8);
   glow.addColorStop(0,'rgba(191,84,215,.10)');
   glow.addColorStop(.54,'rgba(116,74,223,.06)');
   glow.addColorStop(1,'rgba(0,0,0,0)');
   ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   for(let j=0;j<4;j++){
     const color=colors[j%colors.length];
     ctx.beginPath();
     const baseline=h*(.52+j*.055);
     const A=h*(.018+.012*j);
     for(let x=0;x<=w+4;x+=5){
       const fade=(.42+.58*x/Math.max(1,w));
       const y=baseline+Math.sin(x/w*16.5+time*(.72+j*.17)+j*1.6)*A*fade
         +Math.sin(x/w*31-time*.28+j*2.3)*A*.25;
       if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
     }
     ctx.strokeStyle='rgba('+color+','+(.20+j*.075)+')';
     ctx.lineWidth=j===1?2:1.2;
     ctx.shadowBlur=12;ctx.shadowColor='rgba('+color+',.45)';
     ctx.stroke();ctx.shadowBlur=0;
   }
   for(const d of dots){
     const y=((d.y*1.2-(time*d.speed)%1.2)+1.2)%1.2*h;
     const x=(d.x*w+Math.sin(time*.25+d.shift)*12);
     const alpha=(.18+.2*Math.sin(time*.85+d.shift))*.7;
     ctx.beginPath();ctx.arc(x,y,d.r,0,Math.PI*2);
     ctx.fillStyle='rgba(230,207,255,'+Math.max(.04,alpha)+')';ctx.fill();
   }
   const base=h*.78;
   ctx.save();
   ctx.lineWidth=.7;
   for(let i=0;i<16;i++){
     const t=i/15,yy=base+(h-base)*t*t;
     ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);
     ctx.strokeStyle='rgba(136,126,235,'+(.02+.055*t)+')';ctx.stroke();
   }
   for(let i=-10;i<=10;i++){
     ctx.beginPath();ctx.moveTo(w*.55,base);ctx.lineTo(w*.5+i*w*.12,h);
     ctx.strokeStyle='rgba(112,180,238,.045)';ctx.stroke();
   }
   ctx.restore();
   const barX=w*.72,barBottom=h*.87;
   for(let i=0;i<31;i++){
     const n=.25+.75*Math.abs(Math.sin(time*1.15+i*.37)*Math.cos(time*.56+i*.16));
     const height=(.02+.057*n)*h;
     ctx.fillStyle=i%4===0?'rgba(240,118,210,.40)':'rgba(128,221,255,.28)';
     ctx.fillRect(barX+i*Math.max(4,w*.005),barBottom-height,Math.max(2,w*.0024),height);
   }
   if(!reduce.matches){raf=requestAnimationFrame(render)}
 };
 const start=()=>{cancelAnimationFrame(raf);if(!visible||document.hidden)return;if(reduce.matches)render(performance.now());else raf=requestAnimationFrame(render)};
 const io='IntersectionObserver'in window?new IntersectionObserver(es=>{visible=es[0]?.isIntersecting??false;if(visible)start();else cancelAnimationFrame(raf)},{threshold:.03}):null;
 if(io)io.observe(hero);
 document.addEventListener('visibilitychange',start);
 reduce.addEventListener?.('change',start);
 if('ResizeObserver'in window){ro=new ResizeObserver(()=>{sizes();start()});ro.observe(canvas)}else addEventListener('resize',()=>{sizes();start()},{passive:true});
 sizes();start();
})();
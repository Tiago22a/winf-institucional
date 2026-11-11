/* Synthwave.FM™ — Afterglow. Arte animada original sem áudio, sem stream simulado.
   Animação visual ambiental, respeita reduced-motion, pausa manual e abas ocultas. */
(()=>{'use strict';
const body=document.body;
const header=document.querySelector('.sf-header');
const menu=document.getElementById('sf-menu-toggle');
const nav=document.getElementById('sf-header-nav');
const motion=document.getElementById('sf-motion-toggle');
const canvas=document.getElementById('sf-field');
const year=document.getElementById('sf-year');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(year)year.textContent=new Date().getFullYear();
const syncHeader=()=>header?.classList.toggle('sf-scrolled',window.scrollY>60);
syncHeader();window.addEventListener('scroll',syncHeader,{passive:true});
const closeMenu=()=>{
 if(!nav||!menu)return;
 nav.dataset.open='false';menu.setAttribute('aria-expanded','false');
};
if(menu&&nav){
 menu.addEventListener('click',()=>{
  const open=menu.getAttribute('aria-expanded')!=='true';
  menu.setAttribute('aria-expanded',String(open));
  nav.dataset.open=String(open);
 });
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus()}});
 document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu()});
}
let manuallyPaused=false;
let isVisible=true;
let raf=0,lastFrame=0,w=0,h=0,dpr=1;
let ctx=null;
try{ctx=canvas?.getContext('2d',{alpha:true})||null}catch(_){ctx=null}
const motionalOff=()=>reduced.matches||manuallyPaused;
const updateControl=()=>{
 body.classList.toggle('sf-motion-off',motionalOff());
 if(motion){
  motion.setAttribute('aria-pressed',String(motionalOff()));
  motion.textContent=motionalOff()?'ATIVAR EFEITOS':'PAUSAR EFEITOS';
  if(reduced.matches){motion.textContent='EFEITOS REDUZIDOS';motion.disabled=true}
  else motion.disabled=false;
 }
};
function size(){
 if(!ctx||!canvas)return;
 const rect=canvas.getBoundingClientRect();
 w=Math.max(1,rect.width);h=Math.max(1,rect.height);
 dpr=Math.min(window.devicePixelRatio||1,1.75);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
}
const particles=Array.from({length:52},(_,i)=>({
 x:((i*397+29)%991)/991,
 y:((i*211+13)%997)/997,
 radius:i%17===0?1.8:.65,
 speed:8+(i*17)%31,
 phase:i*.57
}));
function draw(ms){
 raf=0;
 if(!ctx||motionalOff()||!isVisible||document.hidden)return;
 if(ms-lastFrame<31){raf=requestAnimationFrame(draw);return}
 lastFrame=ms;
 const t=ms*.001;
 ctx.clearRect(0,0,w,h);
 const left=w*.35,right=w*.98;
 // Three translucent neon wave trails, a pure visual metaphor rather than live audio data.
 for(let j=0;j<3;j++){
  ctx.beginPath();
  const baseY=h*(.42+j*.055);
  const amp=h*(.016+j*.009);
  for(let x=left;x<=right+6;x+=6){
   const xf=x/Math.max(w,1);
   const fade=Math.max(0,(x-left)/Math.max(right-left,1));
   const y=baseY+Math.sin(x*.017+t*(.5+j*.22)+j*1.8)*amp*fade+
      Math.sin(x*.031-t*.33)*amp*.32*fade;
   if(x===left)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=['rgba(248,117,189,.22)','rgba(121,227,255,.2)','rgba(180,137,250,.16)'][j];
  ctx.lineWidth=j===0?1.7:1.1;ctx.stroke();
 }
 for(const p of particles){
  let x=(p.x*w+Math.sin(t*.21+p.phase)*7),y=(p.y*h+t*p.speed)%(h+30);
  const fade=x<w*.45?.15:1;
  ctx.fillStyle='rgba(230,212,255,'+(fade*(.12+.14*Math.sin(t*.62+p.phase)**2))+')';
  ctx.beginPath();ctx.arc(x,y,p.radius,0,Math.PI*2);ctx.fill();
 }
 raf=requestAnimationFrame(draw);
}
const stop=()=>{if(raf){cancelAnimationFrame(raf);raf=0}if(ctx)ctx.clearRect(0,0,w,h)};
const run=()=>{
 stop();if(!ctx||motionalOff()||!isVisible||document.hidden)return;
 lastFrame=0;raf=requestAnimationFrame(draw);
};
updateControl();
if(motion)motion.addEventListener('click',()=>{manuallyPaused=!manuallyPaused;updateControl();if(motionalOff())stop();else run()});
reduced.addEventListener?.('change',()=>{updateControl();if(motionalOff())stop();else run()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else run()});
if('IntersectionObserver'in window&&canvas){
 const ob=new IntersectionObserver(entries=>{
  isVisible=Boolean(entries[0]?.isIntersecting);
  if(isVisible)run();else stop();
 },{threshold:.01});
 ob.observe(canvas);
}
if(ctx){
 if('ResizeObserver'in window){const ob=new ResizeObserver(()=>{size();run()});ob.observe(canvas)}
 else window.addEventListener('resize',()=>{size();run()},{passive:true});
 size();run();
}
})();
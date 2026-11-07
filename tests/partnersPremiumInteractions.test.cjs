"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("partners/index.html"),css=read("partners/premium-home.css"),js=read("partners/premium-home.js");

test("Partners uses a distinct, cohesive translucent footer with honest contact CTAs",()=>{
 assert.match(html,/aria-label="Rodapé institucional WINF Partners"/);
 assert.match(html,/PRONTO PARA FAZER PARTE/);
 assert.match(html,/DO ECOSSISTEMA\?/);
 assert.match(html,/href="\/briefing\/#contact">FALAR COM A PARTNERS/);
 assert.match(html,/href="#modelos">ESTUDAR MODALIDADES/);
 assert.match(html,/class="footer-intro-inner"/);
 assert.match(html,/class="footer-intro-actions"/);
 assert.match(html,/<strong>WINF PARTNERS<sup>™<\/sup><\/strong>/);
 assert.match(html,/FRANQUIA TECNOLÓGICA \/ EXPANSÃO/);
 assert(!html.includes("AEROCORE™ / NAV GLOBAL"));
 assert.equal([...html.matchAll(/<footer\b/g)].length,1);
 assert.match(css,/\.site-footer \.footer-intro::before/);
 assert.match(css,/\.site-footer \.footer-intro::after/);
 assert.match(css,/\.footer-intro-inner/);
 assert.match(css,/@media\(max-width:440px\)/);
});
test("video and small mobile enhancement are loaded locally without third-party libraries",()=>{
 assert.match(html,/src="\/partners\/premium-home.js\?v=20261107-1" defer/);
 assert.match(html,/src="\/partners\/media\/hero\.mp4"/);
 assert.match(html,/poster="\/partners\/media\/hero-poster\.webp"/);
 assert.match(js,/prefers-reduced-motion: reduce/);
 assert.match(js,/saveData/);
 assert.match(js,/visibilitychange/);
 assert.match(js,/Escape/);
 assert(!js.includes("https://"));
});
function simulate({reduced=false,saveData=false}={}){
 const globalListeners={};
 const closeHandlers={};
 let focused=0,plays=0,pauses=0;
 const links=[{addEventListener:(event,cb)=>closeHandlers.link1=cb},
              {addEventListener:(event,cb)=>closeHandlers.link2=cb}];
 const summary={focus:()=>{focused++;}};
 const menu={
  open:true,
  querySelector:s=>s==="summary"?summary:null,
  querySelectorAll:s=>s==="nav a"?links:[],
  contains:target=>target==="inside"
 };
 const video={
  autoplay:true,play(){plays++;return Promise.resolve();},
  pause(){pauses++;}
 };
 const motion={matches:reduced,addEventListener:(event,cb)=>closeHandlers.motion=cb};
 const document={
  hidden:false,
  querySelector:s=>s===".mobile-menu"?menu:s===".hero-video"?video:null,
  addEventListener:(event,cb)=>globalListeners[event]=cb
 };
 vm.runInNewContext(js,{
  document,window:{matchMedia:()=>motion},navigator:{connection:{saveData}}
 });
 return {menu,video,document,motion,globalListeners,closeHandlers,
  get counts(){return{focused,plays,pauses}}};
}
test("mobile menu closes after internal navigation and Escape restores focus",()=>{
 const a=simulate();
 assert(a.counts.plays>0);
 a.closeHandlers.link1();
 assert.equal(a.menu.open,false);
 a.menu.open=true;
 a.globalListeners.keydown({key:"Escape"});
 assert.equal(a.menu.open,false);
 assert.equal(a.counts.focused,1);
 a.menu.open=true;
 a.globalListeners.pointerdown({target:"outside"});
 assert.equal(a.menu.open,false);
 a.menu.open=true;
 a.globalListeners.pointerdown({target:"inside"});
 assert.equal(a.menu.open,true);
});
test("reduced-motion and data saving prevent video autoplay",()=>{
 for(const opts of [{reduced:true},{saveData:true}]){
  const a=simulate(opts);
  assert.equal(a.counts.plays,0);
  assert(a.counts.pauses>0);
  assert.equal(a.video.autoplay,false);
 }
});
test("switching visibility pauses and resumes only when appropriate",()=>{
 const a=simulate();
 const initial=a.counts.plays;
 a.document.hidden=true;
 a.globalListeners.visibilitychange();
 assert(a.counts.pauses>0);
 a.document.hidden=false;
 a.globalListeners.visibilitychange();
 assert(a.counts.plays>initial);
 a.motion.matches=true;
 a.closeHandlers.motion();
 const paused=a.counts.pauses;
 assert(paused>=2);
 a.document.hidden=false;
 a.globalListeners.visibilitychange();
 assert.equal(a.counts.pauses,paused+1);
});

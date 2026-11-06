"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const vm=require("node:vm");
const fs=require("node:fs");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","script.js"),"utf8");

// Minimal in-memory DOM harness. Executes the REAL shared script without
// external packages, network, or browser globals.
function createUI({reducedMotion=false}={}){
 const handlers=new Map(),timers=new Map();let nextTimer=1;
 const doc={activeElement:null,documentElement:{scrollHeight:1200},querySelector:()=>null,
  addEventListener(type,fn){handlers.set(type,fn)}};
 class Element {
  constructor(name,attrs={}){
   this.name=name;this.attributes={...attrs};this.listeners={};
   this.flags=new Set(name==="menu"?["hidden"]:[]);
   this.classList={
    add:v=>this.flags.add(v),
    remove:v=>this.flags.delete(v),
    contains:v=>this.flags.has(v)
   };
   this.hidden=false;this.isConnected=true;this.dataset={};this.style={};this.tagName="DIV";
  }
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  fire(type,extra={}){for(const fn of this.listeners[type]||[])fn({target:this,currentTarget:this,...extra});}
  setAttribute(k,v){this.attributes[k]=String(v)}
  removeAttribute(k){delete this.attributes[k]}
  getAttribute(k){return this.attributes[k]??null}
  focus(){doc.activeElement=this}
  getClientRects(){return [{}]}
  contains(node){return node===this||node===close||node===link}
  querySelector(selector){return selector==='[data-action="close-menu"]'?close:null}
  querySelectorAll(){return [close,link]}
 }
 const body=new Element("body");
 const menu=new Element("menu",{"aria-hidden":"true"});
 const trigger=new Element("trigger");
 const close=new Element("close");
 const link=new Element("link",{href:"/briefing/"});
 doc.body=body;doc.activeElement=trigger;
 doc.getElementById=id=>id==="menu-overlay"?menu:null;
 doc.querySelectorAll=selector=>{
  if(selector==='[data-action="open-menu"]')return [trigger];
  if(selector==='[data-action="close-menu"]')return [close];
  if(selector==='[data-action="menu-link"]')return [link];
  return [];
 };
 const win={
  innerHeight:600,scrollY:0,
  matchMedia:()=>({matches:reducedMotion}),
  addEventListener:()=>{},
  setTimeout(fn,ms){const id=nextTimer++;timers.set(id,{fn,ms});return id},
  clearTimeout(id){timers.delete(id)}
 };
 const history={replaceState:()=>{}};
 vm.runInNewContext(source,{window:win,document:doc,history,requestAnimationFrame:fn=>fn()});
 const key=(name,shift=false)=>{
  let prevented=false;
  handlers.get("keydown")?.({key:name,shiftKey:shift,preventDefault(){prevented=true}});
  return prevented;
 };
 const flush=()=>{for(const [id,item] of [...timers]){timers.delete(id);item.fn();}};
 return {doc,body,menu,trigger,close,link,key,flush,timers};
}
test("menu opens with expanded state and keyboard focus in dialog",()=>{
 const x=createUI();
 x.trigger.fire("click");
 assert.equal(x.menu.getAttribute("aria-hidden"),"false");
 assert.equal(x.trigger.getAttribute("aria-expanded"),"true");
 assert.equal(x.doc.activeElement,x.close);
 assert(!x.menu.classList.contains("hidden"));
});
test("Tab wraps in both directions while overlay is open",()=>{
 const x=createUI();x.trigger.fire("click");
 x.link.focus();
 assert(x.key("Tab"));
 assert.equal(x.doc.activeElement,x.close);
 assert(x.key("Tab",true));
 assert.equal(x.doc.activeElement,x.link);
});
test("Escape closes menu and restores original trigger focus",()=>{
 const x=createUI();x.trigger.fire("click");x.link.focus();
 assert(x.key("Escape"));
 assert.equal(x.menu.getAttribute("aria-hidden"),"true");
 assert.equal(x.trigger.getAttribute("aria-expanded"),"false");
 assert.equal(x.doc.activeElement,x.trigger);
 assert.equal(x.menu.getAttribute("inert"),"");
 x.flush();assert(x.menu.classList.contains("hidden"));
});
test("reopening before delayed close does not hide the active overlay",()=>{
 const x=createUI();x.trigger.fire("click");
 x.close.fire("click");
 x.trigger.fire("click");
 x.flush();
 assert.equal(x.menu.getAttribute("aria-hidden"),"false");
 assert(!x.menu.classList.contains("hidden"));
});
test("reduced-motion closes immediately when scheduled callback runs",()=>{
 const x=createUI({reducedMotion:true});
 x.trigger.fire("click");x.close.fire("click");
 assert([...x.timers.values()].some(v=>v.ms===0));
 x.flush();assert(x.menu.classList.contains("hidden"));
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const js=read("aerocore/assets/onde-comprar.js");
const config=JSON.parse(read("config/winf-territorios-consumidor-200.json"));
function harness(isWinf){
 class Node {
  constructor(){this.children=[];this.options=[];this.dataset={};this.events={};this.hidden=false;this.value="";this.attributes={};this.textContent="";}
  append(x){this.children.push(x);if(x.tagName==="option")this.options.push(x);}
  replaceChildren(...xs){this.children=xs;}
  addEventListener(name,fn){this.events[name]=fn;}
  setAttribute(name,value){this.attributes[name]=value;}
  insertAdjacentElement(){}
  scrollIntoView(){}
  querySelector(){return new Node();}
 }
 class Card {
  constructor(){
   this.nodes=new Map();
   for(const sel of ["article",".directory-card-state",".directory-card-status",".directory-card-city",".directory-card-segment",".directory-card-claim",".directory-card-tags",".directory-card-links"])
    this.nodes.set(sel,new Node());
  }
  querySelector(sel){const n=this.nodes.get(sel);if(!n)throw Error("Unknown selector: "+sel);return n;}
 }
 const ids=new Map();
 const get=id=>{if(!ids.has(id))ids.set(id,new Node());return ids.get(id);};
 const modes=[new Node(),new Node()];
 modes[0].dataset.directoryMode="ativas";modes[1].dataset.directoryMode="territorios";
 const root={classList:{contains:name=>isWinf&&name==="winf-directory"},querySelectorAll:()=>modes};
 const document={
  querySelector:sel=>sel===".ac-directory"?root:sel===".directory-service-field"?get("service-field"):new Node(),
  getElementById:get,
  createElement:tag=>{const n=new Node();n.tagName=tag;return n;},
  createDocumentFragment:()=>new Node()
 };
 get("directory-card").content={cloneNode:()=>new Card()};
 const requests=[];
 const window={matchMedia:()=>({matches:false}),addEventListener:()=>{},open:()=>{}};
 const location={hash:"",origin:"https://winf.com.br"};
 const context={document,window,location,URL,encodeURIComponent,console,
  globalThis:{WINF_CIDADES:[],WINF_PAGINAS_REGIONAIS:[],WINF_UNIDADES_EXTRAS:[]},
  fetch:async(url)=>{requests.push(url);return{ok:true,json:async()=>config};}
 };
 vm.runInNewContext(js,context,{timeout:1000});
 return {get,modes,requests};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test("busca municipal WINF exibe atendimento e WhatsApp central",async()=>{
 const h=harness(true);
 await flush();await flush();
 assert.equal(h.requests.length,1);
 assert.equal(h.requests[0],"/config/winf-territorios-consumidor-200.json");
 assert.match(h.get("directory-count").textContent,/200 cidades/);
 h.get("directory-query").value="Barueri";
 h.get("directory-query").events.input();
 assert.match(h.get("directory-count").textContent,/1 cidade/);
 const card=h.get("directory-results").children[0].children[0];
 assert.match(card.nodes.get(".directory-card-city").textContent,/Barueri/);
 assert.match(card.nodes.get(".directory-card-status").textContent,/Solicitações WINF abertas/);
 const links=card.nodes.get(".directory-card-links").children;
 assert.equal(links.length,1);
 assert.match(links[0].href,/^https:\/\/wa\.me\/5513981113001\?/);
 assert.match(decodeURIComponent(links[0].href),/Barueri\/SP/);
 h.modes[1].events.click();
 const franchising=h.get("directory-results").children[0].children[0].nodes.get(".directory-card-links").children;
 assert.match(franchising[0].href,/wa\.me\/5513997815375/);
});
test("os 200 municípios arquitetônicos não aparecem como disponibilidade automotiva",async()=>{
 const h=harness(true);await flush();await flush();
 h.get("directory-service").value="automotivo";h.get("directory-service").events.change();
 assert.match(h.get("directory-count").textContent,/0 cidades/);
});
test("o diretório AeroCore não importa os 200 territórios WINF Select",async()=>{
 const h=harness(false);await flush();await flush();
 assert.equal(h.requests.length,0);
});

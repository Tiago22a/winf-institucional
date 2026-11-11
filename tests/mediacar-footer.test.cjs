"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const simulator=read("partners/carro-midia/index.html");
const footer=read("partials/winf-footer.html");
const enhancer=read("js/winf-footer.js");

test("MediaCar orienta a jornada de simulação e mantém controles e exportação",()=>{
 assert.match(simulator,/class="sim-guide"/);
 assert.equal((simulator.match(/class="sim-guide-item"/g)||[]).length,3);
 for(const id of ["photoInput","viewTabs","stage","zones","slotEditor","addSlot","saveProject","loadProject","exportJpg","printProposal","copySummary","resetProject"])
  assert.match(simulator,new RegExp('id="'+id+'"'),id);
 assert.match(simulator,/data\-category|simulação|Simulação/i);
 assert.match(simulator,/IndexedDB|indexedDB/);
 const script=simulator.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script,"simulador precisa manter o código funcional");
 assert.doesNotThrow(()=>new Function(script));
});

test("MediaCar deixa a página rolar no celular sem impedir arrastar cotas",()=>{
 assert.match(simulator,/\.stage\{touch-action:pan-y\}/);
 assert.match(simulator,/\.zone\{touch-action:none\}/);
 assert.match(simulator,/@media\(max-width:850px\)\{\.sim-guide\{grid-template-columns:1fr\}/);
});

test("Rodapé institucional publica os projetos que já têm rotas próprias",()=>{
 for(const h of [footer,simulator]){
  assert.match(h,/href="\/partners\/universo-dark\/"/);
  assert.match(h,/href="\/synthwave\/"/);
  assert.doesNotMatch(h,/title="Canal em breve">UNIVERSO DARK/);
  assert.doesNotMatch(h,/title="Canal em breve">SYNTHWAVE/);
  assert.match(h,/instagram\.com\/maw\.partners\//);
 }
 assert.match(enhancer,/\.wf-ref-upcoming/);
 assert.match(enhancer,/\/partners\/universo-dark\//);
 assert.match(enhancer,/\/synthwave\//);
 assert.doesNotThrow(()=>new Function(enhancer));
});

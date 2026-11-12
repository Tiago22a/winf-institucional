"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const simulator=read("partners/carro-midia/index.html");
const media=read("mediacar/index.html");
const partner=read("partners/index.html");
const briefing=read("briefing/index.html");
const footer=read("partials/winf-footer.html");
const enhancer=read("js/winf-footer.js");
const credit=read("js/winf-site-credit.js");
const creditCss=read("css/winf-site-credit.css");
const brandCss=read("css/mediacar-brand-polish.css");
const partnerFooterCss=read("css/mediacar-partners-footer.css");

test("MediaCar de demonstração mantém quatro veículos, cotas e exportações",()=>{
  for(const id of ["stage","carImage","zones","territory","car","style","brand","logo","value","sum","save","png","contract","clear","exportJSON","importJSON","mcSyncPanel"]){
    assert.match(simulator,new RegExp('id="'+id+'"'),id);
  }
  assert.equal((simulator.match(/data:image\/webp;base64/g)||[]).length,4);
  assert.match(simulator,/const POSITIONS=/);
  assert.match(simulator,/window\.MediaCarApp/);
  assert.match(simulator,/function saveLocal\(/);
  assert.match(simulator,/function exportPNG\(/);
  const script=simulator.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,"JavaScript principal presente");
  assert.doesNotThrow(()=>new Function(script));
});

test("MediaCar preserva a rolagem natural e é responsivo",()=>{
  assert.match(simulator,/touch-action:pan-y/);
  assert.match(simulator,/@media\(max-width:850px\)/);
  assert.match(simulator,/@media\(max-width:520px\)/);
  assert.match(simulator,/mc-sim-header/);
  assert.match(brandCss,/@media\(max-width:750px\)/);
});

test("Rodapé MediaCar é Partners / Briefing, não AeroCore",()=>{
  for(const markup of [simulator,media]){
    assert.match(markup,/class="mc-p-footer"/);
    assert.match(markup,/href="\/partners\/"/);
    assert.match(markup,/href="\/briefing\/"/);
    assert.match(markup,/href="\/maw\/"/);
    assert.match(markup,/href="https:\/\/nexablue\.com\.br\/"/);
    assert.doesNotMatch(markup,/class="wf-reference-footer"/);
  }
  assert.match(partner,/class="wp-roadmap"/);
  assert.match(briefing,/class="pb-footer-strip"/);
  assert.match(partnerFooterCss,/\.mc-p-footer/);
  assert.match(partnerFooterCss,/\.mc-p-footer-lockup/);
});

test("Crédito da rede referencia página M.A.W. e site Nexa na ordem solicitada",()=>{
  assert.match(footer,/<p class="winf-footer-credit">[\s\S]*?href="\/maw\/"[\s\S]*?href="https:\/\/nexablue\.com\.br\/"/);
  assert.match(credit,/addLink\('M\.A\.W\.™', '\/maw\/'/);
  assert.match(credit,/addLink\('NEXA BLUE™', 'https:\/\/nexablue\.com\.br\/'/);
  assert.match(creditCss,/\.winf-site-signature/);
  assert.doesNotThrow(()=>new Function(credit));
  assert.match(enhancer,/\.wf-ref-upcoming/);
});

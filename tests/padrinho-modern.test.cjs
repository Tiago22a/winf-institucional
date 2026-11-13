"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const page=read("partners/padrinho-modern/index.html");
const briefing=read("briefing/index.html");
const partners=read("partners/index.html");
const asset=read("briefing/asset-light/index.html");
const kiosk=read("briefing/quiosque/index.html");
const flagship=read("briefing/flagship/index.html");
test("Padrinho Modern tem URL compartilhável, mensagem ao investidor e três modelos",()=>{
  assert.match(page,/<title>Padrinho Modern™/);
  assert.match(page,/<link rel="canonical" href="https:\/\/(?:www\.)?winf\.com\.br\/partners\/padrinho-modern\/"/);
  for(const item of ['id="asset-light"','id="quiosque"','id="flagship"','id="share-page"','id="copy-page"','id="share-status"','id="copy-status"'])assert.ok(page.includes(item),item);
  assert.match(page,/R\$ 15\.000/);
  assert.match(page,/R\$ 95 mil/);
  assert.match(page,/R\$ 250\.000/);
  assert.match(page,/sem promessa de lucro|sem garantia de faturamento|Não há garantia de faturamento/i);
  assert.match(page,/href="\/maw\/"/);
  assert.match(page,/href="https:\/\/nexablue\.com\.br\/"/);
  const code=page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(code);
  assert.doesNotThrow(()=>new Function(code));
});
test("Cada modalidade individual oferece o link de apadrinhamento no fechamento",()=>{
 for(const [html,anchor] of [[asset,'asset-light'],[kiosk,'quiosque'],[flagship,'flagship']]){
  assert.match(html,/class="pm-mini"/);
  assert.ok(html.includes('href="/partners/padrinho-modern/#'+anchor+'"'));
  assert.match(html,/padrinho-modern-cta\.css/);
 }
});
test("Briefing e Partners oferecem Padrinho em todos os modelos e como última chamada",()=>{
 for(const html of [briefing,partners]){
   assert.match(html,/id="padrinho-modern"/);
   assert.equal((html.match(/class="pm-model-link"/g)||[]).length,3);
   assert.match(html,/href="\/partners\/padrinho-modern\/"/);
 }
});
test("A estrutura digital turnkey Asset Light está descrita nos três pontos comerciais",()=>{
 for(const html of [asset,briefing,partners]){
   assert.match(html,/id="estrutura-digital-territorial"/);
   for(const term of ['SITE DA CIDADE','INSTAGRAM','WHATSAPP','CONTA GOOGLE','GOOGLE DRIVE','SISTEMA + IA'])assert.ok(html.includes(term),term);
   assert.match(html,/WINF OS™/);
   assert.match(html,/asset-light-ready-kit\.css/);
 }
});

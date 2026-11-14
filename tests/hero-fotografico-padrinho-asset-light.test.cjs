"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const padrinho=read("partners/padrinho-modern/index.html"),light=read("briefing/asset-light/index.html"),css=read("briefing/model-page.css");
test("Padrinho Modern tem capa com imagem exclusiva atrás do texto",()=>{
 assert.match(padrinho,/<section class="hero" aria-labelledby="padrinho-title">/);
 assert.match(padrinho,/url\("\/partners\/padrinho-modern\/media\/winf-padrinho-modern-oportunidade-04.webp"\)/);
 assert.match(padrinho,/rel="preload" as="image" href="\/partners\/padrinho-modern\/media\/winf-padrinho-modern-oportunidade-04.webp"/);
 assert.match(padrinho,/linear-gradient\(90deg,rgba\(5,7,11,/);
 assert.match(padrinho,/@media\(max-width:480px\)/);
});
test("Padrinho: oito fotos exclusivas, nenhum src visual duplicado",()=>{
 const names=["mentoria-01","parceria-01","crescimento-02","parceria-02","crescimento-04","oportunidade-03","oportunidade-04","mentoria-04"];
 for(const name of names){
  const filename="winf-padrinho-modern-"+name+".webp";
  assert.ok(fs.existsSync(path.join(root,"partners/padrinho-modern/media",filename)),filename);
  assert.ok(padrinho.includes(filename),filename);
 }
 const srcs=[...padrinho.matchAll(/<img\s+[^>]*src="(\/partners\/padrinho-modern\/media\/[^"]+)"/g)].map(m=>m[1]);
 assert.equal(srcs.length,new Set(srcs).size,"repetição de imagem em cards");
});
test("Asset Light: capa panorâmica sobreposta ao texto, sem usar fotos Padrinho",()=>{
 assert.match(light,/<section class="intro"><div class="wrap"><div class="al-cover"><div class="intro-layout">/);
 assert.ok(light.indexOf('class="al-cover"')<light.indexOf('class="mosaic"'));
 assert.match(css,/body\.page-asset-light \.al-cover::before/);
 assert.match(css,/url\("\/briefing\/media\/asset-light-gestao-20261108.webp"\)/);
 assert.match(light,/rel="preload" as="image" href="\/briefing\/media\/asset-light-gestao-20261108.webp"/);
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/@media\(max-width:480px\)/);
 assert.ok(fs.existsSync(path.join(root,"briefing/media/asset-light-gestao-20261108.webp")));
 assert.ok(!padrinho.includes("asset-light-gestao-20261108.webp"),"capa Asset Light reutilizada no Padrinho");
});
test("identidade WINF/Ghost e links continuam oficiais",()=>{
 assert.match(padrinho,/<img src="\/winf-logo.svg" width="95" height="35" alt="WINF™">/);
 assert.match(light,/<img src="\/briefing\/media\/winf-logo-white-official.png" alt="Logomarca oficial WINF">/);
 assert.match(light,/<img src="\/aerocore\/assets\/ghost-symbol.png" alt="">/);
 assert.match(padrinho,/href="\/briefing\/asset-light\/"/);
 assert.match(light,/href="\/partners\/padrinho-modern\/#asset-light"/);
});

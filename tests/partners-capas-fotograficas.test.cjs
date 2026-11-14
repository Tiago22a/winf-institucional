"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const padrinho=read("partners/padrinho-modern/index.html");
const light=read("briefing/asset-light/index.html");
const styles=read("briefing/model-page.css");
const dir=path.join(root,"partners/padrinho-modern/media");
const images=[
 "mentoria-01","parceria-01","crescimento-02","parceria-02",
 "crescimento-04","oportunidade-03","oportunidade-04","mentoria-04"
].map(x=>"winf-padrinho-modern-"+x+".webp");
test("cada foto aprovada do Padrinho está em mídia local e é usada uma única vez",()=>{
 const files=fs.readdirSync(dir).filter(n=>n.endsWith(".webp"));
 for(const name of images){
   assert.ok(files.includes(name),"Falta: "+name);
   assert.ok(fs.statSync(path.join(dir,name)).size>10000,"Imagem inválida: "+name);
   const references=(padrinho.match(new RegExp(name.replace(/[.*+?^\u0024{}()|[\]\\]/g,"\\$&"),"g"))||[]).length;
   assert.equal(references,name.includes("oportunidade-04")?2:1,"Imagem repetida na composição: "+name);
 }
});
test("capa panorâmica Padrinho está atrás do texto e tem leitura mobile",()=>{
 assert.match(padrinho,/<section class="hero" aria-labelledby="padrinho-title">/);
 assert.match(padrinho,/\.hero\{[\s\S]*?url\("\/partners\/padrinho-modern\/media\/winf-padrinho-modern-oportunidade-04\.webp"\)/);
 assert.match(padrinho,/linear-gradient\(90deg,rgba\(5,7,11,/);
 assert.match(padrinho,/background-size:cover/);
 assert.match(padrinho,/@media\(max-width:480px\)/);
 assert.match(padrinho,/rel="preload" as="image" href="\/partners\/padrinho-modern\/media\/winf-padrinho-modern-oportunidade-04.webp"/);
});
test("Asset Light tem capa única fotográfica acima do mosaico e viewport responsivo",()=>{
 const image="/briefing/media/asset-light-gestao-20261108.webp";
 assert.ok(fs.existsSync(path.join(root,image.substring(1))));
 assert.match(light,/<section class="intro"><div class="wrap"><div class="asset-hero-cover">/);
 assert.ok(light.indexOf('class="asset-hero-cover"')<light.indexOf('class="mosaic"'));
 assert.ok(!light.includes('src="'+image+'"'),"Foto da capa duplicada dentro do mosaico");
 assert.ok(!padrinho.includes(image),"Foto do Asset Light reaproveitada no Padrinho");
 assert.match(styles,/\.page-asset-light \.asset-hero-cover::before/);
 assert.match(styles,/url\("\/briefing\/media\/asset-light-gestao-20261108\.webp"\)/);
 assert.match(styles,/@media\(max-width:820px\)/);
 assert.match(styles,/@media\(max-width:480px\)/);
 assert.match(light,/rel="preload" as="image" href="\/briefing\/media\/asset-light-gestao-20261108.webp"/);
});
test("marca oficial e links de negócio foram preservados",()=>{
 assert.match(padrinho,/<img src="\/winf-logo.svg" width="95" height="35" alt="WINF™">/);
 assert.match(light,/<img src="\/briefing\/media\/winf-logo-white-official.png" alt="Logomarca oficial WINF">/);
 assert.match(light,/<img src="\/aerocore\/assets\/ghost-symbol.png" alt="">/);
 assert.match(padrinho,/href="\/briefing\/asset-light\/"/);
 assert.match(light,/href="\/partners\/padrinho-modern\/#asset-light"/);
});

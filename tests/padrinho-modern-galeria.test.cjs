"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const page=fs.readFileSync(path.join(root,"partners/padrinho-modern/index.html"),"utf8");
const section=page.slice(page.indexOf('id="historias"'),page.indexOf('id="modelos"'));
test("Padrinho Modern destaca WINF Asset Light com imagens existentes",()=>{
 assert.match(section,/WINF Asset Light™/);
 const files=["asset-light-gestao-2026.webp","asset-light-mobilidade-2026.webp","asset-light-execucao-2026.webp"];
 for(const name of files){
   assert.ok(fs.existsSync(path.join(root,"briefing/media",name)),name);
   assert.ok(section.includes('/briefing/media/'+name));
 }
 assert.equal((section.match(/<figure\b/g)||[]).length,3);
 for(const tag of section.match(/<img\b[^>]*>/g)||[]){
   assert.match(tag,/alt="[^"]+"/);assert.match(tag,/loading="lazy"/);assert.match(tag,/decoding="async"/);
 }
});
test("links de consulta, logo oficial e identidade do modelo preservados",()=>{
 assert.match(page,/href="\/partners\/#territorios"/);
 assert.doesNotMatch(page,/href="\/partners\/territorios\/"/);
 assert.match(page,/<img src="\/winf-logo.svg" width="95" height="35" alt="WINF™">/);
 assert.match(page,/<link rel="canonical" href="https:\/\/winf.com.br\/partners\/padrinho-modern\/"/);
 assert.match(page,/id="asset-light"/);
 assert.match(page,/Imagens editoriais ilustrativas/);
});
test("layout responsivo não quebra navegação",()=>{
 assert.match(page,/\.pm-editorial-grid\{display:grid/);
 assert.match(page,/@media\(max-width:1000px\)/);
 assert.match(page,/@media\(max-width:640px\)/);
 const markup=page.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
 const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length);
});

test("fotografias de parceria, família e operação digital são reais no repositório",()=>{
 const files=[
  ["partners/media/parceria.webp","/partners/media/parceria.webp"],
  ["briefing/media/asset-light-familia-2026.webp","/briefing/media/asset-light-familia-2026.webp"],
  ["briefing/media/asset-light-gestao-20261108.webp","/briefing/media/asset-light-gestao-20261108.webp"]
 ];
 for(const [local,url] of files){
   assert.ok(fs.existsSync(path.join(root,local)),local);
   assert.ok(page.includes('src="'+url+'"'),url);
 }
 assert.match(page,/class="pm-impact-photos"/);
 assert.match(page,/class="pm-model-photo"/);
 assert.match(page,/@media\(max-width:760px\)/);
 assert.match(page,/decoding="async"/);
 assert.match(page,/loading="lazy"/);
});

"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const page=fs.readFileSync(path.join(root,"briefing/asset-light/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"css/asset-light-editorial.css"),"utf8");
const padrinho=fs.readFileSync(path.join(root,"partners/padrinho-modern/index.html"),"utf8");
test("Asset Light usa capa e segundo painel panorâmico, com texto e CSS responsivos",()=>{
 assert.match(page,/class="al-cover"/);
 assert.match(page,/class="al-wide-scene"/);
 assert.match(page,/asset-light-editorial\.css/);
 assert.match(page,/WINF ASSET LIGHT™ \/ PRESENÇA E PROPÓSITO/);
 assert.match(css,/\.al-cover::before/);
 assert.match(css,/\.al-wide-scene::before/);
 assert.match(css,/@media\(max-width:780px\)/);
 assert.match(css,/@media\(max-width:480px\)/);
 assert.match(css,/text-shadow:/);
});
test("Fotografias amplas do Asset Light estão versionadas, são WEBP e não se repetem no mosaico",()=>{
 for(const name of ["asset-light-vida-a-dois.webp","asset-light-gestao-remota.webp"]){
  const full=path.join(root,"briefing/media",name);
  assert.ok(fs.existsSync(full),name);
  const b=fs.readFileSync(full);
  assert.ok(b.length>20000,name);
  assert.equal(b.toString("ascii",0,4),"RIFF");
  assert.equal(b.toString("ascii",8,12),"WEBP");
  assert.equal((css.match(new RegExp(name.replace(".","\\."),"g"))||[]).length,1);
  assert.ok(!page.includes('src="/briefing/media/'+name+'"'),"Fotografia de fundo repetida no mosaico: "+name);
 }
});
test("Padrinho preserva oito cenas distintas sem reutilizar as imagens do Asset Light",()=>{
 const used=[...padrinho.matchAll(/winf-padrinho-modern-[a-z]+-\d{2}\.webp/g)].map(x=>x[0]);
 assert.equal(used.length,8);
 assert.equal(new Set(used).size,8);
 assert.match(padrinho,/background-image:[\s\S]*?winf-padrinho-modern-oportunidade-04/);
 assert.match(padrinho,/<img src="\/winf-logo\.svg" width="95" height="35" alt="WINF™">/);
});

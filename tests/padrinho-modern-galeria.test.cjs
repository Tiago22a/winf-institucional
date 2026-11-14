"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const page=fs.readFileSync(path.join(root,"partners/padrinho-modern/index.html"),"utf8");
const media="partners/padrinho-modern/media/";
const names=["oportunidade-04","parceria-01","crescimento-02","mentoria-01","parceria-02","crescimento-04","oportunidade-03","mentoria-04"];
const filenames=names.map(n=>"winf-padrinho-modern-"+n+".webp");
test("oito fotografias exclusivas do Padrinho estão versionadas e são WebP válidas",()=>{
 for(const name of filenames){
  const full=path.join(root,media,name);
  assert.ok(fs.existsSync(full),"Arquivo ausente: "+name);
  const bytes=fs.readFileSync(full);
  assert.ok(bytes.length>10000&&bytes.length<160000,name+" tamanho inválido");
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
 }
});
test("uma fotografia por etapa sem reutilizar outra página e sem repetir no mesmo site",()=>{
 const referenced=[...page.matchAll(/winf-padrinho-modern-([a-z]+-\d{2})\.webp/g)].map(m=>m[1]);
 assert.equal(referenced.length,8);
 assert.equal(new Set(referenced).size,8);
 for(const n of names)assert.ok(referenced.includes(n),n);
 const imagePaths=[...page.matchAll(/<img\b[^>]*src="([^"]+\.webp)"/g)].map(m=>m[1]);
 assert.equal(imagePaths.length,6);
 assert.ok(imagePaths.every(p=>p.startsWith("/"+media)));
 assert.doesNotMatch(page,/<img\b[^>]*src="\/briefing\/media\//);
});
test("imagem de fundo da abertura e encerramento, com contraste e adaptação mobile",()=>{
 assert.match(page,/\.hero\{[\s\S]*?background-image:[\s\S]*?winf-padrinho-modern-oportunidade-04\.webp/);
 assert.match(page,/linear-gradient\(90deg,rgba\(5,7,11,\.95\)/);
 assert.match(page,/\.final\{background-image:[\s\S]*?winf-padrinho-modern-mentoria-04\.webp/);
 assert.match(page,/@media\(max-width:780px\)/);
 assert.match(page,/@media\(max-width:480px\)/);
 assert.match(page,/@media\(max-width:640px\)/);
 assert.match(page,/text-shadow:/);
});
test("legibilidade, textos alternativos e identidade WINF oficial intacta",()=>{
 const imgTags=[...page.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
 for(const t of imgTags)assert.match(t,/alt="[^"]+"/);
 assert.match(page,/<img src="\/winf-logo\.svg" width="95" height="35" alt="WINF™">/);
 assert.match(page,/WINF Asset Light™/);
 assert.match(page,/Cenas editoriais ilustrativas criadas para o Padrinho Modern™/);
 assert.match(page,/href="\/partners\/#territorios"/);
 assert.doesNotMatch(page,/href="\/partners\/territorios\/"/);
 assert.match(page,/<link rel="canonical" href="https:\/\/winf.com.br\/partners\/padrinho-modern\/"/);
 const markup=page.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
 const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length);
});

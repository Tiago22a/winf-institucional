"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const dark=read("partners/universo-dark/index.html");
const padrinho=read("partners/padrinho-modern/index.html");

test("Universo Dark oferece dois atalhos diretos ao Padrinho Modern",()=>{
 assert.match(dark,/id="ser-padrinho"/);
 assert.match(dark,/href="\/partners\/padrinho-modern\/#como-funciona"/);
 assert.match(dark,/href="\/partners\/padrinho-modern\/#conversar"/);
 assert.match(padrinho,/id="como-funciona"/);
 assert.match(padrinho,/id="conversar"/);
});
test("a ponte nao cria pagamento nem compartilha carteira do investidor",()=>{
 const section=dark.match(/<section class="dark-padrinho-access"[\s\S]*?<\/section>/)?.[0]||"";
 assert.ok(section,"Falta a secao");
 assert.match(section,/não exige novo login, cadastro ou pagamento/);
 assert.match(section,/Seus dados de investimento não serão compartilhados/);
 assert.match(section,/não cria investimento, prioridade automática/);
 assert.doesNotMatch(section,/<form|data-wallet|token=|uid=/i);
});


test("Universo Dark publica fotografias próprias e não repete vídeos antigos",()=>{
 const images=["hero","governanca","colegiado","analise"];
 for(const slug of images){
  const rel=`partners/universo-dark/media/universo-dark-${slug}.webp`;
  assert.match(dark,new RegExp(rel.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
  const file=fs.readFileSync(path.join(root,rel));
  assert.equal(file.subarray(0,4).toString("ascii"),"RIFF");
  assert.equal(file.subarray(8,12).toString("ascii"),"WEBP");
 }
 assert.doesNotMatch(dark,/universo-dark-(entry|equity)\\.mp4/);
});

test("Título Universo Dark tem linhas separadas e usa identidade oficial",()=>{
 assert.match(dark,/<h1 id="dark-title"><span>UNIVERSO<\\/span><span>DARK™<\\/span><\\/h1>/);
 assert.match(dark,/font-family:Anton/);
 assert.match(dark,/src="\\/winf-logo\\.svg"/);
 assert.match(dark,/noindex,follow/);
});

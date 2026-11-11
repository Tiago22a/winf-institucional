"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const routes=[
 "briefing/index.html",
 "mediacar/index.html",
 "partners/cuidar-e-conectar/index.html",
 "partners/universo-dark/index.html",
 "synthwave/index.html",
 "ghost-shop/index.html"
];
const get=(name)=>fs.readFileSync(path.join(root,name),"utf8");
const exists=(url)=>fs.existsSync(path.join(root,decodeURIComponent(url.split("?")[0]).replace(/^\//,"")));
const findAll=(html,regex)=>[...html.matchAll(regex)].map(m=>m[1]);

test("Cinema: páginas estão ligadas à versão corrigida do player e do estilo",()=>{
 const player=get("js/winf-cinema.js"),css=get("css/winf-cinema.css");
 assert.match(player,/dataset\.fallbackSrc/);
 assert.match(player,/prefers-reduced-motion/);
 assert.match(css,/wc-poster-ambient/);
 assert.match(css,/:hover,:focus-within/);
 for(const route of routes){
  const html=get(route);
  assert.match(html,/\/css\/winf-cinema\.css\?v=20261111-2/,route);
  assert.match(html,/\/js\/winf-cinema\.js\?v=20261111-2/,route);
 }
});

test("Cinema: todos os pôsteres locais existem e nenhum fallback aponta para arquivo ausente",()=>{
 for(const route of routes){
  const html=get(route);
  for(const poster of findAll(html,/<img\b[^>]*class=["'][^"']*wc-film-poster[^"']*["'][^>]*src=["']([^"']+)["']/gi)){
   assert.equal(exists(poster),true,route+" pôster ausente: "+poster);
  }
  for(const fallback of findAll(html,/data-fallback-src=["']([^"']+)["']/gi)){
   assert.equal(exists(fallback),true,route+" vídeo alternativo ausente: "+fallback);
  }
 }
});

test("Briefing: filme aprovado com capa própria, sem vídeo genérico substituto",()=>{
 const html=get("briefing/index.html");
 assert.match(html,/data-src="\/briefing\/media\/winf-dominio-absoluto-manha\.mp4"/);
 assert.doesNotMatch(html,/data-fallback-src="\/partners\/media\/hero\.mp4"/);
 assert.match(html,/class="wc-film-poster" src="\/briefing\/media\/winf-dominio-absoluto-manha\.webp"/);
 assert.doesNotMatch(html,/poster="\/briefing\/media\/winf-dominio-absoluto-manha\.jpg"/);
});

test("Cinema: mídias finais carregadas e conferíveis no repositório",()=>{
 const unresolved=[];
 for(const route of routes){
  const html=get(route);
  for(const video of findAll(html,/\bdata-src=["'](\/[^"']+\.mp4)["']/gi)){
   if(!exists(video))unresolved.push(route+" → "+video);
  }
 }
 if(unresolved.length)console.warn("Fontes originais pendentes de mídia (pôster/fallback preservado):\n"+unresolved.join("\n"));
 assert.deepEqual(unresolved,[],"Todos os vídeos aprovados devem existir no repositório: "+unresolved.join(", "));
});

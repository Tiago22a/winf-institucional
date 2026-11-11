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
  const sharedCss=/\/css\/winf-cinema\.css\?v=20261111-2/.test(html);
  const isolatedCss=["synthwave/index.html","ghost-shop/index.html"].includes(route)&&html.includes("<style>");
  assert.ok(sharedCss||isolatedCss,route+" deve fornecer estilo local ou compartilhado para o player");
  if(route==="synthwave/index.html")assert.match(html,/src="\/synthwave\/assets\/frequencia-radio-ilustrado\.svg"/);
  else assert.match(html,/\/js\/winf-cinema\.js\?v=20261111-2/,route);
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
 assert.match(html,/class="(?:wc-film-poster|briefing-hero-poster)" src="\/briefing\/media\/winf-dominio-absoluto-manha\.webp"/);
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

test("SynthWAVE: two illustrated panels, authentic GHOST symbol and functioning radio routes",()=>{
 const html=get("synthwave/index.html"),radio=get("synthwave/radio/index.html");
 const engine=get("synthwave/app.js"),profile=get("synthwave/profile.js");
 assert.match(html,/SYNTHWAVE\.FM/i);
 assert.match(html,/\/synthwave\/assets\/retro-radio\.svg/);
 assert.match(html,/href="\/synthwave\/radio\/"/);
 const artworks=["frequencia-radio-ilustrado.svg","experiencia-sonora-ilustrada.svg"];
 for(const file of artworks){
   const route="/synthwave/assets/"+file;
   assert.equal(exists(route),true,route+" deve existir");
   assert.match(html,new RegExp('src="'+route.replaceAll(".","\\.")+'"'));
   const asset=get(route.replace(/^\//,""));
   assert.match(asset,/data:image\/png;base64,/,"assinatura GHOST integrada na imagem: "+file);
 }
 assert.match(get("synthwave/assets/retro-radio.svg"),/data:image\/png;base64,/);
 assert.match(html,/\/aerocore\/assets\/ghost-symbol\.png/);
 assert.equal(exists("/aerocore/assets/ghost-symbol.png"),true);
 assert.doesNotMatch(html.slice(html.indexOf('id="filmes"')),/<video\b/,"painéis devem ser ilustrações estáticas");
 assert.match(radio,/data-nav="profile"/);
 assert.match(radio,/\.\.\/profile\.js/);
 assert.match(radio,/\/synthwave\/radio-theme\.css/);
 assert.match(radio,/sw-ghost-nav/);
 assert.match(radio,/sw-ghost-player/);
 assert.doesNotMatch(radio,/#ff007f|#ff3d9f|#ec4193|#ed368a/i);
 assert.match(engine,/profile:\(\)=>window\.SynthwaveProfile\.render\(\)/);
 assert.match(profile,/localStorage\.setItem/);
});

test("SynthWAVE: logo GHOST em relevo no rádio e fotografia editorial preservam a identidade",()=>{
 const home=get("synthwave/index.html");
 const illustration=get("synthwave/assets/frequencia-radio-ilustrado.svg");
 assert.match(illustration,/Marca do som: emblema em baixo-relevo no centro da grade/);
 assert.match(illustration,/<rect x="493" y="393" width="53" height="66"/);
 assert.match(illustration,/<image x="508" y="408" width="23" height="34"/);
 assert.doesNotMatch(illustration,/x="760" y="459" width="24" height="32"/);
 assert.match(illustration,/data:image\/png;base64,/);
 assert.match(home,/id="destinos"/);
 const photos=[
  "/briefing/media/portfolio-supercars-v2.webp",
  "/briefing/media/portfolio-lifestyle-v2.webp",
  "/briefing/media/portfolio-arquitetura-v2.webp"
 ];
 for(const photo of photos){
  assert.equal(exists(photo),true,"Fotografia de lifestyle ausente: "+photo);
  assert.ok(home.includes('src="'+photo+'"'),"O site deve referenciar fotografia existente: "+photo);
 }
 assert.match(home,/id="filmes"/);
 assert.match(home,/\/synthwave\/assets\/retro-radio\.svg/);
 assert.match(home,/href="\/synthwave\/radio\/"/);
});

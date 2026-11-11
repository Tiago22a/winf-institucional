"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const root=join(__dirname,"..");
const read=path=>readFileSync(join(root,path),"utf8");
const citiesSource=read("js/cidades.js");
const cities=JSON.parse(citiesSource.match(/globalThis\.WINF_CIDADES\s*=\s*(\[[\s\S]*?\]);/)[1]);
const extras=JSON.parse(citiesSource.match(/globalThis\.WINF_UNIDADES_EXTRAS\s*=\s*(\[[\s\S]*?\]);/)[1]);

test("só Santos e Pilar do Sul estão operacionais; páginas publicadas não são operação",()=>{
 const active=[...cities,...extras].filter(x=>x.status==="ativa").map(x=>x.cidade).sort();
 assert.deepEqual(active,["Pilar do Sul","Santos"]);
 for(const id of ["sorocaba-sp","guaruja-sp","praia-grande-sp","campina-grande-pb"]){
  const city=cities.find(x=>x.id===id);
  assert.equal(city.siteAtivo,true);
  assert.equal(city.status,"pre_ativacao");
 }
 assert.equal(cities.find(x=>x.id==="cuiaba-mt").status,"nao_ativa");
 const home=read("index.html");
 assert.equal((home.match(/UNIDADE OPERACIONAL/g)||[]).length,2);
 assert.equal((home.match(/PÁGINA PUBLICADA/g)||[]).length,5);
});
test("locator distingue operação de site e preserva jornada de expansão",()=>{
 const locator=read("aerocore/assets/onde-comprar.js");
 assert.match(locator,/cidade\.status === 'ativa'|city\.status === 'ativa'/);
 assert.match(locator,/páginas regionais publicadas/);
 assert.match(locator,/unidades operacionais confirmadas/);
 assert.match(locator,/Página da cidade/);
 assert.match(read("onde-comprar/index.html"),/7 PÁGINAS PUBLICADAS · 2 UNIDADES OPERACIONAIS/);
});
test("sitemap inclui destinos institucionais relevantes, sem canonical da home duplicada",()=>{
 const sitemap=read("sitemap.xml");
 for(const route of ["partners/","onde-comprar/","redes/","briefing/asset-light/","briefing/quiosque/","briefing/flagship/"])
  assert.ok(sitemap.includes("<loc>https://winf.com.br/"+route+"</loc>"));
 assert.doesNotMatch(sitemap,/<loc>https:\/\/winf\.com\.br\/winf-home\/<\/loc>/);
});
test("páginas de produtos e catálogo têm um destino válido para voltar ao topo",()=>{
 for(const path of ["blackpro/index.html","dual-reflect/index.html","invisible/index.html","securityblind/index.html","miniblind-venetian/index.html","ghost-shop/index.html","catalogo/index.html","aerocore/winf-select/index.html","onde-comprar/index.html"]){
  const html=read(path);
  assert.match(html,/id="topo"/,path);
 }
});
test("links antigos e recursos não existentes são corrigidos",()=>{
 const code=read("404/index.html");
 assert.match(code,/src="\/winf-logo\.svg"/);
 assert.doesNotMatch(code,/LOGO%20BRANCO/);
 const catalog=read("catalogo/index.html");
 assert.doesNotMatch(catalog,/favicon-32x32\.png|apple-touch-icon\.png/);
 for(const name of ["blog/index.html","blog/blindagem-transparente/index.html","winf-home/index.html"]){
  const html=read(name);
  assert.doesNotMatch(html,/href="#contact"/);
  assert.match(html,/href="\/onde-comprar\/"/);
 }
});
test("afirmações técnicas e preço não homologados não são publicados",()=>{
 for(const name of ["blackpro/index.html","dual-reflect/index.html","securityblind/index.html"]){
  assert.doesNotMatch(read(name),/GARANTIA VITALÍCIA DE 15 ANOS/);
 }
 assert.doesNotMatch(read("aerocore/luxo/index.html"),/R\$ 6\.000|Blindagem Molecular Absoluta/);
 assert.doesNotMatch(read("aerocore/ceramic-armoring/index.html"),/A blindagem molecular absoluta que sua superfície exige/);
});

"use strict";const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const d=JSON.parse(read("config/winf-proximidade-brasil.json"));const ids=new Set(d.cities.map(c=>c[0]));
test("localizador cobre 5.571 municípios, 27 UFs, 200 hubs e 71 regiões",()=>{assert.equal(d.count,5571);assert.equal(d.cities.length,5571);assert.equal(ids.size,5571);assert.equal(d.states.length,27);assert.equal(d.hubs.length,200);assert.equal(d.regional.length,71);assert.equal(new Set(d.hubs.map(h=>h[5])).size,200);for(const c of d.cities){assert.equal(c.length,8);assert.ok(c[0]&&c[1]&&c[2]);assert.ok(Number.isFinite(c[3])&&Number.isFinite(c[4]));for(const h of c.slice(5))assert.ok(Number.isInteger(h)&&h>=0&&h<200);assert.equal(new Set(c.slice(5)).size,3);}});
test("toda sede comercial encontra a si própria como primeiro polo",()=>{const byId=new Map(d.cities.map(c=>[c[0],c]));for(const h of d.hubs)assert.equal(d.hubs[byId.get(h[5])[5]][0],h[0],h[0]);});
test("27 páginas estaduais previstas no índice, com rota do buscador",()=>{const h=read("winf-select/proximo/index.html"),s=read("sitemap.xml");for(const [uf] of d.states)assert.ok(h.includes('/winf-select/proximo/'+uf.toLowerCase()+'/'));assert.ok(h.includes('id="localizador-cidade"'));assert.ok(s.includes("<loc>https://winf.com.br/winf-select/proximo/</loc>"));assert.doesNotThrow(()=>new Function(read("js/winf-proximo.js")));});

test("27 diretórios estaduais contêm todos os 5.571 municípios e polos reais",()=>{
 const sitemap=read("sitemap.xml");let sum=0;
 for(const [uf] of d.states){
  const page=read("winf-select/proximo/"+uf.toLowerCase()+"/index.html");
  const count=d.cities.filter(c=>c[2]===uf).length;sum+=count;
  assert.equal((page.match(/<li class="municipio"/g)||[]).length,count,uf);
  assert.ok(page.includes('href="/winf-select/proximo/?cidade='),uf);
  assert.ok(page.includes('name="description"'),uf);
  assert.ok(page.includes('rel="canonical"'),uf);
  if(uf!=="DF")assert.ok(sitemap.includes("<loc>https://winf.com.br/winf-select/proximo/"+uf.toLowerCase()+"/</loc>"),uf);
  else assert.ok(page.includes('content="noindex,follow"'));
 }
 assert.equal(sum,5571);
 assert.doesNotThrow(()=>new Function(read("js/winf-proximo-uf.js")));
});

"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const sp=JSON.parse(read("config/winf-expansion-100-sp.json")).territorios;
const br=JSON.parse(read("config/winf-expansion-100-br.json")).territorios;
const list=[...sp,...br];
const sitemap=read("sitemap.xml");
const robots=read("robots.txt");
function guardPage(city,prefix){
 const location=prefix+"/"+city.id+"/",file=location+"index.html",html=read(file);
 const canonical="https://winf.com.br/"+location;
 assert.match(html,/<meta\s+name=["']robots["']\s+content=["'][^"']*\bnoindex\b[^"']*["']\s*\/?\s*>/i,city.id+" "+prefix+" sem noindex");
 assert.ok(!sitemap.includes("<loc>"+canonical+"</loc>"),canonical+" não deve aparecer no sitemap durante pré-lançamento");
 assert.ok(html.includes('rel="canonical" href="'+canonical+'"'),canonical+" canonical divergente");
 assert.doesNotMatch(html,/"@type"\s*:\s*"LocalBusiness"/i,canonical+" não deve inventar estabelecimento local");
 return html;
}
test("200 páginas WINF Select e 200 fichas Partners protegidas contra indexação em massa",()=>{
 assert.equal(list.length,200);
 assert.equal(new Set(list.map(t=>t.id)).size,200);
 for(const c of list){guardPage(c,"winf-select/cidades");guardPage(c,"partners/territorios");}
});
test("robots.txt permite ler as diretivas noindex",()=>{
 assert.match(robots,/User-agent:\s*\*/i);
 assert.match(robots,/Sitemap:\s*https:\/\/winf\.com\.br\/sitemap\.xml/i);
 assert.doesNotMatch(robots,/Disallow:\s*\/(?:\s|$)/im);
});
test("hubs comerciais oficiais continuam indexáveis e no sitemap",()=>{
 for(const route of ["partners/","partners/territorios/","briefing/asset-light/","winf-select/atendimento/"]){
   const canonical="https://winf.com.br/"+route;
   const html=read(route+"index.html");
   assert.ok(sitemap.includes("<loc>"+canonical+"</loc>"),canonical+" ausente do sitemap");
   assert.doesNotMatch(html,/<meta\s+name=["']robots["']\s+content=["'][^"']*\bnoindex\b/i,canonical+" não deve ser noindex");
 }
});

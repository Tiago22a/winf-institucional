"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const rd=p=>fs.readFileSync(path.join(root,p),"utf8");
const list=JSON.parse(rd("config/winf-expansion-100-sp.json"));
const town=c=>String(c).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(rd("js/cidades.js"),sandbox);
test("100 municípios distintos de SP fora das centrais próprias",()=>{
 assert.equal(list.territorios.length,100);
 assert.equal(new Set(list.territorios.map(x=>x.id)).size,100);
 assert.ok(list.territorios.every(x=>x.uf==="SP"&&x.operacao==="nao_ativa"));
 const active=[...(sandbox.WINF_CIDADES||[]),...(sandbox.WINF_UNIDADES_EXTRAS||[]),...(sandbox.WINF_PAGINAS_REGIONAIS||[])].filter(x=>x.uf==="SP"&&x.status==="ativa");
 const activeNames=new Set(active.map(x=>town(x.cidade)));
 assert.ok(list.territorios.every(x=>!activeNames.has(town(x.municipio))));
});
test("não anunciar disponibilidade territorial sem confirmação",()=>{
 assert.equal(list.centraisProprias.length,2);
 assert.ok(list.centraisProprias.every(x=>x.statusOperacional==="ativa"));
 assert.ok(list.territorios.every(x=>x.statusExclusividade==="disponivel"&&x.disponibilidadeConfirmada===true));
});
test("100 fichas individuais preparadas, com noindex até revisão",()=>{
 for(const t of list.territorios){
  const page=rd("partners/territorios/"+t.id+"/index.html");
  assert.ok(page.includes('name="robots" content="noindex,follow"'),t.id);
  assert.ok(page.includes(t.municipio),t.id);
  assert.ok(page.includes("/partners/territorios/?cidade="),t.id);
 }
});
test("jornadas e links da vitrine presentes em Partners, Asset Light, Padrinho e Dark",()=>{
 for(const p of ["partners/index.html","briefing/asset-light/index.html","partners/padrinho-modern/index.html","partners/universo-dark/index.html"]){
  assert.ok(rd(p).includes("/partners/territorios/"),p);
 }
 const html=rd("partners/territorios/index.html");
 assert.ok(html.includes('id="city-query"'));
 assert.ok(html.includes('id="use-location"'));
 assert.ok(html.includes("/partners/padrinho-modern/"));
});

test("duas centrais cobrem 71 cidades, distintas dos 100 territórios-alvo",()=>{
 const active=[...(sandbox.WINF_CIDADES||[]),...(sandbox.WINF_PAGINAS_REGIONAIS||[]),...(sandbox.WINF_UNIDADES_EXTRAS||[])].filter(x=>x.status==="ativa"&&x.uf==="SP");
 assert.equal(active.length,71);
 assert.equal(new Set(active.map(x=>x.id)).size,71);
 assert.equal(active.filter(x=>x.numero==="5513981113001").length,22);
 assert.equal(active.filter(x=>x.numero==="5515997909049").length,49);
 assert.ok(active.every(x=>x.siteAtivo===true&&x.url.startsWith("/")));
 const csv=rd("crm/agenda-cobertura-013-015-template.csv").trim().split("\n");
 assert.equal(csv.length,72);
 assert.match(csv[0],/agenda_id/);
 assert.match(csv[0],/instaladores_disponiveis/);
});
test("consulta pública separa atendimento regional de disponibilidade de licença",()=>{
 const s=rd("partners/territorios/territorios.js"),html=rd("partners/territorios/index.html");
 assert.ok(html.includes('id="coverage-results"'));
 assert.ok(html.includes('id="central-select"'));
 assert.ok(html.includes("71</strong> municípios"));
 assert.ok(s.includes("https://wa.me/"));
 assert.ok(s.includes("cidade com atendimento regional"));
 assert.ok(s.includes("agenda") && s.includes("disponibilidade"));
 assert.doesNotThrow(()=>new Function(s));
});

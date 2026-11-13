"use strict";const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const data=read("js/cidades.js");
const arr=n=>{const marker="globalThis."+n+" = [",s=data.indexOf(marker),e=data.indexOf("];",s);assert.ok(s>=0&&e>s);return JSON.parse(data.slice(s+marker.length-1,e+1));};
const coverage=["WINF_CIDADES","WINF_UNIDADES_EXTRAS","WINF_PAGINAS_REGIONAIS"].flatMap(arr).filter(c=>c.status==="ativa"&&c.exemplo===false&&c.uf==="SP"&&["5513981113001","5515997909049"].includes(c.numero));
test("71 cidades cobertas com links HTML, sitemap e páginas locais",()=>{
 const html=read("winf-select/atendimento/index.html"),sitemap=read("sitemap.xml");
 assert.equal(coverage.length,71);assert.equal(coverage.filter(c=>c.numero==="5513981113001").length,22);assert.equal(coverage.filter(c=>c.numero==="5515997909049").length,49);
 assert.ok(sitemap.includes("<loc>https://winf.com.br/winf-select/atendimento/</loc>"));assert.ok(sitemap.includes("<loc>https://winf.com.br/partners/territorios/</loc>"));
 assert.equal((html.match(/<li><a href="\/(?:pelicula|insulfilm)/g)||[]).length,71);
 for(const c of coverage){
  assert.ok(html.includes('<a href="'+c.url+'">'),"Hub sem "+c.cidade);
  const file=c.url.slice(1)+"index.html";assert.ok(fs.existsSync(path.join(root,file)),file);
  const page=read(file);assert.ok(page.includes("<title>")&&page.includes('name="description"'),file);
  assert.ok(!/name="robots" content="noindex/.test(page),file+" noindex");
  assert.ok(sitemap.includes("<loc>https://winf.com.br"+c.url+"</loc>"),file+" fora do sitemap");
 }
});
test("200 sites preliminares seguem fora do sitemap Google",()=>{
 const sitemap=read("sitemap.xml"),sp=JSON.parse(read("config/winf-expansion-100-sp.json")).territorios,br=JSON.parse(read("config/winf-expansion-100-br.json")).territorios;
 for(const c of [...sp,...br]){assert.ok(!sitemap.includes("<loc>https://winf.com.br/winf-select/cidades/"+c.id+"/</loc>"));assert.ok(!sitemap.includes("<loc>https://winf.com.br/partners/territorios/"+c.id+"/</loc>"));}
 assert.ok(read("peliculas-de-controle-solar-brasil/index.html").includes('href="/winf-select/atendimento/"'));
});

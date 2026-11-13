"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const sp=JSON.parse(read("config/winf-expansion-100-sp.json")).territorios,br=JSON.parse(read("config/winf-expansion-100-br.json")).territorios;
const map=JSON.parse(read("config/winf-expansion-map.json")),coords=new Map(map.territorios.map(t=>[t.id,t]));
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,'&quot;').replace(/'/g,"&#39;");
test("200 sites WINF Select no padrão Santos, com metadados locais",()=>{
 assert.equal(sp.length,100);assert.equal(br.length,100);
 for(const c of [...sp,...br]){
  const html=read("winf-select/cidades/"+c.id+"/index.html"),geo=coords.get(c.id),url="https://winf.com.br/winf-select/cidades/"+c.id+"/";
  assert.ok(geo,c.id+" sem geodata");
  assert.ok(html.includes(esc(c.municipio)),c.id+" sem nome");
  assert.ok(html.includes('<meta name="robots" content="noindex,follow">'),c.id+" indexação antecipada");
  assert.ok(html.includes('<link rel="canonical" href="'+url+'">'),c.id+" canonical");
  assert.ok(html.includes('<meta name="description"'),c.id+" meta description");
  assert.ok(html.includes('content="BR-'+c.uf+'"'),c.id+" meta geo region");
  assert.ok(html.includes('href="/partners/territorios/'+c.id+'/"'),c.id+" rota candidatura");
  assert.ok(html.includes('/css/winf-select-territory.css'),c.id+" sem identidade compartilhada");
  assert.ok(html.includes('/winf-logo.svg'),c.id+" sem logo WINF");
  assert.ok(html.includes('/aerocore/assets/ghost-symbol.png'),c.id+" sem Ghost oficial");
  for(const product of ["/invisible/","/blackpro/","/dual-reflect/"])assert.ok(html.includes('href="'+product+'"'),c.id+" produto faltante "+product);
  assert.ok(html.includes('Código municipal IBGE</dt><dd>'+geo.ibgeId+'</dd>'),c.id+" IBGE incorreto");
  assert.ok(html.includes("mlat="+geo.latitude+"&mlon="+geo.longitude),c.id+" mapa incorreto");
  assert.ok(!html.includes("undefined")&&!html.includes("NaN"),c.id+" placeholder inválido");
  assert.ok(!html.includes('5513981113001'),c.id+" contato de Santos copiado");
  assert.ok(!html.includes('"@type":"LocalBusiness"'),c.id+" LocalBusiness indevido");
  const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match,c.id+" faltando schema");
  const json=JSON.parse(match[1]),place=json["@graph"].find(n=>n["@type"]==="Place");
  assert.ok(place,c.id+" sem Place");
  assert.equal(place.geo.latitude,geo.latitude,c.id+" latitude");
  assert.equal(place.geo.longitude,geo.longitude,c.id+" longitude");
  assert.equal(place.address.addressLocality,c.municipio,c.id+" municipality");
  assert.equal(place.address.addressRegion,c.uf,c.id+" UF");
 }
});
test("CRM lista exatamente 200 rotas locais sem declarar publicação",()=>{
 const csv=read("crm/territorios-200.csv").trim().split(/\r?\n/),head=csv[0].split(";"),rows=csv.slice(1).map(line=>line.split(";"));
 assert.equal(rows.length,200);
 const id=head.indexOf("territorio_id"),site=head.indexOf("url_site_select_planejado"),publish=head.indexOf("site_local_publicado"),robots=head.indexOf("meta_robots");
 assert.ok([id,site,publish,robots].every(n=>n>=0));
 assert.equal(new Set(rows.map(r=>r[id])).size,200);
 for(const row of rows){assert.equal(row[site],"/winf-select/cidades/"+row[id]+"/");assert.equal(row[publish],"nao");assert.equal(row[robots],"noindex,follow");}
});
test("vitrine mostra link para os 200 sites",()=>{assert.match(read("partners/territorios/territorios.js"),/Site WINF Select™/);assert.doesNotThrow(()=>new Function(read("js/winf-select-territory.js")));});

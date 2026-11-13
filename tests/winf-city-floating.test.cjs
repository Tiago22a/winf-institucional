"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const read=p=>readFileSync(p,"utf8");
const cities=[
 ["Santos","pelicula-de-controle-solar-santos-sp/index.html","5513981113001"],
 ["Praia Grande","pelicula-de-controle-solar-praia-grande-sp/index.html","5513981113001"],
 ["Guarujá","pelicula-de-controle-solar-guaruja-sp/index.html","5513981113001"],
 ["Sorocaba","insulfilm-residencial-sorocaba-sp/index.html","5515997909049"],
 ["Pilar do Sul","pelicula-de-controle-solar-pilar-do-sul-sp/index.html","5515997909049"],
 ["Cuiabá","pelicula-de-controle-solar-cuiaba-mt/index.html","5513981113001"],
 ["Campina Grande","pelicula-de-controle-solar-campina-grande-pb/index.html","5513981113001"]
];
test("Sete cidades possuem somente o par local Ghost/WhatsApp e arquivos atualizados",()=>{
 for(const [city,file,phone] of cities){
  const s=read(file);
  assert.equal((s.match(/class="santos-contact-dock"/g)||[]).length,1,city+": somente um dock");
  assert.equal((s.match(/class="santos-contact-ghost"/g)||[]).length,1,city+": Ghost local");
  assert.equal((s.match(/class="santos-contact-whatsapp"/g)||[]).length,1,city+": WhatsApp local");
  assert.ok(s.includes("data-whatsapp=\""+phone+"\""),city+": formulario comercial certo");
  assert.ok(s.includes("/css/winf-city-unit.css?v=20261112-single-dock2"),city+": CSS sem cache antigo");
  assert.ok(s.includes("/js/winf-footer.js?v=20261112-dock2"),city+": footer novo");
  assert.ok(s.includes("/js/winf-return.js?v=20261112-dock2"),city+": retorno novo");
  assert.ok(!s.includes('id="winf-quick-contact"'),city+": sem global no HTML");
 }
});
test("Script global não cria um segundo dock em qualquer rota territorial",()=>{
 const js=read("js/winf-quick-contact.js");
 assert.ok(js.includes("pelicula-de-controle-solar-[a-z0-9-]+"),"guard cobre todas as cidades");
 assert.ok(js.includes("insulfilm-residencial-[a-z0-9-]+"),"guard cobre Sorocaba");
 assert.doesNotThrow(()=>new Function(js));
 const css=read("css/winf-city-unit.css");
 assert.ok(css.includes("body:has(.santos-contact-dock) #winf-quick-contact"),"fallback para cache antigo");
 assert.ok(css.includes("body:has(.santos-contact-dock) .winf-global-floating-dock"));
});
test("Diretório agrupa as sete páginas em centrais regionais, sem links falsos",()=>{
 const home=read("index.html");
 assert.equal((home.match(/class="winf-active-card" data-territory=/g)||[]).length,7);
 assert.match(home,/Baixada Santista e Vale do Ribeira · 013/);
 assert.match(home,/Sorocaba e região · 015/);
 assert.ok(home.includes("OUTRAS 47 CIDADES MAPEADAS"));
 for(const [city,,phone] of cities){
  const start=home.indexOf('aria-label="WINF Select '+city+', ');
  assert.ok(start>=0,city+": card");
  const end=home.indexOf("</article>",start);
  const snippet=home.slice(start,end);
  assert.ok(snippet.includes("wa.me/"+phone+"?text="),city+": WhatsApp por central");
  assert.ok(snippet.includes("SITE DA CIDADE"),city+": site");
 }
});
test("Cadastros de Sorocaba e Pilar do Sul obedecem ao DDD 015",()=>{
 const citiesJs=read("js/cidades.js");
 const config=JSON.parse(read("config/winf-active-cities.json"));
 for(const city of ["Sorocaba","Pilar do Sul"]){
  const start=citiesJs.indexOf('"cidade": "'+city+'"');
  assert.ok(start>=0);
  const frag=citiesJs.slice(start,start+450);
  assert.ok(frag.includes('"numero": "5515997909049"'),city);
  const record=config.cities.find(x=>x.city===city);
  assert.equal(record.phone,"5515997909049",city);
 }
 const script=read("scripts/check-winf-active-territories.mjs");
 assert.match(script,/center15/);
});

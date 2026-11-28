"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const read=p=>readFileSync(p,"utf8");
const cities=[
 ["Santos","pelicula-de-controle-solar-santos-sp/index.html","5513981113001"],
 ["Sorocaba","insulfilm-residencial-sorocaba-sp/index.html","5513981113001"],
 ["Pilar do Sul","pelicula-de-controle-solar-pilar-do-sul-sp/index.html","5513981113001"],
 ["Cuiabá","pelicula-de-controle-solar-cuiaba-mt/index.html","5513981113001"]
];
test("Páginas comerciais disponíveis usam somente o par local Ghost/WhatsApp",()=>{
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
test("Diretório apresenta três 013 e três cidades de atendimento central, demais em breve",()=>{
 const home=read("index.html");
 assert.equal((home.match(/class="winf-active-card" data-territory=/g)||[]).length,6);
 assert.match(home,/Baixada Santista e Vale do Ribeira · 013/);
 assert.match(home,/Sorocaba e região · 015/);
 assert.ok(home.includes("OUTRAS 47 CIDADES EM BREVE"));
 for(const [city,,phone] of [...cities,["Praia Grande","","5513981113001"],["Guarujá","","5513981113001"]]){
  const start=home.indexOf('aria-label="WINF Select '+city+', ');
  assert.ok(start>=0,city+": card");
  const end=home.indexOf("</article>",start);
  const snippet=home.slice(start,end);
  assert.ok(snippet.includes("wa.me/"+phone+"?text="),city+": WhatsApp por central");
  assert.ok(snippet.includes("SITE DA CIDADE"),city+": site");
 }
});
test("Cadastros de Sorocaba, Pilar do Sul e Cuiabá usam WhatsApp único",()=>{
 const citiesJs=read("js/cidades.js");
 const config=JSON.parse(read("config/winf-active-cities.json"));
 for(const city of ["Sorocaba","Pilar do Sul","Cuiabá"]){
  const start=citiesJs.indexOf('"cidade": "'+city+'"');
  assert.ok(start>=0);
  const frag=citiesJs.slice(start,start+450);
  assert.ok(frag.includes('"numero": "5513981113001"'),city);
  const record=config.cities.find(x=>x.city===city);
  assert.equal(record.phone,"5513981113001",city);
 }
 const script=read("scripts/check-winf-active-territories.mjs");
 assert.match(script,/center13/);
});

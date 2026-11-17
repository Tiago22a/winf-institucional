"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {readFileSync,existsSync}=require("node:fs");
const read=p=>readFileSync(p,"utf8");
const existing=[
 ["Santos","pelicula-de-controle-solar-santos-sp/index.html","5513981113001"],
 ["Sorocaba","insulfilm-residencial-sorocaba-sp/index.html","5515997909049"]
];
const removed=[
 ["Praia Grande","pelicula-de-controle-solar-praia-grande-sp/index.html","5513981113001"],
 ["Guarujá","pelicula-de-controle-solar-guaruja-sp/index.html","5513981113001"],
 ["Pilar do Sul","pelicula-de-controle-solar-pilar-do-sul-sp/index.html","5515997909049"],
 ["Cuiabá","pelicula-de-controle-solar-cuiaba-mt/index.html","5513981113001"],
 ["Campina Grande","pelicula-de-controle-solar-campina-grande-pb/index.html","5513981113001"]
];
test("Páginas locais preservadas têm um único dock Ghost/WhatsApp",()=>{
 for(const [city,file,phone] of existing){
  assert.equal(existsSync(file),true,city+": arquivo publicado");
  const s=read(file);
  assert.equal((s.match(/class="santos-contact-dock"/g)||[]).length,1,city+": somente um dock");
  assert.equal((s.match(/class="santos-contact-ghost"/g)||[]).length,1,city+": Ghost local");
  assert.equal((s.match(/class="santos-contact-whatsapp"/g)||[]).length,1,city+": WhatsApp local");
  assert.ok(s.includes('data-whatsapp="'+phone+'"'),city+": canal confirmado no arquivo");
  assert.ok(!s.includes('id="winf-quick-contact"'),city+": sem dock global duplicado");
 }
});
test("Não recriar as cinco páginas removidas; o atendimento usa o WhatsApp",()=>{
 for(const [city,file] of removed)assert.equal(existsSync(file),false,city+": página permanece removida");
});
test("Script global evita duplicar dock em páginas locais",()=>{
 const js=read("js/winf-quick-contact.js");
 assert.ok(js.includes("pelicula-de-controle-solar-[a-z0-9-]+"));
 assert.ok(js.includes("insulfilm-residencial-[a-z0-9-]+"));
 assert.doesNotThrow(()=>new Function(js));
});
test("Sete cards da home preservam WhatsApp mas só mostram SITE DA CIDADE quando arquivo existe",()=>{
 const home=read("index.html");
 assert.equal((home.match(/class="winf-active-card" data-territory=/g)||[]).length,7);
 const all=[...existing,...removed];
 for(const [city,,phone] of all){
  const start=home.indexOf('aria-label="WINF Select '+city+', ');
  assert.ok(start>=0,city+": card presente");
  const end=home.indexOf("</article>",start);
  const snippet=home.slice(start,end);
  assert.ok(snippet.includes("wa.me/"+phone+"?text="),city+": WhatsApp com texto");
  assert.equal(snippet.includes("SITE DA CIDADE"),existing.some(x=>x[0]===city),city+": link somente para arquivo presente");
 }
});
test("Registros regionais existentes não foram reencaminhados indevidamente",()=>{
 const cities=read("js/cidades.js");
 const config=JSON.parse(read("config/winf-active-cities.json"));
 for(const city of ["Sorocaba","Pilar do Sul"]){
  const start=cities.indexOf('"cidade": "'+city+'"');
  assert.ok(start>=0);
  const frag=cities.slice(start,start+460);
  assert.ok(frag.includes('"numero": "5515997909049"'),city);
  const record=config.cities.find(x=>x.city===city);
  assert.equal(record.phone,"5515997909049");
 }
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const source=readFileSync(new URL("../js/winf-service-200.js",import.meta.url),"utf8");
const context={globalThis:{}};
vm.runInNewContext(source,context,{timeout:1000});
const list=context.globalThis.WINF_SERVICE_TERRITORIES_200;
test("inventário cliente possui 200 territórios únicos, 100 de SP e 100 fora",()=>{
 assert.equal(list.length,200);
 assert.equal(new Set(list.map(t=>t.id)).size,200);
 assert.equal(list.filter(t=>t.uf==="SP").length,100);
 assert.equal(list.filter(t=>t.uf!=="SP").length,100);
});
test("nenhum território afirma ter titular licenciado ou unidade física",()=>{
 for(const item of list){
  assert.match(item.id,/^[a-z0-9-]+-[a-z]{2}$/);
  assert.equal(item.licenca,"aguardando_titular");
  assert.equal(item.solicitacoes,"sob_demanda");
  assert.equal(item.encaminhamento,"winf_central");
  assert.equal(Object.hasOwn(item,"physicalUnit"),false);
  assert.equal(Object.hasOwn(item,"whatsapp"),false);
 }
});
test("diretório integra inventário antes do script e preserva WhatsApp central",()=>{
 const page=readFileSync(new URL("../onde-comprar/index.html",import.meta.url),"utf8");
 const js=readFileSync(new URL("../aerocore/assets/onde-comprar.js",import.meta.url),"utf8");
 assert.ok(page.indexOf("winf-service-200.js")>=0);
 assert.ok(page.indexOf("winf-service-200.js")<page.indexOf("onde-comprar.js"));
 assert.match(js,/WINF_SERVICE_TERRITORIES_200/);
 assert.match(js,/5513981113001/);
});

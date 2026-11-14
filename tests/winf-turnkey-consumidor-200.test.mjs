import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const publicIndex=JSON.parse(read("config/winf-territorios-consumidor-200.json"));
const privateIndex=JSON.parse(read("crm/winf-assetlight-territorios-200.json"));
const page=read("onde-comprar/index.html");
const script=read("js/winf-turnkey-consumidor.js");
test("catálogo do consumidor traz exatamente 200 territórios, sem campos internos",()=>{
 assert.equal(publicIndex.count,200);
 assert.equal(publicIndex.territories.length,200);
 assert.equal(new Set(publicIndex.territories.map(t=>t.id)).size,200);
 assert.deepEqual(new Set(publicIndex.territories.map(t=>t.id)),new Set(privateIndex.territorios.map(t=>t.id)));
 const allowed=["id","cidade","uf","consumerContactPhone","routingStatus"];
 for(const t of publicIndex.territories){
   assert.deepEqual(Object.keys(t),allowed);
   assert.equal(t.consumerContactPhone,"5513981113001");
   assert.equal(t.routingStatus,"pre_licenca");
   assert.ok(t.cidade&&t.uf&&t.id);
 }
 assert.ok(!read("config/winf-territorios-consumidor-200.json").includes("emailProposto"));
 assert.ok(!read("config/winf-territorios-consumidor-200.json").includes("instalacaoLocal"));
});
test("busca para consumidor é acessível e consulta exclusivamente o WhatsApp 013",()=>{
 assert.match(page,/id="winf-turnkey-consumer"/);
 assert.match(page,/id="turnkey-city-search"/);
 assert.match(page,/id="turnkey-city-results"/);
 assert.match(page,/winf-turnkey-consumidor\.js/);
 assert.match(script,/\/config\/winf-territorios-consumidor-200\.json/);
 assert.match(script,/routingStatus==="licenca_verificada"/);
 assert.match(script,/"5513981113001"/);
 assert.match(script,/"https:\/\/wa\.me\/"\+phone/);
 assert.match(script,/encodeURIComponent\(msg\)/);
 assert.doesNotMatch(script,/5515997909049|5513997815375/);
 assert.doesNotMatch(script,/localStorage|sessionStorage/);
});
test("não criar páginas fictícias nem anunciar instalações imediatas",()=>{
 assert.match(page,/Cadastro territorial não representa loja física/);
 assert.ok(!script.includes("document.write("));
 assert.doesNotThrow(()=>new Function(script));
});

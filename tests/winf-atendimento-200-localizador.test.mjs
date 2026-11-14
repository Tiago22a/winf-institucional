import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read = p => readFileSync(new URL("../"+p,import.meta.url),"utf8");
const config=JSON.parse(read("config/winf-territorios-consumidor-200.json"));
const page=read("onde-comprar/index.html");
const home=read("index.html");
const shared=read("aerocore/assets/onde-comprar.js");
test("200 territórios comerciais únicos: 100 SP e 100 demais estados",()=>{
  assert.equal(config.territories.length,200);
  assert.equal(new Set(config.territories.map(t=>t.id)).size,200);
  assert.equal(config.territories.filter(t=>t.uf==="SP").length,100);
  assert.equal(config.territories.filter(t=>t.uf!=="SP").length,100);
});
test("antes de licença, o único telefone é o WhatsApp WINF e não há licença simulada",()=>{
  assert.equal(config.whatsapp,"5513981113001");
  assert.ok(config.territories.every(t=>t.routingStatus==="pre_licenca"&&t.consumerContactPhone===config.whatsapp));
  assert.ok(config.territories.every(t=>typeof t.cidade==="string"&&/^[A-Z]{2}$/.test(t.uf)));
});
test("o localizador WINF usa cadastro canônico, e não uma lista duplicada",()=>{
  assert.match(shared,/fetch\('\/config\/winf-territorios-consumidor-200\.json'/);
  assert.match(shared,/isWinfDirectory/);
  assert.match(shared,/classList\.contains\('winf-directory'\)/);
  assert.match(shared,/if \(isWinfDirectory\)/);
  assert.match(shared,/siteAtivo:false,url:null,instagram:null/);
  assert.doesNotMatch(shared,/WINF_SERVICE_TERRITORIES_200/);
  assert.match(page,/aerocore\/assets\/onde-comprar\.js/);
  assert.match(page,/id="directory-results"/);
  assert.match(page,/Atendimento sob consulta/);
});
test("atendimento não se confunde com licença e não promete instalação local",()=>{
  assert.match(shared,/Solicitar atendimento/);
  assert.match(shared,/5513981113001/);
  assert.match(shared,/Consultar licenciamento/);
  assert.match(shared,/5513997815375/);
  assert.match(shared,/execução e agenda mediante confirmação/);
  assert.match(home,/execução|viabilidade do serviço/);
  assert.doesNotMatch(shared,/200 unidades físicas/);
});
test("script do localizador mantém sintaxe executável",()=>{
  new vm.Script(shared,{filename:"aerocore/assets/onde-comprar.js"});
});

"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const lines=fs.readFileSync(path.join(root,"crm/provisionamento-asset-light-200.csv"),"utf8").trim().split(/\r?\n/);
const columns=lines[0].split(";"),data=lines.slice(1).map(l=>Object.fromEntries(l.split(";").map((v,i)=>[columns[i],v])));
test("inventário de 200 territórios Asset Light em 20 lotes de dez",()=>{
 assert.equal(data.length,200); assert.equal(new Set(data.map(r=>r.territorio_id)).size,200);
 assert.equal(data.filter(r=>r.uf==="SP").length,100);assert.equal(data.filter(r=>r.uf!=="SP").length,100);
 for(let batch=1;batch<=20;batch++)assert.equal(data.filter(r=>r.lote===String(batch)).length,10);
});
test("não inventar contas, perfis ou ativação de licença",()=>{
 for(const r of data){
  assert.equal(r.modelo,"WINF Asset Light™");assert.equal(r.status_comercial,"disponivel_para_ativacao");
  assert.equal(r.site_http,"http_pendente_validacao");assert.equal(r.site_indexacao,"noindex_revisao_editorial_pendente");
  assert.equal(r.email_criado,"nao");assert.equal(r.google_identity_status,"nao_criada");
  assert.equal(r.instagram_criado,"nao");assert.equal(r.winf_os_acesso,"nao_provisionado");
  assert.equal(r.usuario_autorizado,"nao_atribuido");assert.equal(r.operacao_presencial,"sujeita_confirmacao");
  assert.equal(r.google_business_status,"avaliar_elegibilidade_apos_operacao_presencial");
  assert.equal(r.winf_os_tenant_key,r.territorio_id);
  assert.equal(r.site_url,"https://winf.com.br/winf-select/cidades/"+r.territorio_id+"/");
  assert.ok(fs.existsSync(path.join(root,"winf-select/cidades",r.territorio_id,"index.html")));
 }
 assert.equal(new Set(data.map(r=>r.email_proposto)).size,200);
 assert.equal(new Set(data.map(r=>r.instagram_planejado)).size,200);
});

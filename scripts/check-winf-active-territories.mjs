/* Teste de regressão das centrais próprias 013/015 e páginas territoriais. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const doc=read('index.html'),body=read('js/cidades.js');
const root={};vm.runInNewContext(body,{globalThis:root});
const original=root.WINF_CIDADES||[],extra=root.WINF_UNIDADES_EXTRAS||[],regional=root.WINF_PAGINAS_REGIONAIS||[];
const all=[...original,...extra,...regional].filter(c=>c.exemplo===false);
const active=all.filter(c=>c.status==='ativa');
assert.equal(original.length,100,'Cadastro legado de 100 entradas preservado');
assert.equal(active.length,71,'Os 71 municípios atendidos são roteados por duas centrais');
assert.equal(new Set(active.map(c=>c.id)).size,active.length,'Não há município ativo duplicado');
const center13=active.filter(c=>c.numero?.startsWith('5513'));
const center15=active.filter(c=>c.numero?.startsWith('5515'));
assert.equal(center13.length,22,'Central 013: 22 municípios');
assert.equal(center15.length,49,'Central 015: 49 municípios');
for(const city of active){
 assert.equal(typeof city.siteAtivo,'boolean','Status da página indefinido: '+city.cidade);
 assert.ok(city.url?.startsWith('/'),'URL não informada: '+city.cidade);
 assert.equal(city.siteAtivo,existsSync(city.url.slice(1)+'index.html'),'Site publicado divergente do arquivo: '+city.cidade);
 assert.ok(city.numero?.startsWith('5513')||city.numero?.startsWith('5515'),'Contato não regional: '+city.cidade);
}
for(const id of ['santos-sp','sorocaba-sp','pilar-do-sul-sp']){
 assert.ok(active.some(c=>c.id===id),'Operação regional âncora ausente: '+id);
}
assert.equal(all.find(c=>c.id==='campina-grande-pb')?.status,'pre_ativacao');
assert.equal(all.find(c=>c.id==='cuiaba-mt')?.status,'nao_ativa');
for(const id of ['unidades-ativas','winf-region-013','winf-region-015']){
 assert.ok(doc.includes('id="'+id+'"'),'Região/segmento ausente na vitrine: '+id);
}
assert.ok(doc.includes('href="/onde-comprar/"'),'Link para o localizador global ausente');
const script=read('js/winf-active-territories.js');
assert.ok(!script.includes('replaceChildren'),'Não apagar os cards publicados do site global');
const locator=read('aerocore/assets/onde-comprar.js');
assert.ok(locator.includes("city.status === 'ativa'"),'Filtro operacional do locator ausente');
console.log('✓ WINF: 71 identidades territoriais ativas e links de páginas existentes conferidos. Roteamento interno reservado.');

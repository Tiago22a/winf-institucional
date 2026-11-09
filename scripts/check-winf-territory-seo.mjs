/* Verifica regionalização editorial: duas listas por cidade e texto de atendimento honesto. */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>readFileSync(p,'utf8');
const cfg=JSON.parse(read('config/winf-active-cities.json'));
const plans=JSON.parse(read('config/winf-neighborhoods.json')).territories;
for(const city of cfg.cities){
  const s=read(city.slug+'/index.html'),plan=plans[city.origin];
  assert.ok(plan,'Plano territorial ausente: '+city.city);
  assert.ok(plan.priority.length>=5&&plan.complementary.length>=5,'Bairros insuficientes: '+city.city);
  const names=[...plan.priority,...plan.complementary];
  assert.equal(new Set(names).size,names.length,'Bairro repetido em '+city.city);
  for(const name of names)assert.ok(s.includes('<li>'+name+'</li>'),city.city+' não exibe '+name);
  assert.equal((s.match(/class="winf-territory-local"/g)||[]).length,0,'Classe combinada inesperada');
  assert.equal((s.match(/class="santos-local-area winf-territory-local"/g)||[]).length,1,'Seção regional não sincronizada: '+city.city);
  assert.equal((s.match(/class="winf-territory-cluster/g)||[]).length,2,'São necessários dois blocos de bairros: '+city.city);
  assert.ok(s.includes('https://wa.me/'+city.phone+'?text='),'CTA não direcionado à central correta: '+city.city);
  assert.ok(s.includes('CONSULTAR SEU BAIRRO NO WHATSAPP'),'CTA bairro ausente');
  assert.ok(s.includes('Não há loja física anunciada'),'Sem inventar loja física');
  if(city.origin==='campina-grande')assert.ok(s.includes('pré-ativação'),'Campina Grande deve sinalizar pré-ativação');
  assert.ok(!s.includes('INFORME SEU BAIRRO</span><span>ENVIE SEU CEP'),'Conteúdo genérico não substituído: '+city.city);
  assert.ok(s.includes('name="geo.region" content="BR-'+city.uf+'"'),'UF de metadados incorreta: '+city.city);
  if(city.uf!=='SP') {
    const nome=city.city.toLocaleUpperCase('pt-BR');
    assert.ok(!s.includes(nome+' / SP')&&!s.includes(nome+'/SP'),'Estado SP herdado no texto de '+city.city);
  }
  console.log('✓ Bairros WINF',city.city,plan.priority.length,'foco +',plan.complementary.length,'complementares');
}
console.log('✓ SEO TERRITORIAL de '+cfg.cities.length+' cidades verificado.');

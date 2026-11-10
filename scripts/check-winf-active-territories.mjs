/* Enlaces oficiais e status confiáveis do diretório WINF (teste de regressão). */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=path=>readFileSync(path,'utf8');
const doc=read('index.html');
const source=read('js/cidades.js');
const root={};vm.runInNewContext(source,{globalThis:root});
const all=[...root.WINF_CIDADES,...root.WINF_UNIDADES_EXTRAS].filter(c=>c.siteAtivo===true);
assert.equal(all.length,7,'São sete sites de cidades publicados');
assert.equal(all.filter(c=>c.status==='ativa').length,5,'Não inventar disponibilidade operacional');
assert.equal(all.find(c=>c.id==='campina-grande-pb')?.status,'pre_ativacao');
assert.equal(all.find(c=>c.id==='cuiaba-mt')?.status,'nao_ativa');
for(const city of all){
 assert.ok(city.url?.startsWith('/'),'Site faltando '+city.cidade);
 assert.ok(read(city.url.slice(1)+'index.html').includes('https://winf.com.br/'+city.url.slice(1)),'Página local não gerada '+city.cidade);
 assert.ok(doc.includes('href="'+city.url+'"'),'Site ausente no global: '+city.cidade);
 assert.equal(city.numero,'5513981113001','Telefone central temporário: '+city.cidade);
 const marker=doc.indexOf('aria-label="WINF Select '+city.cidade+', '+city.uf+'"');
 assert.ok(marker>=0,'Card de território ausente '+city.cidade);
 const article=doc.slice(marker,doc.indexOf('</article>',marker));
 assert.match(article,/wa\.me\/5513981113001\?text=/,'WhatsApp com origem '+city.cidade);
 assert.ok(article.includes(encodeURIComponent(city.cidade)),'Mensagem deve registrar local '+city.cidade);
 assert.equal((article.match(/<a class="winf-active-card-link\s/g)||[]).length,3,'Três links em cada card: '+city.cidade);
 assert.ok(article.includes('href="'+city.url+'"'),'Link próprio da cidade: '+city.cidade);
 assert.ok(article.includes('aria-label="WhatsApp central WINF para '+city.cidade+'"'),'WhatsApp da cidade '+city.cidade);
 assert.ok(article.includes('https://www.instagram.com/'),'Instagram oficial '+city.cidade);
 if(city.instagram)assert.ok(article.includes(city.instagram),'Instagram da unidade '+city.cidade);
 else assert.ok(article.includes('https://www.instagram.com/winf.ofc/'),'Sem perfil local confirmado '+city.cidade);
}
const locator=read('aerocore/assets/onde-comprar.js');
assert.ok(locator.includes("'Instagram da unidade ↗'"),'Faltou Instagram em diretório dinâmico');
assert.ok(locator.includes("'Site da unidade ↗'"),'Faltou site no diretório dinâmico');
assert.ok(locator.includes('encodeURIComponent(text)'),'Origem do contato não identificada');
// O resumo visual de territórios foi retirado do site; validar apenas os dados e links, não texto editorial removido.
assert.ok(!doc.includes('5 unidades ativas + 1 em pré-ativação'), 'Contador legado indevido na página principal');
console.log('✓ WINF: 7 sites de cidades ativos, central e Instagram conferidos; operação presencial independente.');

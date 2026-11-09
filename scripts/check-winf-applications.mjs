/* Smoke test: conteúdos WINF Select ligados a todas as unidades, sem páginas órfãs. */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>readFileSync(p,'utf8');
const cfg=JSON.parse(read('config/winf-active-cities.json'));
const sitemap=read('sitemap.xml');
const guides=['sacadas-varandas','janelas-fachadas','privacidade','seguranca-vidros'];
for(const c of cfg.cities){
 const h=read(c.slug+'/index.html');
 assert.equal((h.match(/id="guias-aplicacoes"/g)||[]).length,1,'Seção duplicada '+c.city);
 for(const guide of guides){
   assert.ok(h.includes('href="/aplicacoes/'+guide+'/?origem='+c.origin+'"'),'Link contextual '+c.city+' '+guide);
 }
 assert.ok(h.includes('07h às 22h'),'Horário da central');
 console.log('✓ Guia vinculado: '+c.city);
}
for(const g of guides){
 const page=read('aplicacoes/'+g+'/index.html');
 const loc='https://winf.com.br/aplicacoes/'+g+'/';
 assert.ok(page.includes('rel="canonical" href="'+loc+'"'),'canonical guia '+g);
 assert.ok(page.includes('<a class="app-button" id="app-whatsapp"'),'CTA guia '+g);
 assert.ok(sitemap.includes('<loc>'+loc+'</loc>'),'sitemap guia '+g);
 assert.ok(page.includes('<script type="application/ld+json">'),'Article + Breadcrumb guia '+g);
}
assert.ok(read('aplicacoes/seguranca-vidros/index.html').includes('/images/securityblind/scene-01.webp'),'Hero correto');
console.log('✓ Quatro guias indexáveis, linkados das seis cidades.');

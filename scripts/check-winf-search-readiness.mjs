/* Auditoria pré-Search Console: rastreabilidade no repositório.
 * NÃO substitui inspeção HTTP, indexação do Google nem dados de desempenho reais.
 */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const cfg=JSON.parse(read('config/winf-active-cities.json'));
const paths=[...cfg.cities.map(c=>c.slug+'/'),...['sacadas-varandas','janelas-fachadas','privacidade','seguranca-vidros'].map(x=>'aplicacoes/'+x+'/'),'catalogo/'];
const sitemap=read('sitemap.xml');
const robots=read('robots.txt');
assert.ok(robots.includes('Sitemap: https://winf.com.br/sitemap.xml'),'Robots sem sitemap');
assert.ok(!/Disallow:\s*\/\s*$/m.test(robots),'Robots bloqueia todo o domínio');
for(const path of paths){
 const page=read(path+'index.html');
 const canonical='https://winf.com.br/'+path;
 assert.equal((page.match(/<title>/g)||[]).length,1,'Título em '+path);
 assert.equal((page.match(/rel="canonical"/g)||[]).length,1,'Canonical em '+path);
 assert.ok(page.includes('rel="canonical" href="'+canonical+'"'),'Canonical divergente '+path);
 assert.ok(page.includes('name="description"'),'Descrição '+path);
 assert.ok(page.includes('property="og:image"'),'Open Graph '+path);
 assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(page),'Noindex '+path);
 assert.ok(sitemap.includes('<loc>'+canonical+'</loc>'),'Não consta no sitemap '+path);
 assert.ok(page.includes('application/ld+json'),'Dados estruturados '+path);
 if(path.startsWith('aplicacoes/')){
   const hero=page.match(/--app-img:url\('(\/images\/[^']+)'\)/)?.[1];
   assert.ok(hero,'Imagem do hero ausente '+path);
   assert.ok(existsSync(resolve(root,hero.slice(1))),'Arquivo do hero inexistente: '+hero);
 }
 console.log('✓ PRONTO PARA INSPEÇÃO:',canonical);
}
console.log('✓ '+paths.length+' URLs preparadas para inspeção HTTP/Search Console. Dados de indexação: não avaliados.');

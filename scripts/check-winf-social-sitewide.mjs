/* Inspeção estática das prévias sociais e URLs públicas. Não inspeciona o cache do WhatsApp. */
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const report=JSON.parse(readFileSync(resolve(root,'docs/seo/winf-social-audit.json'),'utf8'));
const metas=['og:type','og:title','og:description','og:url','og:image','og:image:alt','og:image:secure_url','og:image:type','og:image:width','og:image:height'];
const read=p=>readFileSync(resolve(root,p),'utf8');
const attr=(tag,key)=>tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(?:"([^"]*)"|\\'([^\\']*)\\')','i'))?.slice(1).find(v=>v!==undefined)||'';
function get(html,kind,key){return (html.match(/<meta\b[^>]*>/ig)||[]).filter(tag=>attr(tag,kind)===key)}
const found=new Set();
for(const entry of report.indexPages){
 const route=entry.route==='/'?'index.html':entry.route.slice(1)+'index.html';
 const html=read(route),og=get(html,'property','og:image');
 assert.equal(og.length,1,'og:image único: '+route);
 for(const key of metas)assert.equal(get(html,'property',key).length,1,'Falta '+key+': '+route);
 for(const key of ['twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt'])
  assert.equal(get(html,'name',key).length,1,'Falta '+key+': '+route);
 const image=attr(og[0],'content');
 const url=attr(get(html,'property','og:url')[0],'content');
 assert.ok(/^https:\/\/winf\.com\.br\/(?!.*[?#])/.test(url),'og:url suja: '+route);
 assert.ok(/^https:\/\/winf\.com\.br\/images\/og\/winf-(?:share|select|catalogo)/.test(image),'Imagem inesperada: '+route);
 assert.ok(!url.includes('utm_')&&!image.includes('utm_')&&!url.includes('chatgpt.com'),'URL de campanha: '+route);
 assert.equal(get(html,'property','og:image:type').length,1);
 assert.equal(attr(get(html,'property','og:image:type')[0],'content'),'image/jpeg');
 const dest=image.replace('https://winf.com.br/','');
 assert.ok(existsSync(resolve(root,dest)),'Arquivo OG não existe '+dest);
 const metadata=await sharp(resolve(root,dest)).metadata();
 assert.equal(metadata.width,1200);assert.equal(metadata.height,630);assert.equal(metadata.format,'jpeg');
 assert.ok(metadata.exif,'Metadados JPEG não gravados '+route);
 found.add(image);
}
assert.equal(report.indexPages.length,found.size,'Páginas partilham imagens de contexto incorretamente');
assert.ok(report.indexPages.length>=60,'Cobertura incompleta');
console.log('✓ '+report.indexPages.length+' páginas, imagens próprias, EXIF, OG e Twitter; '+report.excluded.length+' redirecionamentos/noindex excluídos.');

/* Confere se cada arte local está identificada para sua cidade (nome, EXIF e cadastro). */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const cfg=JSON.parse(read('config/winf-active-cities.json'));
const registry=JSON.parse(read('docs/media/winf-city-image-registry.json'));
assert.equal(registry.schema,'winf-city-media-v1');
assert.equal(registry.cities.length,cfg.cities.length);
const used=new Set();
for(const city of cfg.cities){
 const entry=registry.cities.find(x=>x.id===city.id);
 assert.ok(entry,'Falta cidade: '+city.id);
 assert.equal(entry.origin,city.origin);
 assert.equal(entry.city,city.city);
 assert.equal(entry.uf,city.uf);
 assert.equal(entry.folder,'assets/cidades/'+city.id+'/');
 assert.ok(entry.images.length>=1,'Nenhuma capa local para '+city.city);
 const landing=entry.images.find(x=>x.type==='capa-social-da-cidade');
 assert.ok(landing,'Capa de cidade ausente: '+city.city);
 assert.equal(landing.image,'images/og/winf-select-'+city.origin+'-1200x630.jpg');
 for(const asset of entry.images){
  assert.ok(asset.page.startsWith('https://winf.com.br/'+city.slug+'/'),'Página de outra cidade: '+asset.page);
  assert.ok(!used.has(asset.image),'Arte atribuída a mais de uma cidade: '+asset.image);
  used.add(asset.image);
  const file=resolve(root,asset.image);
  assert.ok(existsSync(file),'Arquivo ausente: '+asset.image);
  const data=await sharp(file).metadata();
  assert.equal(data.width,1200);
  assert.equal(data.height,630);
  assert.ok(data.exif?.includes(Buffer.from('WINF_SELECT_CITY='+city.id)),'EXIF regional incorreto '+asset.image);
  assert.ok(asset.alt.includes(city.city+'/'+city.uf),'Texto alternativo sem cidade '+asset.image);
 }
 console.log('✓ '+city.city+'/'+city.uf+': '+entry.images.length+' artes atribuídas e verificadas por nome, EXIF e URL.');
}
console.log('✓ Cidades configuradas mapeadas sem cruzamento de imagens.');

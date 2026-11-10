'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('ghost-shop/index.html');
const css=read('css/winf-ghost-shop.css');
const login='https://painel-os.winf.com.br/login/';
test('GHOST SHOP™ inclui exatamente 12 mockups sem produtos ficticiamente comercializados',()=>{
 const cards=[...html.matchAll(/class="gs-product" data-category="[^"]+" href="([^"]+)"/g)];
 assert.equal(cards.length,12);
 for(const item of cards)assert.equal(item[1],login);
 assert.match(html,/VITRINE CONCEITUAL/);
 assert.match(html,/Sem preços/);
 assert.doesNotMatch(html,/R\$\s*[\d.,]+|data-price|add-to-cart|checkout\//i);
});
test('cada conceito usa imagem existente do acervo WINF',()=>{
 const urls=[...html.matchAll(/src="(\/images\/shop\/blackshop%20\(\d+\)\.webp)"/g)].map(x=>x[1]);
 assert.equal(urls.length,12);
 assert.equal(new Set(urls).size,12);
 for(const url of urls){
  const relative=decodeURIComponent(url.replace(/^\//,''));
  assert.ok(fs.existsSync(path.join(root,relative)),relative);
 }
});
test('filtros permitem navegação sem eliminar a rota de login',()=>{
 const js=html.match(/<script>\s*(\(\(\)=>\{[\s\S]*?\}\)\(\);)\s*<\/script>/)?.[1];
 assert.ok(js,'filtro JavaScript presente');
 assert.doesNotThrow(()=>new Function(js));
 for(const value of ['todos','vestuário','acessórios','objetos','colecionáveis'])assert.ok(html.includes('data-filter="'+value+'"'));
});
test('teasers e acesso à loja presentes nos principais sites e marcas',()=>{
 for(const file of ['index.html','aerocore/index.html','partners/index.html','aerocore/neoskin/index.html','aerocore/ceramic-armoring/index.html','aerocore/winf-select/index.html']){
  assert.ok(read(file).includes('href="/ghost-shop/"'),file);
 }
 assert.match(read('index.html'),/winf-ghost-teaser/);
 assert.match(read('aerocore/index.html'),/winf-ghost-teaser/);
});
test('estilos de loja e teaser não têm blocos CSS desbalanceados',()=>{
 for(const file of ['css/winf-ghost-shop.css','css/winf-ghost-teaser.css']){
  const s=read(file);
  assert.equal((s.match(/\{/g)||[]).length,(s.match(/\}/g)||[]).length,file);
 }
});

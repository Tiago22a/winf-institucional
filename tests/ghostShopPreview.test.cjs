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
test('GHOST SHOP™ inclui 23 conceitos, sem preço ou checkout fictício',()=>{
 const cards=[...html.matchAll(/class="gs-product(?: gs-product--slice)?" data-category="[^"]+" href="([^"]+)"/g)];
 assert.equal(cards.length,23);
 for(const item of cards)assert.equal(item[1],login);
 assert.match(html,/VITRINE CONCEITUAL/);
 assert.match(html,/Sem preços/);
 assert.doesNotMatch(html,/R\$\s*[\d.,]+|data-price|add-to-cart|checkout\//i);
});
test('os 11 itens individuais de acervo e a prancha original usam imagens existentes',()=>{
 // Conta apenas os 11 itens de acervo; a nova capa cinematográfica não é produto.
 const urls=[...html.matchAll(/<span class="gs-product-visual"><img src="(\/images\/shop\/blackshop%20\(\d+\)\.webp)"/g)].map(x=>x[1]);
 assert.equal(urls.length,11);
 assert.equal(new Set(urls).size,11);
 for(const url of urls){
  const relative=decodeURIComponent(url.replace(/^\//,''));
  assert.ok(fs.existsSync(path.join(root,relative)),relative);
 }
});
test('fotografia número 1 foi dividida em 12 quadrados independentes sem mostrar a montagem completa',()=>{
 const coords=[...html.matchAll(/gs-mosaic-crop--c([0-3])-r([0-2])/g)].map(x=>x[1]+','+x[2]);
 assert.equal(coords.length,12);
 assert.equal(new Set(coords).size,12);
 assert.ok(fs.existsSync(path.join(root,'images/shop/blackshop (45).webp')));
 assert.doesNotMatch(html,/src="\/images\/shop\/blackshop%20\(45\)\.webp"/);
 const css=read('css/winf-ghost-shop.css');
 assert.match(css,/background-size:var\(--gs-width-scale\) var\(--gs-height-scale\)/);
 for(let x=0;x<4;x++)for(let y=0;y<3;y++)assert.ok(coords.includes(x+','+y),"Tile "+x+","+y);
});
test('catálogo oficial WINF inclui boutique como seção sem misturar o grid técnico',()=>{
 const catalog=read('catalogo/index.html');
 assert.match(catalog,/id="catalog-ghost-collection-title"/);
 assert.match(catalog,/href="\/ghost-shop\/"/);
 assert.match(catalog,/css\/winf-catalog-ghost\.css/);
 assert.ok(fs.existsSync(path.join(root,'css/winf-catalog-ghost.css')));
 const start=catalog.indexOf('winf-catalog-ghost-collection');
 const products=catalog.indexOf('id="catalogo-produtos"');
 assert.ok(start>=0&&start<products);
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

test('GHOST SHOP™ aparece diretamente nos sete rodapés territoriais e no sitemap',()=>{
 const cidades=[
  'pelicula-de-controle-solar-santos-sp/index.html',
  'pelicula-de-controle-solar-praia-grande-sp/index.html',
  'pelicula-de-controle-solar-guaruja-sp/index.html',
  'insulfilm-residencial-sorocaba-sp/index.html',
  'pelicula-de-controle-solar-pilar-do-sul-sp/index.html',
  'pelicula-de-controle-solar-cuiaba-mt/index.html',
  'pelicula-de-controle-solar-campina-grande-pb/index.html'
 ];
 for(const cidade of cidades){
  const markup=read(cidade);
  assert.ok(markup.includes('href="/ghost-shop/"'),cidade);
  assert.ok(!markup.includes('GHOST SHOP™ / EM IMPLANTAÇÃO'),cidade);
 }
 assert.match(read('sitemap.xml'),/<loc>https:\/\/winf\.com\.br\/ghost-shop\/<\/loc>/);
});

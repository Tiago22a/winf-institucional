const assert = require('node:assert/strict');
const {test} = require('node:test');
const {readFileSync, existsSync}=require('node:fs');
const {join}=require('node:path');
const root=join(__dirname,'..');
const catalog=readFileSync(join(root,'catalogo/index.html'),'utf8');
const briefing=readFileSync(join(root,'briefing/index.html'),'utf8');
test('cartões têm páginas corretas e acesso direto por botão',()=>{
 for(const [url,name] of [['/aerocore/winf-select/','WINF SELECT'],['/aerocore/','AEROCORE'],['/aerocore/neoskin/','NEOSKIN'],['/aerocore/ceramic-armoring/','CERAMIC ARMORING']]){
  assert.match(catalog,new RegExp('<a href="'+url.replace(/\//g,'\\/')+'">'+name.replace(/ /g,'\\s+')+' <span'));
 }
 assert.match(catalog,/class="winf-catalog-quicklinks"/);
});
test('imagens profissionais de marcas são arquivos locais e não contêm títulos na mídia',()=>{
 assert.match(catalog,/src="\/images\/catalogo\/aerocore-porsche-clean\.webp"/);
 assert.match(catalog,/poster="\/images\/catalogo\/ceramic-red-products\.webp"/);
 assert.match(catalog,/data-src="\/aerocore\/assets\/ceramic-armoring-detailing\.mp4"/);
 assert.ok(existsSync(join(root,'images/catalogo/aerocore-porsche-clean.webp')));
 assert.ok(existsSync(join(root,'images/catalogo/ceramic-red-products.webp')));
 const grid=catalog.match(/<div class="winf-catalog-paths">([\s\S]*?)<\/div>/)?.[1];
 assert.ok(grid);
 assert.doesNotMatch(grid,/src="\/images\/ceramic-hero\.webp"/);
});
test('briefing preserva VSL voluntária com fonte e fallback acessíveis',()=>{
 assert.match(briefing,/id="partners-manifesto"/);
 assert.match(briefing,/data-src="\\/partners\\/media\\/manifesto\\.mp4"/);
 assert.match(briefing,/href="\\/partners\\/media\\/manifesto\\.mp4"/);
 assert.match(briefing,/data-play-manifesto/);
 assert.doesNotMatch(briefing,/autoplay[^>]*id="partners-manifesto"/);
 assert.doesNotMatch(briefing,/id="briefing-hero-motion"/);
 assert.match(briefing,/\\/js\\/winf-cinema\\.js\\?v=/);
 assert.match(briefing,/hero-motion\\.css\\?v=/);
});

test('animações param ou não iniciam com movimento reduzido/economia de dados',()=>{
 const script=readFileSync(join(root,'briefing/hero-motion.js'),'utf8');
 const style=readFileSync(join(root,'briefing/hero-motion.css'),'utf8');
 assert.match(script,/prefers-reduced-motion: no-preference/);
 assert.match(script,/navigator\.connection\?\.saveData/);
 assert.match(script,/IntersectionObserver/);
 assert.match(style,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(briefing,/autoplay[^>]*id="partners-manifesto"/);
});

import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const read = file => readFileSync(file,'utf8');
const home = read('index.html');
const global = read('onde-comprar/index.html');
const aero = read('aerocore/onde-comprar/index.html');
const aeroRoot = read('aerocore/index.html');
const data = read('js/cidades.js');
const locator = read('aerocore/assets/onde-comprar.js');
const homeApp = read('js/winf-home-territories.js');
const nav = read('js/winf-global-locator-nav.js');
const aeroCss = read('aerocore/assets/onde-comprar.css');
const globalCss = read('css/winf-global-locator.css');
const vmContext = {globalThis:{}};
vm.runInNewContext(data,vmContext,{filename:'js/cidades.js'});
const cities = vmContext.globalThis.WINF_CIDADES;
const extras = vmContext.globalThis.WINF_UNIDADES_EXTRAS;
const active = [...cities,...extras].filter(x=>x && x.status==='ativa' && x.exemplo===false);
let n=0;
function test(label,fn){fn();n++;console.log('✓ '+label)}
test('catalogo territorial WINF mantém exatamente 100 territórios mais extras',()=>{
  assert.equal(cities.length,100);
  assert.ok(extras.some(x=>x.id==='pilar-do-sul-sp'));
  assert.equal(new Set(cities.map(x=>x.id)).size,100);
  assert.equal(active.length,6);
  for(const id of ['santos-sp','sorocaba-sp','campina-grande-pb','guaruja-sp','praia-grande-sp','pilar-do-sul-sp']){
    assert.ok(active.some(x=>x.id===id),id);
  }
});
test('Santos mantém site, WhatsApp e linha arquitetônica oficiais',()=>{
  const santos = cities.find(x=>x.id==='santos-sp');
  assert.equal(santos.numero,'5513981113001');
  assert.equal(santos.url,'/pelicula-de-controle-solar-santos-sp/');
  assert.equal(santos.tipoAtendimento,'residencial');
  for(const x of active.filter(x=>x.id!=='santos-sp')){
    assert.equal(x.numero,null,'telefone local não homologado: '+x.id);
  }
});
test('home WINF tem W™ e localizador próprio e cards ativos',()=>{
  assert.match(home,/class="winf-home-w-mark"/);
  assert.match(home,/id="unidades-ativas"/);
  assert.match(home,/id="winf-active-grid"/);
  assert.match(home,/js\/winf-home-territories.js/);
  assert.match(home,/js\/cidades.js/);
  assert.doesNotMatch(home,/href="\/aerocore\/onde-comprar\/"/);
  assert.match(home,/href="\/onde-comprar\/"/);
  assert.match(read('css/winf-home-territories.css'),/\.winf-active-card/);
});
test('localizador global possui marca própria, canonical e controles necessários',()=>{
  assert.match(global,/rel="canonical" href="https:\/\/winf\.com\.br\/onde-comprar\/"/);
  assert.match(global,/WINF™ \/ REDE NACIONAL DE ATENDIMENTO/);
  assert.match(global,/id="menu-overlay" class="ac-roadmap-menu winf-global-roadmap hidden"/);
  assert.match(global,/id="active-city-summary"/);
  for(const id of ['directory-results','directory-query','directory-state','directory-service','directory-extras','directory-card','directory-empty','territory-form','directory-search']){
    assert.ok(global.includes('id="'+id+'"'),id);
  }
  assert.match(global,/js\/winf-global-locator-nav.js/);
  assert.match(globalCss,/font-family:Gustavo/);
  assert.doesNotMatch(global,/href="\/aerocore\/onde-comprar\/" data-action="menu-link"/);
});
test('AeroCore onde comprar adota menu oficial e não exibe banner Partners antigo',()=>{
  assert.match(aero,/id="menu-overlay" class="ac-simple-menu ac-shell"/);
  assert.match(aeroRoot,/id="menu-overlay" class="ac-simple-menu ac-shell"/);
  assert.equal((aero.match(/id="menu-overlay"/g)||[]).length,1);
  assert.match(aero,/VOLTAR AO UNIVERSO WINF/);
  assert.doesNotMatch(aero,/ac-partners-banner/);
  assert.match(aero,/ac-simple-menu\.css/);
  assert.match(aero,/id="active-city-summary"/);
  assert.match(aeroCss,/\.ac-directory \.directory-hero h1/);
  assert.match(aeroCss,/font-weight:900!important/);
});
test('ambos os locators utilizam o mesmo código e catálogo de cidades',()=>{
  for(const s of [global,aero]){
    assert.match(s,/\/js\/cidades\.js\?v=20261108-active-1/);
    assert.match(s,/\/aerocore\/assets\/onde-comprar\.js\?v=20261108-summary-1/);
  }
  assert.match(locator,/globalThis\.WINF_CIDADES/);
  assert.match(locator,/globalThis\.WINF_UNIDADES_EXTRAS/);
  assert.match(locator,/new URLSearchParams\(location\.search\)\.get\('cidade'\)/);
  assert.match(locator,/active-city-summary/);
  assert.match(locator,/query\.value = city\.cidade/);
});
test('scripts client-side têm sintaxe válida',()=>{
  for(const [file,code] of [
    ['aerocore/assets/onde-comprar.js',locator],
    ['js/winf-home-territories.js',homeApp],
    ['js/winf-global-locator-nav.js',nav],
    ['js/cidades.js',data]
  ])new vm.Script(code,{filename:file});
});
test('todas as novas rotas/assets existem',()=>{
  for(const p of ['onde-comprar/index.html','css/winf-global-locator.css','css/winf-home-territories.css','js/winf-global-locator-nav.js','js/winf-home-territories.js','aerocore/assets/ac-simple-menu.css'])assert.ok(existsSync(p),p);
});
console.log('\n'+n+' verificações de localizador concluídas.');

import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const read=f=>readFileSync(f,'utf8');
const home=read('index.html'),winf=read('onde-comprar/index.html'),aero=read('aerocore/onde-comprar/index.html');
const shared=read('aerocore/assets/onde-comprar.js'),cities=read('js/cidades.js');
const tests=[
 ['global locator has canonical, branded menu, and ONE H1',()=>{
  assert.match(winf,/rel="canonical" href="https:\/\/winf\.com\.br\/onde-comprar\/"/);
  assert.match(winf,/id="menu-overlay" class="ac-roadmap-menu winf-global-roadmap hidden"/);
  assert.match(winf,/WINF™ \/ UNIVERSO GLOBAL/);
  assert.equal((winf.match(/<h1\b/g)||[]).length,1);
  assert.doesNotMatch(winf,/href="\/aerocore\/onde-comprar\/"/);
  // O rodapé global pode citar WINF OS™; a seção do localizador não deve oferecer esse serviço.
  const locatorMain=winf.split('<main id="conteudo"')[1]?.split('</main>')[0]||'';
  assert.ok(locatorMain.length>100,'localizador principal presente');
  assert.doesNotMatch(locatorMain,/WINF OS™/);
 }],
 ['two locators depend on the SAME master register and script',()=>{
   for(const html of [winf,aero]){
    assert.match(html,/src="\/js\/cidades\.js\?/);
    assert.match(html,/src="\/aerocore\/assets\/onde-comprar\.js\?/);
    assert.match(html,/id="directory-results"/);
    assert.match(html,/id="directory-card"/);
    assert.match(html,/id="directory-state"/);
    assert.match(html,/id="directory-service"/);
    const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
    assert.equal(ids.length,new Set(ids).size,'duplicate IDs');
   }
   assert.match(shared,/status === 'ativa'/);
 }],
 ['AeroCore locator uses the exact official menu style, no Partners banner',()=>{
  assert.match(aero,/id="menu-overlay" class="ac-simple-menu ac-shell"/);
  assert.match(aero,/ac-simple-menu\.css/);
  assert.match(aero,/VOLTAR AO UNIVERSO WINF/);
  assert.match(aero,/href="\/partners\/" data-close-menu="true"/);
  assert.doesNotMatch(aero,/ac-partners-banner/);
 }],
 ['WINF global has visible active territories and sends visitors to global locator',()=>{
   assert.match(home,/id="unidades-ativas"/);
   assert.match(home,/id="winf-active-cards"/);
   assert.match(home,/Santos \/ SP/);
   assert.match(home,/Pilar do Sul \/ SP/);
   assert.match(home,/href="\/onde-comprar\/"/);
   assert.doesNotMatch(home,/href="\/aerocore\/onde-comprar\/"/);
   assert.match(home,/winf-active-territories\.js/);
 }],
 ['Legacy register keeps 100 entries, with 71 regional municipalities active and expansion separate',()=>{
   const list=JSON.parse(cities.match(/globalThis\.WINF_CIDADES\s*=\s*(\[[\s\S]*?\]);/)[1]);
   const extra=JSON.parse(cities.match(/globalThis\.WINF_UNIDADES_EXTRAS\s*=\s*(\[[\s\S]*?\]);/)[1]);
   const regional=JSON.parse(cities.match(/globalThis\.WINF_PAGINAS_REGIONAIS\s*=\s*(\[[\s\S]*?\]);/)[1]);
   assert.equal(list.length,100);
   assert.equal(list.filter(x=>x.status==='ativa').length,8);
   assert.equal(list.filter(x=>x.status==='pre_ativacao').length,1);
   assert.equal(list.find(x=>x.id==='campina-grande-pb')?.status,'pre_ativacao');
   for(const id of ['sorocaba-sp','guaruja-sp','praia-grande-sp']) {
     assert.equal(list.find(x=>x.id===id)?.status,'ativa');
     assert.equal(list.find(x=>x.id===id)?.siteAtivo,true);
   }
   assert.equal(list.find(x=>x.id==='cuiaba-mt')?.status,'nao_ativa');
   assert.equal(extra.filter(x=>x.status==='ativa').length,1);
   assert.equal(regional.filter(x=>x.status==='ativa').length,62);
   assert.equal(list.filter(x=>x.status==='ativa').length+extra.filter(x=>x.status==='ativa').length+regional.filter(x=>x.status==='ativa').length,71);
   const santos=list.find(x=>x.id==='santos-sp');
   assert.equal(santos.url,'/pelicula-de-controle-solar-santos-sp/');
   assert.equal(santos.numero,'5513981113001');
 }],
 ['AeroCore headline explicitly uses Montserrat and WINF uses Gustavo',()=>{
   const css=read('aerocore/assets/onde-comprar.css');
   const winfCss=read('css/winf-locator.css');
   assert.match(css,/\.ac-directory:not\(\.winf-directory\) h1/);
   assert.match(css,/font-family:Montserrat/);
   assert.match(winfCss,/\.winf-locator-page \.winf-directory h1/);
   assert.match(winfCss,/font:700 clamp\([^)]+\)\/\.99 Gustavo/);
 }],
 ['JS module syntax for both locators and home passes',()=>{
   for(const f of ['aerocore/assets/onde-comprar.js','js/winf-locator-menu.js','js/winf-active-territories.js','js/cidades.js'])new vm.Script(read(f),{filename:f});
 }],
 ['WINF global uses the official logo and the locator keeps its distinct identity',()=>{
   assert.match(home,/class="winf-home-official-logo"/);
   assert.match(home,/src="\/winf-logo\.svg"/);
   assert.doesNotMatch(home,/src="\/brand\/winf-monogram\.svg"/);
   assert.match(winf,/src="\/winf-logo\.svg"/);
   assert.doesNotMatch(winf,/src="\/brand\/winf-monogram\.svg"/);
   assert.ok(existsSync('brand/winf-monogram.svg'));
   assert.match(read('brand/winf-monogram.svg'),/<path/);
 }]

];
for(const [name,run] of tests){run();console.log('✓ '+name)}
console.log('\n'+tests.length+' WINF locator checks passed');

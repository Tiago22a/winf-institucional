const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
const root=join(__dirname,'..');
const catalog=readFileSync(join(root,'catalogo/index.html'),'utf8');
const briefing=readFileSync(join(root,'briefing/index.html'),'utf8');
const css=readFileSync(join(root,'briefing/hero-motion.css'),'utf8');

function loadSimulator(){
 const start=catalog.indexOf('// ===================== VISUALIZADOR DE PELÍCULAS WINF =====================');
 const end=catalog.indexOf('// ===================== MODAL DE ESPECIFICAÇÕES (vanilla JS) =====================',start);
 assert.ok(start>0&&end>start);
 const simulator=catalog.slice(start,end);
 const elements=new Map();
 const make=(id)=>({
  id,hidden:false,value:'',textContent:'',innerHTML:'',style:{},dataset:{},attributes:{},
  setAttribute(name,value){this.attributes[name]=String(value)},
  addEventListener(name,handler){this['on'+name]=handler},
  replaceChildren(...children){this.options=[...children];this.value=children[0]?.value||''},
  add(option){this.options=this.options||[];this.options.push(option)},
  get options(){return this._options||[]},set options(next){this._options=next},
  get selectedIndex(){return this.options.findIndex(x=>x.value===this.value)},
  set selectedIndex(index){if(this.options[index])this.value=this.options[index].value}
 });
 for(const id of ['winf-film-lab','sim-model-select','sim-film-select','sim-vlt-select',
  'sim-blackpro-settings','sim-view-switch','winf-lab-panes','sim-before',
  'sim-after','sim-tint','sim-vlt','sim-ir','sim-warranty',
  'winf-lab-kicker','winf-lab-title','winf-lab-description','winf-lab-page','sim-view-caption']){
  elements.set(id,make(id));
 }
 elements.get('sim-vlt-select').value='15';
 const views=['exterior','interior'].map(x=>{
  const b=make('button-'+x);b.dataset.simView=x;return b;
 });
 const callbacks={};
 const context=vm.createContext({
  activeCategory:'arch',selectedFilmId:'',
  PRODUCT_CATALOG:[
   {id:'select-blackpro',name:'BlackPro®',category:'arch',line:'select',specs:{vlt:'70%'},
    keyMetrics:{ir:'95%',warranty:'10 anos'}},
   {id:'select-invisible-70',name:'Invisible®',category:'arch',line:'select',specs:{vlt:'70%'},
    keyMetrics:{ir:'—',warranty:'10 anos'}}
  ],
  productLink:p=>'/blackpro/?partner=5511999999999&id='+p.id,
  Option:class Option{constructor(text,value){this.text=text;this.value=value}},
  document:{
   getElementById:id=>elements.get(id),
   querySelectorAll:selector=>selector==='[data-sim-view]'?views:[],
   addEventListener:(type,callback)=>{callbacks[type]=callback}
  }
 });
 new vm.Script(simulator,{filename:'winf-lab.js'}).runInContext(context);
 return {context,elements,views,callbacks,run:js=>vm.runInContext(js,context)};
}
test('Catálogo preserva produto aprovado e dá opção de percentual e perspectiva',()=>{
 assert.match(catalog,/id="sim-vlt-select"/);
 assert.match(catalog,/id="sim-blackpro-settings"/);
 assert.match(catalog,/data-sim-view="exterior"/);
 assert.match(catalog,/data-sim-view="interior"/);
 assert.match(catalog,/id="sim-view-caption"/);
 for(const vlt of ['5','15','20','35','50'])assert.ok(catalog.includes('<option value="'+vlt+'">'));
 assert.match(catalog,/Não representa|não representa|não simula com precisão/);
 assert.match(catalog,/id: 'select-blackpro'/);
 assert.match(catalog,/function productLink\(p\)/);
 assert.match(catalog,/params\.set\('partner',PRODUCT_PARTNER\)/);
});
test('VLT altera comparação real no DOM e vista interna não utiliza a fachada externa',()=>{
 const sim=loadSimulator();
 sim.run('populateFilmSelect(); updateSimDisplay()');
 const el=id=>sim.elements.get(id);
 assert.equal(el('sim-film-select').value,'select-blackpro');
 assert.equal(el('sim-blackpro-settings').hidden,false);
 assert.equal(el('sim-view-switch').hidden,false);
 assert.equal(el('sim-vlt').textContent,'15% · PRÉVIA');
 const oldImage=el('sim-after').style.backgroundImage;
 assert.ok(oldImage.includes('dualreflect-poster-1.webp'));
 assert.equal(el('sim-before').style.backgroundImage,oldImage);
 const shade15=Number(el('sim-tint').style.opacity);
 el('sim-vlt-select').value='50';
 sim.run('updateSimDisplay()');
 assert.ok(Number(el('sim-tint').style.opacity)<shade15);
 el('sim-vlt-select').value='5';
 sim.run('updateSimDisplay()');
 assert.ok(Number(el('sim-tint').style.opacity)>shade15);
 sim.views[1].onclick();
 assert.equal(el('winf-lab-panes').dataset.view,'interior');
 assert.ok(el('sim-after').style.backgroundImage.includes('invisible-poster-2.webp'));
 assert.equal(el('sim-before').style.backgroundImage,el('sim-after').style.backgroundImage);
 assert.equal(sim.views[1].attributes['aria-pressed'],'true');
 assert.equal(sim.views[0].attributes['aria-pressed'],'false');
 assert.ok(el('winf-lab-page').href?.includes('partner=')||el('winf-lab-page').href?.startsWith('/blackpro/'));
});
test('Filme não-BlackPro preserva comparação e oculta seletor especial',()=>{
 const sim=loadSimulator();
 sim.run('populateFilmSelect();updateSimDisplay()');
 sim.elements.get('sim-film-select').value='select-invisible-70';
 sim.run('updateSimDisplay()');
 assert.equal(sim.elements.get('sim-blackpro-settings').hidden,true);
 assert.equal(sim.elements.get('sim-view-switch').hidden,true);
 assert.equal(sim.elements.get('sim-vlt').textContent,'70%');
});
test('As cenas possuem arquivos locais; poster e vídeo recortam a faixa superior em todos os dispositivos',()=>{
 for(const name of [
  'images/dualreflect-poster-1.webp','images/invisible-poster-1.webp',
  'images/invisible-poster-2.webp','images/invisible-poster-3.webp'
 ]) assert.ok(existsSync(join(root,name)),name);
 assert.match(css,/#topo \.briefing-hero-poster,\s*#topo \.briefing-hero-motion/);
 assert.match(css,/transform:scale\(1\.20\)/);
 assert.match(css,/transform:scale\(1\.24\) translateY\(-2%\)/);
 assert.match(briefing,/hero-motion\.css\?v=20261116-hero-no-top-band/);
 assert.match(briefing,/class="briefing-hero-motion"/);
 assert.match(briefing,/class="briefing-hero-poster"/);
});

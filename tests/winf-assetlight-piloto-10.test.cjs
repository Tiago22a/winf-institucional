"use strict";
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const cohort=['barueri-sp','cotia-sp','santana-de-parnaiba-sp','itapevi-sp','indaiatuba-sp','jundiai-sp','osasco-sp','campinas-sp','vinhedo-sp','vargem-grande-paulista-sp'];

test('Lote 01: exatamente dez rotas, com CSS/JS isolados e triagem pela Central 013',()=>{
  assert.equal(new Set(cohort).size,10);
  assert.ok(exists('winf-select/assets/territorio.css'));
  assert.ok(exists('winf-select/assets/territorio.js'));
  const descriptors=[];
  for(const id of cohort){
    const base=`winf-select/cidades/${id}/`;
    assert.ok(exists(base+'index.html'),base+'index.html ausente');
    const html=read(base+'index.html');
    assert.ok(html.includes('<meta name="robots" content="noindex,follow">'),id);
    assert.ok(html.includes(`rel="canonical" href="https://winf.com.br/${base}"`),id);
    assert.ok(html.includes('../../assets/territorio.css'),id);
    assert.ok(html.includes('../../assets/territorio.js'),id);
    assert.ok(html.includes(`data-territory-id="${id}"`),id);
    assert.ok(html.includes('https://wa.me/5513981113001?text='),id);
    assert.ok(html.toLowerCase().includes('presença técnica'),id);
    assert.ok(!/"@type"\s*:\s*"LocalBusiness"/.test(html),id);
    assert.ok((html.match(/<details>/g)||[]).length>=3,id);
    const match=html.match(/<meta name="description" content="([^"]+)/);
    assert.ok(match&&match[1].length>=75,id);
    descriptors.push(match[1]);
  }
  assert.equal(new Set(descriptors).size,10,'metadescricoes nao podem ser duplicadas');
});

test('Lote 01: portal regional nao recebeu indexacao nem itens no sitemap',()=>{
  if(!exists('sitemap.xml')) return; // rodagem isolada local: o gate do repo audita o sitemap.
  const xml=read('sitemap.xml');
  for(const id of cohort){
    assert.ok(!xml.includes(`<loc>https://winf.com.br/winf-select/cidades/${id}/</loc>`),id);
  }
});

test('Lote 01: inventario comercial nao confunde registros e operacoes',()=>{
  if(!exists('crm/winf-assetlight-territorios-200.json'))return;
  const inv=JSON.parse(read('crm/winf-assetlight-territorios-200.json'));
  assert.equal(inv.territorios.length,200);
  assert.equal(inv.territorios.filter(t=>t.uf==='SP').length,100);
  assert.equal(new Set(inv.territorios.map(t=>t.id)).size,200);
  for(const id of cohort){
    const entry=inv.territorios.find(t=>t.id===id);
    assert.ok(entry,`cadastro ausente: ${id}`);
    assert.notEqual(entry.instalacaoLocal,'confirmada',`nao presumir operacao ${id}`);
  }
});

test('Lote 01: formulario identifica cidade, interesse e nao envia a CRM sem permissao',()=>{
 const vm=require('node:vm');
 const script=read('winf-select/assets/territorio.js');
 for(const id of cohort){
  const city=id.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
  let submitted,redirect;
  const elements={service:'Reduzir calor',neighborhood:'Centro',project:'Residencial',size:'2 janelas'};
  const form={
   getAttribute(name){return name==='data-city'?city:id;},
   elements:{namedItem(name){return {value:elements[name]}}},
   addEventListener(event,fn){assert.equal(event,'submit');submitted=fn;}
  };
  vm.runInNewContext(script,{
   document:{querySelector(selector){assert.equal(selector,'[data-quote]');return form;}},
   window:{location:{assign(url){redirect=url;}}},
   encodeURIComponent
  });
  let prevented=false;submitted({preventDefault(){prevented=true}});
  assert.ok(prevented);
  const dest=new URL(redirect);
  assert.equal(dest.host,'wa.me');assert.equal(dest.pathname,'/5513981113001');
  assert.ok(dest.searchParams.get('text').includes(`Território: ${id}`));
  assert.ok(dest.searchParams.get('text').includes('Serviço: Reduzir calor'));
 }
});

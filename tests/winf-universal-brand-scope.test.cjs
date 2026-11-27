'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const root=join(__dirname,'..');
const read=p=>readFileSync(join(root,p),'utf8');

test('GHOST+ apresenta AeroCore como mobilidade e mantém WINF Select em arquitetura',()=>{
 const s=read('js/winf-quick-contact.js');
 assert.match(s,/\['WINF Select™ — Arquitetura','\/aerocore\/winf-select\/'\]/);
 assert.match(s,/\['AeroCore™ — Automotivo, Aeronáutico e Náutico','\/aerocore\/'\]/);
 assert.doesNotMatch(s,/AeroCore™ — Películas/);
 assert.match(s,/\['NeoSkin™ — PPF','\/aerocore\/neoskin\/'\]/);
 assert.match(s,/\['Ceramic Armoring™','\/aerocore\/ceramic-armoring\/'\]/);
 assert.match(s,/if \(\/\^\\\/\(\?:pelicula-de-controle-solar-/);
});
test('menu global da homepage mantém divisões claras',()=>{
 const home=read('index.html');
 assert.match(home,/AEROCORE™<small class="winf-brand-menu-scope">MOBILIDADE · AUTOMOTIVO · MARINE · AVIATION<\/small>/);
 assert.match(home,/WINF SELECT™<small class="winf-brand-menu-scope">ARQUITETURA · GLASS \+ HOME<\/small>/);
 assert.match(home,/NEOSKIN™<small class="winf-brand-menu-scope">PPF · PROTEÇÃO DE PINTURA<\/small>/);
 assert.match(home,/CERAMIC ARMORING™<small class="winf-brand-menu-scope">REVESTIMENTO CERÂMICO · PROTEÇÃO DE SUPERFÍCIES<\/small>/);
 assert.match(home,/href="\/aerocore\/winf-select\/"/);
 assert.match(home,/href="\/aerocore\/"/);
 assert.match(read('css/winf-global-menu.css'),/\.winf-brand-menu-scope/);
});
test('Catálogo Universal separa aplicações sem alterar o filtro e os cards',()=>{
 const s=read('catalogo/index.html');
 assert.match(s,/WINF Select™ \/ Arquitetura/);
 assert.match(s,/AeroCore™ \/ Automotivo · Aeronáutico · Náutico/);
 assert.match(s,/Explore a AeroCore™ para automóveis, aeronaves e embarcações/);
 for (const id of ['tab-all','tab-arch','tab-aerocore','tab-neoskin','tab-ceramic']) {
  assert.ok(s.includes('id="'+id+'"'),'Missing '+id);
 }
 assert.match(s,/const matchesCurrentLine=/);
});

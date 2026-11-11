"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"mediacar/index.html"),"utf8");
const script=fs.readFileSync(path.join(root,"js/winf-cinema.js"),"utf8");
const asset=name=>path.join(root,"media/ecossistema",name);
test("MediaCar publica as mídias originais específicas da BMW e da equipe",()=>{
 for(const [name,minimum] of [
  ["mediacar-bmw.mp4",300000],
  ["mediacar-team.mp4",250000],
  ["mediacar-bmw.webp",30000],
  ["mediacar-team.webp",30000]
 ]){
  assert.ok(fs.existsSync(asset(name)),name+" não foi publicado");
  assert.ok(fs.statSync(asset(name)).size>minimum,name+" inesperadamente pequeno");
 }
 assert.match(html,/data-src="\/media\/ecossistema\/mediacar-bmw\.mp4"/);
 assert.match(html,/data-src="\/media\/ecossistema\/mediacar-team\.mp4"/);
 assert.match(html,/src="\/media\/ecossistema\/mediacar-bmw\.webp"/);
 assert.match(html,/src="\/media\/ecossistema\/mediacar-team\.webp"/);
});
test("A animação da BMW aparece dentro da abertura, atrás do título",()=>{
 const start=html.indexOf('<section class="hero"'),end=html.indexOf('</section>',start);
 assert.ok(start>=0&&end>start);
 const hero=html.slice(start,end);
 assert.match(hero,/class="hero-media"/);
 assert.match(hero,/id="mediacar-title"/);
 assert.match(hero,/O CARRO<br>VIRA <em>MÍDIA\.<\/em>/);
 assert.ok(hero.indexOf('mediacar-bmw.mp4')<hero.indexOf('id="mediacar-title"'));
 assert.match(html,/\.hero-media video\.wc-playing\{opacity:1\}/);
 assert.match(html,/@media\(prefers-reduced-motion:reduce\)/);
});
test("Os dois filmes pertencem ao MediaCar, sem reaproveitamento indevido",()=>{
 assert.doesNotMatch(html,/data-fallback-src/);
 assert.doesNotMatch(html,/\/videos\/aerocore\/aerocore-hero\.mp4/);
 assert.doesNotMatch(html,/\/briefing\/media\/flagship-equipe-20261108\.mp4/);
 assert.doesNotMatch(html,/\/images\/aerocore\/aerocore-(car|showroom)\.webp/);
 assert.match(html,/href="\/partners\/carro-midia\/"/);
 assert.match(script,/IntersectionObserver/);
 assert.match(html,/MÍDIA EM MOVIMENTO/);
});

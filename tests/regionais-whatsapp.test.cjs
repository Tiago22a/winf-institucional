"use strict";
const { test }=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ddd15=[
  ["Sorocaba","insulfilm-residencial-sorocaba-sp/index.html","sorocaba"],
  ["Pilar do Sul","pelicula-de-controle-solar-pilar-do-sul-sp/index.html","pilar-do-sul"],
];
const ddd13=["pelicula-de-controle-solar-santos-sp/index.html","pelicula-de-controle-solar-guaruja-sp/index.html","pelicula-de-controle-solar-praia-grande-sp/index.html"];
test("DDD 015 usa WhatsApp regional em todo link e no orçamento",()=>{
 for(const [city,file,slug] of ddd15){
   const html=read(file);
   assert.match(html,/data-whatsapp="5515997909049"/,city);
   assert.match(html,/"telephone":"\+55-15-99790-9049"/,city);
   assert.match(html,/wa\.me\/5515997909049\?text=/,city);
   assert.ok(html.includes("origem="+slug+"&amp;partner=5515997909049"),city);
   assert.ok(!html.includes("5513981113001"),city);
   assert.ok(html.includes('data-city="'+city+'"'),city);
 }
});
test("DDD 013 continua em central separada",()=>{
 for(const file of ddd13){
   const html=read(file);
   assert.ok(html.includes("5513981113001"),file);
   assert.ok(!html.includes("5515997909049"),file);
 }
});

"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");

const source=readFileSync(join(__dirname,"../catalogo/index.html"),"utf8");

test("catálogo não exibe CTA redundante de consultor no cabeçalho",()=>{
 const nav=source.match(/<nav id="nav"[\s\S]*?<\/nav>/)?.[0];
 assert.ok(nav,"cabeçalho do catálogo existe");
 assert.doesNotMatch(nav,/Falar com Consultor|onclick="falarConsultor\(\)"/i);
 assert.match(nav,/CATÁLOGO <span/);
});
test("preserva botão de contato dos produtos e redirecionamento WhatsApp",()=>{
 assert.match(source,/function falarConsultorProduto\(/);
 assert.match(source,/function falarConsultor\(/);
 assert.match(source,/WHATSAPP_NUMBER/);
 assert.match(source,/https:\/\/wa\.me/);
});
test("título geral é editorial, em caixa alta e com fonte institucional",()=>{
 assert.match(source,/<h1 id="hero-title"[^>]*winf-catalog-hero-all[^>]*>[\s\S]*?UMA MARCA\.<br><span[^>]*>MUITAS POSSIBILIDADES\.<\/span>/);
 assert.match(source,/title:\s*'UMA MARCA\.<br><span[^>]*>MUITAS POSSIBILIDADES\.<\/span>'/);
 assert.match(source,/#hero-title\.winf-catalog-hero-all\{\s*font-family:Gustavo,Impact,Arial,sans-serif!important/);
 assert.match(source,/font-weight:700!important/);
});
test("todas as abas compartilham a tipografia editorial da WINF, inclusive no celular",()=>{
 assert.match(source,/heading\.classList\.add\('winf-catalog-hero-all'\)/);
 assert.match(source,/getElementById\('catalog-hero'\)\?\.classList\.add\('is-universe'\)/);
 assert.match(source,/@media\(max-width:640px\)/);
 assert.match(source,/font-size:clamp\(29px,8vw,44px\)!important/);
 assert.match(source,/label: 'Divisão de Conforto Arquitetônico'/);
});

test("troca as referências do Porsche na vitrine sem sobreposição textual no card Ceramic",()=>{
 const section=source.match(/<div class="winf-catalog-paths">([\s\S]*?)<\/div>/)?.[0];
 assert.ok(section,"Grade das quatro marcas existe");
 assert.match(section,/<a href="\/aerocore\/"><img class="winf-card-aerocore-image" src="\/images\/catalogo\/aerocore-porsche-clean\.webp"/);
 assert.match(section,/<a href="\/aerocore\/ceramic-armoring\/"><video class="winf-card-ceramic-video"/);
 assert.match(section,/ceramic-armoring-detailing\.mp4/);
 assert.doesNotMatch(section,/porsche-911-highway-20261103-poster\.webp/);
 assert.doesNotMatch(section,/src="\/images\/ceramic-hero\.webp"[^>]*>[^<]*CERAMIC ARMORING/i);
 assert.doesNotMatch(section,/reference-detailing\.webp/);
 assert.match(section,/PROTEÇÃO CERÂMICA/);
 assert.match(section,/CERAMIC ARMORING<sup>™<\/sup>/);
});

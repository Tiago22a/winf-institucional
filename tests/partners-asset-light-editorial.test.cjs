"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const get=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=get("partners/index.html"),css=get("partners/landing.css"),model=get("briefing/asset-light/index.html");
test("galeria Asset Light usa apenas fotos existentes do acervo aprovado",()=>{
 for(const photo of ["asset-light-mobilidade-2026.webp","asset-light-execucao-2026.webp"]){
   assert.ok(fs.existsSync(path.join(root,"briefing/media",photo)),photo);
   assert.ok(html.includes('src="/briefing/media/'+photo+'"'),photo);
 }
 assert.equal((html.match(/wp-al-editorial__gallery/g)||[]).length,1);
 assert.match(html,/Imagens editoriais ilustrativas do conceito WINF Asset Light/);
});
test("nenhum logo oficial WINF ou Ghost foi alterado",()=>{
 assert.match(html,/<img src="\/winf-logo.svg\?v=winf-official-vector-20261111"/);
 assert.match(model,/<img src="\/briefing\/media\/winf-logo-white-official.png"/);
 assert.match(html,/<img class="wp-hero-glass-ghost" src="\/aerocore\/assets\/ghost-symbol.png"/);
});
test("SEO, link de briefing, mobile e lazy loading preservados",()=>{
 assert.match(html,/<link rel="canonical" href="https:\/\/winf.com.br\/partners\/"/);
 assert.match(html,/href="\/briefing\/asset-light\/" class="wp-al-editorial__link"/);
 assert.ok((html.match(/loading="lazy" decoding="async"/g)||[]).length>=2);
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/@media\(max-width:580px\)/);
 assert.match(html,/não representam lojas, instalações contratadas ou equipes locais efetivamente ativadas/i);
});

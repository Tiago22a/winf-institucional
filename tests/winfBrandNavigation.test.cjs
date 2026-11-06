"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const pages=["index.html","briefing/index.html","winf-home/index.html","aerocore/index.html"];
test("identidade NeoSkin™ PPF é consistente na navegação principal",()=>{
 for(const file of pages){
  const s=read(file);
  assert(s.includes("NEOSKIN™ PPF"),file);
  assert(!/menu-primary-link[^>]*>PPF<\/a>/i.test(s),"PPF genérico: "+file);
 }
 assert.match(read("aerocore/index.html"),/data-text="NEOSKIN™ PPF">NEOSKIN™ PPF/);
});
test("menu de início, briefing e rodapé destinam cada marca ao site certo",()=>{
 const home=read("index.html"),brief=read("briefing/index.html");
 assert.match(home,/href="\/aerocore\/winf-select\/" data-action="menu-link" class="menu-primary-link">WINF SELECT™/);
 assert.match(home,/href="\/aerocore\/neoskin\/" data-action="menu-link" class="menu-primary-link">NEOSKIN™ PPF/);
 assert.match(home,/href="\/partners\/" data-action="menu-link" class="menu-secondary-link[^"]*">WINF Partners™/);
 assert.match(home,/<a href="\/partners\/">WINF PARTNERS™<\/a>/);
 assert.match(brief,/data-action="menu-link" href="\/aerocore\/winf-select\/">WINF SELECT™/);
 assert.match(brief,/data-action="menu-link" href="\/aerocore\/neoskin\/">NEOSKIN™ PPF/);
 assert(fs.existsSync(path.join(root,"aerocore/winf-select/index.html")));
 assert(fs.existsSync(path.join(root,"aerocore/neoskin/index.html")));
 assert(fs.existsSync(path.join(root,"partners/index.html")));
});
test("menus secundários permanecem intactos e produtos não mudaram de rota",()=>{
 const home=read("index.html");
 assert.match(home,/href="\/aerocore\/ceramic-armoring\/" data-action="menu-link"/);
 assert.match(home,/href="\/invisible\/" data-action="menu-link"/);
 assert.match(home,/href="\/aerocore\/" data-action="menu-link" class="menu-primary-link">AEROCORE™/);
 for(const file of pages){
  const html=read(file);
  const ids=[...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"").matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,file+" has repeated IDs");
 }
});

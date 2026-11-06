"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const files=[
 "index.html","winf-home/index.html","briefing/index.html","partners/index.html",
 "aerocore/index.html","aerocore/aerocore/index.html","aerocore/neoskin/index.html",
 "aerocore/ceramic-armoring/index.html","neoskin/index.html",
 "aerocore/winf-select/index.html","catalogo/index.html","blog/index.html"
];
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
const getFooter=html=>html.match(/<footer id="winf-global-footer"[\s\S]*?<\/footer>/)?.[0];

test("12 páginas têm um único rodapé editorial com CSS versionado",()=>{
 for(const file of files){
  const html=read(file),foot=getFooter(html);
  assert(foot,"Footer ausente em "+file);
  assert.equal((html.match(/id="winf-global-footer"/g)||[]).length,1,file);
  assert.match(foot,/data-footer-version="20261106-editorial1"/,file);
  assert.match(html,/\/css\/winf-footer-reference\.css\?v=20261106-editorial1/,file);
  assert.doesNotMatch(foot,/wf-ref-primary|wf-ref-upcoming|wf-ref-countries|wf-ref-social-pending/,file);
  for(const section of ["wf-ref-editorial","wf-ref-navigation","wf-ref-signature","wf-ref-lastline","wf-ref-contact-box"])assert(foot.includes(section),file+" lacks "+section);
 }
});
test("identidade específica e marca oficial WINF preservadas",()=>{
 for(const file of ["index.html","winf-home/index.html","briefing/index.html","partners/index.html","aerocore/winf-select/index.html","catalogo/index.html","blog/index.html"]){
  assert.match(getFooter(read(file)),/src="\/winf-logo\.svg"/,file);
 }
 for(const file of ["aerocore/index.html","aerocore/aerocore/index.html"]){
  assert.match(getFooter(read(file)),/AEROCORE<sup>™<\/sup>/,file);
 }
 for(const file of ["aerocore/neoskin/index.html","neoskin/index.html"]){
  assert.match(getFooter(read(file)),/NEOSKIN<sup>™<\/sup>/,file);
 }
 for(const file of ["briefing/index.html","partners/index.html"]){
  assert.match(getFooter(read(file)),/EXPANSÃO SELETIVA/,file);
 }
});
test("nenhuma duplicação de IDs HTML nas páginas afetadas",()=>{
 for(const file of files){
  const ids=[...read(file).matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,file);
 }
});
test("links críticos do rodapé são destinos reais do site, sem redes sociais pendentes",()=>{
 const check=["/partners/","/briefing/","/catalogo/","/aerocore/neoskin/","/aerocore/aerocore/","/aerocore/winf-select/"];
 for(const href of check)assert(read("briefing/index.html").includes('href="'+href+'"'));
 const ft=getFooter(read("briefing/index.html"));
 assert.doesNotMatch(ft,/role="img" aria-label="X AeroCore|link oficial pendente/);
 assert.match(ft,/https:\/\/wa\.me\/5513981113001/);
});
test("animação do hero no briefing não usa mídia externa ou texto sobreposto",()=>{
 const html=read("briefing/index.html"),css=read("briefing/clean-hero-animation.css");
 assert.match(html,/class="wb-clean-motion" aria-hidden="true"/);
 assert.match(html,/\/briefing\/clean-hero-animation\.css\?v=20261106-logo-free-1/);
 assert.doesNotMatch(html,/data-background-video/);
 assert.doesNotMatch(html,/data-src="\/partners\/media\/hero\.mp4"/);
 assert.doesNotMatch(css,/url\(|content:"[A-ZÁÉÍÓÚ]/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(html,/id="partners-title"/);
 assert.match(html,/id="licensing-plans"/);
});
test("rodapé é responsivo e mantém foco visível no teclado",()=>{
 const css=read("css/winf-footer-reference.css");
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/wf-ref-brand-logo/);
});


function discoverIndexPages(dir){
 const result=[];
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  if(ent.name.startsWith(".")||ent.name==="node_modules")continue;
  const absolute=path.join(dir,ent.name);
  if(ent.isDirectory())result.push(...discoverIndexPages(absolute));
  else if(ent.isFile()&&ent.name==="index.html")result.push(path.relative(root,absolute).replaceAll(path.sep,"/"));
 }
 return result;
}
test("todas as páginas do site com rodapé global usam a mesma versão editorial",()=>{
 const pages=discoverIndexPages(root);
 const global=pages.filter(file=>read(file).includes('id="winf-global-footer"'));
 assert.equal(global.length,48,"Esperadas 48 páginas com rodapé global; revisar inventário se mudar");
 for(const file of global){
  const html=read(file),foot=getFooter(html);
  assert(foot, "rodapé global incorreto em "+file);
  assert.match(foot,/data-footer-version="20261106-editorial1"/,file);
  assert.match(html,/\/css\/winf-footer-reference\.css\?v=20261106-editorial1/,file);
  const markupOnly=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
  const ids=[...markupOnly.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,"IDs duplicados em "+file);
 }
});
test("links jurídicos do rodapé resolvem nos anchors existentes",()=>{
 const policies=read("aerocore/policies/index.html");
 for(const anchor of ["certificacoes","juridico","privacidade"]){
  assert.match(policies,new RegExp('id="'+anchor+'"'));
  assert(getFooter(read("briefing/index.html")).includes("/aerocore/policies/#"+anchor));
 }
});

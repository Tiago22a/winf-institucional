"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const page=read("partners/index.html");
const css=read("partners/premium-home.css");
const brief=read("briefing/index.html");

test("Partners is a real, indexable flagship homepage, not a login placeholder",()=>{
 assert.match(page,/<html lang="pt-BR">/);
 assert.match(page,/name="robots" content="index,follow,max-image-preview:large"/);
 assert.match(page,/canonical" href="https:\/\/winf.com.br\/partners\/"/);
 assert.match(page,/og:title/);
 assert.match(page,/name="description"/);
 assert.match(page,/id="hero-title"/);
 assert.match(page,/NÓS ESTRUTURAMOS/);
 assert(!page.includes('href="https://winf.com.br/partners"'));
 assert(!page.includes("Acessar WINF OS Terminal"));
 assert(!page.includes("Acesso exclusivo para líderes"));
});
test("hierarchy includes the six useful pillars and correct commercial steps",()=>{
 for(const id of ["visao","ecossistema","modelos","kit","aurel","processo","parcerias"]){
  assert(page.includes('id="'+id+'"'),id);
 }
 for(const name of ["WINF Select™","WINF OS™","GHOST SHOP™","M.A.W.™",
 "WINF INTELLIGENCE ACADEMY™","AUREL™"])assert(page.toLowerCase().includes(name.toLowerCase()),name);
 assert.match(page,/R\$ 15\.000/);
 assert.match(page,/R\$ 95\.000/);
 assert.match(page,/R\$ 250\.000/);
 assert.match(page,/45 metros lineares/);
 assert.match(page,/03 × 15 M/);
 for(const id of ["asset-light-investment","kiosk","studio"])assert(brief.includes('id="'+id+'"'));
 assert.match(page,/Não há garantia de receita, rentabilidade/);
});
test("every local hash and local file path is real",()=>{
 const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
 for(const match of page.matchAll(/\bhref="#([^"]+)"/g))assert(ids.has(match[1]),"internal #"+match[1]);
 for(const hash of ["#asset-light-investment","#kiosk","#studio"])
  assert(page.includes('/briefing/'+hash) && brief.includes('id="'+hash.slice(1)+'"'),hash);
 for(const file of ["winf-logo.svg","partners/media/arquitetura.webp","partners/media/aplicacao.webp",
 "partners/media/asset-light.webp","briefing/media/portfolio-arquitetura-v2.webp","partners/premium-home.css"])
 assert(fs.existsSync(path.join(root,file)),"missing asset "+file);
 assert.equal(ids.size,[...page.matchAll(/\bid="([^"]+)"/g)].length,"duplicate IDs");
});
test("separate commercial CTAs for licensees, investors and industrial partners",()=>{
 assert.match(page,/CONHECER OS MODELOS/);
 assert.match(page,/ACESSAR O BRIEFING COMPLETO/);
 assert.match(page,/SOU INVESTIDOR/);
 assert.match(page,/SOU IMPORTADOR/);
 assert.match(page,/importa%C3%A7%C3%A3o/);
 assert.match(page,/investimento%20estrat%C3%A9gico/);
 assert(!page.includes("retorno garantido"));
});
test("AUREL is described truthfully; unavailable functions are not advertised as active",()=>{
 assert.match(page,/AUREL™\./);
 assert.match(page,/VSL, AUTOMAÇÕES E INTEGRAÇÕES EM DESENVOLVIMENTO/);
 assert.match(page,/Identidade visual temporária de AUREL/);
 assert(!page.includes("data-autostart-auron"));
});
test("responsive design, accessibility, dark palette and reduced motion",()=>{
 assert.match(css,/@media\(max-width:1050px\)/);
 assert.match(css,/@media\(max-width:740px\)/);
 assert.match(css,/@media\(max-width:440px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/:focus-visible/);
 assert.match(page,/class="skip-link" href="#conteudo"/);
 assert.match(page,/aria-label="Menu para dispositivos móveis"/);
 assert.match(page,/<summary aria-label="Abrir ou fechar navegação"/);
 assert.match(page,/<main id="conteudo">/);
 assert(!page.includes('class="fixed inset-0 z-[80]'));
});
test("all image tags have descriptions and no invalid placeholder preview links",()=>{
 const tags=[...page.matchAll(/<img\b[^>]*>/g)].map(x=>x[0]);
 assert(tags.length>=4);
 for(const tag of tags)assert(/\balt="[^"]+"/.test(tag),tag);
 assert(!page.includes("aistudio.google.com"));
 assert(!page.includes("preview-aurel"));
 assert(!page.includes("private_key"));
 assert(!page.includes("apiKey"));
});

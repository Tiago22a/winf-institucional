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
 assert.match(page,/UMA NOVA FORMA/);
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
 assert(tags.length>=3);
 for(const tag of tags)assert(/\balt="[^"]+"/.test(tag),tag);
 assert(!page.includes("aistudio.google.com"));
 assert(!page.includes("preview-aurel"));
 assert(!page.includes("private_key"));
 assert(!page.includes("apiKey"));
});

test("WINF Partners logo follows official AeroCore menu wordmark, without loose WINF logo assembly",()=>{
 const wordmarks=[...page.matchAll(/<strong>WINF PARTNERS<sup>™<\/sup><\/strong>/g)];
 assert.equal(wordmarks.length,2,"header and footer must use matching wordmarks");
 assert.match(page,/class="brand partners-wordmark"/);
 assert.match(page,/class="partners-wordmark footer-wordmark"/);
 assert(!page.includes('class="brand" href="/" aria-label="WINF — site institucional"'));
 assert.match(css,/\.partners-wordmark strong/);
});
test("ecosystem menus present NeoSkin and WINF Select clearly, including on mobile",()=>{
 assert.match(page,/aria-label="WINF Partners: navegação principal"/);
 assert.match(page,/aria-label="Menu para dispositivos móveis"/);
 assert.match(page,/href="#ecossistema">Ecossistema/);
 assert(page.includes('<a href="/aerocore/neoskin/">NeoSkin™'));
 assert(page.includes('<a href="/aerocore/winf-select/">WINF Select™'));
 assert.match(page,/WINF PARTNERS™ \/ FRANQUIA TECNOLÓGICA/);
 assert.match(page,/class="footer-legal"/);
 assert(!page.includes('class="wf-reference-footer"'));
 assert.match(page,/aria-label="Rodapé institucional WINF Partners"/);
});


test("cinematic Partners homepage preserves real video with static poster fallback",()=>{
 assert.match(page,/<video class="hero-video" autoplay muted loop playsinline preload="metadata"/);
 assert.match(page,/<source src="\/partners\/media\/hero\.mp4" type="video\/mp4">/);
 assert.match(page,/poster="\/partners\/media\/hero-poster\.webp"/);
 assert(fs.existsSync(path.join(root,"partners/media/hero.mp4")));
 assert(fs.existsSync(path.join(root,"partners/media/hero-poster.webp")));
 assert.match(css,/\.hero-media\{/);
 assert.match(css,/\.hero-video\{/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.hero-media\{display:none\}/);
});
test("Partners navigation is its own discovery funnel, not AeroCore product menu",()=>{
 const nav=page.match(/<nav class="desktop-nav"[\s\S]+?<\/nav>/)?.[0];
 assert(nav);
 for(const id of ["#visao","#ecossistema","#aurel","#modelos","#processo"])assert(nav.includes('href="'+id+'"'),id);
 assert(!nav.includes("/aerocore/"));
 assert(!nav.includes("WINF SELECT™"));
 assert.match(page,/class="header-cta" href="\/briefing\/#contact">QUERO PARTICIPAR/);
 assert.match(brief,/id="contact"/);
 assert.match(page,/class="mobile-participate" href="\/briefing\/#contact"/);
 assert.match(page,/id="discovery-title"/);
 assert.match(page,/class="guided-discovery__steps"/);
 assert.match(page,/class="ecosystem-explore__grid"/);
});
test("briefing remains a separate, unmodified deep dive with all critical anchors",()=>{
 assert.match(page,/href="\/briefing\/">ACESSAR O BRIEFING COMPLETO/);
 for(const anchor of ["contact","asset-light-investment","kiosk","studio"])
  assert(brief.includes('id="'+anchor+'"'),anchor);
 assert.match(page,/WINF Partners™/);
});

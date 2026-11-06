"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const brief=read("briefing/index.html"),partners=read("partners/index.html");
const css=read("css/winf-interface-polish.css"),script=read("script.js");

test("briefing and Partners load the scoped UI styles",()=>{
 for(const [name,html] of [["briefing",brief],["partners",partners]])
  assert(html.includes("/css/winf-interface-polish.css?v=20261106-1"),name);
 assert.match(partners,/<body class="winf-partners-entry /);
 assert.match(css,/\.partners-page/);
 assert.match(css,/\.winf-partners-entry/);
});

test("briefing overlay has accessible dialog and keyboard control",()=>{
 assert.match(brief,/id="menu-overlay"/);
 assert.match(brief,/aria-modal="true" aria-label="Navegação WINF" role="dialog" inert/);
 assert.match(brief,/aria-controls="menu-overlay" aria-expanded="false"/);
 assert.match(brief,/data-action="close-menu" type="button" aria-label="Fechar navegação"/);
 assert.match(script,/event\.key === 'Escape'/);
 assert.match(script,/event\.key !== 'Tab'/);
 assert.match(script,/menuLastTrigger/);
 assert.match(script,/menu\.setAttribute\('inert', ''\)/);
 assert.match(script,/button\.setAttribute\('aria-expanded', 'true'\)/);
 assert.match(script,/button\.setAttribute\('aria-expanded', 'false'\)/);
 assert.match(script,/motionReduced\(\)/);
});

test("briefing navigation communicates destinations without misleading labels",()=>{
 const dialog=brief.match(/<div aria-hidden="true" aria-modal="true"[\s\S]*?<\/div><main id="conteudo">/)?.[0];
 assert(dialog,"briefing menu not found");
 assert.match(dialog,/href="\/aerocore\/winf-select\/">WINF SELECT™/);
 assert.match(dialog,/href="\/aerocore\/neoskin\/">NEOSKIN™ PPF/);
 assert.match(dialog,/href="\/winf-home\/">SOBRE A WINF/);
 assert.doesNotMatch(dialog,/Dealer Locator|ABOUT US|>PPF<\/a>/);
});

test("Partners homepage links to real briefing models, not itself",()=>{
 const main=partners.slice(partners.indexOf("<header"),partners.indexOf("<footer"));
 assert(!main.includes('href="https://winf.com.br/partners"'));
 assert.match(main,/href="\/briefing\/"/);
 assert.match(main,/href="\/briefing\/#licensing-plans"/);
 assert.match(brief,/id="licensing-plans"/);
 assert.doesNotMatch(main,/Acessar WINF OS Terminal/);
 assert.doesNotMatch(main,/Conhecer a Expansão OS/);
 assert.match(main,/Conhecer a Expansão/);
});

test("header uses official WINF logo and keeps the AeroCore brand intact",()=>{
 assert.match(partners,/src="\/winf-logo\.svg" class="winf-partners-logo"/);
 assert(fs.existsSync(path.join(root,"winf-logo.svg")));
 assert.match(css,/\.winf-partners-logo/);
});

test("styles are responsive, scoped and respect reduced motion",()=>{
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/:focus-visible/);
 assert.doesNotMatch(css,/#D4AF37|#F2D272/i);
});


test("briefing and Partners share abstract logo-free hero media",()=>{
 const motion=read("briefing/clean-hero-animation.css");
 for(const [name,html] of [["briefing",brief],["Partners",partners]]){
  assert.match(html,/class="wb-clean-motion" aria-hidden="true"/,name);
  assert.match(html,/\/briefing\/clean-hero-animation\.css\?v=20261106-logo-free-1/,name);
 }
 assert.doesNotMatch(partners,/id="briefing-background-video"/);
 assert.doesNotMatch(partners,/\/briefing\/media\/briefing-bg\.mp4/);
 assert.doesNotMatch(motion,/url\(/);
 assert.match(motion,/prefers-reduced-motion/);
});

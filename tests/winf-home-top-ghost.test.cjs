"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
test("GHOST superior e menu de tracinhos sao botoes independentes",()=>{
  const home=read("index.html");
  const header=home.match(/<header class="winf-home-header[\s\S]*?<\/header>/)?.[0]||"";
  const panel=home.match(/<aside id="winf-home-ghost-panel"[\s\S]*?<\/aside>/)?.[0]||"";
  const js=read("script.js");
  assert.match(header,/id="winf-home-top-ghost"/);
  assert.match(header,/aria-controls="winf-home-ghost-panel" aria-expanded="false"/);
  assert.match(header,/data-action="open-menu"/);
  assert.equal((header.match(/ghost-symbol\.png/g)||[]).length,1);
  assert.match(panel,/hidden>/);
  for(const href of ["/","/aerocore/winf-select/","/aerocore/","/aerocore/neoskin/","/aerocore/ceramic-armoring/","/partners/","/redes/?origem=%2F","/aerocore/onde-comprar/"]){
    assert.ok(panel.includes('href="'+href+'"'),"Missing Ghost shortcut: "+href);
  }
  assert.match(js,/getElementById\('winf-home-top-ghost'\)/);
  assert.match(js,/getElementById\('winf-home-ghost-panel'\)/);
  assert.match(js,/setTopGhostOpen\(Boolean\(topGhostPanel\?\.hidden\)\)/);
  assert.match(js,/setTopGhostOpen\(false\);/);
  assert.match(js,/data-winf-home-ghost-close/);
  assert.match(js,/event.key === 'Escape'/);
  new vm.Script(js);
});
test("WhatsApp unico continua e Ghost antigo e ocultado em cache",()=>{
  const q=read("js/winf-quick-contact.js");
  const c=read("css/winf-home-header.css");
  assert.match(q,/const topGhostManagedHere = Boolean\(headerGhost && document.getElementById\('winf-home-ghost-panel'\)\)/);
  assert.match(q,/if\(headerGhost && !topGhostManagedHere\)triggers.push\(headerGhost\)/);
  assert.match(q,/headerGhost \? '' : '<div class="wqc-item">/);
  assert.match(q,/wqc-whatsapp/);
  assert.match(c,/#winf-home-ghost-panel\[hidden\]/);
  assert.match(c,/body:has\(#winf-home-top-ghost\) #winf-quick-contact/);
  assert.match(read("js/winf-footer.js"),/20261127-top-ghost-direct-2/);
  assert.match(read("index.html"),/script\.js\?v=20261127-top-ghost-direct-2/);
  new vm.Script(q);
});

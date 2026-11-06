"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const home=read("index.html");
const brief=read("briefing/index.html");
const partners=read("partners/index.html");
const partnerJs=read("partners/partners.js");

test("homepage sends potential investors to active briefing instead of circular landing",()=>{
 assert(!home.includes('href="/partners/"'));
 assert.match(home,/href="\/briefing\/">Conhecer WINF Partners™/);
 assert.match(home,/id="expansao-winf"/);
 assert.match(home,/id="expansao-title"/);
 assert.match(home,/WINF PARTNERS™ \/ EXPANSÃO TERRITORIAL/);
 assert(fs.existsSync(path.join(root,"briefing/index.html")));
});
test("corporate landing avoids unsupported nationwide/24h claims",()=>{
 assert(!home.includes("Licenciados em todo o Brasil · Atendimento via WhatsApp 24h"));
 assert.match(home,/Consulte a disponibilidade em sua cidade/);
});
test("Partners gateway does not direct investor to itself or suggest fake OS activation",()=>{
 assert(!partners.includes('href="https://winf.com.br/partners"'));
 assert.match(partners,/href="\/briefing\/"/);
 assert.match(partners,/href="\/briefing\/#licensing-plans"/);
 assert.match(partners,/Conhecer modelos/);
 assert.match(partners,/Consultar Modalidades/);
 assert(!partners.includes("Acessar WINF OS Terminal"));
});
test("investment options and potential industrial partners can reach appropriate contact form",()=>{
 assert.match(brief,/Investidores e parceiros industriais/);
 assert.match(brief,/data-model="Investimento societário \/ parceria estratégica"/);
 assert.match(brief,/data-model="Parceria industrial \/ importação"/);
 assert.match(brief,/<option>Investimento societário \/ parceria estratégica<\/option>/);
 assert.match(brief,/<option>Parceria industrial \/ importação<\/option>/);
 assert.match(brief,/id="partners-form"/);
 assert.match(brief,/id="contact"/);
 assert.match(partnerJs,/querySelectorAll\('\[data-model\]'\)/);
 assert.match(partnerJs,/model\.value = link\.dataset\.model/);
});
test("license pricing and conservative financial claims stay consistent",()=>{
 assert.match(brief,/R\$ 15\.000/);
 assert.match(brief,/R\$ 95\.000/);
 assert.match(brief,/R\$ 250\.000/);
 assert.match(brief,/<small>A partir de<\/small> R\$ 95\.000/);
 assert.match(brief,/45 metros lineares/);
 assert.match(brief,/Não há promessa de faturamento, margem, retorno ou prazo de recuperação do investimento/);
});
test("no unverified certified-lab claims or status misrepresentation",()=>{
 assert(!brief.includes("laboratórios certificados"));
 assert(!brief.includes("Aja como um Rei"));
 assert.match(brief,/Solicitar conversa/);
 assert.match(brief,/não representa aprovação, ativação ou contratação/);
});
test("no duplicate static HTML ids in changed pages",()=>{
 for(const [path,html] of [["index.html",home],["briefing/index.html",brief],["partners/index.html",partners]]){
  const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
  const ids=[...markup.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size,ids.length,path);
 }
});


test("WhatsApp and social shares present the WINF Partners investment/industrial context accurately",()=>{
 assert.match(brief,/property="og:title"/);
 assert.match(brief,/WINF Partners™ — Expansão e parcerias estratégicas/);
 assert.match(brief,/oportunidades de parceria industrial e empresarial/);
 assert.match(brief,/WINF Partners — arquitetura e expansão territorial/);
 assert(!brief.includes("cena do vídeo original"));
 assert.match(home,/WINF Partners™/);
 assert(fs.existsSync(path.join(root,"partners/media/hero-poster.webp")));
 assert(fs.existsSync(path.join(root,"images/og/og-winf-select.png")));
});

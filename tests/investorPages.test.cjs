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

test("a página principal mantém gateway Partners e apresentação completa como destinos reais",()=>{
 assert.match(home,/href="\/partners\/"/);
 assert.match(home,/href="\/briefing\/">Conhecer WINF Partners™/);
 assert.match(home,/id="expansao-winf"/);
 assert.match(home,/id="expansao-title"/);
 assert.match(home,/WINF PARTNERS™ \/ EXPANSÃO TERRITORIAL/);
 assert(fs.existsSync(path.join(root,"partners/index.html")));
 assert(fs.existsSync(path.join(root,"briefing/index.html")));
});
test("a home não promete cobertura nacional ou WhatsApp 24 horas sem validação",()=>{
 assert(!home.includes("Licenciados em todo o Brasil · Atendimento via WhatsApp 24h"));
 assert.match(home,/Consulte a disponibilidade em sua cidade/);
});
test("o gateway de expansão encaminha ao briefing e à central, sem simular ativação WINF OS",()=>{
 assert(!partners.includes('href="https://winf.com.br/partners"'));
 assert.match(partners,/href="\/briefing\/"/);
 assert.match(partners,/href="#asset-light"/);
 assert.match(partners,/CONHECER O LICENCIAMENTO/);
 assert.match(partners,/Consultar território/);
 assert.match(partners,/https:\/\/wa\.me\/5513981113001/);
 assert(!partners.includes("Acessar WINF OS Terminal"));
});
test("as frentes de investimento e importação possuem canais de contato separados",()=>{
 assert.match(brief,/Investidores e parceiros industriais/);
 assert.match(brief,/Conversar sobre investimento/);
 assert.match(brief,/Propor parceria industrial/);
 assert.match(brief,/conversar%20sobre%20investimento%20ou%20parceria%20estrat/);
 assert.match(brief,/parceria%20industrial%20ou%20de%20importa/);
 assert.match(brief,/target="_blank" rel="noopener noreferrer"/);
});
test("preços do licenciamento e limites de previsão financeira continuam coerentes",()=>{
 assert.match(brief,/R\$ 15\.000/);
 assert.match(brief,/R\$ 95\.000/);
 assert.match(brief,/R\$ 250\.000/);
 assert.match(brief,/<small>A partir de<\/small> R\$ 95\.000/);
 assert.match(brief,/Composição do kit apresentada na proposta de adesão/);
 assert.match(brief,/Não há promessa de faturamento, margem, retorno ou prazo de recuperação do investimento/);
});
test("o briefing não atribui certificações e aprovações automáticas",()=>{
 assert(!brief.includes("laboratórios certificados"));
 assert(!brief.includes("Aja como um Rei"));
 assert.match(brief,/Condições e eventual participação societária dependem de negociação, documentação e análise das partes/);
 assert.match(brief,/Conversar sobre investimento/);
});
test("páginas institucionais possuem IDs estáticos únicos",()=>{
 for(const [page,html] of [["index.html",home],["briefing/index.html",brief],["partners/index.html",partners]]){
  const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"");
  const ids=[...markup.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
  assert.equal(new Set(ids).size,ids.length,page);
 }
});

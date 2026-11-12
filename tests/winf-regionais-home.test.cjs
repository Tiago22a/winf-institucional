"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"css/winf-active-territories.css"),"utf8");
const section=html.split('<section id="unidades-ativas"')[1]?.split("</section>")[0]||"";
const cards=[...html.matchAll(/<article class="winf-active-card" data-territory="([^"]+)"[\s\S]*?<\/article>/g)];
const byName=Object.fromEntries(cards.map(m=>[m[1],m[0]]));
test("Rede territorial exibe sete sites existentes, uma vez cada",()=>{
 assert.equal(cards.length,7);
 assert.deepEqual(Object.keys(byName).sort(),["santos","praia-grande","guaruja","sorocaba","pilar-do-sul","cuiaba","campina-grande"].sort());
 const urls=[
 "/pelicula-de-controle-solar-santos-sp/",
 "/pelicula-de-controle-solar-praia-grande-sp/",
 "/pelicula-de-controle-solar-guaruja-sp/",
 "/insulfilm-residencial-sorocaba-sp/",
 "/pelicula-de-controle-solar-pilar-do-sul-sp/",
 "/pelicula-de-controle-solar-cuiaba-mt/",
 "/pelicula-de-controle-solar-campina-grande-pb/"
 ];
 for(const url of urls){assert.ok(html.includes('href="'+url+'"'),url);assert.ok(fs.existsSync(path.join(root,url.slice(1),"index.html")),url)}
});
test("Atendimento das regionais 013 e 015 não se mistura",()=>{
 for(const city of ["santos","guaruja","praia-grande"]){assert.match(byName[city],/wa\.me\/5513981113001\?text=/,city);assert.doesNotMatch(byName[city],/5515997909049/,city)}
 for(const city of ["sorocaba","pilar-do-sul"]){assert.match(byName[city],/wa\.me\/5515997909049\?text=/,city);assert.doesNotMatch(byName[city],/5513981113001/,city)}
});
test("Home preserva links a serviços e identifica as regiões",()=>{
 assert.ok(html.includes('id="winf-active-cards"'));
 for(const id of ["winf-region-013","winf-region-015","winf-region-outros"])assert.ok(html.includes('id="'+id+'"'),id);
 for(const slug of ["sacadas-varandas","privacidade","janelas-residenciais"]){
 const url="/pelicula-de-controle-solar-santos-sp/"+slug+"/";
 assert.ok(byName.santos.includes(url));assert.ok(fs.existsSync(path.join(root,url.slice(1),"index.html")));
 }
 assert.match(css,/\.winf-active-region-head/);
 assert.match(css,/\.winf-active-pipeline/);
});
test("DDD 015 anuncia 47 cidades em planejamento sem links inventados",()=>{
 const tags=html.match(/<details class="winf-active-pipeline">([\s\S]*?)<\/details>/)?.[1];
 assert.ok(tags);
 assert.equal((tags.match(/<li\b/g)||[]).length,47);
 for(const city of ["Itapetininga","Votorantim","Araçoiaba da Serra","Salto de Pirapora","Piedade"])assert.ok(tags.includes(city),city);
 assert.match(tags,/Ainda não há página local publicada/);
 assert.doesNotMatch(tags,/<a\s/i);
});

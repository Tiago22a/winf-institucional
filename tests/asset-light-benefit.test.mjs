import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const file=(name)=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const briefing=file("briefing/index.html");
const asset=file("briefing/asset-light/index.html");
const partners=file("partners/index.html");

for(const [name,html] of [["Briefing",briefing],["Asset Light",asset],["Partners",partners]]){
 test(name+" explica benefício de 45 metros lineares OU WINFCOIN™",()=>{
  assert.match(html,/45 metros lineares/i);
  assert.match(html,/WINFCOIN™/);
  assert.match(html,/equivalente/i);
  assert.doesNotMatch(html,/90 metros lineares de películas arquitetônicas no kit inicial/i);
 });
}
test("Briefing mantém composição de 15 m para as três linhas",()=>{
 for(const product of ["DualReflect","BlackPro","Invisible"])assert.match(briefing,new RegExp("15 m[^<]{0,100}WINF "+product+"™","i"));
 assert.match(briefing,/não se soma ao kit físico/);
 assert.match(briefing,/valor e a ativação dessa opção dependem/);
});
test("Página individual não promete WINFCOIN já disponível",()=>{
 assert.match(asset,/quando homologad[oa]/i);
 assert.match(asset,/não se acumulam/i);
 assert.match(asset,/não há valor de crédito publicado/i);
});
test("Partners envia para página detalhada e explica escolha única",()=>{
 assert.match(partners,/href="\/briefing\/asset-light\/"/);
 assert.match(partners,/uma única modalidade por licença/);
 assert.match(partners,/sem acumular as opções/);
});

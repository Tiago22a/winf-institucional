import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(resolve(base,path),'utf8');
test('mandato executivo preserva rádio gratuita e fontes de verdade',()=>{
 const doc=read('DIRECAO_EXECUTIVA_PRODUCAO.md');
 assert.match(doc,/sem login, assinatura nem e-mail/);
 for(const id of Array.from({length:10},(_,i)=>'SW-'+String(i+1).padStart(2,'0')))assert.ok(doc.includes(id),id);
 assert.match(doc,/não aparecem como gravados/);
 assert.match(doc,/Sem chaves reais no GitHub/);
});
test('episódio 03 é roteiro em revisão e não anúncio de áudio publicado',()=>{
 const ep=read('podcasts/temporada-01/ep03-invisivel.md');
 const catalog=read('podcast-catalog.js');
 assert.match(ep,/áudio não gravado/);
 assert.match(ep,/DAVI/);assert.match(ep,/LIA/);
 assert.match(ep,/vozes sintéticas/);
 assert.match(ep,/tensões térmicas/);
 assert.match(catalog,/id:'ep03-invisivel'/);
 assert.match(catalog,/status:'scripted'/);
 assert.doesNotMatch(catalog,/status:'published'/);
 assert.doesNotMatch(ep,/audioUrl:\s*['"]/);
});

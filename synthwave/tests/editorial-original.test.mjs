import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
test('roteiro original de episódio 02 ainda não é apresentado como áudio lançado',()=>{
 const ep=read('podcasts/temporada-01/ep02-padrinho.md');
 const catalog=read('podcast-catalog.js');
 assert.match(ep,/áudio não gravado/);
 assert.match(ep,/vozes sintéticas/);
 assert.match(ep,/não constitui oferta de investimento/);
 assert.match(catalog,/id:'ep02-padrinho'/);
 assert.match(catalog,/status:'planned'/);
 assert.doesNotMatch(ep,/https:\/\/.*\.mp3/);
});
test('cada coleção tem descrição e chamada editorial sem fingir lançamento musical',()=>{
 const text=read('COLECOES_COPYS_ORIGINAIS.md');
 for(const title of ['FOCO','ESTRADA','DEPOIS DAS 20H','REFÚGIO','ENCONTRO','CRIAR','COMEÇO DE DIA','PAUSA'])assert.ok(text.includes('## '+['FOCO','ESTRADA','DEPOIS DAS 20H','REFÚGIO','ENCONTRO','CRIAR','COMEÇO DE DIA','PAUSA'].indexOf(title)+1+'. '+title));
 assert.match(text,/Não anunciar novas músicas ou episódios como disponíveis/);
});

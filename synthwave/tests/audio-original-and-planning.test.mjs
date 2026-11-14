import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
test('quatro MP3 originais têm arquivos reais, e URLs apontam ao lugar correto',()=>{
 const window={};
 new Function('window',read('original-audio.js'))(window);
 const tracks=window.SYNTHWAVE_ORIGINAL_TRACKS;
 assert.equal(tracks.length,4);
 assert.equal(new Set(tracks.map(x=>x.id)).size,4);
 for(const t of tracks){
   assert.match(t.audioUrl,/^\/synthwave\/audio\/original\/[a-z0-9-]+\.mp3$/);
   assert.equal(t.duration,42);
   assert.equal(t.licenseLabel,'Autoral SynthWAVE');
   const file=resolve(root,'..',t.audioUrl.slice(1));
   assert.ok(statSync(file).size>20000,t.audioUrl);
   const head=readFileSync(file).subarray(0,4);
   assert.ok(head.subarray(0,3).toString()==='ID3'||head[0]===255,'invalid MP3 header '+file);
 }
});
test('rádio carrega os instrumentais antes do app e mantém streaming gratuito',()=>{
 const html=read('radio/index.html'),app=read('app.js');
 assert.ok(html.indexOf('original-audio.js')<html.indexOf('app.js'));
 assert.match(app,/window\.SYNTHWAVE_ORIGINAL_TRACKS\|\|\[\]/);
 assert.match(app,/button\('▶ OUVIR AGORA',"startRadio\(\)"\)/);
 assert.ok(!html.includes('SYNTHWAVE PREMIUM'));
 assert.ok(!html.includes('newsletter/newsletter.js'));
 for(const id of ['study','work','travel','love','relax','sleep','create','train'])assert.ok(app.includes("id:'"+id+"'"));
 for(const index of [13,14,15,16])assert.ok(app.includes('['+index+',')||app.includes(','+index+','));
});
test('plano das 12 semanas e oito episódios não confundem áudio com roteiro',()=>{
 const editorial=read('PLANO_COMPLETO_CONTEUDOS_12_CICLOS.md');
 const briefs=read('podcasts/temporada-01/BRIEFINGS_04_A_08.md');
 for(let i=1;i<=12;i++)assert.ok(editorial.includes('| '+String(i).padStart(2,'0')+' |'),'cycle '+i);
 for(let i=4;i<=8;i++)assert.ok(briefs.includes('## EP0'+i),'episode '+i);
 assert.match(editorial,/Não exigir conta, WhatsApp, e-mail ou cartão/i);
 assert.match(editorial,/sem áudio/);
 assert.match(briefs,/Nenhum dos episódios abaixo tem áudio/);
});

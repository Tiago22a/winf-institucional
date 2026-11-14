import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const dir=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>readFileSync(resolve(dir,file),'utf8');

test('scripts principais da FM têm sintaxe válida',()=>{
 for(const file of ['app.js','my-playlists.js','audio-engine.js','cloud-auth.js','newsletter/newsletter.js']){
  assert.doesNotThrow(()=>new Function(read(file)),file);
 }
 const worker=read('backend/worker.js').replace('export default {','const worker = {');
 assert.doesNotThrow(()=>new Function(worker));
});

test('configurações pessoais permanecem desligadas até provisionamento seguro',()=>{
 const firebase=JSON.parse(read('firebase-public-config.json'));
 const newsletter=JSON.parse(read('newsletter/config.json'));
 assert.equal(firebase.enabled,false);
 assert.equal(newsletter.enabled,false);
 const html=read('radio/index.html');
 assert.ok(html.indexOf('cloud-auth.js')<html.indexOf('my-playlists.js'));
 assert.ok(html.indexOf('my-playlists.js')<html.indexOf('app.js'));
 assert.ok(html.includes('sw-newsletter-mount'));
 assert.ok(html.includes('newsletter/newsletter.js'));
});

test('músicas reais do catálogo contêm autoria, arquivo e licença explícitos',()=>{
 const win={};
 new Function('window',read('music-library.js'))(win);
 assert.equal(win.SYNTHWAVE_LICENSED_TRACKS.length,5);
 for(const track of win.SYNTHWAVE_LICENSED_TRACKS){
  assert.ok(track.title&&track.artist&&track.audioUrl&&track.sourceUrl);
  assert.ok(track.licenseLabel&&track.licenseUrl);
  assert.ok(/^https:\/\//.test(track.audioUrl));
 }
});

test('listas privadas são editáveis localmente mesmo sem Firebase',()=>{
 const win={addEventListener(){}};
 const storage={getItem:()=>null,setItem(){}};
 const doc={getElementById:()=>null};
 new Function('window','localStorage','document',read('my-playlists.js'))(win,storage,doc);
 const markup=win.SynthwaveLists.render([{id:'t1',title:'Música demonstrativa',artist:'Autoria testada'}]);
 assert.ok(markup.includes('Favoritas'));
 assert.ok(markup.includes('Criar playlist'));
 assert.ok(markup.includes('Conta Google em preparação')===false);
});

test('ponte Firebase desativada não permite nem simula login',async()=>{
 const win={dispatchEvent(){}};
 class EventMock{constructor(type,options){this.type=type;this.detail=options.detail}}
 const fetchMock=async()=>({ok:true,json:async()=>({enabled:false})});
 new Function('window','fetch','CustomEvent',read('cloud-auth.js'))(win,fetchMock,EventMock);
 await Promise.resolve();
 await Promise.resolve();
 await Promise.resolve();
 assert.equal(win.SynthwaveCloud.snapshot().status,'unconfigured');
 await assert.rejects(()=>win.SynthwaveCloud.login());
});

test('API de newsletter recusa spam e grava somente opt-in validado',async()=>{
 const code=read('backend/worker.js').replace('export default {','const handler = {')+'\nreturn handler;';
 const verification=async()=>new Response(JSON.stringify({success:true}),{status:200,headers:{'Content-Type':'application/json'}});
 const handler=new Function('fetch',code)(verification);
 const writes=[];
 const env={
  ALLOWED_ORIGINS:'https://winf.com.br,https://www.winf.com.br',
  TURNSTILE_SECRET:'test-only',
  CONSENT_VERSION:'synthwave-newsletter-v1',
  DB:{prepare(sql){return {bind(...values){return {run:async()=>writes.push(values)}}}}}
 };
 const data={name:'Ouvinte Exemplo',phone:'(13) 98111-3001',consent:true,
  consentVersion:'synthwave-newsletter-v1',turnstileToken:'token-mock-valid'};
 const request=(value,origin='https://winf.com.br')=>new Request('https://api.winf.com.br/synthwave/newsletter',{
  method:'POST',headers:{'Content-Type':'application/json','Origin':origin},
  body:JSON.stringify(value)
 });
 assert.equal((await handler.fetch(request(data,'https://malicioso.example'),env)).status,403);
 assert.equal((await handler.fetch(request({...data,consent:false}),env)).status,400);
 assert.equal((await handler.fetch(request({...data,phone:'123'}),env)).status,400);
 assert.equal(writes.length,0);
 assert.equal((await handler.fetch(request(data),env)).status,201);
 assert.equal(writes.length,1);
 assert.equal(writes[0][0],'+5513981113001');
});

test('regras de acesso restringem playlists ao UID autenticado',()=>{
 const rules=read('firestore-rules.fragment.rules');
 assert.ok(rules.includes('request.auth.uid == uid'));
 assert.ok(rules.includes('allow get, list: if own()'));
 assert.ok(rules.includes('allow create, update: if own()'));
 assert.ok(!rules.includes('allow read, write: if true'));
});

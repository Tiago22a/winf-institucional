import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const dir=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>readFileSync(resolve(dir,file),'utf8');

test('scripts principais da FM têm sintaxe válida',()=>{
 for(const file of ['app.js','my-playlists.js','audio-engine.js','station-programming.js','experiencias/voice-player.js','experiencias/audio-preview-catalog.js','cloud-auth.js','newsletter/newsletter.js',...['e01-cinco-sons','e02-fotografia-gaveta','e03-janela-mundo','e04-plano-mudou','e05-estrada-silencio','e06-maquina-pergunta'].map(id=>'experiencias/volume-01/'+id+'.js'),...['after-hours','first-light','focus-frequency','creative-current','city-drive','night-glow'].map(id=>'experiencias/capsulas/'+id+'.js')]){
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
 assert.ok(!html.includes('sw-newsletter-mount'));
 assert.ok(!html.includes('newsletter/newsletter.js'));
 assert.ok(!html.includes('id="modal"'));
 assert.ok(!html.includes('SYNTHWAVE PREMIUM'));
});

test('músicas reais do catálogo contêm autoria, arquivo e licença explícitos',()=>{
 const win={};
 new Function('window',read('music-library.js'))(win);
 assert.equal(win.SYNTHWAVE_LICENSED_TRACKS.length,7);
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

test('catálogo editorial bloqueia episódios publicados sem áudio, transcrição e direitos',()=>{
 const win={};
 new Function('window',read('podcast-catalog.js'))(win);
 const items=win.SYNTHWAVE_PODCAST_CATALOG;
 assert.equal(items.length,8);
 assert.equal(items.filter(x=>x.status==='scripted').length,8);
 assert.equal(items.filter(x=>x.status==='published').length,0);
 assert.ok(items.every(win.SynthwaveEditorial.validEpisode));
 const first=items[0];
 assert.equal(win.SynthwaveEditorial.validEpisode({...first,status:'published',audioUrl:'https://audio.example/test.mp3'}),false);
 const {previewAudioUrl: _previewOnly, ...approvedFields}=first;
 assert.equal(win.SynthwaveEditorial.validEpisode({...approvedFields,status:'published',audioUrl:'https://audio.example/test.mp3',transcriptUrl:'/synthwave/transcricao/',rightsStatement:'Original autorizado',rightsApprovedAt:'2026-11-14',productionReviewedAt:'2026-11-14'}),true);
});
test('roteiro piloto pode ser lido sem fingir existir um áudio publicado',()=>{
 const page=read('podcasts/temporada-01/ep01-cuidar-conectar/index.html');
 assert.ok(page.includes('Prévia de roteiro — não é um episódio publicado'));
 assert.ok(page.includes('O áudio ainda não foi gravado'));
 assert.ok(page.includes('class="speaker lia"')&&page.includes('class="speaker davi"'));
 assert.ok(!page.includes('<audio'));
});
test('FM não expõe painel administrativo fictício e usa cores aprovadas',()=>{
 const app=read('app.js'),html=read('radio/index.html');
 assert.ok(!app.includes('function admin()'));
 assert.ok(!app.includes("profile:()=>window.SynthwaveProfile.render(),admin"));
 assert.ok(html.indexOf('podcast-catalog.js')<html.indexOf('app.js'));
 for(const content of [app,read('fm-features.css')]){
  assert.ok(!content.includes('#ff007f'));
  assert.ok(!content.includes('text-pink'));
 }
});


test('entrada SynthWAVE exige no máximo dois cliques, sem identidade ou newsletter',()=>{
 const landing=read('index.html');
 const radio=read('radio/index.html');
 const app=read('app.js');
 assert.ok(landing.includes('href="/synthwave/radio/#live"'), 'Primeiro clique deve abrir diretamente a tela da rádio');
 assert.ok(landing.includes('OUVIR AGORA · GRÁTIS'), 'CTA principal deve anunciar o acesso gratuito');
 assert.ok(radio.includes('data-nav="live"'), 'A rota de rádio deve existir');
 assert.ok(app.includes("location.hash.replace('#','')||'home'"), 'A rádio deve respeitar #live na primeira navegação');
 assert.ok(app.includes("button('▶ OUVIR AGORA',\"startRadio()\")"), 'Segundo clique inicia a reprodução');
 assert.ok(app.includes('function startRadio(){'));
 assert.ok(app.includes('window.SynthwaveStation.queueFor(tracks,stationBlock)'));
 assert.ok(!radio.includes('newsletter/newsletter.js'), 'Nenhum formulário de inscrição deve ser montado');
 assert.ok(!radio.includes('sw-newsletter-mount'));
 assert.ok(!radio.includes('id="modal"'), 'Sem janela Premium no caminho do Play');
 assert.ok(!app.includes('openPremium()'));
 assert.ok(!app.includes('closePremium()'));
});

test('conta pessoal é opcional e não aparece como requisito da rádio',()=>{
 const app=read('app.js');
 const cloud=read('cloud-auth.js');
 const playlists=read('my-playlists.js');
 assert.ok(app.includes('Grátis e sem cadastro.'), 'A rádio deve informar que é grátis e não exige conta');
 assert.ok(playlists.includes('CONTA OPCIONAL / GOOGLE'));
 assert.ok(cloud.includes('config.enabled!==true'));
 assert.ok(app.includes('start(true)'), 'O Play deve delegar diretamente à engine');
});

test('MVP: entrada grátis sem barreira de cadastro ou assinatura premium',()=>{
 const home=read('index.html'),radio=read('radio/index.html');
 assert.match(home,/OUVIR AGORA · GRÁTIS/);
 assert.match(home,/href="\/synthwave\/radio\/#live"/);
 assert.doesNotMatch(radio,/SYNTHWAVE PREMIUM/);
 assert.match(radio,/rádio de reprodução contínua/i);
 assert.equal(JSON.parse(read('firebase-public-config.json')).enabled,false);
 assert.equal(JSON.parse(read('newsletter/config.json')).enabled,false);
 const editorial=read('PLANO_EDITORIAL_LANCAMENTO.md');
 assert.match(editorial,/GHOST SHOP™/);
 assert.match(editorial,/Não exigir e-mail para ouvir/);
});

test('duas faixas novas têm créditos e URLs verificáveis do Wikimedia Commons',()=>{
 const win={};new Function('window',read('music-library.js'))(win);
 const tracks=win.SYNTHWAVE_LICENSED_TRACKS;
 assert.equal(new Set(tracks.map(t=>t.id)).size,7);
 for(const id of ['licensed-gonna-be-gone','licensed-in-the-desert']){
  const track=tracks.find(t=>t.id===id);
  assert.ok(track);assert.equal(track.artist,'Kjartan Abel');
  assert.equal(track.licenseLabel,'CC BY-SA 4.0');
  assert.ok(track.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert.ok(track.audioUrl.startsWith('https://upload.wikimedia.org/wikipedia/commons/'));
  assert.ok(read('MUSIC_CREDITS.md').includes(track.sourceUrl));
 }
});
test('podcasts 2 e 3 existem apenas em modo roteiro com prévia de leitura, sem áudio fictício',()=>{
 const win={};new Function('window',read('podcast-catalog.js'))(win);
 for(const id of ['ep02-padrinho','ep03-invisivel']){
  const episode=win.SYNTHWAVE_PODCAST_CATALOG.find(p=>p.id===id);
  assert.equal(episode.status,'scripted');
  assert.ok(episode.scriptUrl.startsWith('/synthwave/podcasts/temporada-01/'));
  const html=read('podcasts/temporada-01/'+id+'/index.html');
  assert.match(html,/Prévia de roteiro — não é um episódio publicado/);
  assert.match(html,/O áudio ainda não foi gravado/);
  assert.doesNotMatch(html,/<audio|<iframe/i);
  assert.match(html,/LIA/);assert.match(html,/DAVI/);
 }
});

test('pipeline de áudio usa somente roteiros originais e três identidades de episódio',()=>{
 const render=read('production/render_audio.py');
 const workflow=read('../.github/workflows/synthwave-audio-render.yml');
 const preview=read('production/audio-preview.js');
 assert.match(render,/ep01-cuidar-conectar/);
 assert.match(render,/ep02-padrinho/);
 assert.match(render,/ep03-invisivel/);
 assert.match(render,/synthesize_wav/);
 assert.match(render,/PiperVoice/);
 assert.match(render,/original_synthesized_ambient/);
 assert.match(workflow,/upload-artifact@v4/);
 assert.match(preview,/method:'HEAD'/);
 assert.match(preview,/Content-Type/);
 for(const id of ['ep01-cuidar-conectar','ep02-padrinho','ep03-invisivel']){
  const html=read('podcasts/temporada-01/'+id+'/index.html');
  assert.match(html,/audio-preview\.js/);
  assert.match(html,/Prévia de roteiro|prévia editorial|roteiro original/i);
  assert.ok(!html.includes('<audio'), 'o player não pode aparecer sem MP3 disponível');
 }
});

test('grade 24 horas tem seis blocos contíguos cobrindo todas as horas locais',()=>{
 const win={};new Function('window',read('station-programming.js'))(win);
 const grade=win.SynthwaveStation;
 assert.equal(grade.blocks.length,6);
 assert.equal(grade.spots.length,36);
 assert.equal(grade.songsPerSpot,5);
 for(let hour=0;hour<24;hour++){
  const slot=grade.blockAt({getHours:()=>hour});
  assert.ok(slot.start<=hour&&hour<slot.end,'Hora sem grade: '+hour);
 }
 for(let i=1;i<grade.blocks.length;i++)assert.equal(grade.blocks[i-1].end,grade.blocks[i].start);
 assert.equal(grade.blocks[0].start,0);assert.equal(grade.blocks.at(-1).end,24);
});
test('sequência de músicas prioriza o horário sem repetir nem omitir faixas',()=>{
 const win={};new Function('window',read('station-programming.js'))(win);
 const items=[
  {category:'Focus',audioUrl:'/a.mp3'}, {category:'Drive',audioUrl:'/b.mp3'},
  {category:'Ambient',synthPreset:'deep_focus_lofi'}, {category:'Originals',audioUrl:'/c.mp3'},
  {category:'Drive',synthPreset:'cyber_drive'}
 ];
 const queue=win.SynthwaveStation.queueFor(items,win.SynthwaveStation.blockAt({getHours:()=>9}));
 assert.equal(queue.length,items.length);
 assert.equal(new Set(queue).size,items.length);
 assert.deepEqual([...queue].sort((a,b)=>a-b),[0,1,2,3,4]);
 assert.equal(queue[0],0);
});
test('vinheta a cada cinco músicas e fallback sem TTS, mantendo rádio aberta',()=>{
 const win={};new Function('window',read('station-programming.js'))(win);
 const radio=read('app.js'),markup=read('radio/index.html'),css=read('fm-features.css');
 const block=win.SynthwaveStation.blockAt({getHours:()=>17});
 for(const number of [0,1,2,3,4,6,7,8,9])assert.equal(win.SynthwaveStation.spotFor(number,block),null);
 for(const number of [5,10,15,20])assert.ok(win.SynthwaveStation.spotFor(number,block)?.text);
 assert.ok(win.SynthwaveStation.spots.every(s=>s.text.length>40));
 assert.ok(win.SynthwaveStation.spots.every(s=>s.text.length<380));
 assert.ok(radio.includes("function playStationSpot(){"));
 assert.ok(radio.includes("typeof window.SpeechSynthesisUtterance!=='function'"));
 assert.ok(radio.includes("if(radioMode&&playing)advanceRadioTrack()"));
 assert.ok(radio.includes("function next(automatic=false){"));
 assert.ok(radio.includes("next(true)"));
 assert.ok(markup.indexOf('station-programming.js')<markup.indexOf('app.js?v=20261114-18mp3-release2'));
 assert.ok(markup.includes('station-programming.js'));
 assert.ok(css.includes('.sw-program-timeline'));
 assert.ok(!radio.includes('window.open('));
});

test('SynthWAVE: oito roteiros preservados e cinco novas prévias condicionadas aos arquivos reais',()=>{
 const win={};new Function('window',read('podcast-catalog.js'))(win);
 const ids=['ep04-alem-da-pintura','ep05-recomeco','ep06-cidade','ep07-brasil','ep08-institute'];
 const player=read('production/audio-preview.js');
 const render=read('production/render_audio.py');
 for(const id of ids){
   const item=win.SYNTHWAVE_PODCAST_CATALOG.find(x=>x.id===id);
   assert.equal(item?.status,'scripted');
   assert.equal(item.scriptUrl,'/synthwave/podcasts/temporada-01/'+id+'/');
   assert.ok(render.includes('"'+id+'"'));
   assert.ok(player.includes("'"+id+"'"));
   const script=read('podcasts/temporada-01/'+id+'.md');
   const html=read('podcasts/temporada-01/'+id+'/index.html');
   assert.ok(script.split('**LIA:**').length>10,id+' LIA');
   assert.ok(script.split('**DAVI:**').length>10,id+' DAVI');
   assert.match(html,/Prévia de roteiro — não é um episódio publicado/);
   assert.ok(html.includes('data-audio-episode="'+id+'"'));
   assert.ok(!html.includes('<audio'),'não apresentar player sem arquivo verificado');
 }
 assert.equal(win.SYNTHWAVE_PODCAST_CATALOG.filter(x=>x.status==='published').length,0);
});

test('todos os oito podcasts têm MP3 de prévia real e player direto sem exigir login',()=>{
 const w={};new Function('window',read('podcast-catalog.js'))(w);
 const items=w.SYNTHWAVE_PODCAST_CATALOG;
 const app=read('app.js');
 assert.equal(items.length,8);
 assert.equal(items.filter(x=>x.status==='published').length,0);
 for(const p of items){
   assert.equal(p.status,'scripted');
   assert.ok(p.previewAudioUrl,'prévia ausente: '+p.id);
   assert.equal(p.previewAudioUrl,'/synthwave/podcasts/audio-previews/'+p.id+'-previa.mp3');
   assert.ok(w.SynthwaveEditorial.validEpisode(p));
   const manifest=JSON.parse(read('podcasts/audio-previews/'+p.id+'-manifest.json'));
   assert.equal(manifest.status,'audio_preview_unreviewed');
   assert.deepEqual(manifest.speakers,['LIA','DAVI']);
   assert.ok(manifest.durationSecondsApprox>120);
 }
 assert.match(app,/Prévia sonora · LIA e DAVI · em revisão/);
 assert.match(app,/const preview=p.status==='scripted'&&p.previewAudioUrl/);
 assert.match(app,/\+preview\+published\+/);
 assert.match(app,/Nenhuma edição final foi homologada ainda/);
});

test('Experiências volume 01: seis histórias originais completas em duas vozes',()=>{
 const win={};
 const files=['e01-cinco-sons','e02-fotografia-gaveta','e03-janela-mundo','e04-plano-mudou','e05-estrada-silencio','e06-maquina-pergunta'];
 for(const id of files)new Function('window',read('experiencias/volume-01/'+id+'.js'))(win);
 const items=win.SYNTHWAVE_EXPERIENCES;
 assert.equal(items.length,6);
 assert.equal(new Set(items.map(item=>item.id)).size,6);
 assert.deepEqual(items.map(e=>e.number),[1,2,3,4,5,6]);
 for(const item of items){
  assert.equal(item.status,'scripted');
  assert.ok(!item.audioUrl,'Roteiro sem áudio final não pode fingir estar publicado');
  assert.ok(item.title&&item.summary&&item.tagline&&item.category);
  assert.ok(item.chapters.length>=5,'Experiência precisa de atos distintos');
  const turns=item.chapters.flatMap(ch=>ch.lines);
  assert.ok(turns.length>=35,'Roteiro superficial: '+item.id);
  assert.ok(turns.some(t=>t[0]==='LIA'));
  assert.ok(turns.some(t=>t[0]==='DAVI'));
  assert.ok(turns.every(t=>['LIA','DAVI'].includes(t[0])&&t[1].length>=10));
  assert.ok(turns.filter(t=>t[1].length>=30).length>=Math.floor(turns.length*.9),'Roteiro precisa ter desenvolvimento, além de falas curtas de transição');
  assert.ok(item.chapters.every(ch=>ch.title&&ch.cue&&ch.lines.length>=5));
 }
});
test('A rádio exibe as experiências, permite narração local e preserva música livre',()=>{
 const radio=read('radio/index.html'),app=read('app.js'),tts=read('experiencias/voice-player.js');
 assert.ok(radio.includes('data-nav="experiences"'));
 assert.ok(app.includes('function experiencesView()'));
 assert.ok(app.includes('function openExperience(id)'));
 assert.ok(app.includes("experiences:experiencesView"));
 assert.ok(app.includes("function toggleExperienceVoice(id)"));
 assert.ok(app.includes("if(playing)pause()"),'A reprodução da rádio deve pausar durante a narração');
 assert.ok(tts.includes('global.SpeechSynthesisUtterance'));
 assert.ok(tts.includes('global.speechSynthesis'));
 assert.ok(tts.includes("turn.speaker==='LIA'"),'Vozes devem ter diferenciação de narração');
 assert.ok(radio.indexOf('experiencias/voice-player.js')<radio.indexOf('app.js?v=20261114-18mp3-release2'));
 assert.ok(!radio.includes('sw-newsletter-mount'));
 assert.ok(!radio.includes('newsletter/newsletter.js'));
});
test('Os seis programas não dependem de áudio hospedado nem de conta Google',()=>{
 const mock={};
 const doc={getElementById:()=>null,querySelectorAll:()=>[]};
 new Function('window','document',read('experiencias/voice-player.js'))(mock,doc);
 assert.equal(mock.SynthwaveExperiencesPlayer.available(),false);
 assert.equal(typeof mock.SynthwaveExperiencesPlayer.play,'function');
 assert.equal(typeof mock.SynthwaveExperiencesPlayer.stop,'function');
 assert.equal(mock.SynthwaveExperiencesPlayer.getState().active,false);
 const program=read('station-programming.js');
 assert.ok(program.includes("id:'spot-24'"));
 const w={};new Function('window',program)(w);
 assert.equal(w.SynthwaveStation.spots.length,36);
 assert.equal(new Set(w.SynthwaveStation.spots.map(x=>x.id)).size,36);
 assert.ok(w.SynthwaveStation.spots.every(x=>x.text.length>=50&&x.text.length<380));
});

test('Notas de Frequência inclui oito artigos originais acessíveis e links sem barreira de cadastro',()=>{
 const page=read('notas/index.html'),home=read('index.html'),radio=read('radio/index.html');
 const ids=['primeiro-play','paisagem-sonora','estrada-com-som','criatividade-rascunho','noite-sem-pressa','inteligencia-artificial-som','direitos-e-creditos','pessoas-por-tras-da-radio'];
 for(const id of ids){
   assert.ok(page.includes('id="'+id+'"'),'artigo ausente: '+id);
   assert.ok(page.includes('href="#'+id+'"'),'índice ausente: '+id);
 }
 assert.equal((page.match(/class="story" id=/g)||[]).length,8);
 assert.ok(page.includes('href="/synthwave/radio/#live"'));
 assert.ok(home.includes('href="/synthwave/notas/"'));
 assert.ok(radio.includes('href="/synthwave/notas/"'));
 assert.doesNotMatch(page,/<form|type="email"|data-paywall/i);
 assert.match(page,/Conteúdo editorial original/);
});

test('Cápsulas volume 02: 12 programas, 36 atos, 180 falas, dois locutores',()=>{
 const win={};
 const slots=['after-hours','first-light','focus-frequency','creative-current','city-drive','night-glow'];
 for(const slot of slots)new Function('window',read('experiencias/capsulas/'+slot+'.js'))(win);
 const capsules=win.SYNTHWAVE_EXPERIENCES;
 assert.equal(capsules.length,12);
 assert.equal(new Set(capsules.map(e=>e.id)).size,12);
 assert.deepEqual(capsules.map(e=>e.number),[7,8,9,10,11,12,13,14,15,16,17,18]);
 assert.equal(capsules.reduce((sum,e)=>sum+e.chapters.length,0),36);
 assert.equal(capsules.reduce((sum,e)=>sum+e.chapters.flatMap(c=>c.lines).length,0),180);
 const requiredSlots=['AFTER HOURS','FIRST LIGHT','FOCUS FREQUENCY','CREATIVE CURRENT','CITY DRIVE','NIGHT GLOW'];
 for(const slot of requiredSlots)assert.equal(capsules.filter(e=>e.slot===slot).length,2,slot);
 for(const capsule of capsules){
  assert.equal(capsule.format,'capsule');
  assert.equal(capsule.status,'scripted');
  assert.ok(!capsule.audioUrl);
  assert.ok(capsule.title&&capsule.tagline&&capsule.summary&&capsule.category);
  assert.equal(capsule.chapters.length,3);
  const turns=capsule.chapters.flatMap(ch=>ch.lines);
  assert.equal(turns.length,15);
  assert.ok(turns.every(t=>['LIA','DAVI'].includes(t[0])&&t[1].length>=24));
  assert.ok(turns.some(t=>t[0]==='LIA')&&turns.some(t=>t[0]==='DAVI'));
  assert.ok(capsule.chapters.every(ch=>ch.title&&ch.cue&&ch.lines.length===5));
 }
});
test('As 12 vinhetas de cápsulas respeitam o horário e não mudam a frequência de inserção',()=>{
 const w={};new Function('window',read('station-programming.js'))(w);
 const radio=w.SynthwaveStation;
 assert.equal(radio.spots.length,36);
 assert.equal(radio.spots.filter(spot=>spot.kind==='capsula').length,12);
 assert.equal(radio.songsPerSpot,5);
 for(const slot of radio.blocks){
  const first=radio.spotFor(15,slot),second=radio.spotFor(30,slot);
  assert.equal(first.kind,'capsula');
  assert.equal(second.kind,'capsula');
  assert.equal(first.slot,slot.label);
  assert.equal(second.slot,slot.label);
  assert.notEqual(first.id,second.id);
  assert.equal(radio.spotFor(14,slot),null);
  assert.ok(radio.spotFor(5,slot));
 }
});
test('A aba Experiências separa volume longo e cápsulas por horário sem bloquear o Play',()=>{
 const radio=read('radio/index.html'),app=read('app.js'),home=read('index.html');
 assert.ok(app.includes("format==='capsule'"));
 assert.ok(app.includes('Doze histórias. Seis momentos do dia.'));
 assert.ok(app.includes('Seis histórias para ficar um pouco mais.'));
 assert.ok(app.includes("capsules.filter(e=>e.slot===slot.label)"));
 assert.ok(radio.includes('data-nav="experiences"'));
 assert.ok(radio.includes('experiencias/capsulas/after-hours.js'));
 assert.ok(radio.includes('experiencias/capsulas/night-glow.js'));
 assert.ok(radio.indexOf('experiencias/capsulas/night-glow.js')<radio.indexOf('experiencias/voice-player.js'));
 assert.ok(radio.indexOf('experiencias/voice-player.js')<radio.indexOf('app.js?v=20261114-18mp3-release2'));
 assert.ok(home.includes('href="/synthwave/radio/#live"'), 'Play direto preservado');
 assert.doesNotMatch(radio,/newsletter\/newsletter\.js|sw-newsletter-mount|data-required-login/i);
});


test('prévia de 18 experiências só é exibida após geração real e validação',()=>{
 const radio=read('radio/index.html'),app=read('app.js'),source=read('experiencias/audio-preview-catalog.js');
 const scripts=['after-hours','first-light','focus-frequency','creative-current','city-drive','night-glow'];
 const original=['e01-cinco-sons','e02-fotografia-gaveta','e03-janela-mundo','e04-plano-mudou','e05-estrada-silencio','e06-maquina-pergunta'];
 const win={};new Function('window',source)(win);
 const files=Object.entries(win.SYNTHWAVE_EXPERIENCE_AUDIO||{});
 assert.ok(files.length===0||files.length===18, 'Catálogo não pode ser parcialmente publicado');
 const ids=[];
 for(const id of original)ids.push(id);
 for(const slot of scripts){
  const x={};new Function('window',read('experiencias/capsulas/'+slot+'.js'))(x);
  ids.push(...x.SYNTHWAVE_EXPERIENCES.map(y=>y.id));
 }
 assert.equal(new Set(ids).size,18);
 for(const [id,entry] of files){
  assert.ok(ids.includes(id));
  assert.equal(entry.status,'audio_preview_unreviewed');
  assert.equal(entry.audioUrl,'/synthwave/experiencias/audio-previews/'+id+'-previa.mp3');
  assert.match(entry.sha256,/^[0-9a-f]{64}$/);
 }
 assert.ok(radio.indexOf('experiencias/audio-preview-catalog.js')<radio.indexOf('app.js?v=20261114-18mp3-release2'));
 assert.ok(app.includes('const verifiedAudio='));
 assert.ok(app.includes("knownAudio?.status==='audio_preview_unreviewed'"));
 assert.ok(app.includes('experienceMp3'));
 assert.ok(app.includes('experienceMp3Status'),'Áudio indisponível deve oferecer fallback legível');
 assert.ok(app.includes('window.SynthwaveExperiencesPlayer.stop()'));
 assert.ok(app.includes('function toggleExperienceVoice(id)'));
 assert.ok(app.includes('if(preview&&!preview.paused)preview.pause();'));
 assert.ok(read('production/export_experiences.mjs').includes('stories.length!==18'));
 assert.ok(read('production/render_experiences.py').includes('audio-preview-catalog.js'));
 assert.ok(read('../.github/workflows/synthwave-experiences-audio.yml').includes('ffprobe'));
});


test('release SynthWAVE: 18 MP3 reais com SHA256, 8 podcasts e 4 faixas próprias',()=>{
 const w={};new Function('window',read('experiencias/audio-preview-catalog.js'))(w);
 const entries=Object.entries(w.SYNTHWAVE_EXPERIENCE_AUDIO||{});
 assert.equal(entries.length,18,'O lançamento deve disponibilizar as 18 prévias antes da divulgação');
 const catalogue=new Set();
 for(const [id,entry] of entries){
  assert.match(id,/^[a-z0-9-]+$/);
  catalogue.add(id);
  const mp3='experiencias/audio-previews/'+id+'-previa.mp3';
  const manifest='experiencias/audio-previews/'+id+'-manifest.json';
  assert.ok(statSync(resolve(dir,mp3)).size>60000,'MP3 vazio: '+id);
  const bytes=readFileSync(resolve(dir,mp3));
  assert.ok(bytes.toString('ascii',0,3)==='ID3'||(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0),'Cabeçalho MP3 inválido: '+id);
  const hash=createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash,entry.sha256,'SHA256 diferente do catálogo: '+id);
  const meta=JSON.parse(read(manifest));
  assert.equal(meta.experienceId,id);
  assert.equal(meta.sha256,hash);
  assert.equal(meta.finalPublicationApproved,false,'Prévia não pode virar áudio final por engano');
  assert.equal(meta.status,'audio_preview_unreviewed');
  assert.ok(meta.durationSecondsApprox>45);
  assert.ok(meta.spokenTurns>=15);
 }
 const previews=['ep01-cuidar-conectar','ep02-padrinho','ep03-invisivel','ep04-alem-da-pintura','ep05-recomeco','ep06-cidade','ep07-brasil','ep08-institute'];
 for(const id of previews){
  assert.ok(statSync(resolve(dir,'podcasts/audio-previews/'+id+'-previa.mp3')).size>60000,'Podcast sem áudio: '+id);
  const manifest=JSON.parse(read('podcasts/audio-previews/'+id+'-manifest.json'));
  assert.equal(manifest.status,'audio_preview_unreviewed');
 }
 for(const file of ['foco-frequencia-clara','estrada-horizonte','refugio-chuva-sintetica','depois-das-20h']){
  assert.ok(statSync(resolve(dir,'audio/original/'+file+'.mp3')).size>60000,'Música autoral ausente: '+file);
 }
 assert.equal(catalogue.size,18);
 const radio=read('radio/index.html');
 assert.ok(radio.includes('audio-preview-catalog.js?v=20261114-18mp3-release2'),'Página deve contornar cache de catálogo vazio anterior');
 assert.ok(radio.includes('18 prévias de histórias'),'Descrição deve refletir conteúdos realmente gerados');
});

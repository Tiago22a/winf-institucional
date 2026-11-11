/* SYNTHWAVE.fm — Vanilla JavaScript edition. No React, build step or frameworks. */
'use strict';
const cover=(id)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=900&q=80';
const images=['photo-1508739773434-c26b3d09e071','photo-1518709268805-4e9042af9f23','photo-1542282088-72c9c27ed0cd','photo-1511671782779-c97d3d27a1d4','photo-1486406146926-c627a92ad1ab','photo-1509198397868-475647b2a1e5','photo-1519608487953-e999c86e7455','photo-1493225457124-a3eb161ffa5f'];
const synthTracks=[
['AeroCore Stratosphere','SynthWave Labs · AeroCore Sound','AeroCore',92,0,254],
['Neon Overpass (Highway Pulse)','Krypton 81','Drive',118,1,218],
['Brutalist Monolith','NeoSkin ADV-X Sound','NeoSkin',104,2,275],
['Clean Room Frequencies','Ateliê Collective','Focus',84,3,310],
['Optical Transparency (Minimal Works)','WINF Select Ensemble','WINF Select',78,4,290],
['City Lights (Drive Mode ON)','Vektor Drive','Drive',122,5,204],
['After Hours Telemetry','Night Drive Collective','Drive',96,6,260],
['The Sound of Protection (Manifesto Theme)','WINF International Group','Originals',88,7,240]
].map((a,i)=>({id:'track-'+i,title:a[0],artist:a[1],category:a[2],bpm:a[3],cover:cover(images[a[4]]),duration:a[5],synthPreset:['aerocore_ambient','cyber_drive','neoskin_pulse','deep_focus_lofi','aerocore_ambient','cyber_drive','night_glide','sunset_highway'][i]}));
const tracks=[...window.SYNTHWAVE_LICENSED_TRACKS,...synthTracks];
const playlists=[
['AEROCORE SOUNDSCAPE','Atmosferas eletrônicas, tecnologia & movimento','WINF Sound',[0,1,5,9],0,'Seleção musical'],
['NEOSKIN APOCALYPSE','Batidas urbanas & texturas intensas','WINF Sound',[3,0,7,6],2,'Seleção musical'],
['SELECT AMBIENT WORKS','Sons para um espaço tranquilo','Ambient',[2,1,8,9],4,'Seleção musical'],
['CITY DRIVE / CITY LIGHTS','Synthwave real para percorrer a cidade','Drive',[0,1,4,10,11],5,'Seleção musical'],
['HIGHWAY SESSIONS','Uma viagem sonora pela estrada','Drive',[1,0,4,6,10],1,'Seleção musical'],
['NIGHT DRIVE / AFTER HOURS','Noites, neon e grandes avenidas','Drive',[1,0,2,11,12],6,'Seleção musical'],
['DEEP FOCUS / LOFI ATELIÊ','Concentração e criatividade','Focus',[2,3,8,9],3,'Seleção musical'],
['SYNTHWAVE ORIGINALS','Experimentos sonoros sintetizados do site','WINF Sound',[5,6,7,8,9,10,11,12],7,'Sons digitais']
].map((a,i)=>({id:i,title:a[0],subtitle:a[1],category:a[2],tracks:a[3],cover:cover(images[a[4]]),duration:a[5]}));
const podcasts=[
['QUANTUM TECH INSIGHTS','Tecnologia & Ciência Solar','O Espectro Invisível e a Barreira Térmica AeroCore™',0],
['ELITE PERFORMANCE MASTERS','Automotivo & Performance','300 km/h em Interlagos: Quando o PPF Salva a Pintura Original',2],
['INVISIBLE LUXURY CHRONICLES','Arquitetura & Estilo de Vida','A Casa Invisível: Fachadas de Vidro sem Superaquecimento',4],
['O QUE O VIDRO NÃO CONTA','Mercado & Educação','Por que Películas Baratas Ficam Roxas e Como Explicar ao Cliente',3]
].map((a,i)=>({id:i,title:a[0],category:a[1],episode:a[2],cover:cover(images[a[3]])}));
const schedules=[['00:00 – 06:00','Cyber Nocturne & Night Drive'],['06:00 – 10:00','Morning Transmission & Quantum Focus'],['10:00 – 15:00','Ateliê High-End & Ambient Installation'],['15:00 – 20:00','City Lights & Highway Sessions'],['20:00 – 00:00','AeroCore™ Soundscape & SynthWave Originals']];
let queue=tracks.map((t,i)=>t.audioUrl?i:-1).filter(i=>i>=0),position=0,playing=false,elapsed=0,timer=null,activeView='home',filter='Todos',soundscape=null;
const $=s=>document.querySelector(s);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(label,fn,style='btn')=>'<button class="'+style+'" onclick="'+fn+'">'+label+'</button>';
const heading=(eyebrow,title,subtitle='')=>'<div class="mb-9"><p class="text-pink text-xs uppercase tracking-[.3em] font-black mb-3">'+eyebrow+'</p><h1 class="text-5xl md:text-7xl text-white leading-none">'+title+'</h1>'+(subtitle?'<p class="text-gray-400 max-w-2xl mt-4">'+subtitle+'</p>':'')+'</div>';
function trackCard(t,i){
 const extra=t.audioUrl
  ?'<a class="text-pink hover:text-white underline text-[11px] inline-block mt-3" href="'+escapeHtml(t.sourceUrl)+'" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Origem e licença · '+escapeHtml(t.licenseLabel)+'</a>'
  :'<p class="text-[10px] tracking-wider text-pink font-bold uppercase mt-3">Síntese · '+escapeHtml(t.category)+' · '+t.bpm+' BPM</p>';
 return '<article class="panel tile overflow-hidden group" tabindex="0" role="button" onclick="playIndex('+i+')" onkeydown="if(event.key===\'Enter\')playIndex('+i+')"><div class="relative"><img loading="lazy" class="aspect-square w-full object-cover" src="'+t.cover+'" alt=""><div class="absolute bottom-3 right-3 rounded-full bg-pink w-11 h-11 text-white grid place-items-center opacity-90 group-hover:scale-110">▶</div></div><div class="p-4"><p class="text-white text-sm font-extrabold truncate">'+escapeHtml(t.title)+'</p><p class="text-gray-500 text-xs mt-1 truncate">'+escapeHtml(t.artist)+'</p>'+extra+'</div></article>';
}
function playlistCard(p){return '<article class="panel tile group" onclick="playPlaylist('+p.id+')"><img loading="lazy" class="w-full aspect-[4/3] object-cover" src="'+p.cover+'" alt=""><div class="p-5"><p class="text-[10px] tracking-[.2em] text-pink uppercase font-extrabold">'+p.category+'</p><h3 class="text-white text-2xl mt-2">'+escapeHtml(p.title)+'</h3><p class="text-gray-500 text-xs mt-2">'+escapeHtml(p.subtitle)+'</p><p class="text-gray-400 text-xs mt-4">▶ Ouvir seleção · '+p.duration+'</p></div></article>'}
function podcastCard(p){return '<article class="panel overflow-hidden"><img loading="lazy" src="'+p.cover+'" alt="" class="w-full aspect-[4/3] object-cover"><div class="p-5"><p class="text-pink text-[10px] font-black tracking-widest uppercase">'+p.category+'</p><h3 class="text-white text-3xl mt-2">'+p.title+'</h3><p class="text-gray-400 text-sm mt-3">Ep. 01 · '+p.episode+'</p><p class="text-xs text-gray-600 mt-4">Conteúdo editorial: áudio do episódio ainda não disponível.</p></div></article>'}
function home(){return '<section class="hero min-h-[480px] md:min-h-[630px] flex items-center relative overflow-hidden"><div class="max-w-7xl mx-auto w-full px-5 py-20 relative z-10"><p class="text-pink font-bold tracking-[.4em] uppercase text-xs mb-5">A new frequency is born // 24.7</p><h1 class="text-white text-[clamp(5rem,14vw,13rem)] leading-[.78] glow">FEEL THE<br><span class="text-pink">FREQUENCY.</span></h1><p class="text-white/70 text-base md:text-xl max-w-xl mt-9">Seu universo sonoro. Músicas licenciadas, paisagens eletrônicas e playlists que acompanham cada jornada.</p><div class="flex flex-wrap gap-3 mt-8">'+button('▶ Sintonizar agora',"go('live');playIndex(0)")+button('Explorar playlists',"go('playlists')",'btn-outline')+'</div><p class="text-gray-500 text-xs tracking-[.3em] uppercase mt-10">Music · Technology · Motion · Culture</p></div><div class="absolute right-[-12%] top-16 w-[55vw] aspect-square rounded-full border border-pink/25 shadow-[0_0_160px_40px_#ff007f15]"></div></section><section class="max-w-7xl mx-auto px-5 py-16">'+heading('Curated frequency','SONS PARA CADA MOMENTO','Faixas e soundscapes da experiência SYNTHWAVE.fm.')+'<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">'+tracks.slice(0,4).map((t,i)=>trackCard(t,i)).join('')+'</div></section><section class="paper py-16 px-5"><div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center"><div><p class="text-pink text-xs tracking-widest font-extrabold">EDITORIAL MANIFESTO</p><h2 class="text-6xl md:text-8xl leading-none mt-3">NÃO É SÓ<br>UMA RÁDIO.</h2><p class="mt-6 text-lg">É um território de frequências, tecnologia, movimento e identidade.</p>'+button('Conheça o manifesto',"go('about')",'btn-outline mt-8')+'</div><div class="font-brush text-5xl md:text-7xl rotate-[-6deg] text-[#ff007f] text-center">TURN IT UP.</div></div></section><section class="max-w-7xl mx-auto px-5 py-16">'+heading('Selected for you','PLAYLISTS EM DESTAQUE')+'<div class="grid md:grid-cols-3 gap-5">'+playlists.slice(0,3).map(playlistCard).join('')+'</div></section>'}
function live(){let d=new Date(),h=d.getHours(),slot=schedules.find(s=>{let n=parseInt(s[0]);return h>=n&&h<(n===20?24:n===15?20:n===10?15:n===6?10:6)})||schedules[0];return '<section class="max-w-7xl mx-auto py-12">'+heading('On air // 24.7','SYNTHWAVE RADIO','Seleção contínua de músicas licenciadas, reproduzidas diretamente dos arquivos do Wikimedia Commons. Não é uma transmissão ao vivo sincronizada.')+'<div class="grid lg:grid-cols-2 gap-7"><div class="panel p-7 md:p-11"><span class="inline-flex gap-2 items-center text-xs font-black text-pink tracking-widest"><span class="w-2 h-2 bg-pink rounded-full animate-pulse"></span> MUSIC ON DEMAND</span><h2 class="text-6xl text-white mt-9">THE SOUND<br>NEVER STOPS.</h2><p class="text-gray-400 mt-5">Programação editorial: '+escapeHtml(slot[1])+'</p><div class="mt-9">'+button('▶ Ouvir rádio',"startRadio()")+'</div><div class="mt-8"><p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3">Ambientes sonoros</p><div class="flex gap-2 flex-wrap">'+['Desligado','Chuva','Trânsito','Estática'].map((label,i)=>'<button class="pill '+((soundscape===([null,'rain','traffic','static'][i]))?'selected':'')+'" onclick="chooseSoundscape('+i+')">'+label+'</button>').join('')+'</div></div></div><div class="panel p-7"><h2 class="text-white text-4xl mb-4">PROGRAMAÇÃO</h2>'+schedules.map(s=>'<div class="border-b border-white/10 py-4 flex gap-5"><span class="text-pink text-xs font-black shrink-0">'+s[0]+'</span><span class="text-gray-300 text-sm">'+s[1]+'</span></div>').join('')+'</div></div></section>'}
function playlistView(){return '<section class="max-w-7xl mx-auto py-12">'+heading('The collection','PLAYLISTS','Curadoria por ritmo, direção e estado de espírito.')+'<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">'+playlists.map(playlistCard).join('')+'</div></section>'}
function podcastView(){return '<section class="max-w-7xl mx-auto py-12">'+heading('Voices & Ideas','PODCASTS','Debates sobre tecnologia, desempenho, ciência e arquitetura. Os episódios aguardam arquivos de áudio para reprodução.')+'<div class="grid md:grid-cols-2 xl:grid-cols-4 gap-5">'+podcasts.map(podcastCard).join('')+'</div></section>'}
function explore(){let f=filter.toLowerCase();let results=tracks.map((t,i)=>({t,i})).filter(({t})=>f==='todos'||t.category.toLowerCase()===f);return '<section class="max-w-7xl mx-auto py-12">'+heading('Discover your sound','EXPLORAR','Busque e filtre o catálogo de faixas.')+'<input id="search" placeholder="Pesquisar música ou artista..." aria-label="Pesquisar" oninput="searchTracks(this.value)" class="w-full mb-5"><div class="flex flex-wrap gap-2 mb-8">'+['Todos',...new Set(tracks.map(t=>t.category))].map(c=>'<button class="pill '+(filter===c?'selected':'')+'" onclick="filter=\''+c+'\';go(\'explore\')">'+c+'</button>').join('')+'</div><div id="results" class="grid grid-cols-2 md:grid-cols-4 gap-4">'+results.map(({t,i})=>trackCard(t,i)).join('')+'</div></section>'}
function searchTracks(q){let found=tracks.map((t,i)=>({t,i})).filter(({t})=>(filter==='Todos'||t.category===filter)&&(t.title+' '+t.artist).toLowerCase().includes(q.toLowerCase()));$('#results').innerHTML=found.map(({t,i})=>trackCard(t,i)).join('')||'<p class="text-gray-500">Nenhum resultado.</p>'}
function credits(){
 const licensed=tracks.filter(t=>t.audioUrl);
 return '<section class="max-w-7xl mx-auto py-12">'+heading('Music licensing','CRÉDITOS MUSICAIS','Obras reproduzidas integralmente, sem alterações nos arquivos. A transmissão é por solicitação do ouvinte, não uma emissora sincronizada.')+
 '<div class="grid md:grid-cols-2 gap-5">'+licensed.map(t=>
 '<article class="panel p-6"><h3 class="text-white text-3xl">'+escapeHtml(t.title)+'</h3><p class="mt-1 text-sm text-gray-300">'+escapeHtml(t.artist)+'</p><p class="mt-3 text-xs uppercase tracking-wider text-pink">'+escapeHtml(t.licenseLabel)+'</p><div class="flex gap-5 mt-4 text-sm"><a class="underline text-white" target="_blank" rel="noopener noreferrer" href="'+escapeHtml(t.sourceUrl)+'">Arquivo e autoria</a><a class="underline text-white" target="_blank" rel="noopener noreferrer" href="'+escapeHtml(t.licenseUrl)+'">Texto da licença</a></div><p class="mt-3 text-xs text-gray-500">'+escapeHtml(t.changes)+'</p></article>').join('')+
 '</div><p class="text-sm text-gray-400 mt-9">Arquivos armazenados no Wikimedia Commons e acessados externamente. A disponibilidade dos endereços depende do provedor. Permissões Creative Commons não eliminam eventuais obrigações regulatórias, autorais ou conexas relativas à operação de rádio pública no Brasil.</p></section>';
}
function about(){return '<section class="max-w-7xl mx-auto py-12">'+heading('The manifesto','WE ARE THE FREQUENCY','Uma plataforma de música e experiências sonoras que conecta cultura, design, tecnologia e movimento.')+'<div class="paper p-8 md:p-16"><h2 class="text-6xl md:text-9xl">A TRILHA SONORA<br>DO FUTURO.</h2><p class="max-w-3xl text-lg mt-7">SYNTHWAVE.fm nasce dentro do ecossistema WINF para traduzir universos visuais em identidades sonoras. Música para criar, dirigir, trabalhar, pensar e sentir.</p><p class="font-brush text-pink text-4xl mt-9">SOUND WITHOUT LIMITS.</p></div><div class="grid md:grid-cols-3 gap-4 mt-7">'+['Cultura','Tecnologia','Movimento'].map(s=>'<div class="panel p-7 text-center"><h3 class="text-4xl text-white">'+s+'</h3></div>').join('')+'</div></section>'}
function admin(){let saved=JSON.parse(localStorage.getItem('synthwave_settings')||'{}');return '<section class="max-w-7xl mx-auto py-12">'+heading('Local administration','PAINEL ADMIN','Configurações demonstrativas armazenadas somente neste navegador. Não existe autenticação ou backend administrativo nesta versão estática.')+'<div class="panel p-7 max-w-2xl"><label class="block text-xs font-black uppercase tracking-widest mb-2">Nome da estação</label><input id="station" class="w-full" value="'+escapeHtml(saved.station||'SYNTHWAVE.fm')+'"><label class="block text-xs font-black uppercase tracking-widest mt-6 mb-2">Mensagem editorial</label><textarea id="message" class="w-full" rows="4">'+escapeHtml(saved.message||'Sound without limits.')+'</textarea><button class="btn mt-5" onclick="saveAdmin()">Salvar no navegador</button><p id="saved" class="text-sm mt-3 text-gray-400"></p></div></section>'}
function saveAdmin(){localStorage.setItem('synthwave_settings',JSON.stringify({station:$('#station').value,message:$('#message').value}));$('#saved').textContent='Preferências salvas localmente.'}
function go(view){activeView=view;document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===view));const render={home,live,playlists:playlistView,podcasts:podcastView,explore,about,credits,profile:()=>window.SynthwaveProfile.render(),admin};$('#app').innerHTML=(render[view]||home)();window.scrollTo({top:0,behavior:'smooth'});location.hash=view==='home'?'':view}
function playPlaylist(id){queue=playlists[id].tracks.slice();position=0;start(true);go('playlists')}
function playIndex(i){const real=!!tracks[i].audioUrl;queue=tracks.map((t,j)=>({t,j})).filter(x=>!!x.t.audioUrl===real).map(x=>x.j);position=queue.indexOf(i);start(true)}
function startRadio(){queue=tracks.map((t,i)=>t.audioUrl?i:-1).filter(i=>i>=0);position=0;start(true)}
function currentTrack(){return tracks[queue[position]??0]}
/* Audio control delegates to audio-engine.js (Web Audio + optional HTMLAudioElement). */
function updatePlayer(){
  const t=currentTrack();
  $('#nowCover').src=t.cover;
  $('#nowTitle').textContent=t.title;
  $('#nowArtist').textContent=t.artist;
  const credit=$('#nowCredit');
  if(credit){
    if(t.audioUrl){credit.textContent='Créditos e licença · '+t.licenseLabel;credit.href=t.sourceUrl;credit.classList.remove('hidden')}
    else{credit.textContent='Som gerado no navegador';credit.removeAttribute('href');credit.classList.remove('hidden')}
  }
  $('#playBtn').textContent=playing?'❚❚':'▶';
  document.body.classList.toggle('playing',playing);
  updateProgress();
}
function updateProgress(){
  const t=currentTrack(),actual=SynthwaveAudio.media&&SynthwaveAudio.playing&&t.audioUrl?SynthwaveAudio.media.currentTime:elapsed;
  const duration=t.duration||1;
  const percent=Math.min(100,100*actual/duration);
  const bar=$('#progressBar'),label=$('#timeLabel');
  if(bar)bar.style.width=percent+'%';
  if(label)label.textContent=formatTime(actual)+' / '+formatTime(duration);
}
function formatTime(secs){const n=Math.max(0,Math.floor(secs||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
function start(restart=false){
  const status=$('#audioStatus'); if(status) status.textContent='';
  if(restart)elapsed=0;
  if(timer)clearInterval(timer);
  playing=true;
  if(!restart&&SynthwaveAudio.currentTrack===currentTrack()&&!SynthwaveAudio.playing){SynthwaveAudio.resume(currentTrack(),()=>next())}
  else SynthwaveAudio.play(currentTrack(),()=>next());
  timer=setInterval(()=>{
    if(!playing)return;
    if(currentTrack().audioUrl){elapsed=SynthwaveAudio.media?SynthwaveAudio.media.currentTime:elapsed}
    else if((elapsed+=.25)>=currentTrack().duration){next();return}
    updateProgress();paintVisualizer();
  },250);
  updatePlayer();
}
function pause(){
  playing=false;
  SynthwaveAudio.pause();
  if(timer)clearInterval(timer);
  timer=null;
  updatePlayer();
}
function togglePlay(){playing?pause():start()}
function next(){position=(position+1)%queue.length;playing?start(true):(elapsed=0,updatePlayer())}
function previous(){position=(position-1+queue.length)%queue.length;playing?start(true):(elapsed=0,updatePlayer())}
function setVolume(v){SynthwaveAudio.setVolume(Number(v)/100)}
function chooseSoundscape(i){soundscape=[null,'rain','traffic','static'][i];SynthwaveAudio.setSoundscape(soundscape);if(activeView==='live')go('live')}
function paintVisualizer(){
  if(currentTrack().audioUrl)return; // Actual music plays through an external media element; keep the animated UI.
  const analyser=SynthwaveAudio.getAnalyser();
  if(!analyser||!playing)return;
  const data=new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  document.querySelectorAll('#visualizer span').forEach((bar,i)=>{bar.style.height=Math.max(3,Math.round(data[(i*2)%data.length]/255*28))+'px'});
}
SynthwaveAudio.onError=(err)=>{playing=false;if(timer)clearInterval(timer);timer=null;updatePlayer();console.warn('Falha ao reproduzir áudio:',err);const l=$('#audioStatus');if(l)l.textContent='Áudio indisponível: verifique o formato e a conexão.'};
function openPremium(){$('#modal').classList.remove('hidden');$('#modal').classList.add('flex')}
function closePremium(){$('#modal').classList.add('hidden');$('#modal').classList.remove('flex')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePremium();if(e.code==='Space'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)){e.preventDefault();togglePlay()}});
$('#year').textContent=new Date().getFullYear();$('#visualizer').innerHTML=Array.from({length:12},(_,i)=>'<span style="animation-delay:-'+(i*.13)+'s"></span>').join('');go(location.hash.replace('#','')||'home');updatePlayer();
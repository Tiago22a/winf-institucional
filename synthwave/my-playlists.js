/* SYNTHWAVE.fm — personal collections v1, local-only.
 * No Google login or cloud synchronization is advertised as functional.
 * Uses only tracks from the curated catalog, never arbitrary uploaded media.
 */
(function(global){
'use strict';
const KEY='synthwave-personal-collections-v1';
let cache=null;
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(tracks){
 if(cache)return cache;
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){}
 const validIds=new Set(tracks.map(t=>t.id));
 cache=Array.isArray(saved)?saved.slice(0,25).filter(x=>x&&/^[a-z0-9-]{1,48}$/.test(x.id)).map(x=>({
   id:x.id,name:String(x.name||'Minha seleção').slice(0,48),
   tracks:(Array.isArray(x.tracks)?x.tracks:[]).filter(id=>validIds.has(id)).slice(0,100)
 })):[];
 if(!cache.find(item=>item.id==='favoritas'))cache.unshift({id:'favoritas',name:'Favoritas',tracks:[]});
 return cache;
}
function persist(){
 try{localStorage.setItem(KEY,JSON.stringify(cache))}catch(_){
   announce('O armazenamento está bloqueado; suas alterações poderão desaparecer ao fechar a página.');
 }
}
function announce(message){
 const status=document.getElementById('sw-personal-status');
 if(status)status.textContent=message;
 const bottom=document.getElementById('audioStatus');
 if(bottom)bottom.textContent=message;
}
function favorite(tracks,index){
 const track=tracks[index],favoriteList=read(tracks).find(x=>x.id==='favoritas');
 if(!track||!favoriteList)return;
 if(!favoriteList.tracks.includes(track.id)){favoriteList.tracks.push(track.id);persist()}
 announce('Faixa salva em Favoritas neste navegador.');
}
function render(tracks){
 const playlists=read(tracks);
 const cards=playlists.map(item=>{
   const songs=item.tracks.map(id=>tracks.find(t=>t.id===id)).filter(Boolean);
   const rows=songs.length?songs.map(track=>
      '<li class="flex justify-between items-center gap-3 py-2 border-b border-white/10">'+
      '<span class="text-xs text-gray-300">'+html(track.title)+' · '+html(track.artist)+'</span>'+
      '<button class="text-pink text-xs shrink-0" type="button" data-action="remove-song" data-id="'+html(item.id)+'" data-song="'+html(track.id)+'">Remover</button></li>').join('') :
      '<li class="text-gray-500 text-sm py-3">Adicione faixas do catálogo para começar.</li>';
   return '<article class="panel p-6 sw-personal-card">'+
      '<p class="text-pink uppercase text-[10px] tracking-[.18em] font-bold">SUA SELEÇÃO</p>'+
      '<h2 class="text-white text-3xl mt-2">'+html(item.name)+'</h2>'+
      '<p class="text-gray-500 text-xs mt-1">'+songs.length+' faixa(s)</p>'+
      '<div class="flex flex-wrap gap-2 mt-5">'+
      '<button type="button" data-action="play" data-id="'+html(item.id)+'" class="sw-moment-action">▶ Ouvir</button>'+
      (item.id==='favoritas'?'':'<button type="button" data-action="delete-list" data-id="'+html(item.id)+'" class="btn-outline">Excluir lista</button>')+
      '</div><ul class="mt-5">'+rows+'</ul>'+
      '<div class="flex flex-wrap gap-2 mt-4"><label for="sw-pick-'+html(item.id)+'" class="sr-only">Adicionar música</label>'+
      '<select id="sw-pick-'+html(item.id)+'" data-picker="'+html(item.id)+'" class="flex-1 min-w-[175px] text-sm">'+
       tracks.map(t=>'<option value="'+html(t.id)+'">'+html(t.title)+' · '+html(t.artist)+'</option>').join('')+
      '</select><button type="button" data-action="add-song" data-id="'+html(item.id)+'" class="btn-outline">Adicionar +</button></div></article>';
 }).join('');
 return '<section class="max-w-7xl mx-auto px-5 py-12" id="sw-my-lists">'+
  '<p class="text-pink font-bold uppercase tracking-[.2em] text-xs">A SUA FREQUÊNCIA</p>'+
  '<h1 class="text-white text-5xl md:text-7xl mt-3">MINHAS PLAYLISTS.</h1>'+
  '<p class="text-gray-400 mt-4 max-w-3xl">Crie suas coleções e salve músicas da biblioteca SynthWAVE.fm. Ouça sem cadastro e organize seus favoritos.</p>'+
  '<div class="panel p-5 mt-7 mb-8 sw-local-notice"><strong class="text-white">Suas escolhas, neste navegador.</strong>'+
  '<p class="text-sm text-gray-400 mt-2">Nesta etapa, as playlists são salvas apenas neste dispositivo. Não há conta Google nem sincronização em nuvem ativada. Envio de músicas próprias exigirá confirmação de autoria, permissão de uso e moderação.</p></div>'+
  '<form id="sw-create-list" class="flex flex-wrap gap-3 mb-8"><label for="sw-list-name" class="sr-only">Nome da nova playlist</label>'+
  '<input id="sw-list-name" type="text" class="flex-1 min-w-[220px]" maxlength="48" minlength="2" required placeholder="Nome da sua nova playlist">'+
  '<button type="submit" class="sw-moment-action">+ Criar playlist</button></form>'+
  '<p id="sw-personal-status" role="status" aria-live="polite" class="text-pink text-sm mb-5"></p>'+
  '<div class="grid lg:grid-cols-2 gap-5">'+cards+'</div></section>';
}
function bind(tracks,playIndices,redraw){
 const root=document.getElementById('sw-my-lists');
 if(!root)return;
 const form=root.querySelector('#sw-create-list');
 form.addEventListener('submit',e=>{
   e.preventDefault();
   const value=root.querySelector('#sw-list-name').value.trim().slice(0,48);
   if(value.length<2){announce('Informe pelo menos duas letras.');return}
   const all=read(tracks);
   if(all.length>=25){announce('Limite de 25 playlists neste navegador.');return}
   const id='l-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
   all.push({id,name:value,tracks:[]});
   persist();redraw();
 });
 root.addEventListener('click',e=>{
   const button=e.target.closest('button[data-action]');
   if(!button)return;
   const id=button.dataset.id,action=button.dataset.action,all=read(tracks);
   const chosen=all.find(x=>x.id===id);
   if(!chosen)return;
   if(action==='play'){
     const indices=chosen.tracks.map(id=>tracks.findIndex(t=>t.id===id)).filter(i=>i>=0);
     if(indices.length)playIndices(indices);
     else announce('Adicione músicas antes de tocar.');
   }else if(action==='delete-list'&&id!=='favoritas'){
     cache=all.filter(item=>item.id!==id);persist();redraw();
   }else if(action==='add-song'){
     const select=document.getElementById('sw-pick-'+id);
     const track=tracks.find(t=>t.id===select?.value);
     if(track&&!chosen.tracks.includes(track.id)){chosen.tracks.push(track.id);persist();redraw()}
   }else if(action==='remove-song'){
     chosen.tracks=chosen.tracks.filter(song=>song!==button.dataset.song);
     persist();redraw();
   }
 });
}
global.SynthwaveLists={render,bind,favorite};
})(window);

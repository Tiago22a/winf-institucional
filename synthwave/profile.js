/* SynthWAVE.fm — perfil local de ouvinte.
   Dados salvos somente no navegador. Não é uma conta, não existe autenticação,
   nem sincronização em nuvem. */
(function(global){
  'use strict';
  const KEY='winf-synthwave-listener-v1';
  const categories=['Drive','Focus','Ambient','Originals','NeoSkin','AeroCore'];
  const picks=['CITY DRIVE / CITY LIGHTS','NIGHT DRIVE / AFTER HOURS','DEEP FOCUS / LOFI ATELIÊ','AEROCORE SOUNDSCAPE','SYNTHWAVE ORIGINALS'];
  const esc=(value)=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function read(){
    try{
      const raw=localStorage.getItem(KEY);
      if(!raw)return null;
      const value=JSON.parse(raw);
      return value&&typeof value==='object'?value:null;
    }catch(_){return null}
  }
  function chosen(value,selected){return value===selected?' selected':''}
  function render(){
    const data=read()||{},name=esc(data.name||'');
    const genre=categories.includes(data.genre)?data.genre:'Drive';
    const favorite=picks.includes(data.favorite)?data.favorite:picks[0];
    const message=read()?'<div class="sw-profile-saved" role="status">Perfil local salvo neste navegador. Você pode atualizar seus dados quando quiser.</div>':'<div class="sw-profile-intro">Personalize seu espaço. Nenhuma conta online será criada nesta versão.</div>';
    return '<section class="sw-profile-wrap max-w-7xl mx-auto px-5 py-12">'+
      '<p class="sw-profile-eyebrow">SEU ESPAÇO / SYNTHWAVE.FM</p>'+
      '<h1 class="sw-profile-title">MINHA<br><em>FREQUÊNCIA.</em></h1>'+
      '<p class="sw-profile-copy">Seu nome, seu ritmo, suas escolhas. Monte um perfil simples para organizar sua experiência na SynthWAVE.</p>'+
      '<div class="sw-profile-grid"><div class="sw-profile-form-panel">'+message+
      '<form id="sw-profile-form" onsubmit="event.preventDefault();SynthwaveProfile.save()" autocomplete="off">'+
      '<label for="sw-listener-name">COMO PODEMOS TE CHAMAR?</label>'+
      '<input id="sw-listener-name" name="nickname" type="text" maxlength="48" minlength="2" required placeholder="Seu nome ou apelido" value="'+name+'">'+
      '<label for="sw-listener-genre">MEU ESTILO FAVORITO</label>'+
      '<select id="sw-listener-genre" name="genre">'+categories.map(g=>'<option value="'+esc(g)+'"'+chosen(g,genre)+'>'+esc(g)+'</option>').join('')+'</select>'+
      '<label for="sw-listener-favorite">PLAYLIST FAVORITA</label>'+
      '<select id="sw-listener-favorite" name="favorite">'+picks.map(g=>'<option value="'+esc(g)+'"'+chosen(g,favorite)+'>'+esc(g)+'</option>').join('')+'</select>'+
      '<div class="sw-profile-actions"><button type="submit" class="sw-profile-save">SALVAR PERFIL ↗</button>'+
      '<button type="button" class="sw-profile-delete" onclick="SynthwaveProfile.clear()">APAGAR DADOS</button></div>'+
      '<p id="sw-profile-status" aria-live="polite" class="sw-profile-status"></p>'+
      '</form></div>'+
      '<aside class="sw-profile-info"><span class="sw-profile-num">01 / IDENTIDADE DIGITAL</span><h2>VOCÊ É PARTE<br>DA FREQUÊNCIA.</h2>'+
      '<p>Escolha o que combina com seu momento. Seus dados ficam armazenados somente neste navegador, usando armazenamento local. Não solicitamos senha, telefone nem e-mail.</p>'+
      '<a href="#playlists" onclick="event.preventDefault();go(\'playlists\')" class="sw-profile-return">EXPLORAR PLAYLISTS →</a>'+
      '<span class="sw-profile-circle" aria-hidden="true">S W</span></aside></div></section>';
  }
  function status(text){
    const el=document.getElementById('sw-profile-status');
    if(el)el.textContent=text;
  }
  function save(){
    const form=document.getElementById('sw-profile-form');
    if(!form)return;
    if(!form.reportValidity())return;
    const name=document.getElementById('sw-listener-name').value.trim().slice(0,48);
    const genre=document.getElementById('sw-listener-genre').value;
    const favorite=document.getElementById('sw-listener-favorite').value;
    if(name.length<2){status('Informe um nome ou apelido com pelo menos dois caracteres.');return}
    if(!categories.includes(genre)||!picks.includes(favorite)){status('Selecione uma opção disponível.');return}
    try{
      localStorage.setItem(KEY,JSON.stringify({name,genre,favorite,updatedAt:Date.now()}));
      global.go('profile');
    }catch(_){status('Seu navegador bloqueou o armazenamento local. Não foi possível salvar o perfil.')}
  }
  function clear(){
    if(!global.confirm('Apagar os dados do perfil salvos neste navegador?'))return;
    try{localStorage.removeItem(KEY);global.go('profile')}catch(_){status('Não foi possível apagar os dados locais.')}
  }
  global.SynthwaveProfile={render,save,clear};
})(window);

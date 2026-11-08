'use strict';
// WINF global. Mostra exclusivamente os registros com status ativo em js/cidades.js.
// Dados de telefone local e sites devem ser validados antes de ativação.
(() => {
  const holder = document.getElementById('winf-active-grid');
  if (!holder) return;
  const records = Array.isArray(globalThis.WINF_CIDADES) ? globalThis.WINF_CIDADES : [];
  const extras = Array.isArray(globalThis.WINF_UNIDADES_EXTRAS) ? globalThis.WINF_UNIDADES_EXTRAS : [];
  const active = [...records,...extras].filter(city => city && city.exemplo === false && city.status === 'ativa')
    .sort((a,b) => String(a.cidade).localeCompare(String(b.cidade),'pt-BR'));
  if (!active.length) return; // preserva link estático de Santos se cadastro falhar
  const fragment = document.createDocumentFragment();
  active.forEach(city => {
    const card = document.createElement('a');
    card.className = 'winf-active-card';
    // URLs publicadas pelo cadastro: sempre validar protocolo e origem.
    let href = '/onde-comprar/';
    if (city.url && typeof city.url === 'string') {
      try {
        const url = new URL(city.url,location.origin);
        if (url.origin === location.origin && ['https:','http:'].includes(url.protocol)) href=url.pathname+url.search+url.hash;
      } catch {}
    } else {
      href += '?cidade='+encodeURIComponent(city.cidade)+'#unidades';
    }
    card.href=href;
    card.setAttribute('aria-label','Consultar atendimento WINF em '+city.cidade+', '+city.uf);
    const marker=document.createElement('span');
    marker.textContent=city.id==='santos-sp'?'WINF SELECT / PILOTO':'REDE WINF / CADASTRO ATIVO';
    const title=document.createElement('strong');
    title.textContent=city.cidade+' ';
    const state=document.createElement('small');
    state.textContent=city.uf;
    title.append(state);
    const cta=document.createElement('em');
    cta.textContent=city.url?'CONHECER UNIDADE ↗':'CONSULTAR ATENDIMENTO ↗';
    card.append(marker,title,cta);
    fragment.append(card);
  });
  holder.replaceChildren(fragment);
  const counter=document.getElementById('winf-territories-count');
  if(counter)counter.textContent=active.length+(active.length===1?' LOCALIDADE ATIVA CADASTRADA':' LOCALIDADES ATIVAS CADASTRADAS');
})();

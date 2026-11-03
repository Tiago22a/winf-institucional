'use strict';

(() => {
  const root = document.querySelector('.ac-directory');
  if (!root) return;
  const source = Array.isArray(globalThis.WINF_CIDADES) ? globalThis.WINF_CIDADES : [];
  // Demonstration records are never advertised as real units or available territories.
  const cities = source.filter(city => city && city.exemplo === false && ['ativa', 'nao_ativa'].includes(city.status));
  const query = document.getElementById('directory-query');
  const state = document.getElementById('directory-state');
  const service = document.getElementById('directory-service');
  const results = document.getElementById('directory-results');
  const empty = document.getElementById('directory-empty');
  const count = document.getElementById('directory-count');
  const enquiry = document.getElementById('territory-enquiry');
  const template = document.getElementById('directory-card');
  const modes = root.querySelectorAll('[data-directory-mode]');
  let mode = 'ativas';
  const names = { automotivo: 'Automotivo', residencial: 'Residencial', ambos: 'Automotivo + residencial' };
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const eligible = city => mode === 'ativas' ? city.status === 'ativa' : city.status === 'nao_ativa' && city.disponivelParaAtivacao === true;
  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.origin);
      return url.protocol === 'https:' || url.origin === location.origin ? url.href : null;
    } catch { return null; }
  }
  function addLink(container, label, url) {
    const href = safeUrl(url);
    if (!href) return;
    const link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    if (new URL(href).origin !== location.origin) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    container.append(link);
  }
  const states = [...new Set(cities.filter(city => city.status === 'ativa' || city.disponivelParaAtivacao === true).map(city => city.uf).filter(Boolean))].sort();
  states.forEach(uf => { const option = document.createElement('option'); option.value = uf; option.textContent = uf; state.append(option); });
  function render() {
    const q = normalize(query.value);
    const matched = cities.filter(city => eligible(city) && (!q || normalize(city.cidade + ' ' + city.uf).includes(q)) && (!state.value || city.uf === state.value) && (!service.value || city.tipoAtendimento === service.value || (service.value !== 'ambos' && city.tipoAtendimento === 'ambos')));
    const fragment = document.createDocumentFragment();
    matched.forEach(city => {
      const card = template.content.cloneNode(true);
      card.querySelector('.directory-card-state').textContent = city.uf || '';
      card.querySelector('.directory-card-status').textContent = mode === 'ativas' ? '● Unidade ativa' : 'Ativação disponível';
      card.querySelector('.directory-card-city').textContent = city.cidade;
      card.querySelector('.directory-card-segment').textContent = names[city.tipoAtendimento] || 'Atendimento sob consulta';
      const tags = city.tipoAtendimento === 'ambos' ? ['Automotivo', 'Residencial'] : [names[city.tipoAtendimento]].filter(Boolean);
      tags.forEach(text => { const tag = document.createElement('span'); tag.textContent = text; card.querySelector('.directory-card-tags').append(tag); });
      const links = card.querySelector('.directory-card-links');
      if (mode === 'ativas') {
        addLink(links, 'Conhecer unidade ↗', city.url);
        if (/^55\d{10,11}$/.test(String(city.numero || ''))) addLink(links, 'WhatsApp ↗', 'https://wa.me/' + city.numero);
        if (!links.childElementCount) addLink(links, 'Consultar atendimento ↗', 'https://wa.me/5513981113001?text=' + encodeURIComponent('Olá! Gostaria de atendimento em ' + city.cidade + '/' + city.uf + '.'));
      } else {
        addLink(links, 'Consultar ativação ↗', 'https://wa.me/5513997815375?text=' + encodeURIComponent('Olá! Tenho interesse em ativar um território WINF em ' + city.cidade + '/' + city.uf + '.'));
      }
      fragment.append(card);
    });
    results.replaceChildren(fragment);
    empty.hidden = matched.length !== 0;
    enquiry.hidden = mode !== 'territorios';
    count.textContent = mode === 'ativas' ? matched.length + (matched.length === 1 ? ' unidade encontrada' : ' unidades encontradas') : matched.length + (matched.length === 1 ? ' território encontrado' : ' territórios encontrados');
    document.getElementById('directory-kicker').textContent = mode === 'ativas' ? 'ENCONTRE ATENDIMENTO' : 'CONSULTE A EXPANSÃO';
    document.getElementById('directory-title').textContent = mode === 'ativas' ? 'Onde você está?' : 'Onde você quer começar?';
    document.getElementById('directory-empty-title').textContent = mode === 'ativas' ? 'Vamos encontrar seu atendimento.' : 'Consulte a cidade que você tem em mente.';
    document.getElementById('directory-empty-copy').textContent = mode === 'ativas' ? 'Ainda não há unidades cadastradas que correspondam à sua busca. Fale com a central para confirmar o atendimento na sua região.' : 'A lista de territórios disponíveis será exibida conforme as confirmações da equipe. Você também pode informar uma cidade abaixo e solicitar uma consulta.';
    const contact = document.getElementById('directory-empty-contact');
    contact.textContent = mode === 'ativas' ? 'Falar com a central →' : 'Falar com a expansão →';
    contact.href = mode === 'ativas' ? 'https://wa.me/5513981113001' : 'https://wa.me/5513997815375';
    empty.querySelector('button[data-directory-mode]').hidden = mode === 'territorios';
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.directoryMode === mode)));
  }
  query.addEventListener('input', render);
  state.addEventListener('change', render);
  service.addEventListener('change', render);
  document.getElementById('directory-search').addEventListener('submit', event => event.preventDefault());
  document.getElementById('directory-search').addEventListener('reset', () => { query.value = ''; state.value = ''; service.value = ''; render(); });
  modes.forEach(button => button.addEventListener('click', () => { mode = button.dataset.directoryMode; render(); }));
  document.getElementById('territory-form').addEventListener('submit', event => {
    event.preventDefault();
    const city = document.getElementById('territory-city').value.trim();
    if (!city) return;
    const url = 'https://wa.me/5513997815375?text=' + encodeURIComponent('Olá! Gostaria de verificar a disponibilidade para ativação de um território WINF em ' + city + '.');
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  render();
})();

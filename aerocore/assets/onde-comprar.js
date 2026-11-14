'use strict';

(() => {
  const root = document.querySelector('.ac-directory');
  if (!root) return;
  const source = [
    ...(globalThis.WINF_CIDADES || []),
    ...(globalThis.WINF_PAGINAS_REGIONAIS || [])
  ];
  // Demonstration records are never advertised as real units or available territories.
  const cities = source.filter(city => city && city.exemplo === false && ['ativa', 'pre_ativacao', 'nao_ativa'].includes(city.status));
  const extras = Array.isArray(globalThis.WINF_UNIDADES_EXTRAS) ? globalThis.WINF_UNIDADES_EXTRAS.filter(city => city && city.exemplo === false && city.status === 'ativa') : [];
  const extrasSection = document.getElementById('directory-extras');
  const extraResults = document.getElementById('directory-extra-results');
  const query = document.getElementById('directory-query');
  const state = document.getElementById('directory-state');
  const service = document.getElementById('directory-service');
  const results = document.getElementById('directory-results');
  const empty = document.getElementById('directory-empty');
  const count = document.getElementById('directory-count');
  const enquiry = document.getElementById('territory-enquiry');
  const template = document.getElementById('directory-card');
  const modes = root.querySelectorAll('[data-directory-mode]');
  const more = document.getElementById('directory-more');
  const less = document.createElement('button');
  less.id = 'directory-less';
  less.type = 'button';
  less.className = 'directory-less';
  less.textContent = 'Ver menos ↑';
  less.setAttribute('aria-controls', 'directory-results');
  less.hidden = true;
  more.insertAdjacentElement('afterend', less);
  const selectionBanner = document.getElementById('directory-selection-banner');
  const serviceField = document.querySelector('.directory-service-field');
  const networkNote = document.getElementById('directory-network-note');
  let mode = location.hash === '#territorios' ? 'territorios' : 'ativas';
  const initialCount = () => window.matchMedia('(max-width: 680px)').matches ? 4 : 6;
  const batchCount = 6;
  let visibleLimit = initialCount();
  const names = { automotivo: 'Automotivo', residencial: 'Residencial', ambos: 'Automotivo + residencial' };
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const eligible = city => mode === 'ativas'
    ? city.status === 'ativa'
    : city.status !== 'ativa' && (city.siteAtivo === true || city.disponivelParaAtivacao === true);
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
  const states = [...new Set([...cities, ...extras].map(city => city.uf).filter(Boolean))].sort();
  states.forEach(uf => { const option = document.createElement('option'); option.value = uf; option.textContent = uf; state.append(option); });
  function render() {
    const q = normalize(query.value);
    const matchesFilter = city =>
      (!q || normalize(city.cidade + ' ' + city.uf).includes(q)) &&
      (!state.value || city.uf === state.value) &&
      (mode === 'territorios' || !service.value || city.tipoAtendimento === service.value ||
      (service.value === 'nao_informado' && !city.tipoAtendimento) ||
      (service.value !== 'ambos' && city.tipoAtendimento === 'ambos'));
    const matched = cities.filter(city => eligible(city) && matchesFilter(city));
    const shown = matched.slice(0, visibleLimit);

    function cardsFor(items) {
      const fragment = document.createDocumentFragment();
      items.forEach(city => {
        const active = city.status === 'ativa';
        const card = template.content.cloneNode(true);
        const article = card.querySelector('article');
        article.dataset.status = city.status;
        article.dataset.journey = active ? 'atendimento' : 'expansao';
        card.querySelector('.directory-card-state').textContent = city.uf || 'BR';
        card.querySelector('.directory-card-status').textContent =
          active ? '● Território WINF ativo' : city.siteAtivo ? '◌ Estrutura digital publicada' : '◌ Seleção sob consulta';
        card.querySelector('.directory-card-city').textContent = city.cidade + (city.uf ? ' — ' + city.uf : '');
        card.querySelector('.directory-card-segment').textContent = active
          ? (names[city.tipoAtendimento] || 'Películas para vidros') + ' · Atendimento e instalação mediante confirmação'
          : 'WINF Asset Light™ · oportunidade territorial';
        const claim = card.querySelector('.directory-card-claim');
        if (!active) {
          claim.hidden = false;
          claim.textContent = 'Apenas 1 licenciado selecionado por cidade. Não é para todos.';
        }
        const tags = active
          ? (city.tipoAtendimento === 'ambos' ? ['Automotivo', 'Residencial'] : [names[city.tipoAtendimento] || 'Soluções WINF'])
          : [city.siteAtivo ? 'Página online' : 'Em preparação', 'Exclusividade territorial'];
        tags.forEach(label => {
          const tag = document.createElement('span');
          tag.textContent = label;
          card.querySelector('.directory-card-tags').append(tag);
        });
        const links = card.querySelector('.directory-card-links');
        if (city.siteAtivo === true) {
          addLink(links, active ? 'Ver página da cidade ↗' : 'Conhecer estrutura pronta ↗', city.url);
        }
        if (active) {
          const whatsapp = /^55\d{10,11}$/.test(String(city.numero || ''))
            ? city.numero : '5513981113001';
          const message = 'Olá! Estou em ' + city.cidade + '/' + city.uf +
            ' e gostaria de consultar atendimento WINF Select. Pode me orientar?';
          addLink(links, 'Solicitar atendimento ↗',
            'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message));
          if (city.instagram) addLink(links, 'Instagram ↗', city.instagram);
        } else {
          const message = 'Olá! Vi a estrutura digital WINF da cidade de ' + city.cidade + '/' + city.uf +
            '. Tenho interesse em ser o único licenciado WINF Asset Light™ do município. ' +
            'A seleção ainda está disponível? Gostaria de conhecer o pack, as condições de contratação e a ativação.';
          addLink(links, 'Consultar exclusividade ↗',
            'https://wa.me/5513997815375?text=' + encodeURIComponent(message));
        }
        fragment.append(card);
      });
      return fragment;
    }

    results.replaceChildren(cardsFor(shown));
    const extraMatched = mode === 'ativas' ? extras.filter(matchesFilter) : [];
    extraResults.replaceChildren(cardsFor(extraMatched));
    extrasSection.hidden = extraMatched.length === 0;
    empty.hidden = matched.length + extraMatched.length !== 0;
    enquiry.hidden = mode !== 'territorios';
    selectionBanner.hidden = mode !== 'territorios';
    serviceField.hidden = mode === 'territorios';
    more.hidden = matched.length <= shown.length;
    less.hidden = visibleLimit <= initialCount();
    const remaining = matched.length - shown.length;
    if (remaining > 0) {
      const next = Math.min(batchCount, remaining);
      more.textContent = 'Ver mais ' + next + (next === 1 ? ' cidade ↓' : ' cidades ↓');
    }
    more.setAttribute('aria-expanded', String(visibleLimit > initialCount()));
    less.setAttribute('aria-expanded', String(visibleLimit > initialCount()));
    count.textContent = mode === 'ativas'
      ? (matched.length + extraMatched.length) + ' cidades com atendimento WINF'
      : matched.length + (matched.length === 1 ? ' cidade na vitrine de expansão' : ' cidades na vitrine de expansão');
    networkNote.hidden = mode !== 'ativas';
    networkNote.textContent = 'Atendimento e agenda sujeitos à confirmação';
    document.getElementById('directory-kicker').textContent = mode === 'ativas'
      ? 'WINF SELECT™ / ATENDIMENTO' : 'WINF PARTNERS™ / TERRITÓRIOS';
    document.getElementById('directory-title').textContent = mode === 'ativas'
      ? 'Encontre sua cidade.' : 'Sua cidade pode ser a próxima.';
    document.getElementById('directory-empty-title').textContent = mode === 'ativas'
      ? 'Sua cidade pode ser a próxima.' : 'Não encontrou sua cidade?';
    document.getElementById('directory-empty-copy').textContent = mode === 'ativas'
      ? 'Explore as cidades com estrutura digital WINF preparada para expansão. A oportunidade de representar sua cidade pode estar aberta.'
      : 'Conte qual município você deseja desenvolver. Nossa equipe pode verificar o cadastro e as condições de seleção.';
    const contact = document.getElementById('directory-empty-contact');
    contact.textContent = mode === 'ativas' ? 'Consultar atendimento →' : 'Falar com expansão →';
    contact.href = mode === 'ativas'
      ? 'https://wa.me/5513981113001?text=' + encodeURIComponent('Olá! Quero consultar atendimento WINF na minha cidade.')
      : 'https://wa.me/5513997815375?text=' + encodeURIComponent('Olá! Quero consultar o território WINF Asset Light™ da minha cidade.');
    empty.querySelector('button[data-directory-mode]').hidden = mode === 'territorios';
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.directoryMode === mode)));
  }
  const refresh = () => { visibleLimit = initialCount(); render(); };
  query.addEventListener('input', refresh);
  state.addEventListener('change', refresh);
  service.addEventListener('change', refresh);
  document.getElementById('directory-search').addEventListener('submit', event => event.preventDefault());
  document.getElementById('directory-search').addEventListener('reset', event => {
    event.preventDefault();
    query.value = '';
    state.value = '';
    service.value = '';
    refresh();
  });
  modes.forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.directoryMode;
    if (mode === 'territorios') service.value = '';
    visibleLimit = initialCount();
    render();
  }));
  more.addEventListener('click', () => {
    visibleLimit += batchCount;
    render();
  });
  less.addEventListener('click', () => {
    visibleLimit = initialCount();
    render();
    document.getElementById('directory-title').scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });
  document.getElementById('territory-form').addEventListener('submit', event => {
    event.preventDefault();
    const city = document.getElementById('territory-city').value.trim();
    if (!city) return;
    const message = 'Olá! Quero verificar a disponibilidade para ser o único licenciado WINF Asset Light™ em ' + city +
      '. Gostaria de conhecer o pack digital já preparado, as condições e o processo de ativação.';
    window.open('https://wa.me/5513997815375?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
  window.addEventListener('hashchange', () => {
    if (location.hash === '#territorios') { mode = 'territorios'; render(); }
  });
  render();
})();

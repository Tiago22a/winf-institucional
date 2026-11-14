'use strict';

(() => {
  const root = document.querySelector('.ac-directory');
  if (!root) return;
  const legacy = [
    ...(globalThis.WINF_CIDADES || []),
    ...(globalThis.WINF_PAGINAS_REGIONAIS || [])
  ].filter(city => city && city.exemplo === false && ['ativa', 'pre_ativacao', 'nao_ativa'].includes(city.status));
  // Consulta os 200 municípios da fonte oficial já presente no site.
  // Não cria uma segunda lista estática de municípios nem publica rotas locais.
  const byId = new Map(legacy.filter(city => city.id).map(city => [city.id, city]));
  const cities = [...byId.values()];
  const isWinfDirectory = root.classList.contains('winf-directory');
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
    ? (city.onDemand === true || city.status === 'ativa')
    : (city.onDemand === true ||
        (city.status !== 'ativa' && (city.siteAtivo === true || city.disponivelParaAtivacao === true)));
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
  function refreshStates(){
    const existing = new Set([...state.options].map(o => o.value));
    [...new Set([...cities,...extras].map(x=>x.uf).filter(Boolean))].sort().forEach(uf=>{
      if(existing.has(uf))return;
      const option=document.createElement('option');option.value=uf;option.textContent=uf;
      state.append(option);
    });
  }
  refreshStates();
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
        const onDemand = city.onDemand === true;
        const active = city.status === 'ativa' && !onDemand;
        const serviceJourney = mode === 'ativas';
        const card = template.content.cloneNode(true);
        const article = card.querySelector('article');
        article.dataset.status = onDemand ? 'pre_ativacao' : city.status;
        article.dataset.journey = serviceJourney ? 'atendimento' : 'expansao';
        card.querySelector('.directory-card-state').textContent = city.uf || 'BR';
        card.querySelector('.directory-card-status').textContent = serviceJourney
          ? (onDemand ? '◌ Solicitações WINF abertas' : '● Atendimento WINF')
          : (onDemand ? '◌ Titular licenciado não atribuído' :
             city.siteAtivo ? '◌ Estrutura digital publicada' : '◌ Seleção sob consulta');
        card.querySelector('.directory-card-city').textContent = city.cidade + (city.uf ? ' — ' + city.uf : '');
        card.querySelector('.directory-card-segment').textContent = serviceJourney
          ? (onDemand ? 'Atendimento sob demanda · execução e agenda mediante confirmação' :
             (names[city.tipoAtendimento] || 'Películas para vidros') + ' · Atendimento e instalação mediante confirmação')
          : 'WINF Asset Light™ · oportunidade de licenciamento territorial';
        const claim = card.querySelector('.directory-card-claim');
        if (!serviceJourney && !active) {
          claim.hidden = false;
          claim.textContent = 'Licenciamento por seleção e contrato; o atendimento ao consumidor já recebe solicitações.';
        }
        const tags = serviceJourney
          ? (onDemand ? ['Atendimento WINF', 'Sob consulta'] :
             (city.tipoAtendimento === 'ambos' ? ['Automotivo', 'Residencial'] : [names[city.tipoAtendimento] || 'Soluções WINF']))
          : (onDemand ? ['Seleção territorial', 'Sem titular licenciado'] :
             [city.siteAtivo ? 'Página online' : 'Em preparação', 'Exclusividade territorial']);
        tags.forEach(label => {
          const tag = document.createElement('span');
          tag.textContent = label;
          card.querySelector('.directory-card-tags').append(tag);
        });
        const links = card.querySelector('.directory-card-links');
        // Não ressuscitar URLs de páginas geográficas removidas do sitemap.
        if (!onDemand && city.siteAtivo === true) {
          addLink(links, serviceJourney ? 'Ver página da cidade ↗' : 'Conhecer estrutura pronta ↗', city.url);
        }
        if (serviceJourney) {
          const whatsapp = onDemand ? '5513981113001' :
            (/^55\d{10,11}$/.test(String(city.numero || '')) ? city.numero : '5513981113001');
          const subject = service.value && names[service.value]
            ? ' Tenho interesse em ' + names[service.value].toLowerCase() + '.' : '';
          const message = 'Olá! Estou em ' + city.cidade + '/' + city.uf +
            ' e gostaria de solicitar atendimento WINF.' + subject +
            ' Podem confirmar a disponibilidade para meu serviço?';
          addLink(links, 'Solicitar atendimento ↗',
            'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message));
          if (!onDemand && city.instagram) addLink(links, 'Instagram ↗', city.instagram);
        } else {
          const message = 'Olá! Gostaria de conhecer as condições para licenciar o território WINF de ' +
            city.cidade + '/' + city.uf + '. Está disponível para seleção?';
          addLink(links, 'Consultar licenciamento ↗',
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
      ? (matched.length + extraMatched.length) + ' cidades para consultar atendimento WINF'
      : matched.length + (matched.length === 1 ? ' cidade na vitrine de expansão' : ' cidades na vitrine de expansão');
    networkNote.hidden = mode !== 'ativas';
    networkNote.textContent = 'Atendimento WINF sob demanda · execução e agenda sob confirmação';
    document.getElementById('directory-kicker').textContent = mode === 'ativas'
      ? 'WINF™ / ATENDIMENTO' : 'WINF PARTNERS™ / TERRITÓRIOS';
    document.getElementById('directory-title').textContent = mode === 'ativas'
      ? 'Encontre sua cidade.' : 'Sua cidade pode ser a próxima.';
    document.getElementById('directory-empty-title').textContent = mode === 'ativas'
      ? 'Sua cidade pode ser a próxima.' : 'Não encontrou sua cidade?';
    document.getElementById('directory-empty-copy').textContent = mode === 'ativas'
      ? 'Não encontrou sua cidade? Envie sua solicitação à WINF para consultar cobertura, condições e agenda.'
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
  if (isWinfDirectory) {
    fetch('/config/winf-territorios-consumidor-200.json', {cache:'no-store'})
      .then(response => {if (!response.ok) throw Error('Cadastro de atendimento indisponível');return response.json();})
      .then(data => {
        if (!data || !Array.isArray(data.territories) || data.territories.length!==200 ||
            new Set(data.territories.map(x=>x.id)).size!==200)
          throw Error('Cadastro incompleto');
        const central=/^55[1-9][0-9]{9,10}$/.test(String(data.whatsapp||''))
          ? data.whatsapp : '5513981113001';
        data.territories.forEach(item => {
          if (!item || !/^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2}$/.test(item.id) ||
              !/^[A-Z]{2}$/.test(item.uf) || typeof item.cidade!=='string' || !item.cidade.trim()) return;
          // Um site comercial não equivale a loja física, instalador ativo ou licença.
          byId.set(item.id,{
            id:item.id,cidade:item.cidade,uf:item.uf,
            status:'pre_ativacao',exemplo:false,onDemand:true,
            numero:central,tipoAtendimento:'residencial',
            siteAtivo:false,url:null,instagram:null,
            disponivelParaAtivacao:true
          });
        });
        if (data.territories.some(x => !byId.has(x.id)))
          throw Error('Cadastro inconsistente');
        cities.splice(0,cities.length,...byId.values());
        refreshStates();
        render();
      })
      .catch(error => {
        console.warn('[WINF] Consulta dos territórios temporariamente indisponível.',error);
        networkNote.hidden=false;
        networkNote.textContent='Consulta ampliada indisponível; envie sua cidade pelo WhatsApp oficial.';
      });
  }
})();

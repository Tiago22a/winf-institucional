(() => {
  const root = document.getElementById('vitrine-territorios');
  const query = document.getElementById('vitrine-busca');
  const gps = document.getElementById('vitrine-gps');
  const local = document.getElementById('vitrine-local');
  const status = document.getElementById('vitrine-resultados');
  const positions = {"1100205":[-8.76077,-63.8999],"1200401":[-9.97499,-67.8243],"1302603":[-3.11866,-60.0212],"1400100":[2.82384,-60.6753],"1501402":[-1.4554,-48.4898],"1502152":[-6.49659,-49.8776],"1505536":[-6.06781,-49.9037],"1600303":[0.034934,-51.0694],"1721000":[-10.24,-48.3558],"2111300":[-2.53874,-44.2825],"2211001":[-5.09194,-42.8034],"2304400":[-3.71664,-38.5423],"2307650":[-3.86699,-38.6259],"2408102":[-5.79357,-35.1986],"2504009":[-7.22196,-35.8731],"2507507":[-7.11509,-34.8641],"2602902":[-8.28218,-35.0253],"2606200":[-7.5606,-34.9959],"2607208":[-8.39303,-35.0609],"2607901":[-8.11298,-35.015],"2611606":[-8.04666,-34.8771],"2704302":[-9.66599,-35.735],"2800308":[-10.9091,-37.0677],"2905701":[-12.6996,-38.3263],"2910800":[-12.2664,-38.9663],"2927408":[-12.9718,-38.5011],"2929206":[-12.6183,-38.6786],"2933307":[-14.8615,-40.8442],"3106200":[-19.9102,-43.9266],"3106705":[-19.9668,-44.2008],"3118601":[-19.9321,-44.0539],"3125101":[-22.854,-46.3178],"3131307":[-19.4703,-42.5476],"3136702":[-21.7595,-43.3398],"3143302":[-16.7282,-43.8578],"3144805":[-19.9758,-43.8509],"3152501":[-22.2266,-45.9389],"3167202":[-19.4569,-44.2413],"3170107":[-19.7472,-47.9381],"3170206":[-18.9141,-48.2749],"3201308":[-20.2632,-40.4165],"3205002":[-20.121,-40.3074],"3205200":[-20.3417,-40.2875],"3205309":[-20.3155,-40.3128],"3300100":[-23.0011,-44.3196],"3300209":[-22.8697,-42.3326],"3300704":[-22.8894,-42.0286],"3301009":[-21.7622,-41.3181],"3301702":[-22.7858,-43.3049],"3302403":[-22.3768,-41.7848],"3302700":[-22.9354,-42.8246],"3303302":[-22.8832,-43.1034],"3303500":[-22.7556,-43.4603],"3303906":[-22.52,-43.1926],"3304201":[-22.4705,-44.4509],"3304557":[-22.9129,-43.2003],"3304904":[-22.8268,-43.0634],"3305000":[-21.638,-41.0446],"3305505":[-22.9292,-42.5099],"3306305":[-22.5202,-44.0996],"3501608":[-22.7374,-47.3331],"3501905":[-22.7088,-46.772],"3502754":[-23.4366,-47.0608],"3502804":[-21.2076,-50.4401],"3503208":[-21.7845,-48.178],"3503307":[-22.3572,-47.3842],"3503901":[-23.3965,-46.32],"3504008":[-22.66,-50.4183],"3504107":[-23.1171,-46.5563],"3505500":[-20.5531,-48.5698],"3505708":[-23.5057,-46.879],"3506003":[-22.3246,-49.0871],"3506102":[-20.9491,-48.4791],"3506508":[-21.291,-50.3432],"3507506":[-22.8837,-48.4437],"3507605":[-22.9527,-46.5419],"3508405":[-23.3053,-47.1362],"3508504":[-23.0992,-45.7076],"3509007":[-23.3607,-46.7397],"3509205":[-23.355,-46.8781],"3509502":[-22.9053,-47.0659],"3510500":[-23.6125,-45.4125],"3510609":[-23.5235,-46.8407],"3511102":[-21.1314,-48.977],"3513009":[-23.6022,-46.919],"3513504":[-23.8911,-46.424],"3513801":[-23.6813,-46.6205],"3515004":[-23.6437,-46.8579],"3515707":[-23.5411,-46.371],"3516200":[-20.5352,-47.4039],"3516408":[-23.3229,-46.729],"3518404":[-22.8075,-45.1938],"3518701":[-23.9888,-46.258],"3518800":[-23.4538,-46.5333],"3519071":[-22.8529,-47.2143],"3520400":[-23.7785,-45.3552],"3520509":[-23.0816,-47.2101],"3522208":[-23.7161,-46.8572],"3522307":[-23.5886,-48.0483],"3522505":[-23.5488,-46.9327],"3522604":[-22.4357,-46.8224],"3523107":[-23.4835,-46.3457],"3523404":[-23.0035,-46.8464],"3523909":[-23.2544,-47.2927],"3524006":[-23.1526,-47.0593],"3524402":[-23.2983,-45.9658],"3524709":[-22.7037,-46.9851],"3525003":[-23.5275,-46.9023],"3525300":[-22.2936,-48.5592],"3525904":[-23.1852,-46.8974],"3526704":[-22.1809,-47.3841],"3526803":[-22.6027,-48.8037],"3526902":[-22.566,-47.397],"3527108":[-21.6718,-49.7526],"3527306":[-23.0856,-46.9484],"3529005":[-22.2171,-49.9501],"3529302":[-21.6025,-48.364],"3529401":[-23.6677,-46.4613],"3530607":[-23.5208,-46.1854],"3530706":[-22.3675,-46.9428],"3530805":[-22.4332,-46.9532],"3531803":[-22.945,-47.3122],"3533403":[-22.7832,-47.2941],"3534401":[-23.5324,-46.7916],"3534708":[-22.9797,-49.8697],"3536505":[-22.7542,-47.1488],"3538006":[-22.9246,-45.4613],"3538709":[-22.7338,-47.6476],"3539806":[-23.5333,-46.3473],"3540606":[-23.2093,-47.5251],"3541000":[-24.0084,-46.4121],"3541406":[-22.1207,-51.3925],"3543303":[-23.7067,-46.4058],"3543402":[-21.1699,-47.8099],"3543907":[-22.3984,-47.5546],"3545209":[-23.1996,-47.2931],"3545803":[-22.7553,-47.4143],"3547304":[-23.4439,-46.9178],"3547809":[-23.6737,-46.5432],"3548500":[-23.9535,-46.335],"3548708":[-23.6914,-46.5646],"3548807":[-23.6229,-46.5548],"3548906":[-22.0174,-47.886],"3549102":[-21.9707,-46.7944],"3549805":[-20.8113,-49.3758],"3549904":[-23.1896,-45.8841],"3550308":[-23.5329,-46.6395],"3550704":[-23.7951,-45.4143],"3551009":[-23.9574,-46.3883],"3551702":[-21.1316,-47.9875],"3552205":[-23.4969,-47.4451],"3552403":[-22.8204,-47.2728],"3552502":[-23.5448,-46.3112],"3552809":[-23.6019,-46.7526],"3554003":[-23.3487,-47.8461],"3554102":[-23.0104,-45.5593],"3556206":[-22.9698,-46.9974],"3556503":[-23.2136,-46.8234],"3556701":[-23.0302,-46.9833],"3557006":[-23.5446,-47.4388],"4101804":[-25.5859,-49.4047],"4104808":[-24.9573,-53.459],"4106902":[-25.4195,-49.2646],"4108304":[-25.5427,-54.5827],"4113700":[-23.304,-51.1691],"4115200":[-23.4205,-51.9333],"4118204":[-25.5161,-48.5225],"4119905":[-25.0916,-50.1668],"4125506":[-25.5313,-49.2031],"4202404":[-26.9155,-49.0709],"4204202":[-27.1004,-52.6152],"4204608":[-28.6723,-49.3729],"4205407":[-27.5945,-48.5477],"4208203":[-26.9101,-48.6705],"4208906":[-26.4851,-49.0713],"4209102":[-26.3045,-48.8487],"4216602":[-27.6136,-48.6366],"4304606":[-29.9128,-51.1857],"4305108":[-29.1629,-51.1792],"4309209":[-29.9413,-50.9869],"4313409":[-29.6875,-51.1328],"4314100":[-28.2576,-52.4091],"4314407":[-31.7649,-52.3371],"4314902":[-30.0318,-51.2065],"4315602":[-32.0349,-52.1071],"4316808":[-29.722,-52.4343],"4318705":[-29.7545,-51.1498],"5002704":[-20.4486,-54.6295],"5003702":[-22.2231,-54.812],"5008305":[-20.7849,-51.7007],"5103403":[-15.601,-56.0974],"5107602":[-16.4673,-54.6372],"5107909":[-11.8604,-55.5091],"5107925":[-12.5425,-55.7211],"5108402":[-15.6458,-56.1322],"5201108":[-16.3281,-48.953],"5201405":[-16.8198,-49.2469],"5208707":[-16.6864,-49.2643],"5218805":[-17.7923,-50.9192],"5300108":[-15.7795,-47.9297]};
  const normalize = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
  const searchText = s => normalize(s).replace(/[\s/,-]+/g, ' ');
  // O site publicado não confirma operação local ou licença já concedida.
  // A situação operacional vem do cadastro WINF, sem expor a lógica interna de roteamento.
  const catalog = [
    ...(globalThis.WINF_CIDADES || []),
    ...(globalThis.WINF_PAGINAS_REGIONAIS || []),
    ...(globalThis.WINF_UNIDADES_EXTRAS || [])
  ];
  const byPath = new Map(catalog.filter(city => city && city.url).map(city =>
    [new URL(city.url, location.origin).pathname, city]));
  const items = [...root.querySelectorAll('[data-territorio]')];
  items.forEach(item => {
    const page = item.querySelector('a');
    if (!page) return;
    const city = byPath.get(new URL(page.getAttribute('href'), location.origin).pathname);
    const active = city && city.status === 'ativa';
    const label = page.textContent.trim();
    item.dataset.journey = active ? 'atendimento' : 'expansao';
    item.querySelectorAll('small').forEach(info => {
      if (/atendimento sob consulta/i.test(info.textContent)) info.remove();
    });
    const state = document.createElement('span');
    state.className = 'vitrine-state';
    state.textContent = active ? '● Atendimento WINF' : '◌ Território para ativação';
    const action = document.createElement('a');
    action.className = 'vitrine-cta';
    action.target = '_blank';
    action.rel = 'noopener noreferrer';
    if (active) {
      const phone = /^55\d{10,11}$/.test(String(city.numero || '')) ? city.numero : '5513981113001';
      action.textContent = 'Solicitar atendimento ↗';
      action.href = 'https://wa.me/' + phone + '?text=' +
        encodeURIComponent('Olá! Quero consultar atendimento WINF Select para ' + label + '.');
    } else {
      const cityName = label.replace(/\s*\/\s*/, '/');
      action.textContent = 'Verificar exclusividade ↗';
      action.href = 'https://wa.me/5513997815375?text=' +
        encodeURIComponent('Olá! Vi o território WINF ' + cityName +
        ' na vitrine. Quero saber se ainda posso ser o único licenciado Asset Light™ nesta cidade e receber as condições do pack de ativação.');
      const limit = document.createElement('small');
      limit.textContent = '1 selecionado por cidade';
      item.append(limit);
    }
    item.append(state, action);
  });
  const groups = [...root.querySelectorAll('[data-ver]')].map(button => ({
    button, items: [...document.getElementById(button.dataset.ver).children], expanded: false
  }));
  const states = new Set(groups.flatMap(group => group.items.map(item =>
    normalize(item.querySelector('a').textContent.split('/').at(-1))
  )));
  function render() {
    const term = searchText(query.value);
    let count = 0;
    for (const group of groups) {
      const matches = group.items.filter(item => {
        const label = item.querySelector('a').textContent;
        const uf = normalize(label.split('/').at(-1));
        if (states.has(term)) {
          return uf === term;
        }
        return searchText(item.textContent).includes(term);
      });
      const visible = new Set(matches.slice(0, group.expanded ? matches.length : 8));
      for (const item of group.items) item.hidden = !visible.has(item);
      group.button.hidden = matches.length <= 8;
      group.button.textContent = group.expanded ? 'Ver menos' : 'Ver mais cidades';
      group.button.setAttribute('aria-expanded', String(group.expanded && matches.length > 8));
      count += matches.length;
    }
    status.textContent = term ? count + (count === 1 ? ' território encontrado' : ' territórios encontrados') : '';
  }
  for (const group of groups) group.button.addEventListener('click', () => {
    group.expanded = !group.expanded;
    render();
  });
  query.addEventListener('input', render);
  gps.addEventListener('click', () => {
    if (!navigator.geolocation) {
      local.textContent = 'Localização indisponível. Use a busca por cidade ou UF.';
      return;
    }
    gps.disabled = true;
    local.textContent = 'Buscando o território mais próximo…';
    navigator.geolocation.getCurrentPosition(({coords}) => {
      const rad = Math.PI / 180;
      const distance = ([lat, lon]) => Math.sin((lat - coords.latitude) * rad / 2) ** 2 +
        Math.cos(lat * rad) * Math.cos(coords.latitude * rad) * Math.sin((lon - coords.longitude) * rad / 2) ** 2;
      const nearest = Object.entries(positions).reduce((best, item) =>
        distance(item[1]) < distance(best[1]) ? item : best);
      const item = root.querySelector('[data-territorio="' + nearest[0] + '"]');
      const link = item.querySelector('a').cloneNode(true);
      local.replaceChildren('Cidade encontrada na vitrine: ', link);
      gps.disabled = false;
    }, () => {
      local.textContent = 'Não foi possível usar a localização. Busque por cidade ou UF.';
      gps.disabled = false;
    }, {timeout: 9000, maximumAge: 300000});
  });
  render();
})();

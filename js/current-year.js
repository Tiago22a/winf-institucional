(() => {
  'use strict';

  const renderYear = () => {
    document.querySelectorAll('[data-current-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  };

  const groups = {
    select: {
      label: 'WINF SELECT™', tagline: 'Arquitetura, luz e conforto em perfeita sintonia.',
      intro: 'Películas arquitetônicas para espaços que exigem mais do que proteção.',
      accent: '#c6d4c4',
      columns: [
        ['EXPLORAR', [['Home WINF', '/'], ['Catálogo Select', '/catalogo/'], ['Glass+ Home', '/winf-home/'], ['Journal', '/blog/']]],
        ['PELÍCULAS', [['Invisible®', '/invisible/'], ['DualReflect®', '/dual-reflect/'], ['BlackPro®', '/blackpro/'], ['Ceramic', '/ceramic/']]],
        ['SOLUÇÕES', [['Security Blind', '/securityblind/'], ['MiniBlind Venetian', '/miniblind-venetian/'], ['Santos, SP', '/cidades/santos-sp/'], ['Sorocaba, SP', '/cidades/sorocaba-sp/']]]
      ],
      social: [['WINF OFICIAL', 'https://www.instagram.com/winf.ofc/'], ['WINF PARTNERS', 'https://www.instagram.com/winfpartners/']]
    },
    aero: {
      label: 'AEROCORE™', tagline: 'Nascida no espaço. Feita para a Terra.',
      intro: 'Tecnologia de proteção avançada para máquinas e experiências extraordinárias.',
      accent: '#aebdc4',
      columns: [
        ['UNIVERSO', [['Home AeroCore', '/aerocore/'], ['Tecnologia AeroCore', '/aerocore/aerocore/'], ['NeoSkin™ PPF', '/aerocore/neoskin/'], ['WINF Oficial', '/']]],
        ['EXPERIÊNCIAS', [['Automotive', '/aerocore/luxo/'], ['Motorsports', '/aerocore/motorsports/'], ['Marine', '/aerocore/marine/'], ['Aeronáutica', '/aerocore/aeronautica/']]],
        ['COLEÇÕES', [['Ghost', '/aerocore/ghost/'], ['Phantom', '/aerocore/phantom/'], ['Spectre', '/aerocore/spectre/'], ['Contato', '/aerocore/contato/']]]
      ],
      social: [['AEROCORE OFICIAL', 'https://www.instagram.com/aerocoreofc/'], ['NEOSKIN OFICIAL', 'https://www.instagram.com/neoskinofc/']]
    },
    neoskin: {
      label: 'NEOSKIN™', tagline: 'A próxima pele da sua máquina.',
      intro: 'Proteção de pintura com engenharia, precisão e presença.',
      accent: '#91a568',
      columns: [
        ['DESCOBRIR', [['NeoSkin™', '/aerocore/neoskin/'], ['AeroCore™', '/aerocore/'], ['Tecnologia AeroCore', '/aerocore/aerocore/'], ['WINF Oficial', '/']]],
        ['UNIVERSO AEROCORE', [['Ghost', '/aerocore/ghost/'], ['Phantom', '/aerocore/phantom/'], ['Motorsports', '/aerocore/motorsports/'], ['Supermáquinas', '/aerocore/supermaquinas/']]],
        ['CONEXÃO', [['Contato', '/aerocore/contato/'], ['Licenciamento', '/aerocore/licenciamento/'], ['WINF Partners', '/partners/'], ['Catálogo arquitetônico', '/catalogo/']]]
      ],
      social: [['NEOSKIN OFICIAL', 'https://www.instagram.com/neoskinofc/'], ['AEROCORE OFICIAL', 'https://www.instagram.com/aerocoreofc/']]
    }
  };

  const escapeHtml = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const makeLink = ([label, href]) => '<a href="' + escapeHtml(href) + '"' + (href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + escapeHtml(label) + '</a>';

  function upgradeFooter() {
    const path = window.location.pathname.toLowerCase();
    const type = path.startsWith('/aerocore/neoskin') || path.startsWith('/neoskin/') ? 'neoskin'
      : path.startsWith('/aerocore/') ? 'aero' : 'select';
    const data = groups[type];
    const oldFooter = document.querySelector('footer');
    if (!oldFooter && !document.body) return;
    const style = document.createElement('style');
    style.textContent = `
      .winf-signature-footer{position:relative;isolation:isolate;background:#080a0b!important;color:#e8eae8!important;border-top:1px solid rgba(255,255,255,.14);padding:76px clamp(20px,5vw,72px) 30px;font-family:inherit;line-height:1.5;text-transform:none}
      .winf-signature-footer *{box-sizing:border-box}
      .winf-signature-footer .wf-inner{max-width:1260px;margin:auto}
      .winf-signature-footer .wf-head{display:flex;justify-content:space-between;align-items:start;gap:32px;padding-bottom:55px}
      .winf-signature-footer .wf-eyebrow{font-size:10px;letter-spacing:.34em;font-weight:600;color:var(--wf-accent);margin:0 0 15px}
      .winf-signature-footer .wf-wordmark{font-size:clamp(27px,4vw,47px);letter-spacing:.11em;font-weight:600;line-height:1.12;color:#fff;text-decoration:none}
      .winf-signature-footer .wf-tagline{font-size:12px;letter-spacing:.1em;color:#a7ada9;margin:16px 0 0}
      .winf-signature-footer .wf-intro{font-size:13px;line-height:1.9;color:#a5aaa7;max-width:320px;margin:0}
      .winf-signature-footer .wf-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) minmax(170px,1fr);gap:35px;border-top:1px solid rgba(255,255,255,.12);padding:39px 0 45px}
      .winf-signature-footer .wf-label{font-size:10px;font-weight:600;letter-spacing:.24em;color:var(--wf-accent);margin:0 0 18px}
      .winf-signature-footer .wf-links{display:flex;flex-direction:column;align-items:flex-start;gap:13px}
      .winf-signature-footer a{color:#aab0ae;text-decoration:none;transition:color .2s ease}
      .winf-signature-footer a:hover,.winf-signature-footer a:focus-visible{color:#fff;text-decoration:underline;text-underline-offset:5px}
      .winf-signature-footer .wf-links a{font-size:12px;letter-spacing:.025em}
      .winf-signature-footer .wf-bottom{border-top:1px solid rgba(255,255,255,.12);padding-top:25px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:15px;color:#818986;font-size:10px;letter-spacing:.08em}
      .winf-signature-footer .wf-bottom a{color:#b9c2bc}
      @media(max-width:780px){.winf-signature-footer{padding-top:56px}.winf-signature-footer .wf-head{flex-direction:column;padding-bottom:35px}.winf-signature-footer .wf-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:35px 20px}}
      @media(max-width:420px){.winf-signature-footer .wf-grid{grid-template-columns:1fr 1fr}.winf-signature-footer .wf-wordmark{font-size:27px}}
    `;
    document.head.appendChild(style);

    const footer = document.createElement('footer');
    footer.className = 'winf-signature-footer';
    footer.setAttribute('aria-label', 'Navegação institucional ' + data.label);
    footer.style.setProperty('--wf-accent', data.accent);
    const columns = data.columns.map(([title, links]) =>
      '<nav aria-label="' + escapeHtml(title) + '"><p class="wf-label">' + escapeHtml(title) + '</p><div class="wf-links">' + links.map(makeLink).join('') + '</div></nav>'
    ).join('');
    footer.innerHTML = '<div class="wf-inner"><div class="wf-head"><div><p class="wf-eyebrow">WINF GROUP / TECNOLOGIA E DESIGN</p>' +
      '<a class="wf-wordmark" href="' + (type === 'select' ? '/' : type === 'aero' ? '/aerocore/' : '/aerocore/neoskin/') + '">' + escapeHtml(data.label) + '</a>' +
      '<p class="wf-tagline">' + escapeHtml(data.tagline) + '</p></div><p class="wf-intro">' + escapeHtml(data.intro) + '</p></div>' +
      '<div class="wf-grid">' + columns + '<nav aria-label="Redes oficiais"><p class="wf-label">ACOMPANHE</p><div class="wf-links">' + data.social.map(makeLink).join('') + '</div></nav></div>' +
      '<div class="wf-bottom"><span>© <span data-current-year></span> WINF GROUP. DO BRASIL PARA O MUNDO.</span><span><a href="/partners/">WINF PARTNERS™</a> &nbsp; / &nbsp; <a href="/aerocore/policies/">POLÍTICAS</a></span></div></div>';
    if (oldFooter) oldFooter.replaceWith(footer);
    else document.body.appendChild(footer);
  }
  function init() { upgradeFooter(); renderYear(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

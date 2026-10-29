/* WINF™ — rodapé institucional único, links contextuais por família. */
(function () {
  "use strict";
  var path = (window.location.pathname || "/").toLowerCase().replace(/\/+/g, "/");
  var link = {
    select:"/", invisible:"/invisible/", dual:"/dual-reflect/", black:"/blackpro/",
    security:"/securityblind/", decor:"/miniblind-venetian/",
    aero:"/aerocore/", films:"/aerocore/aerocore/", ppf:"/aerocore/neoskin/",
    ceramic:"/aerocore/ceramic-armoring/", marine:"/aerocore/marine/",
    aircraft:"/aerocore/aeronautica/", motorsports:"/aerocore/motorsports/",
    partners:"/partners/", blog:"/blog/", catalog:"/catalogo/",
    contact:"/#contato", privacy:"/aerocore/policies/#privacidade"
  };
  var selectLines = [
    ["Invisible™ — Nano Cerâmica",link.invisible],
    ["DualReflect™ — Controle Solar",link.dual],
    ["BlackPro™ — Privacidade",link.black],
    ["SecurityBlinder™ — Segurança",link.security],
    ["Miniblind & Venetian™",link.decor]
  ];
  var aeroLines = [
    ["AeroCore™ — Películas",link.films],
    ["NeoSkin™ — PPF",link.ppf],
    ["Ceramic Armoring™",link.ceramic],
    ["AeroCore Marine",link.marine],
    ["AeroCore Aircraft",link.aircraft],
    ["AeroCore Motorsports",link.motorsports]
  ];
  var ecosystem = [
    ["WINF Select™",link.select],
    ["AeroCore™",link.aero],
    ["NeoSkin™",link.ppf],
    ["WINF Partners™",link.partners],
    ["WINF Journal™",link.blog]
  ];
  var variants = {
    select:{
      label:"WINF SELECT™ / ARQUITETURA",brand:"WINF",url:link.select,
      description:"Engenharia invisível aplicada ao vidro. Conforto térmico, proteção, privacidade e estética para projetos que exigem mais.",
      lines:selectLines,instagram:"winf.ofc"
    },
    aero:{
      label:"AEROCORE™ / PERFORMANCE",brand:"AEROCORE",url:link.aero,
      description:"Tecnologia de alto desempenho para mobilidade. Proteção e engenharia para quem vai além do convencional.",
      lines:aeroLines,instagram:"aerocoreofc"
    },
    ppf:{
      label:"NEOSKIN™ / PAINT PROTECTION",brand:"NEOSKIN",url:link.ppf,
      description:"Proteção de pintura com engenharia e precisão. Uma nova dimensão de acabamento e resistência.",
      lines:[
        ["NeoSkin™ — PPF",link.ppf],
        ["AeroCore™ — Películas",link.films],
        ["Ceramic Armoring™",link.ceramic],
        ["AeroCore Motorsports",link.motorsports]
      ],instagram:"neoskinofc"
    },
    partners:{
      label:"WINF PARTNERS™ / EXPANSÃO",brand:"WINF",url:link.partners,
      description:"Um ecossistema de marcas, tecnologia e oportunidades. Conheça as frentes de atuação da WINF™.",
      lines:[
        ["WINF Asset Light™",link.partners],
        ["WINF Select™ — Arquitetura",link.select],
        ["AeroCore™ — Mobilidade",link.aero],
        ["NeoSkin™ — PPF",link.ppf],
        ["Ceramic Armoring™",link.ceramic]
      ],instagram:"winfpartners"
    }
  };
  var family = "select";
  if (path.indexOf("/aerocore/neoskin/")===0 || path.indexOf("/neoskin/")===0 || path.indexOf("/blog/ppf-armadura-invisivel/")===0) {
    family = "ppf";
  } else if (path.indexOf("/aerocore/")===0 || path.indexOf("/ceramic/")===0) {
    family = "aero";
  } else if (path.indexOf("/partners/")===0 || path.indexOf("/briefing/")===0) {
    family = "partners";
  }
  var v = variants[family];
  function nav(items) {
    return items.map(function (item) {
      return '<li><a class="wf-footer__link" href="'+item[1]+'">'+item[0]+'</a></li>';
    }).join("");
  }
  function enhanceFooter(footer) {
    if (footer.dataset.enhanced) return;
    footer.dataset.enhanced = 'true';
    footer.querySelector('.wf-footer__back-top').addEventListener('click', function () {
      window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
    document.querySelectorAll('[data-current-year]').forEach(function (element) { element.textContent = new Date().getFullYear(); });
  }
  function render() {
    var present = document.getElementById("winf-global-footer");
    if (present) { enhanceFooter(present); return; }
    var footer = document.createElement("footer");
    footer.id = "winf-global-footer";
    footer.className = "wf-footer";
    footer.setAttribute("data-footer-version", "20261021-footer-utf8-4");
    footer.setAttribute("aria-label","Rodapé institucional WINF");
    footer.innerHTML =
      '<div id="privacy" aria-hidden="true"></div><div id="politica-de-privacidade" aria-hidden="true"></div>' +
      '<section class="wf-footer__callout" aria-labelledby="wf-expansion-title"><div class="wf-footer__callout-inner">' +
      '<div><span class="wf-footer__eyebrow">WINF PARTNERS™ / EXPANSÃO</span>' +
      '<h2 id="wf-expansion-title">Pronto para fazer parte do ecossistema?</h2>' +
      '<p>Expansão territorial homologada e tecnologia proprietária para a sua operação.</p></div>' +
      '<div class="wf-footer__actions"><a class="wf-footer__button" href="'+link.contact+'">Falar com Partners™ <span aria-hidden="true">→</span></a>' +
      '<a class="wf-footer__button wf-footer__button--outline" href="'+link.partners+'">Seja parceiro WINF <span aria-hidden="true">→</span></a></div></div></section>' +
      '<div class="wf-footer__wrap">' +
      '<div class="wf-footer__top">' +
      '<div class="wf-footer__intro">' +
      '<div class="wf-footer__eyebrow">'+v.label+'</div><div class="wf-footer__brand-row">' +
      (v.brand==="WINF" ? '<a class="wf-footer__brand wf-footer__brand--logo" href="'+v.url+'" aria-label="WINF™ — página principal"><img class="wf-footer__brand-logo" src="/winf-logo.svg" alt="WINF™" width="109" height="36" loading="eager" decoding="async" /></a>' : '<a class="wf-footer__brand" href="'+v.url+'" aria-label="'+v.brand+' — página principal">'+v.brand+'<sup>™</sup></a>') +
      '<span class="wf-footer__badge">ECOSYSTEM</span></div><p class="wf-footer__description">'+v.description+'</p>' +
      '<a class="wf-footer__primary" href="'+link.contact+'">Fale com um especialista <span aria-hidden="true">↗</span></a>' +
      '</div>' +
      '<nav class="wf-footer__group" aria-label="Linhas e películas">' +
      '<h2 class="wf-footer__title">Linhas &amp; películas</h2><ul class="wf-footer__list">'+nav(v.lines)+'</ul></nav>' +
      '<nav class="wf-footer__group" aria-label="Ecossistema WINF">' +
      '<h2 class="wf-footer__title">Ecossistema</h2><ul class="wf-footer__list">'+nav(ecosystem)+'</ul></nav>' +
      '<nav class="wf-footer__group wf-footer__connect" aria-label="Redes e contato">' +
      '<h2 class="wf-footer__title">Conexões</h2><ul class="wf-footer__list">' +
      '<li><a class="wf-footer__link wf-footer__link--accent" href="'+link.catalog+'">Catálogo digital ↗</a></li>' +
      '<li><a class="wf-footer__link" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/'+v.instagram+'/">Instagram @'+v.instagram+' ↗</a></li>' +
      '<li><a class="wf-footer__link" href="'+link.contact+'">Contato comercial</a></li>' +
      '<li><a class="wf-footer__link" href="'+link.partners+'">Seja parceiro WINF</a></li>' +
      '</ul></nav>' +
      '</div>' +
      '<div class="wf-footer__bottom">' +
      '<small>© '+new Date().getFullYear()+' WINF™. Todos os direitos reservados.</small>' +
      '<div class="wf-footer__bottom-right"><span class="wf-footer__sig">Do Brasil para o mundo.</span>' +
      '<a href="'+link.partners+'">winf.com.br/partners/</a><a href="'+link.privacy+'">Políticas &amp; privacidade</a>' +
      '<button class="wf-footer__back-top" type="button">↑ Voltar ao topo</button></div></div>' +
      '<div class="wf-footer__union" aria-label="Conexões globais: China, Estados Unidos e Brasil">' +
      (path === '/aerocore' || path.indexOf('/aerocore/') === 0 ?
        '<div class="wf-footer__flags"><img src="/images/flags/cn.svg" alt="China" width="27" height="18" loading="lazy">' +
      '<span aria-hidden="true"></span><img src="/images/flags/us.svg" alt="Estados Unidos" width="34" height="18" loading="lazy">' +
      '<span aria-hidden="true"></span><img src="/images/flags/br.svg" alt="Brasil" width="25" height="18" loading="lazy"></div>'
        : '<div class="wf-footer__countries" role="group" aria-label="Brasil, Estados Unidos e China"><span class="wf-footer__country wf-footer__country--br" aria-label="Brasil">BR</span><span class="wf-footer__country wf-footer__country--us" aria-label="Estados Unidos">US</span><span class="wf-footer__country wf-footer__country--cn" aria-label="China">CN</span></div>') +
      '<span>Conexões que aproximam o mundo.</span></div>' +
      '</div>';
    enhanceFooter(footer);
    var existing = Array.prototype.slice.call(document.querySelectorAll("footer"));
    if (existing.length) {
      existing[0].replaceWith(footer);
      existing.slice(1).forEach(function (item) { item.remove(); });
    } else {
      var main = document.querySelector("main");
      if (main) main.insertAdjacentElement("afterend",footer);
      else document.body.appendChild(footer);
    }
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",render,{once:true});
  else render();
}());

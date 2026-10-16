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
  function render() {
    if (document.getElementById("winf-global-footer")) return;
    var footer = document.createElement("footer");
    footer.id = "winf-global-footer";
    footer.className = "wf-footer";
    footer.setAttribute("aria-label","Rodapé institucional WINF");
    footer.innerHTML =
      '<div class="wf-footer__wrap">' +
      '<div class="wf-footer__top">' +
      '<div class="wf-footer__intro">' +
      '<div class="wf-footer__eyebrow">'+v.label+'</div>' +
      '<a class="wf-footer__brand" href="'+v.url+'" aria-label="'+v.brand+' — página principal">'+v.brand+'<sup>™</sup></a>' +
      '<p class="wf-footer__description">'+v.description+'</p>' +
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
      '<a href="'+link.privacy+'">Políticas &amp; privacidade</a></div></div>' +
      '</div>';
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

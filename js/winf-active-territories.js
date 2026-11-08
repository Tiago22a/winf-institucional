/* Espelha no portal global os status públicos de /js/cidades.js. */
(() => {
  "use strict";
  const container = document.getElementById("winf-active-cards");
  const count = document.getElementById("winf-active-total");
  if (!container) return;
  const all = [...(Array.isArray(globalThis.WINF_CIDADES) ? globalThis.WINF_CIDADES : []),
    ...(Array.isArray(globalThis.WINF_UNIDADES_EXTRAS) ? globalThis.WINF_UNIDADES_EXTRAS : [])];
  if (!all.length) return; // mantém o link de Santos no HTML se a fonte não carregar
  const active = all.filter(c => c && c.status === "ativa" && c.exemplo === false);
  function safeLocal(path) {
    return typeof path === "string" && /^\/(?!\/)[a-z0-9\-\/]+\/$/i.test(path) ? path : null;
  }
  function addText(node,name,value) { const el = document.createElement(node); el.className = name; el.textContent = value; return el; }
  const fragment = document.createDocumentFragment();
  for (const city of active) {
    const card = document.createElement("article"); card.className = "winf-active-card";
    const header = document.createElement("div"); header.className = "winf-active-card-top";
    header.append(addText("span","",String(city.referencia || city.uf || "WINF")),
      addText("span","winf-active-dot","CADASTRADA"));
    card.append(header);
    card.append(addText("h3","",String(city.cidade || "Unidade WINF")+" / "+String(city.uf || "BR")));
    const hasLocalPhone = /^55[1-9]\d{9,10}$/.test(String(city.numero || ""));
    const label = city.id === "pilar-do-sul-sp" ? "Unidade extra da rede" : "Atendimento conforme disponibilidade";
    card.append(addText("p","",label));
    const link = document.createElement("a");
    const landing = safeLocal(city.url);
    if (landing) {
      link.href = landing;
      link.textContent = "CONHECER UNIDADE ↗";
    } else {
      const phone = hasLocalPhone ? String(city.numero) : "5513981113001";
      const message = "Olá! Gostaria de confirmar atendimento WINF em "+String(city.cidade)+"/"+String(city.uf)+".";
      link.href = "https://wa.me/"+phone+"?text="+encodeURIComponent(message);
      link.target = "_blank"; link.rel = "noopener noreferrer";
      link.textContent = hasLocalPhone ? "FALAR COM UNIDADE ↗" : "CONSULTAR A CENTRAL ↗";
    }
    card.append(link);
    fragment.append(card);
  }
  if (active.length) { container.replaceChildren(fragment); }
  if (count) count.textContent = active.length+" localidades cadastradas como ativas";
})();
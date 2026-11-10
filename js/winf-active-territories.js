/* WINF Select: os cards do portal são HTML estático, acessíveis e indexáveis.
 * A lista de cidades permanece em /js/cidades.js para o locator; nunca substitua
 * os cards por links individuais, pois isso remove site, WhatsApp e Instagram.
 */
(() => {
  "use strict";
  const container = document.getElementById("winf-active-cards");
  if (!container) return;
  const cards = container.querySelectorAll(":scope > article.winf-active-card");
  const count = document.getElementById("winf-active-total");
  if (count) count.textContent = cards.length + " sites regionais publicados";
})();

/* WINF Select: os cards do portal são HTML estático, acessíveis e indexáveis.
 * A lista de cidades permanece em /js/cidades.js para o locator; nunca substitua
 * os cards por links individuais, pois isso remove site, WhatsApp e Instagram.
 */
(() => {
  "use strict";
  // Os sites estão em grades regionais (013, 015 e outras). Conte todos eles.
  const cards = document.querySelectorAll("#unidades-ativas article.winf-active-card");
  if (!cards.length) return;
  const count = document.getElementById("winf-active-total");
  if (count) count.textContent = cards.length + " sites regionais publicados";
})();

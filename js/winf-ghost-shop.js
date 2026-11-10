"use strict";
// GHOST SHOP™ — filtro editorial local. Não cria pedidos ou inventa disponibilidade.
(function () {
  const buttons = Array.from(document.querySelectorAll("[data-gs-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-gs-brand]"));
  if (!buttons.length || !cards.length) return;
  function filterCollection(category) {
    buttons.forEach(button => {
      const selected = button.dataset.gsFilter === category;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    cards.forEach(card => {
      card.hidden = category !== "all" && card.dataset.gsBrand !== category;
    });
  }
  buttons.forEach(button => button.addEventListener("click", () => filterCollection(button.dataset.gsFilter)));
}());

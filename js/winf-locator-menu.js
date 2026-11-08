/* WINF™ | navegação acessível do diretório institucional */
(() => {
  "use strict";
  const overlay = document.getElementById("menu-overlay");
  const trigger = document.querySelector('[data-action="open-menu"]');
  if (!overlay || !trigger) return;
  let previousFocus = null;
  let hideTimer = null;
  const closeButtons = [...overlay.querySelectorAll('[data-action="close-menu"]')];
  const focusable = () => [...overlay.querySelectorAll('a[href],button:not([disabled]),summary')].filter(item => item.getClientRects().length > 0);

  function open() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
    previousFocus = document.activeElement;
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden","false");
    trigger.setAttribute("aria-expanded","true");
    document.body.classList.add("menu-open");
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    (closeButtons[0] || focusable()[0])?.focus();
  }
  function close() {
    if (overlay.getAttribute("aria-hidden") === "true") return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden","true");
    trigger.setAttribute("aria-expanded","false");
    document.body.classList.remove("menu-open");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (overlay.getAttribute("aria-hidden") === "true") overlay.classList.add("hidden"); }, 270);
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  trigger.addEventListener("click", open);
  closeButtons.forEach(button => button.addEventListener("click", close));
  overlay.querySelectorAll('[data-action="menu-link"]').forEach(link => link.addEventListener("click",close));
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", event => {
    if (overlay.getAttribute("aria-hidden") === "true") return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const available = focusable();
    if (!available.length) return;
    if (event.shiftKey && document.activeElement === available[0]) { event.preventDefault(); available[available.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === available[available.length - 1]) { event.preventDefault(); available[0].focus(); }
  });
})();
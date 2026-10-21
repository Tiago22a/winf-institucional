(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  const hero = document.querySelector('[data-background-video]');
  let heroVisible = true;
  function syncHero() {
    if (!hero) return;
    if (reduceMotion.matches || saveData || document.hidden || !heroVisible) {
      hero.pause();
      return;
    }
    if (!hero.getAttribute('src')) { hero.src = hero.dataset.src; hero.load(); }
    hero.play().catch(() => { /* Keep the poster when autoplay is unavailable. */ });
  }
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; syncHero(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', syncHero);
  reduceMotion.addEventListener('change', syncHero);
  syncHero();

  // Match the original muted preview, with controls after an explicit play action.
  const manifesto = document.getElementById('partners-manifesto');
  function loadManifesto() {
    const source = manifesto?.querySelector('source[data-src]');
    if (source) { source.src = source.dataset.src; source.removeAttribute('data-src'); manifesto.load(); }
    if (manifesto && !reduceMotion.matches && !saveData && !manifesto.controls) manifesto.play().catch(() => {});
  }
  if (manifesto && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) { loadManifesto(); observer.disconnect(); }
    }, { rootMargin: '200px' }).observe(manifesto);
  } else loadManifesto();
  manifesto?.addEventListener('play', loadManifesto, { once: true });

  document.querySelector('[data-play-manifesto]')?.addEventListener('click', () => {
    loadManifesto();
    manifesto.controls = true;
    manifesto.muted = false;
    manifesto.loop = false;
    manifesto.play().catch(() => {});
  });
  const contact = document.getElementById('contact');
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (!contact.open) contact.showModal();
    });
  });
  document.querySelector('[data-close-contact]')?.addEventListener('click', () => contact.close());
  contact?.addEventListener('click', event => { if (event.target === contact) {
    const box = contact.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) contact.close();
  }});
  const form = document.getElementById('partners-form');
  const model = document.getElementById('partner-model');
  document.querySelectorAll('[data-model]').forEach(link => {
    link.addEventListener('click', () => { model.value = link.dataset.model; });
  });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const message = [
      'Olá! Quero conhecer o licenciamento WINF Partners.',
      '',
      `Nome: ${fields.get('name')}`,
      `Cidade / UF: ${fields.get('city')}`,
      `WhatsApp: ${fields.get('phone')}`,
      `Modelo de interesse: ${fields.get('model')}`,
      ...(String(fields.get('message') || '').trim() ? [`Sobre minha operação: ${fields.get('message')}`] : []),
      '', 'Gostaria de consultar a disponibilidade da minha cidade e receber o dossiê.'
    ].join('\n');
    const url = `https://wa.me/5513997815375?text=${encodeURIComponent(message)}`;
    // A persistent link also works if the browser blocks the new window.
    const status = document.getElementById('partners-form-status');
    status.replaceChildren(document.createTextNode('Mensagem preparada. '));
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.className = 'partners-form-status-link'; link.textContent = 'Continuar no WhatsApp ↗';
    status.append(link);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

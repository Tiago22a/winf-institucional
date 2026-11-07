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

  // Briefing VSL remains a poster until clicked; other pages keep their muted preview.
  const manifesto = document.getElementById('partners-manifesto');
  const isBriefingVsl = manifesto?.hasAttribute('data-vsl-player') ?? false;
  function loadManifesto(preview = false) {
    const source = manifesto?.querySelector('source[data-src]');
    if (source) { source.src = source.dataset.src; source.removeAttribute('data-src'); manifesto.load(); }
    if (preview && manifesto && !reduceMotion.matches && !saveData && !manifesto.controls) {
      manifesto.play().catch(() => {});
    }
  }
  if (manifesto && !isBriefingVsl) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) { loadManifesto(true); observer.disconnect(); }
      }, { rootMargin: '200px' }).observe(manifesto);
    } else loadManifesto(true);
    manifesto.addEventListener('play', () => loadManifesto(true), { once: true });
  }

  document.querySelector('[data-play-manifesto]')?.addEventListener('click', () => {
    if (!manifesto) return;
    loadManifesto(false);
    manifesto.controls = true;
    manifesto.muted = false;
    manifesto.loop = false;
    const playback = manifesto.play();
    if (playback?.catch) playback.catch(() => {
      // Return the play affordance and expose a direct video link if playback fails.
      manifesto.controls = false;
      const fallback = document.querySelector('[data-vsl-fallback]');
      if (fallback) fallback.hidden = false;
    });
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
  const phone = document.getElementById('partner-phone');
  const ghost = document.getElementById('partners-modal-ghost');
  const whatsapp = document.getElementById('partners-modal-whatsapp');
  const helpPanel = document.getElementById('partners-modal-help-panel');
  const helpClose = document.getElementById('partners-modal-help-close');
  const unlockHint = document.getElementById('partners-form-unlock-hint');
  const status = document.getElementById('partners-form-status');
  const phoneDigitsValid = () => {
    const digits = (phone?.value || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
  };
  const prepareMessage = () => {
    const fields = new FormData(form);
    const info = [
      'Olá! Gostaria de conversar com a equipe WINF Partners™ sobre uma proposta.',
      '',
      'Nome: ' + String(fields.get('name') || '').trim(),
      'Cidade / UF: ' + String(fields.get('city') || '').trim(),
      'WhatsApp: ' + String(fields.get('phone') || '').trim(),
      'Modelo ou parceria: ' + String(fields.get('model') || '').trim(),
      ...(String(fields.get('message') || '').trim() ? ['Sobre a operação: ' + String(fields.get('message') || '').trim()] : []),
      '',
      'Gostaria de entender as condições e próximos passos.'
    ];
    return 'https://wa.me/5513997815375?text=' + encodeURIComponent(info.join('\n'));
  };
  const isReady = () => Boolean(form && form.checkValidity() && phoneDigitsValid());
  const closeHelp = (restoreFocus = false) => {
    if (!helpPanel) return;
    helpPanel.hidden = true;
    ghost?.setAttribute('aria-expanded', 'false');
    if (restoreFocus && !ghost?.disabled) ghost.focus();
  };
  function syncContactGate() {
    if (!form || !ghost || !whatsapp) return;
    const ready = isReady();
    ghost.disabled = !ready;
    ghost.setAttribute('aria-label', ready ? 'Abrir guia WINF Partners' : 'Preencha os campos para liberar o guia WINF Partners');
    whatsapp.setAttribute('aria-disabled', String(!ready));
    whatsapp.setAttribute('aria-label', ready ? 'Abrir WhatsApp com sua proposta preenchida' : 'WhatsApp disponível após preencher os campos');
    whatsapp.tabIndex = ready ? 0 : -1;
    whatsapp.classList.toggle('is-ready', ready);
    if (ready) {
      whatsapp.href = prepareMessage();
      whatsapp.target = '_blank';
      whatsapp.rel = 'noopener noreferrer';
    } else {
      whatsapp.removeAttribute('href');
      closeHelp();
    }
    if (unlockHint) {
      unlockHint.classList.toggle('is-ready', ready);
      unlockHint.textContent = ready
        ? 'Pronto! O fantasma e o WhatsApp verde estão liberados. Escolha como deseja continuar.'
        : 'Preencha nome, cidade, WhatsApp e tipo de parceria para liberar os canais rápidos.';
    }
  }
  document.querySelectorAll('[data-model]').forEach(link => {
    link.addEventListener('click', () => {
      if (model) model.value = link.dataset.model;
      syncContactGate();
    });
  });
  form?.addEventListener('input', () => {
    phone?.setCustomValidity('');
    syncContactGate();
  });
  form?.addEventListener('change', syncContactGate);
  form?.addEventListener('reset', () => requestAnimationFrame(syncContactGate));
  ghost?.addEventListener('click', () => {
    if (ghost.disabled || !helpPanel) return;
    const opening = helpPanel.hidden;
    helpPanel.hidden = !opening;
    ghost.setAttribute('aria-expanded', String(opening));
    if (opening) helpClose?.focus();
  });
  helpClose?.addEventListener('click', () => closeHelp(true));
  document.addEventListener('click', e => {
    if (!helpPanel?.hidden && !e.target.closest('.partners-modal-contact-dock')) closeHelp();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !helpPanel?.hidden && contact?.open) {
      e.preventDefault();
      e.stopPropagation();
      closeHelp(true);
    }
  }, true);
  contact?.addEventListener('close', () => closeHelp());
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!phoneDigitsValid()) {
      phone?.setCustomValidity('Informe um WhatsApp válido com DDD.');
    } else {
      phone?.setCustomValidity('');
    }
    if (!form.reportValidity()) {
      syncContactGate();
      return;
    }
    const url = prepareMessage();
    status?.replaceChildren(document.createTextNode('Mensagem pronta. '));
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.className = 'partners-form-status-link';
    link.textContent = 'Continuar no WhatsApp ↗';
    status?.append(link);
    syncContactGate();
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  syncContactGate();
})();

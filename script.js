(() => {
  'use strict';

  const body = document.body;
  const menu = document.getElementById('menu-overlay');
  const cookieBanner = document.getElementById('cookie-banner');
  const frame = document.getElementById('scroll-frame');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const whatsappNumber = '5513997815375';

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Accessible overlay navigation: focus trap, state, and focus restoration.
  // Applied only when a page actually contains the legacy menu-overlay.
  const menuTriggers = [...document.querySelectorAll('[data-action="open-menu"]')];
  let menuLastTrigger = null;
  let menuHideTimeout = null;
  const motionReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuOpen = () => Boolean(menu && menu.getAttribute('aria-hidden') === 'false');
  const focusableMenu = () => menu ? [...menu.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((node) => !node.hidden && node.getClientRects().length > 0) : [];

  const openMenu = (event) => {
    if (!menu || menuOpen()) return;
    if (menuHideTimeout) window.clearTimeout(menuHideTimeout);
    menuLastTrigger = event?.currentTarget || document.activeElement;
    menu.classList.remove('hidden');
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    menuTriggers.forEach((button) => button.setAttribute('aria-expanded', 'true'));
    body.classList.add('menu-open');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    const firstControl = menu.querySelector('[data-action="close-menu"]');
    (firstControl || focusableMenu()[0] || menu).focus();
  };

  const closeMenu = ({restoreFocus = true} = {}) => {
    if (!menu || !menuOpen()) return;
    // Focus must leave the overlay BEFORE applying aria-hidden/inert.
    if (restoreFocus) {
      const trigger = menuLastTrigger?.isConnected ? menuLastTrigger : menuTriggers[0];
      trigger?.focus();
    }
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    menuTriggers.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    body.classList.remove('menu-open');
    menuHideTimeout = window.setTimeout(() => menu.classList.add('hidden'), motionReduced() ? 0 : 300);
  };

  menuTriggers.forEach((button) => {
    if (menu) {
      button.setAttribute('aria-controls', menu.id);
      button.setAttribute('aria-expanded', 'false');
    }
    button.addEventListener('click', openMenu);
  });
  if (menu) {
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('[data-action="close-menu"]').forEach((button) => {
    if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', 'Fechar navegação');
    button.addEventListener('click', () => closeMenu());
  });
  menu?.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (!menuOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = focusableMenu();
    if (!controls.length) { event.preventDefault(); return; }
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll('[data-action="menu-link"]').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  const scrollToHash = (hash) => {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: motionReduced() ? 'instant' : 'smooth', block: 'start' });
  };
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      history.replaceState(null, '', hash);
      scrollToHash(hash);
    });
  });

  const updateFrame = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (frame) frame.textContent = `${Math.round(progress * 100)}%`;
  };
  updateFrame();
  window.addEventListener('scroll', updateFrame, { passive: true });
  window.addEventListener('resize', updateFrame, { passive: true });

  const markAssetError = (element) => {
    element.dataset.assetError = 'true';
    const parent = element.closest('.brand-card-media, .article-cover, .hero-media');
    if (parent) parent.classList.add('asset-error');
    if (element.tagName === 'IMG' && element.closest('.brand-card-media')) {
      const card = element.closest('.brand-card-media');
      card.dataset.fallback = element.alt || '';
      element.style.display = 'none';
    }
  };

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => markAssetError(image));
  });

  const setupVideo = (video) => {
    const source = video.dataset.src;
    if (source && !video.src) {
      video.src = source;
      video.load();
    }
    const play = () => video.play().catch(() => {});
    video.addEventListener('canplay', play, { once: true });
    video.addEventListener('error', () => markAssetError(video));
    play();
  };

  const videoObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            setupVideo(video);
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.15 })
    : null;

  document.querySelectorAll('video.lazy-video').forEach((video) => {
    if (videoObserver) videoObserver.observe(video);
    else setupVideo(video);
  });

  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      markAssetError(heroVideo);
      body.classList.add('assets-missing');
    });
    heroVideo.addEventListener('canplay', () => body.classList.remove('assets-missing'), { once: true });
    heroVideo.play().catch(() => {});
  }

  const revealElements = document.querySelectorAll('.reveal, .reveal-group');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-product]').forEach((card) => {
    card.addEventListener('click', () => {
      const interest = card.dataset.product;
      const select = contactForm?.querySelector('select[name="need"]');
      if (select && interest) {
        const productNeed = Array.from(select.options).find((option) => option.textContent.toLowerCase().includes(interest.split('™')[0].toLowerCase()));
        if (productNeed) select.value = productNeed.value;
      }
    });
  });

  const getField = (name) => contactForm?.elements.namedItem(name)?.value?.trim() || '';
  const sendWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = [
      '*NOVA SOLICITAÇÃO // WINF SELECT™*',
      '',
      `*Nome:* ${getField('name')}`,
      `*Empresa/Escritório:* ${getField('company') || 'N/A'}`,
      `*WhatsApp:* ${getField('phone')}`,
      `*Cidade:* ${getField('city')}`,
      `*Tipo de Projeto:* ${getField('project')}`,
      `*Área aproximada:* ${getField('area') || 'A definir'} m²`,
      `*Principal Necessidade:* ${getField('need')}`
    ].join('\n');

    contactForm.classList.add('hidden');
    formSuccess?.classList.remove('hidden');
    window.setTimeout(() => sendWhatsApp(message), 600);
  });

  document.querySelector('[data-action="reset-form"]')?.addEventListener('click', () => {
    contactForm?.reset();
    contactForm?.classList.remove('hidden');
    formSuccess?.classList.add('hidden');
  });

  const cookiesAccepted = (() => {
    try { return localStorage.getItem('winf-cookies-accepted') === '1'; } catch (_) { return false; }
  })();
  if (cookiesAccepted) cookieBanner?.remove();
  document.querySelector('[data-action="allow-cookies"]')?.addEventListener('click', () => {
    try { localStorage.setItem('winf-cookies-accepted', '1'); } catch (_) { /* sessão privada */ }
    cookieBanner?.remove();
  });

  // If the omitted media is not present, preserve layout with the same dark visual language.
  window.setTimeout(() => {
    const mediaWithErrors = document.querySelectorAll('[data-asset-error="true"]').length;
    const mediaTotal = document.querySelectorAll('video, .brand-card-media img, .article-cover img').length;
    if (mediaTotal > 0 && mediaWithErrors >= Math.ceil(mediaTotal * 0.65)) body.classList.add('assets-missing');
  }, 1800);
})();

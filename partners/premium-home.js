/* WINF Partners™ — lightweight progressive enhancement.
   No tracking, checkout, service worker or external dependencies. */
(() => {
  'use strict';

  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    const trigger = menu.querySelector('summary');
    // Anchored navigation should never leave the mobile dropdown covering content.
    menu.querySelectorAll('nav a').forEach((link) => {
      link.addEventListener('click', () => { menu.open = false; });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !menu.open) return;
      menu.open = false;
      if (trigger) trigger.focus();
    });
    document.addEventListener('pointerdown', (event) => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  }

  const video = document.querySelector('.hero-video');
  if (!video) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const dataSaver = Boolean(navigator.connection?.saveData);

  const shouldPlay = () => !dataSaver && !reduced?.matches && !document.hidden;
  const synchronizeVideo = () => {
    if (!shouldPlay()) {
      video.pause();
      return;
    }
    const attempt = video.play();
    if (attempt?.catch) attempt.catch(() => {
      // Poster remains visible when autoplay is blocked or unsupported.
      video.pause();
    });
  };

  // Autoplay is a progressive enhancement: poster must work without JS/video.
  if (!shouldPlay()) {
    video.autoplay = false;
    video.pause();
  } else {
    synchronizeVideo();
  }
  document.addEventListener('visibilitychange', synchronizeVideo);
  reduced?.addEventListener?.('change', synchronizeVideo);
})();

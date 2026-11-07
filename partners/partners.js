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
})();

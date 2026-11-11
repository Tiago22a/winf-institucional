/* WINF Partners™ / hero original — apresentação um pouco adiantada e com o
 * Ghost visível no último quadro. Não modifica nem substitui o vídeo original.
 * O filme web aprovado dura 5,35s; seguramos a última imagem brevemente antes
 * de reiniciar, evitando o retorno imediato ao poster.
 */
(() => {
  'use strict';

  const stage = document.querySelector('[data-wp-hero-film]');
  const url = stage?.dataset.filmSrc;
  if (!stage || !url || !url.startsWith('/partners/media/')) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (motion.matches || connection?.saveData) return;

  const video = document.createElement('video');
  video.className = 'wp-hero-approved-video';
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = false;
  video.loop = false;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  video.preload = 'metadata';
  const poster = stage.dataset.filmPoster;
  if (poster?.startsWith('/partners/media/')) video.poster = poster;
  stage.prepend(video);

  const preferredIntroOffset = 0.45;
  const finalFrameHoldMs = 2550;
  let loaded = false;
  let visible = false;
  let firstSeekDone = false;
  let holdTimer = null;

  const startPosition = () =>
    Number.isFinite(video.duration)
      ? Math.min(preferredIntroOffset, Math.max(0, video.duration - 1.5))
      : 0;

  const cancelHold = () => {
    if (holdTimer !== null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  };

  const resetToStart = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      try { video.currentTime = startPosition(); } catch (_) { /* fallback */ }
    }
  };

  const pause = () => {
    cancelHold();
    video.pause();
    stage.classList.remove('wp-film-playing', 'wp-film-hold');
  };

  const play = async () => {
    if (!visible || document.hidden || motion.matches) return;
    cancelHold();
    try {
      if (!loaded) {
        video.src = url;
        video.load();
        loaded = true;
      } else if (video.ended) {
        resetToStart();
      }
      await video.play();
    } catch (_) {
      stage.classList.remove('wp-film-playing', 'wp-film-hold');
    }
  };

  video.addEventListener('loadedmetadata', () => {
    if (firstSeekDone) return;
    firstSeekDone = true;
    resetToStart();
  });
  video.addEventListener('playing', () => {
    stage.classList.add('wp-film-playing');
    stage.classList.remove('wp-film-hold');
  });
  video.addEventListener('ended', () => {
    // Deixar o Ghost e o cenário aparentes: manter o quadro final sob os textos.
    stage.classList.add('wp-film-playing', 'wp-film-hold');
    cancelHold();
    if (!visible || document.hidden || motion.matches) return;
    holdTimer = setTimeout(() => {
      holdTimer = null;
      if (!visible || document.hidden || motion.matches) return;
      resetToStart();
      void play();
    }, finalFrameHoldMs);
  });
  video.addEventListener('error', pause);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else if (visible) void play();
  });

  motion.addEventListener?.('change', () => {
    if (motion.matches) pause();
    else if (visible) void play();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) void play();
      else pause();
    }, { threshold: 0.08 });
    observer.observe(stage);
  } else {
    visible = true;
    void play();
  }
})();

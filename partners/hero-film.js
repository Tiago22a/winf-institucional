/* WINF Partners — ponto seguro para ativar o filme cinematográfico da home.
 * Não carregar o arquivo de referência com esquadrias distorcidas.
 * Para habilitar depois da aprovação: data-film-src="/partners/media/partners-glass-approved.mp4"
 * e opcionalmente data-film-poster="/partners/media/partners-glass-poster.webp"
 * no elemento [data-wp-hero-film]. A página funciona sem vídeo.
 */
(() => {
  'use strict';
  const stage = document.querySelector('[data-wp-hero-film]');
  const url = stage?.dataset.filmSrc;
  if (!stage || !url || !url.startsWith('/partners/media/')) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (motion.matches || connection?.saveData) return;

  const film = document.createElement('video');
  film.className = 'wp-hero-approved-video';
  film.muted = true;
  film.defaultMuted = true;
  film.autoplay = false;
  film.loop = true;
  film.playsInline = true;
  film.setAttribute('playsinline', '');
  film.setAttribute('muted', '');
  film.setAttribute('aria-hidden', 'true');
  film.preload = 'none';
  const poster = stage.dataset.filmPoster;
  if (poster?.startsWith('/partners/media/')) film.poster = poster;
  stage.prepend(film);

  let started = false;
  let observed = false;
  const play = async () => {
    if (document.hidden || motion.matches) return;
    try {
      if (!started) {
        film.src = url;
        film.load();
        started = true;
      }
      await film.play();
    } catch (_) {
      stage.classList.remove('wp-film-playing');
    }
  };
  const pause = () => { film.pause(); stage.classList.remove('wp-film-playing'); };
  film.addEventListener('playing', () => stage.classList.add('wp-film-playing'));
  film.addEventListener('error', pause);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else if (observed) void play();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      observed = entry.isIntersecting;
      if (observed) void play();
      else pause();
    }, { threshold: 0.08 });
    observer.observe(stage);
  } else {
    observed = true;
    void play();
  }
})();

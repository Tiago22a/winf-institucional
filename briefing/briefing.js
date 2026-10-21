/* Optional local video slot. The static poster remains until the MP4 is uploaded. */
(() => {
  'use strict';
  const video = document.getElementById('briefing-background-video');
  if (!video) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  const source = video.querySelector('source');
  video.addEventListener('canplay', () => video.classList.remove('is-missing'));
  video.addEventListener('error', () => video.classList.add('is-missing'));
  source?.addEventListener('error', () => video.classList.add('is-missing'));
  function sync() {
    if (reducedMotion.matches || saveData) {
      video.pause(); video.removeAttribute('autoplay');
      source?.removeAttribute('src'); video.load();
      return;
    }
    if (!source?.getAttribute('src')) {
      source?.setAttribute('src', video.dataset.videoSrc); video.load();
    }
    if (document.hidden) video.pause();
    else video.play().catch(() => { /* Poster remains if autoplay is blocked or the future file is absent. */ });
  }
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
})();

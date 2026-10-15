(() => {
  const video = document.getElementById('hub-video');
  if (!video) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  let visible = true;
  const syncPlayback = () => {
    if (reduceMotion.matches || saveData || document.hidden || !visible) {
      video.pause();
    } else {
      video.play().catch(() => { /* The poster remains when autoplay is unavailable. */ });
    }
  };
  if (saveData || reduceMotion.matches) {
    video.removeAttribute('autoplay');
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
    video.load();
    return;
  }
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }).observe(document.querySelector('.intro'));
  document.addEventListener('visibilitychange', syncPlayback);
  reduceMotion.addEventListener('change', syncPlayback);
})();

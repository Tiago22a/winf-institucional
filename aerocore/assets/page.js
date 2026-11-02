'use strict';

// Homepage-only media preferences and Ghost Protocol interaction.
const videos = document.querySelectorAll('video');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateVideoPreference() {
  videos.forEach(video => {
    if (reducedMotion.matches) video.pause();
    else video.play().catch(() => {});
  });
}
reducedMotion.addEventListener('change', updateVideoPreference);
updateVideoPreference();
const ghost = document.querySelector('[data-ghost-protocol]');
ghost.addEventListener('click', () => {
  const selected = ghost.classList.toggle('ghost-selected');
  ghost.setAttribute('aria-pressed', String(selected));
});

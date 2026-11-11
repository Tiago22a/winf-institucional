/* SynthWAVE.FM — reprodução nativa dos filmes aprovados.
   Não depende do lazy-loader comum para ativar o vídeo principal. */
(() => {
  "use strict";
  const videos = Array.from(document.querySelectorAll("video.sw-live-video, video.sw-frame-video"));
  if (!videos.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tryPlay = (video) => {
    if (reduced.matches || document.hidden || !video.isConnected) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.then(() => { video.dataset.swState = "playing"; }).catch(() => {
        video.dataset.swState = "needs-interaction";
      });
    }
  };
  const hero = document.querySelector("video.sw-live-video");
  const trigger = document.getElementById("sw-play-trigger");
  if (hero && trigger) {
    const reveal = () => { if (!reduced.matches && hero.paused) trigger.hidden = false; };
    const hide = () => { trigger.hidden = true; };
    hero.addEventListener("playing", hide);
    hero.addEventListener("error", () => { hero.dataset.swState = "unavailable"; trigger.hidden = true; });
    hero.addEventListener("stalled", () => { hero.dataset.swState = "buffering"; });
    trigger.addEventListener("click", () => { tryPlay(hero); });
    hero.addEventListener("loadeddata", () => { tryPlay(hero); });
    tryPlay(hero);
    setTimeout(reveal, 1800);
  }
  const clips = videos.filter(v => v !== hero);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) tryPlay(entry.target);
        else entry.target.pause();
      }
    }, { rootMargin: "100px 0px", threshold: 0.05 });
    clips.forEach(v => io.observe(v));
  } else {
    clips.forEach(tryPlay);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach(v => v.pause());
    else {
      if (hero) tryPlay(hero);
      clips.forEach(v => {
        const rect = v.getBoundingClientRect();
        if (rect.top < innerHeight && rect.bottom > 0) tryPlay(v);
      });
    }
  });
  window.addEventListener("pageshow", () => { if (hero) tryPlay(hero); });
  reduced.addEventListener?.("change", () => {
    if (reduced.matches) videos.forEach(v => v.pause());
    else if (hero) tryPlay(hero);
  });
})();
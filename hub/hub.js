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

(() => {
  const sidebar = document.getElementById('hub-sidebar');
  const toggle = document.querySelector('.hub-menu-toggle');
  const shade = document.querySelector('.hub-menu-shade');
  if (!sidebar || !toggle || !shade) return;
  const mobile = matchMedia('(max-width: 1000px)');
  const links = [...sidebar.querySelectorAll('[data-section]')];
  const setOpen = (open, restoreFocus = false) => {
    sidebar.classList.toggle('is-open', open);
    document.body.classList.toggle('hub-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    shade.hidden = !open;
    sidebar.inert = mobile.matches && !open;
    if (open) sidebar.querySelector('.sidebar-close').focus();
    else if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('is-open')));
  sidebar.querySelector('.sidebar-close').addEventListener('click', () => setOpen(false, true));
  shade.addEventListener('click', () => setOpen(false, true));
  links.forEach(link => link.addEventListener('click', () => { if (mobile.matches) setOpen(false, true); }));
  document.addEventListener('keydown', event => {
    if (!sidebar.classList.contains('is-open')) return;
    if (event.key === 'Escape') setOpen(false, true);
    if (event.key !== 'Tab') return;
    const items = [...sidebar.querySelectorAll('a,button')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobile.addEventListener('change', () => setOpen(false));
  setOpen(false);
  let scheduled = false;
  const update = () => {
    const sections = [document.querySelector('.intro'), ...links.slice(1).map(link => document.getElementById(link.dataset.section))];
    let current = 0;
    sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= innerHeight * .38) current = index; });
    links.forEach((link, index) => {
      link.classList.toggle('is-active', index === current);
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const max = document.documentElement.scrollHeight - innerHeight;
    sidebar.querySelector('.sidebar-progress span').style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    scheduled = false;
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
})();

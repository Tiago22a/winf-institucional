/* Progressive enhancement: navigation remains usable without JavaScript. */
(() => {
  const header = document.querySelector('.ac-header');
  if (!header) return;
  const toggle = header.querySelector('.ac-header__toggle');
  const navigation = header.querySelector('.ac-header__navigation');
  const mobile = window.matchMedia('(max-width: 767px)');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? '−' : '+';
  };
  header.classList.add('is-enhanced');
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a')) {
      setOpen(false);
      toggle.focus();
    }
  });
  mobile.addEventListener('change', () => {
    if (mobile.matches && navigation.contains(document.activeElement)) toggle.focus();
    setOpen(false);
  });
  const currentPath = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  navigation.querySelectorAll('a[href]').forEach((link) => {
    const url = new URL(link.href);
    if (url.origin === window.location.origin && (url.pathname.replace(/\/$/, '') || '/') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();

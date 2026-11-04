(() => {
  'use strict';
  const section = document.querySelector('.ac-tactical-faq');
  if (!section) return;
  const more = section.querySelector('#tactical-faq-more');
  const toggle = section.querySelector('.tactical-faq-toggle');
  if (!more || !toggle) return;
  const label = toggle.querySelector('[data-faq-toggle-label]');
  const icon = toggle.querySelector('[data-faq-toggle-icon]');
  toggle.addEventListener('click', () => {
    const show = more.hidden;
    more.hidden = !show;
    toggle.setAttribute('aria-expanded', String(show));
    label.textContent = show ? 'Ver menos dúvidas' : 'Ver mais dúvidas';
    icon.textContent = show ? '−' : '+';
    if (!show) {
      more.querySelectorAll('.accordion-content').forEach(content => content.classList.add('hidden'));
      more.querySelectorAll('.accordion-icon').forEach(arrow => arrow.classList.remove('rotate-180'));
    }
  });

  // Existing site code owns accordion interactions; reflect its real state for assistive technology.
  section.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;
    const sync = () => trigger.setAttribute('aria-expanded', String(!content.classList.contains('hidden')));
    sync();
    new MutationObserver(sync).observe(content, { attributes: true, attributeFilter: ['class'] });
  });
})();

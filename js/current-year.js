(() => {
  'use strict';

  const setCurrentYear = () => {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-current-year]').forEach((element) => {
      element.textContent = year;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setCurrentYear, { once: true });
  } else {
    setCurrentYear();
  }
})();

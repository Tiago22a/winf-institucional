/**
 * AEROCORE - Vanilla JS Interaction Engine
 * Pure static HTML companion script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Navbar Scroll Behavior
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-black/80', 'backdrop-blur-3xl', 'border-b', 'border-white/[0.05]', 'py-4');
        navbar.classList.remove('bg-transparent', 'py-8');
      } else {
        navbar.classList.remove('bg-black/80', 'backdrop-blur-3xl', 'border-b', 'border-white/[0.05]', 'py-4');
        navbar.classList.add('bg-transparent', 'py-8');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Navigation Drawer
  const menuToggle = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');
  const hamLine1 = document.getElementById('ham-line-1');
  const hamLine2 = document.getElementById('ham-line-2');

  function openMenu() {
    if (!navDrawer || !navOverlay) return;
    navDrawer.classList.remove('translate-x-full');
    navDrawer.classList.add('translate-x-0');
    navOverlay.classList.remove('opacity-0', 'pointer-events-none');
    navOverlay.classList.add('opacity-100', 'pointer-events-auto');
    if (hamLine1) hamLine1.classList.add('rotate-45', 'translate-y-[3.5px]');
    if (hamLine2) hamLine2.classList.add('-rotate-45', '-translate-y-[3.5px]');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!navDrawer || !navOverlay) return;
    navDrawer.classList.add('translate-x-full');
    navDrawer.classList.remove('translate-x-0');
    navOverlay.classList.add('opacity-0', 'pointer-events-none');
    navOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    if (hamLine1) hamLine1.classList.remove('rotate-45', 'translate-y-[3.5px]');
    if (hamLine2) hamLine2.classList.remove('-rotate-45', '-translate-y-[3.5px]');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDrawer && !navDrawer.classList.contains('translate-x-full');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // 4. Accordion Toggle
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    const arrow = item.querySelector('.accordion-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        // Close others in same parent if requested
        const parent = item.closest('.accordion-group');
        if (parent) {
          parent.querySelectorAll('.accordion-item').forEach((sibling) => {
            if (sibling !== item) {
              const sibContent = sibling.querySelector('.accordion-content');
              const sibArrow = sibling.querySelector('.accordion-icon');
              if (sibContent) sibContent.classList.add('hidden');
              if (sibArrow) sibArrow.classList.remove('rotate-180');
            }
          });
        }

        if (isOpen) {
          content.classList.add('hidden');
          if (arrow) arrow.classList.remove('rotate-180');
        } else {
          content.classList.remove('hidden');
          if (arrow) arrow.classList.add('rotate-180');
        }
      });
    }
  });

  // 5. Contact Form Handler with WhatsApp Link Integration
  const contactForms = document.querySelectorAll('.contact-form-component');
  contactForms.forEach((form) => {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const interestSelect = form.querySelector('select[name="interest"]');
    const sendBtn = form.querySelector('.contact-send-btn');
    const whatsappBtn = form.querySelector('.contact-whatsapp-btn');
    const feedbackMsg = form.querySelector('.contact-feedback');

    function updateWhatsapp() {
      if (!whatsappBtn) return;
      const name = nameInput ? nameInput.value : '';
      const email = emailInput ? emailInput.value : '';
      const interest = interestSelect ? interestSelect.value : '';
      const text = `Olá! Gostaria de mais informações.\nNome: ${name}\nE-mail: ${email}\nInteresse: ${interest}`;
      whatsappBtn.href = `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
    }

    if (nameInput) nameInput.addEventListener('input', updateWhatsapp);
    if (emailInput) emailInput.addEventListener('input', updateWhatsapp);
    if (interestSelect) interestSelect.addEventListener('change', updateWhatsapp);

    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (feedbackMsg) {
          feedbackMsg.classList.remove('hidden');
          setTimeout(() => {
            feedbackMsg.classList.add('hidden');
          }, 4000);
        }
      });
    }
  });

  // 6. Thermal Simulator (WINF Select)
  const glassSlider = document.getElementById('glass-slider');
  const glassVal = document.getElementById('glass-area-val');
  const expBtns = document.querySelectorAll('.exposure-btn');
  const tempDropEl = document.getElementById('sim-temp-drop');
  const kwhSavingsEl = document.getElementById('sim-kwh-savings');
  const co2ReductionEl = document.getElementById('sim-co2-reduction');

  let currentExposure = 'high';

  function updateSimulator() {
    if (!glassSlider) return;
    const area = Number(glassSlider.value);
    if (glassVal) glassVal.textContent = `${area} m²`;

    const factor = currentExposure === 'extreme' ? 1.4 : currentExposure === 'high' ? 1.0 : 0.7;
    const kwhSavings = Math.round(area * 45 * factor);
    const co2Reduction = Math.round(kwhSavings * 0.42);
    const tempDrop = currentExposure === 'extreme' ? '8°C - 12°C' : '6°C - 9°C';

    if (tempDropEl) tempDropEl.textContent = tempDrop;
    if (kwhSavingsEl) kwhSavingsEl.textContent = `~ ${kwhSavings.toLocaleString()} kWh / ano`;
    if (co2ReductionEl) co2ReductionEl.textContent = `~ ${co2Reduction.toLocaleString()} kg CO₂ / ano`;
  }

  if (glassSlider) {
    glassSlider.addEventListener('input', updateSimulator);
  }

  expBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      expBtns.forEach((b) => {
        b.classList.remove('bg-amber-500/20', 'border-amber-400', 'text-amber-300');
        b.classList.add('bg-white/5', 'border-white/10', 'text-white/60');
      });
      btn.classList.add('bg-amber-500/20', 'border-amber-400', 'text-amber-300');
      btn.classList.remove('bg-white/5', 'border-white/10', 'text-white/60');
      currentExposure = btn.dataset.exposure || 'high';
      updateSimulator();
    });
  });

  // 7. Windowfilm Specs Filter
  const wfTabs = document.querySelectorAll('.wf-tab-btn');
  const wfHeaders = document.querySelectorAll('[data-wf-col]');
  const wfCells = document.querySelectorAll('[data-wf-cell]');

  wfTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.product || 'all';

      wfTabs.forEach((t) => {
        if (t === tab) {
          t.classList.remove('text-white/50', 'hover:text-white', 'hover:bg-white/5');
          t.classList.add('bg-white', 'text-black');
        } else {
          t.classList.add('text-white/50', 'hover:text-white', 'hover:bg-white/5');
          t.classList.remove('bg-white', 'text-black');
        }
      });

      wfHeaders.forEach((th) => {
        const colType = th.dataset.wfCol;
        if (selected === 'all' || selected === colType) {
          th.classList.remove('hidden');
          th.classList.toggle('col-span-4', selected !== 'all');
          th.classList.toggle('col-span-1', selected === 'all');
        } else {
          th.classList.add('hidden');
        }
      });

      wfCells.forEach((td) => {
        const cellType = td.dataset.wfCell;
        if (selected === 'all' || selected === cellType) {
          td.classList.remove('hidden');
          td.classList.toggle('col-span-4', selected !== 'all');
          td.classList.toggle('col-span-1', selected === 'all');
        } else {
          td.classList.add('hidden');
        }
      });
    });
  });

  // 8. NeoSkin Specs Filter
  const nsTabs = document.querySelectorAll('.ns-tab-btn');
  const nsCells = document.querySelectorAll('[data-ns-col]');

  nsTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.product || 'all';

      nsTabs.forEach((t) => {
        if (t === tab) {
          t.classList.remove('text-white/50', 'hover:text-white', 'hover:bg-white/5');
          t.classList.add('bg-white', 'text-black');
        } else {
          t.classList.add('text-white/50', 'hover:text-white', 'hover:bg-white/5');
          t.classList.remove('bg-white', 'text-black');
        }
      });

      nsCells.forEach((cell) => {
        const col = cell.dataset.nsCol;
        if (selected === 'all' || selected === col) {
          cell.style.opacity = '1';
        } else {
          cell.style.opacity = '0.15';
        }
      });
    });
  });
});

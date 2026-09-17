(() => {
  'use strict';
  const form = document.getElementById('invisible-contact-form');
  const success = document.getElementById('invisible-form-success');
  const send = (message) => window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  const modal = document.getElementById('invisible-modal');
  const subject = document.getElementById('invisible-modal-subject');

  document.querySelectorAll('[data-action="open-invisible-modal"]').forEach((button) => {
    button.addEventListener('click', () => {
      if (modal) { subject.textContent = button.dataset.subject || 'Orçamento Invisible™'; modal.classList.remove('hidden'); document.body.classList.add('menu-open'); }
    });
  });
  document.querySelectorAll('[data-action="close-invisible-modal"]').forEach((button) => button.addEventListener('click', () => { modal?.classList.add('hidden'); document.body.classList.remove('menu-open'); }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name') || '';
    const contact = data.get('contact') || '';
    const interest = data.get('interest') || 'INVISIBLE 70';
    if (event.currentTarget === form) {
      form.classList.add('hidden'); success?.classList.remove('hidden');
    }
    send(`*PROTOCOLO DE CONTATO // INVISIBLE™*\n\n*Identificação:* ${name}\n*E-mail / Contato:* ${contact}\n*Interesse:* ${interest}`);
  };
  form?.addEventListener('submit', handleSubmit);
  document.querySelectorAll('#invisible-modal form').forEach((f) => f.addEventListener('submit', handleSubmit));
  document.querySelector('[data-action="invisible-whatsapp"]')?.addEventListener('click', () => send('Olá! Gostaria de mais informações sobre WINF SELECT INVISIBLE™.'));

  document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((button) => button.classList.toggle('active', button === tab));
    const selected = tab.dataset.tab;
    document.querySelectorAll('.inv-table-wrap tbody tr').forEach((row) => {
      row.querySelectorAll('td').forEach((cell, index) => cell.classList.toggle('selected', selected !== 'all' && index === ({70:1,80:2,spectre:3}[selected] || 0)));
    });
  }));
})();

  const abrirModalBtn = document.getElementById('abrirModalBtn');
  const fecharModalBtn = document.getElementById('fecharModalBtn');
  const modal = document.getElementById('modal');
  const formModal = document.getElementById('formModal');

  // Função para abrir modal
  abrirModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Função para fechar modal
  fecharModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Enviar formulário e redirecionar
formModal.addEventListener('submit', (e) => {
  e.preventDefault();
  let cidade = formModal.cidade.value.trim();
  const estado = formModal.estado.value.trim().toUpperCase();

  if (!cidade || !estado) return alert('Preencha cidade e estado corretamente.');

  // Cidade com primeira letra maiúscula e o resto minúsculo
  cidade = cidade.charAt(0).toUpperCase() + cidade.slice(1).toLowerCase();

  // Slug no formato: Cidade com 1ª letra maiúscula + hífen + estado todo maiúsculo
  const cidadeSlug = `${cidade}-${estado}`;

  modal.classList.add('hidden');

  window.location.href = `dashboard/?id=${cidadeSlug}`;
});
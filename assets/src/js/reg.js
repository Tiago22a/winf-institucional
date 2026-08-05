const form = document.getElementById('lpForm');
const resultadoDiv = document.createElement('div');
form.parentNode.insertBefore(resultadoDiv, form.nextSibling);

// Envio simples do formulário via fetch POST para o PHP
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  resultadoDiv.textContent = "⏳ Gerando sua landing page...";
  resultadoDiv.style.color = "blue";

  try {
    const response = await fetch('../gerar_lp.php', {
      method: 'POST',
      body: formData,
      credentials: 'include' // envia cookies (para o token Firebase)
    });

    if (response.redirected) {
      // PHP vai redirecionar para a nova LP
      window.location.href = response.url;
      return;
    }

    const texto = await response.text();
    if (response.ok) {
      resultadoDiv.textContent = "✅ Landing page criada com sucesso!";
      resultadoDiv.style.color = "green";
    } else {
      resultadoDiv.textContent = "❌ Erro: " + texto;
      resultadoDiv.style.color = "red";
    }
  } catch (error) {
    console.error("Erro:", error);
    resultadoDiv.textContent = "❌ Erro de conexão com o servidor.";
    resultadoDiv.style.color = "red";
  }
});

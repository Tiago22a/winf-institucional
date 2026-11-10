// Prévia estática isolada. Não conectar a Firebase ou disparar pagamentos/ativação.
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const target=document.getElementById(link.getAttribute('href').slice(1));
    if(!target)return;
    // Navegação nativa acessível; sem efeitos obrigatórios.
  });
});

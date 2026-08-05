  // Trocar tema e salvar no localStorage
    function aplicarTema() {
      const tema = localStorage.getItem("tema") || "light";
      document.body.classList.remove("light-theme", "dark-theme");
      document.body.classList.add(tema + "-theme");
    }

    function alternarTema() {
      const temaAtual = localStorage.getItem("tema") || "light";
      const novoTema = temaAtual === "light" ? "dark" : "light";
      localStorage.setItem("tema", novoTema);
      aplicarTema();
    }

    document.getElementById("toggle-theme").addEventListener("click", alternarTema);
    aplicarTema(); // aplica ao abrir
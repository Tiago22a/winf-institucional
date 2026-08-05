// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Config do Firebase - use a sua
const firebaseConfig = {
  apiKey: "AIzaSyBs5nRf528evxnNQUIsxf8Ygrkzxi1KEv4",
  authDomain: "winf-auth.firebaseapp.com",
  projectId: "winf-auth",
  storageBucket: "winf-auth.firebasestorage.app",
  messagingSenderId: "218399040481",
  appId: "1:218399040481:web:1f971f1a71a70812c728a0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Seleciona elementos
const form = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const senha = form.senha.value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    const token = await user.getIdToken();

    // Salva token no localStorage
    localStorage.setItem('token', token);

    // Salva token em cookie para backend PHP ler
    document.cookie = `token=${token}; path=/; samesite=strict`;

    // Redireciona para a página de licenciados
    window.location.href = '../';
  } catch (error) {
    errorMsg.textContent = 'E-mail ou senha incorretos!';
  }
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBs5nRf528evxnNQUIsxf8Ygrkzxi1KEv4",
  authDomain: "winf-auth.firebaseapp.com",
  projectId: "winf-auth",
  storageBucket: "winf-auth.appspot.com",
  messagingSenderId: "218399040481",
  appId: "1:218399040481:web:1f971f1a71a70812c728a0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        alert("Você saiu da sessão.");
        window.location.href = "./login/";
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  });
}

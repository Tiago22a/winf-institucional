import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3UJmtrDhSIJnhgZf2tj-CggEnGEyA1xI",
  authDomain: "winf-licenciados-e-cidades.firebaseapp.com",
  projectId: "winf-licenciados-e-cidades",
  storageBucket: "winf-licenciados-e-cidades.firebasestorage.app",
  messagingSenderId: "757986095258",
  appId: "1:757986095258:web:8d77bca53c8ff329382f23"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos DOM
const resultadoDiv = document.getElementById("resultado");
const searchInput = document.getElementById("search");
const notFound = document.getElementById("nao-encontrado");

// Utilitário para gerar slug da cidade
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Mapa de estados para siglas
const estadoParaUF = {
  "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
  "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
  "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
  "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
  "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
};

let cidadesPorEstado = {};

// Carrega cidades do Firestore
async function carregarCidades() {
  try {
    const estadosSnapshot = await getDocs(collection(db, "estados"));
    estadosSnapshot.forEach((doc) => {
      const estado = doc.id;
      const cidades = doc.data().cidades || [];
      cidadesPorEstado[estado] = cidades;
    });
  } catch (error) {
    resultadoDiv.innerHTML = `<p class="text-red-500">Erro ao carregar cidades: ${error.message}</p>`;
  }
}

// Mostra cidades filtradas
function mostrarCidades(filtro = "") {
  resultadoDiv.innerHTML = "";
  notFound.classList.add("hidden");

  const termo = filtro.trim().toLowerCase();

  if (termo.length < 2) return;

  let encontrou = false;

  for (const estado in cidadesPorEstado) {
    const cidadesFiltradas = cidadesPorEstado[estado].filter(cidade =>
      cidade.toLowerCase().includes(termo)
    );

    if (cidadesFiltradas.length > 0) {
      encontrou = true;

      const estadoDiv = document.createElement("div");
      estadoDiv.className = "mb-6";

      const uf = estadoParaUF[estado] || slugify(estado);

      let lista = "";
 cidadesFiltradas.forEach(cidade => {
  // Nome da cidade capitalizado preservando acentos
  const cidadeFormatada = cidade
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join("-");

  // Slug MINÚSCULA real da pasta
  const slugCidade = slugify(cidade); // exemplo: santos

  // Slug final bonita MAIÚSCULA — só para exibir
  const slugBonita = `${cidadeFormatada}-${uf}`; // Ex: Santos-SP

  // URL REAL apontando para a pasta minúscula
  const urlCidade = `./cidades/${slugCidade}-${uf.toLowerCase()}`;

  lista += `
    <li>
      <a href="${urlCidade}" 
         class="block bg-zinc-800 p-3 rounded-lg hover:bg-teal-600 transition">
        ${slugBonita}
      </a>
    </li>
  `;
});





      estadoDiv.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${estado}</h3>
        <ul class="grid grid-cols-2 gap-2">
          ${lista}
        </ul>
      `;
      resultadoDiv.appendChild(estadoDiv);
    }
  }

  if (!encontrou) {
    notFound.classList.remove("hidden");
  }
}

// Evento de busca
searchInput.addEventListener("input", () => {
  mostrarCidades(searchInput.value);
});

// Executa carregamento inicial
carregarCidades();

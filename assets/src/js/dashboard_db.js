import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKpO1OLccL37DIsfoL2P3aNZzq1K-wioo",
  authDomain: "metricas-licenciados.firebaseapp.com",
  projectId: "metricas-licenciados",
  storageBucket: "metricas-licenciados.firebasestorage.app",
  messagingSenderId: "557326788940",
  appId: "1:557326788940:web:f96e8e8bb19f97334d87e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function carregarDashboard() {
  const cidadeSlug = getParam('id');
  if (!cidadeSlug) {
    document.getElementById('status').innerText = "Parâmetro 'id' não informado na URL.";
    return;
  }

  const docRef = doc(db, "licenciados", cidadeSlug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    document.getElementById('status').innerText = `Nenhum dado encontrado para ${cidadeSlug}.`;
    return;
  }

  const data = docSnap.data();

  document.getElementById('cidade').innerText = data.cidadeSlug || cidadeSlug;
  document.getElementById('acessos').innerText = data.totalAcessos || 0;
  document.getElementById('ultima-visita').innerText = data.ultimaVisita || 'N/A';
  document.getElementById('status').innerText = '';

  // Chama o gráfico real com ajuste dinâmico do eixo Y
  await gerarGraficoReal(cidadeSlug);
}

async function gerarGraficoReal(cidadeSlug) {
  const dias = 7;
  const hoje = new Date();

  const labels = [];
  const dados = [];

  for (let i = dias - 1; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const diaFormatado = data.toISOString().slice(0, 10); // YYYY-MM-DD
    labels.push(diaFormatado);
  }

  const acessoCollection = collection(db, "licenciados", cidadeSlug, "acessos");
  const snapshot = await getDocs(acessoCollection);

  const acessosPorData = {};
  snapshot.forEach(doc => {
    const dataId = doc.id;
    const count = doc.data().count || 0;
    acessosPorData[dataId] = count;
  });

  for (const dataStr of labels) {
    dados.push(acessosPorData[dataStr] || 0);
  }

  // Encontra o maior valor para ajustar o stepSize
  const maxAcesso = Math.max(...dados);

  function calcularStepSize(max) {
    if (max <= 10) return 1;
    if (max <= 50) return 5;
    if (max <= 200) return 10;
    if (max <= 1000) return 50;
    if (max <= 5000) return 100;
    if (max <= 20000) return 300;
    return Math.ceil(max / 20);
  }

  const stepSize = calcularStepSize(maxAcesso);

  const ctx = document.getElementById('graficoAcessos').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(data => data.slice(5)), // mostra MM-DD
      datasets: [{
        label: 'Acessos reais',
        data: dados,
        backgroundColor: '#004AAD',
        borderRadius: 5,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: stepSize,
            precision: 0 // mostra só números inteiros
          }
        }
      }
    }
  });
}

window.onload = carregarDashboard;

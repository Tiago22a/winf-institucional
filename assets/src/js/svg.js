import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração Firebase
const app = initializeApp({
  apiKey: "AIzaSyC3UJmtrDhSIJnhgZf2tj-CggEnGEyA1xI",
  authDomain: "winf-licenciados-e-cidades.firebaseapp.com",
  projectId: "winf-licenciados-e-cidades",
  storageBucket: "winf-licenciados-e-cidades.appspot.com",
  messagingSenderId: "757986095258",
  appId: "1:757986095258:web:8d77bca53c8ff329382f23"
});

const db = getFirestore(app);
const grupoPontinhos = document.getElementById("pontos-licenciados");

// Função principal
highlightStatesWithCities();

// Cria pontinho dentro de um path SVG (com validação)
function criarPontinhoDentroDoEstado(pathElement, estadoSigla) {
  if (!pathElement) return;

  const bbox = pathElement.getBBox();
  const svg = pathElement.ownerSVGElement;
  const pt = svg.createSVGPoint();

  const maxTentativas = 100;

  for (let i = 0; i < maxTentativas; i++) {
    const x = bbox.x + Math.random() * bbox.width;
    const y = bbox.y + Math.random() * bbox.height;

    pt.x = x;
    pt.y = y;

    // Se o método isPointInFill estiver disponível (mais preciso)
    if (typeof pathElement.isPointInFill === "function" && pathElement.isPointInFill(pt)) {
      adicionarPontinho(x, y, estadoSigla);
      return;
    }

    // Fallback para browsers que não suportam isPointInFill
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) continue;

    const transformed = pt.matrixTransform(screenCTM);
    const elementoAbaixo = document.elementFromPoint(transformed.x, transformed.y);

    if (elementoAbaixo === pathElement) {
      adicionarPontinho(x, y, estadoSigla);
      return;
    }
  }

  // Fallback: adiciona no centro
  adicionarPontinho(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2, estadoSigla);
}

function adicionarPontinho(x, y, estadoSigla) {
  const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circ.setAttribute("class", "pontinho");
  circ.setAttribute("cx", x);
  circ.setAttribute("cy", y);
  circ.setAttribute("r", 4);
  circ.setAttribute("fill", "#00FF00");
  circ.setAttribute("stroke", "#006600");
  circ.setAttribute("stroke-width", "1");
  circ.setAttribute("data-estado", estadoSigla);
  grupoPontinhos.appendChild(circ);
}

// Função principal para destacar estados e distribuir pontos
async function highlightStatesWithCities() {
  const LIMITE_MAXIMO = 300;

  const estadosRef = collection(db, "estados");
  const snapshot = await getDocs(estadosRef);

  grupoPontinhos.innerHTML = '';

  const estadosData = [];
  let totalLicenciados = 0;

  snapshot.forEach((doc) => {
    const sigla = doc.id.toLowerCase();
    const cidades = doc.data().cidades;

    if (Array.isArray(cidades) && cidades.length > 0) {
      estadosData.push({ sigla, cidadesCount: cidades.length });
      totalLicenciados += cidades.length;

      const path = document.getElementById(sigla);
      if (path) path.classList.add("ativo");
    }
  });

  const TOTAL_PONTOS = Math.min(totalLicenciados, LIMITE_MAXIMO);

  if (totalLicenciados <= LIMITE_MAXIMO) {
    estadosData.forEach((estado) => {
      const path = document.getElementById(estado.sigla);
      if (!path) return;

      for (let i = 0; i < estado.cidadesCount; i++) {
        criarPontinhoDentroDoEstado(path, estado.sigla);
      }
    });
    return;
  }

  let pontosDistribuidos = 0;

  estadosData.forEach((estado) => {
    const path = document.getElementById(estado.sigla);
    if (!path) return;

    let pontos = Math.floor((estado.cidadesCount / totalLicenciados) * TOTAL_PONTOS);
    if (pontos < 1) pontos = 1;
    if (pontosDistribuidos + pontos > TOTAL_PONTOS) {
      pontos = TOTAL_PONTOS - pontosDistribuidos;
    }

    for (let i = 0; i < pontos; i++) {
      criarPontinhoDentroDoEstado(path, estado.sigla);
    }

    pontosDistribuidos += pontos;
  });
}

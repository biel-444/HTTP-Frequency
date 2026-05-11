/* =========================
   HTTPFrequency - script.js
========================= */

const API_URL = "https://http-frequency.onrender.com";

/* =========================
   ENVIAR REQUEST
========================= */

async function enviarRequest() {

  const urlInput = document.getElementById("url");
  const methodInput = document.getElementById("method");
  const bodyInput = document.getElementById("body");

  const url = urlInput.value.trim();
  const method = methodInput.value;

  let body = {};

  /* =========================
     VALIDAÇÕES
  ========================= */

  if (!url) {
    alert("Digite uma URL.");
    return;
  }

  try {

    new URL(url);

  } catch {

    alert("URL inválida.");
    return;
  }

  /* =========================
     PARSE JSON
  ========================= */

  if (bodyInput.value.trim() !== "") {

    try {

      body = JSON.parse(bodyInput.value);

    } catch {

      alert("JSON inválido.");
      return;
    }
  }

  /* =========================
     LOADING BUTTON
  ========================= */

  const button = document.querySelector(".request-btn");

  const originalText = button.innerText;

  button.innerText = "Enviando...";
  button.disabled = true;

  try {

    /* =========================
       FETCH BACKEND
    ========================= */

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        url: url,
        method: method,
        body: body
      })
    });

    /* =========================
       RESPONSE JSON
    ========================= */

    const data = await response.json();

    mostrarResultado(data, response.status);

    salvarHistorico({
      url,
      method,
      status: response.status,
      horario: new Date().toLocaleString()
    });

  } catch (error) {

    console.error(error);

    mostrarErro(error);

  } finally {

    button.innerText = originalText;
    button.disabled = false;
  }
}

/* =========================
   MOSTRAR RESULTADO
========================= */

function mostrarResultado(data, status) {

  let resultadoContainer =
    document.getElementById("resultado-container");

  /* cria dinamicamente */
  if (!resultadoContainer) {

    resultadoContainer = document.createElement("div");

    resultadoContainer.id = "resultado-container";

    resultadoContainer.classList.add("request-container");

    document.querySelector(".hero-content")
      .appendChild(resultadoContainer);
  }

  resultadoContainer.innerHTML = `
  
    <h2 style="margin-bottom:20px;">
      Resultado da Request
    </h2>

    <div style="
      margin-bottom:20px;
      padding:14px;
      border-radius:14px;
      background: rgba(255,255,255,0.04);
      border:1px solid rgba(255,255,255,0.08);
    ">

      <strong>Status:</strong>
      ${status}

    </div>

    <pre style="
      background:#020617;
      padding:20px;
      border-radius:18px;
      overflow:auto;
      color:#00b7ff;
      font-size:0.95rem;
      line-height:1.6;
    ">${JSON.stringify(data, null, 2)}</pre>
  `;
}

/* =========================
   MOSTRAR ERRO
========================= */

function mostrarErro(error) {

  let resultadoContainer =
    document.getElementById("resultado-container");

  if (!resultadoContainer) {

    resultadoContainer = document.createElement("div");

    resultadoContainer.id = "resultado-container";

    resultadoContainer.classList.add("request-container");

    document.querySelector(".hero-content")
      .appendChild(resultadoContainer);
  }

  resultadoContainer.innerHTML = `

    <h2 style="margin-bottom:20px;color:#ef4444;">
      Erro na Requisição
    </h2>

    <div style="
      background: rgba(239,68,68,0.08);
      border:1px solid rgba(239,68,68,0.2);
      padding:20px;
      border-radius:18px;
      color:#fca5a5;
    ">

      ${error}

    </div>
  `;
}

/* =========================
   HISTÓRICO LOCAL
========================= */

function salvarHistorico(requestData) {

  const historico =
    JSON.parse(localStorage.getItem("httpfrequency_history"))
    || [];

  historico.unshift(requestData);

  /* limita histórico */
  if (historico.length > 20) {
    historico.pop();
  }

  localStorage.setItem(
    "httpfrequency_history",
    JSON.stringify(historico)
  );
}

/* =========================
   MOSTRAR HISTÓRICO
========================= */

function mostrarHistorico() {

  const historico =
    JSON.parse(localStorage.getItem("httpfrequency_history"))
    || [];

  console.log(historico);
}

/* =========================
   ANIMAÇÃO SUAVE SCROLL
========================= */

document.querySelectorAll('a[href^="#"]')
  .forEach(anchor => {

    anchor.addEventListener("click", function (e) {

      e.preventDefault();

      const target =
        document.querySelector(this.getAttribute("href"));

      if (target) {

        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

/* =========================
   EFEITO NAVBAR SCROLL
========================= */

window.addEventListener("scroll", () => {

  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 30) {

    navbar.style.background =
      "rgba(3,7,18,0.92)";

  } else {

    navbar.style.background =
      "rgba(3,7,18,0.75)";
  }
});

/* =========================
   ENTER PARA ENVIAR
========================= */

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Enter" &&
    event.ctrlKey
  ) {

    enviarRequest();
  }
});

/* =========================
   LOG INICIAL
========================= */

console.log(`
======================================
        HTTPFrequency iniciado
======================================
CTRL + ENTER -> enviar request
======================================
`);
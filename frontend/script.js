/* =========================
   HTTPFrequency - script.js
========================= */

const API_URL = "https://http-frequency.onrender.com";

/* =========================
   ENVIAR REQUEST
========================= */

async function enviarRequest() {

  const urlsInput =
    document.getElementById("urls");

  const concurrencyInput =
    document.getElementById("concurrency");

  const timeoutInput =
    document.getElementById("timeout");

  const urls = urlsInput.value
    .split("\n")
    .map(url => url.trim())
    .filter(url => url !== "");

  /* =========================
     VALIDAÇÕES
  ========================= */

  if (urls.length === 0) {

    alert("Digite ao menos uma URL.");

    return;
  }

  for (const url of urls) {

    try {

      new URL(url);

    } catch {

      alert(`URL inválida: ${url}`);

      return;
    }
  }

  const concurrency =
    parseInt(concurrencyInput.value) || 10;

  const timeout =
    parseInt(timeoutInput.value) || 10;

  /* =========================
     LOADING BUTTON
  ========================= */

  const button =
    document.querySelector(".request-btn");

  const originalText =
    button.innerText;

  button.innerText = "Executando...";
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
        urls: urls,
        concurrency: concurrency,
        timeout: timeout
      })
    });

    const data =
      await response.json();

    mostrarResultado(
      data,
      response.status
    );

  } catch (error) {

    console.error(error);

    mostrarErro(error);

  } finally {

    button.innerText =
      originalText;

    button.disabled = false;
  }
}

/* =========================
   MOSTRAR RESULTADO
========================= */

function mostrarResultado(data, status) {

  const resultadoContainer =
    document.getElementById("resultado-container");

  let tabelaHTML = "";

  if (data.resultados) {

    tabelaHTML = `

      <table style="
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
      ">

        <thead>

          <tr>

            <th>URL</th>
            <th>Status</th>
            <th>Tempo</th>
            <th>Resultado</th>
            <th>Bytes</th>

          </tr>

        </thead>

        <tbody>
    `;

    data.resultados.forEach(r => {

      tabelaHTML += `

        <tr>

          <td>${r.url}</td>

          <td>${r.status_code}</td>

          <td>
            ${r.tempo_resposta
              ? r.tempo_resposta.toFixed(3) + "s"
              : "-"}
          </td>

          <td>
            ${r.sucesso
              ? "Sucesso"
              : "Falha"}
          </td>

          <td>
            ${r.bytes_recebidos ?? "-"}
          </td>

        </tr>
      `;
    });

    tabelaHTML += `
        </tbody>
      </table>
    `;
  }

  const csvUrl =
    `${API_URL}/${data.execution_id}/download`;

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
      display:flex;
      gap:20px;
      flex-wrap:wrap;
    ">

      <div>
        <strong>Status:</strong>
        ${status}
      </div>

      <div>
        <strong>Total:</strong>
        ${data.total_urls}
      </div>

      <div>
        <strong>Sucessos:</strong>
        ${data.sucessos}
      </div>

      <div>
        <strong>Falhas:</strong>
        ${data.falhas}
      </div>

      <div>
        <strong>Tempo Médio:</strong>
        ${data.tempo_medio}s
      </div>

    </div>

    ${tabelaHTML}

    <div style="margin-top:25px;">

      <a
        href="${csvUrl}"
        target="_blank"
        class="request-btn"
        style="
          text-decoration:none;
          display:inline-block;
        "
      >
        Baixar CSV
      </a>

    </div>

    <pre style="
      background:#020617;
      padding:20px;
      border-radius:18px;
      overflow:auto;
      color:#00b7ff;
      font-size:0.95rem;
      line-height:1.6;
      margin-top:30px;
    ">${JSON.stringify(data, null, 2)}</pre>
  `;
}

/* =========================
   MOSTRAR ERRO
========================= */

function mostrarErro(error) {

  const resultadoContainer =
    document.getElementById("resultado-container");

  resultadoContainer.innerHTML = `

    <h2 style="
      margin-bottom:20px;
      color:#ef4444;
    ">
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
   ANIMAÇÃO SUAVE SCROLL
========================= */

document.querySelectorAll('a[href^="#"]')
  .forEach(anchor => {

    anchor.addEventListener("click", function (e) {

      e.preventDefault();

      const target =
        document.querySelector(
          this.getAttribute("href")
        );

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

  const navbar =
    document.querySelector(".navbar");

  if (window.scrollY > 30) {

    navbar.style.background =
      "rgba(3,7,18,0.92)";

  } else {

    navbar.style.background =
      "rgba(3,7,18,0.75)";
  }
});

/* =========================
   CTRL + ENTER
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
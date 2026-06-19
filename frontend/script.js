/* =========================
   HTTPFrequency - script.js
========================= */

const API_URL = "https://http-frequency.onrender.com";

/* =========================
   ENVIAR REQUEST
========================= */

async function enviarRequest() {

  const urlsInput      = document.getElementById("urls");
  const concurrencyInput = document.getElementById("concurrency");
  const timeoutInput   = document.getElementById("timeout");

  const urls = urlsInput.value
    .split("\n")
    .map(url => url.trim())
    .filter(url => url !== "");

  /* ---------- validações ---------- */

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

  const concurrency = parseInt(concurrencyInput.value) || 10;
  const timeout     = parseInt(timeoutInput.value)     || 10;

  /* ---------- loading button ---------- */

  const button = document.querySelector(".request-btn");
  const originalText = button.innerText;
  button.innerText = "Executando...";
  button.disabled  = true;

  try {

    /* ---------- fetch backend (rota corrigida) ---------- */

    const response = await fetch(`${API_URL}/executions`, {   // <- /executions
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls, concurrency, timeout }),
    });

    const data = await response.json();

    mostrarResultado(data, response.status);

  } catch (error) {

    console.error(error);
    mostrarErro(error);

  } finally {

    button.innerText = originalText;
    button.disabled  = false;
  }
}

/* =========================
   MOSTRAR RESULTADO
========================= */

function mostrarResultado(data, status) {

  const container = document.getElementById("resultado-container");

  /* ---------- tabela principal (todos os resultados) ---------- */

  let tabelaHTML = "";

  if (data.resultados && data.resultados.length > 0) {

    tabelaHTML = `
      <h3 style="margin:30px 0 14px;">Todos os resultados</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>URL</th>
            <th>Status</th>
            <th>Tempo</th>
            <th>Resultado</th>
            <th>Bytes</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.resultados.forEach((r, i) => {

      const sucessoClass = r.sucesso ? "status-success" : "status-fail";
      const sucessoLabel = r.sucesso ? "✓ Sucesso" : "✗ Falha";
      const tempo = r.tempo_resposta
        ? (r.tempo_resposta * 1000).toFixed(1) + " ms"
        : "-";

      tabelaHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${r.url}</td>
          <td>${r.status_code ?? "-"}</td>
          <td>${tempo}</td>
          <td class="${sucessoClass}">${sucessoLabel}</td>
          <td>${r.bytes_recebidos ?? "-"}</td>
        </tr>
      `;
    });

    tabelaHTML += `</tbody></table>`;
  }

  /* ---------- ranking (URLs de sucesso, por velocidade) ---------- */

  let rankingHTML = "";

  if (data.ranking && data.ranking.length > 0) {

    rankingHTML = `
      <h3 style="margin:36px 0 14px;">
        🏆 Ranking — mais rápidas primeiro
      </h3>
      <table>
        <thead>
          <tr>
            <th>Pos.</th>
            <th>URL</th>
            <th>Tempo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.ranking.forEach((r, i) => {

      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`;
      const tempo   = (r.tempo_resposta * 1000).toFixed(1) + " ms";

      rankingHTML += `
        <tr>
          <td>${medalha}</td>
          <td>${r.url}</td>
          <td class="status-success">${tempo}</td>
          <td>${r.status_code}</td>
        </tr>
      `;
    });

    rankingHTML += `</tbody></table>`;
  }

  /* ---------- URL de download (rota corrigida) ---------- */

  const csvUrl = `${API_URL}/executions/${data.execution_id}/download`;  // <- /executions/{id}/download

  /* ---------- monta HTML final ---------- */

  container.innerHTML = `

    <h2 style="margin-bottom:20px;">Resultado da Análise</h2>

    <!-- métricas resumidas -->
    <div style="
      display:flex;
      gap:20px;
      flex-wrap:wrap;
      margin-bottom:20px;
      padding:18px;
      border-radius:14px;
      background:rgba(255,255,255,0.04);
      border:1px solid rgba(255,255,255,0.08);
    ">
      <div><strong>HTTP:</strong> ${status}</div>
      <div><strong>Total:</strong> ${data.total_urls}</div>
      <div><strong>✓ Sucessos:</strong> <span class="status-success">${data.sucessos}</span></div>
      <div><strong>✗ Falhas:</strong> <span class="status-fail">${data.falhas}</span></div>
      <div><strong>Tempo médio:</strong> ${(data.tempo_medio * 1000).toFixed(1)} ms</div>
    </div>

    ${rankingHTML}

    ${tabelaHTML}

    <!-- download CSV -->
    <div style="margin-top:28px;">
      <a
        href="${csvUrl}"
        target="_blank"
        class="request-btn"
        style="text-decoration:none; display:inline-block;"
      >
        ⬇ Baixar CSV
      </a>
    </div>

    <!-- JSON bruto -->
    <pre class="result-json">${JSON.stringify(data, null, 2)}</pre>
  `;
}

/* =========================
   MOSTRAR ERRO
========================= */

function mostrarErro(error) {

  document.getElementById("resultado-container").innerHTML = `
    <h2 style="margin-bottom:20px; color:#ef4444;">Erro na Requisição</h2>
    <div style="
      background:rgba(239,68,68,0.08);
      border:1px solid rgba(239,68,68,0.2);
      padding:20px;
      border-radius:18px;
      color:#fca5a5;
    ">${error}</div>
  `;
}

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================
   NAVBAR SCROLL
========================= */

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.style.background = window.scrollY > 30
    ? "rgba(3,7,18,0.92)"
    : "rgba(3,7,18,0.75)";
});

/* =========================
   CTRL + ENTER
========================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) enviarRequest();
});

/* =========================
   LOG INICIAL
========================= */

console.log(`
======================================
        HTTPFrequency iniciado
======================================
CTRL + ENTER  →  enviar request
API            →  ${API_URL}
======================================
`);

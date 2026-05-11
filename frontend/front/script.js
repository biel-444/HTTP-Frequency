/*const API_URL = "https://http-frequency.onrender.com"

function formatarTempo(segundos) {

    if (segundos === null || segundos === undefined) {
        return "-"
    }

    if (segundos < 1) {
        return `${Math.round(segundos * 1000)} ms`
    }

    return `${segundos.toFixed(2)} s`
}

function criarBadgeStatus(sucesso) {

    if (sucesso) {

        return `
            <span class="badge badge-success">
                ✅ Online
            </span>
        `
    }

    return `
        <span class="badge badge-danger">
            ❌ Offline
        </span>
    `
}

function renderizarStats(data) {

    return `
        <div class="card">
            <span>Total</span>
            <strong>${data.total_urls}</strong>
        </div>

        <div class="card">
            <span>Online</span>
            <strong>${data.sucessos}</strong>
        </div>

        <div class="card">
            <span>Offline</span>
            <strong>${data.falhas}</strong>
        </div>

        <div class="card">
            <span>Tempo médio</span>
            <strong>
                ${formatarTempo(data.tempo_medio)}
            </strong>
        </div>

        <a
            class="download-link"
            href="${API_URL}/executions/${data.execution_id}/download"
            target="_blank"
        >
            ⬇ Baixar CSV
        </a>
    `
}

function renderizarResultados(resultados, tbody) {

    if (!resultados || resultados.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    Nenhum resultado encontrado.
                </td>
            </tr>
        `

        return
    }

    resultados.forEach(result => {

        const row = document.createElement("tr")

        row.className = result.sucesso
            ? "row-success"
            : "row-error"

        row.innerHTML = `
            <td>${result.url}</td>

            <td>
                ${result.status_code ?? "-"}
            </td>

            <td>
                ${formatarTempo(result.tempo_resposta)}
            </td>

            <td>
                ${criarBadgeStatus(result.sucesso)}
            </td>
        `

        tbody.appendChild(row)
    })
}

function renderizarErro(stats, tbody, mensagem) {

    stats.innerHTML = `
        <div class="error-box">
            ${mensagem}
        </div>
    `

    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-state">
                Nenhum resultado disponível.
            </td>
        </tr>
    `
}

async function executar() {

    const textarea = document.getElementById("urls")

    const stats = document.getElementById("stats")

    const tbody = document.getElementById("results")

    const button = document.getElementById("execute-btn")

    tbody.innerHTML = ""

    stats.innerHTML = ""

    const urls = textarea.value
        .split("\n")
        .map(url => url.trim())
        .filter(url => url !== "")

    if (urls.length === 0) {

        alert("Informe pelo menos uma URL")

        return
    }

    button.disabled = true

    button.innerText = "Executando..."

    try {

        const response = await fetch(
            `${API_URL}/executions`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    urls,
                    concurrency: 5,
                    timeout: 5
                })
            }
        )

        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            )
        }

        const data = await response.json()

        stats.innerHTML = renderizarStats(data)

        renderizarResultados(
            data.resultados,
            tbody
        )
    }

    catch (error) {

        console.error(error)

        renderizarErro(
            stats,
            tbody,
            "Erro ao conectar com a API. Verifique se o backend está online."
        )
    }

    finally {

        button.disabled = false

        button.innerText = "Executar"
    }
}*/
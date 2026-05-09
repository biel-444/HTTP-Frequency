/*async function executar() {

    const textarea = document.getElementById("urls")

    const stats = document.getElementById("stats")

    const tbody = document.getElementById("results")

    tbody.innerHTML = ""

    const urls = textarea.value
        .split("\n")
        .map(url => url.trim())
        .filter(url => url !== "")

    const response = await fetch(
        "http://127.0.0.1:8000/executions",
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

    const data = await response.json()

    stats.innerHTML = `
        <p>Total: ${data.total_urls}</p>
        <p>Sucessos: ${data.sucessos}</p>
        <p>Falhas: ${data.falhas}</p>
        <p>Tempo médio: ${data.tempo_medio}s</p>
        <a href="http://127.0.0.1:8000/executions/${data.execution_id}/download">
            Baixar CSV
        </a>
    `

    data.resultados.forEach(result => {

        const row = document.createElement("tr")

        row.innerHTML = `
            <td>${result.url}</td>
            <td>${result.status_code}</td>
            <td>${result.tempo_resposta}</td>
            <td>${result.sucesso}</td>
        `

        tbody.appendChild(row)
    })
}*/

const API_URL = "http://127.0.0.1:8000"

function formatarTempo(segundos) {

    if (!segundos) {
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

async function executar() {

    const textarea = document.getElementById("urls")

    const stats = document.getElementById("stats")

    const tbody = document.getElementById("results")

    const button = document.getElementById("execute-btn")

    tbody.innerHTML = ""

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
            throw new Error("Erro ao executar requests")
        }

        const data = await response.json()

        stats.innerHTML = `
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
        `

        data.resultados.forEach(result => {

            const row = document.createElement("tr")

            row.className = result.sucesso
                ? "row-success"
                : "row-error"

            row.innerHTML = `
                <td>${result.url}</td>

                <td>
                    ${result.status_code || "-"}
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

        stats.innerHTML += `
            <a
                class="download-link"
                href="${API_URL}/executions/${data.execution_id}/download"
            >
                ⬇ Baixar CSV
            </a>
        `
    }

    catch (error) {

        console.error(error)

        stats.innerHTML = `
            <div class="error-box">
                Erro ao conectar com a API.
                Verifique se o backend está online.
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

    finally {

        button.disabled = false

        button.innerText = "Executar"
    }
}
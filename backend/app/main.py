from pathlib import Path

import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.database import (
    buscar_execucao,
    criar_execucao,
    listar_execucoes,
    salvar_resultados
)

from app.models import ExecutionRequest

from app.service import run_probe


app = FastAPI(
    title="HTTPFrequency",
    version="3.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent

EXPORT_DIR = BASE_DIR / "exports"

EXPORT_DIR.mkdir(exist_ok=True)

@app.get("/")
def home():
    return {
        "status": "HTTPFrequency rodando"
    }


@app.post("/executions")
async def executar_requests(payload: ExecutionRequest):

    try:

        execution = criar_execucao()

        resultados = await run_probe(
            urls=[str(url) for url in payload.urls],
            concurrency=payload.concurrency,
            timeout=payload.timeout
        )

        salvar_resultados(
            execution_id=execution["id"],
            resultados=resultados
        )

        csv_data = []

        for r in resultados:

            csv_data.append({
                "url": r.url,
                "status_code": r.status,
                "tempo_resposta": r.elapsed_s,
                "sucesso": r.ok,
                "erro": r.error,
                "final_url": r.final_url,
                "bytes_recebidos": r.bytes_rcv
            })
            df = pd.DataFrame(csv_data)

        file_path = EXPORT_DIR / f"execution_{execution['id']}.csv"

        df.to_csv(file_path, index=False)

        sucessos = len([r for r in resultados if r.ok])
        falhas = len(resultados) - sucessos

        tempos = [r.elapsed_s for r in resultados if r.elapsed_s is not None]

        media_tempo = (
            sum(tempos) / len(tempos)
            if tempos else 0
        )
        
        return {
            "execution_id": execution["id"],
            "csv_file": str(file_path),
            "total_urls": len(resultados),
            "sucessos": sucessos,
            "falhas": falhas,
            "tempo_medio": round(media_tempo, 3),
            "resultados": csv_data
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@app.get("/executions")
def get_execucoes():

    return listar_execucoes()


@app.get("/executions/{execution_id}")
def get_execucao(execution_id: int):

    execution = buscar_execucao(execution_id)

    if not execution:

        raise HTTPException(
            status_code=404,
            detail="Execução não encontrada"
        )

    return execution
@app.get("/executions/{execution_id}/download")
def download_csv(execution_id: int):

    file_path = EXPORT_DIR / f"execution_{execution_id}.csv"

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="CSV não encontrado"
        )

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="text/csv"
    )
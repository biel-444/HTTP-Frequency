import os

from dotenv import load_dotenv
from supabase import create_client


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


def criar_execucao():

    response = (
        supabase
        .table("executions")
        .insert({})
        .execute()
    )

    return response.data[0]


def salvar_resultados(
    execution_id,
    resultados
):

    data = []

    for r in resultados:

        data.append({
            "execution_id": execution_id,
            "url": r.url,
            "status_code": r.status,
            "tempo_resposta": r.elapsed_s,
            "sucesso": r.ok,
            "erro": r.error,
        })

    response = (
        supabase
        .table("execution_results")
        .insert(data)
        .execute()
    )

    return response.data


def listar_execucoes():

    response = (
        supabase
        .table("executions")
        .select("*")
        .order("created_at", desc=True)
    )
    return response.data
def buscar_execucao(execution_id: int):

    execution = (
        supabase
        .table("executions")
        .select("*")
        .eq("id", execution_id)
        .execute()
    )

    if not execution.data:
        return None

    resultados = (
        supabase
        .table("execution_results")
        .select("*")
        .eq("execution_id", execution_id)
        .execute()
    )

    return {
        "execution": execution.data[0],
        "resultados": resultados.data
    }
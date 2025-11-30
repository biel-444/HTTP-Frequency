import asyncio
import time
from dataclasses import dataclass
from typing import Optional, List
import httpx


# Resultado de uma requisição para uma URL
@dataclass
class ResultadoRequisicao:
    url: str                  # URL testada
    ok: bool                  # True se consideramos sucesso
    status: Optional[int]     # Código HTTP (200, 404, etc.) ou None se falhou antes
    tempo_s: Optional[float]  # Tempo de resposta em segundos
    bytes_recebidos: Optional[int]  # Tamanho da resposta em bytes
    url_final: Optional[str]  # URL final após redirecionamentos
    erro: Optional[str]       # Nome do erro de rede (se houver)


# Faz UMA requisição para UMA URL
async def buscar(
    cliente: httpx.AsyncClient,
    url: str,
    metodo: str = "GET"
) -> ResultadoRequisicao:
    inicio = time.perf_counter()  # marca o tempo antes da requisição
    try:
        resposta = await cliente.request(metodo, url)  # faz a requisição HTTP
        tempo = time.perf_counter() - inicio          # tempo que demorou

        corpo = resposta.content if resposta.content is not None else b""

        return ResultadoRequisicao(
            url = url,
            ok = resposta.status_code < 400,
            status = resposta.status_code,
            tempo_s = tempo,
            bytes_recebidos = len(corpo),
            url_final = str(resposta.url),
            erro = None,
        )
    except httpx.HTTPError as erro_rede:
        # Qualquer erro de rede cai aqui (timeout, DNS, conexão, etc.)
        return ResultadoRequisicao(
            url = url,
            ok = False,
            status = None,
            tempo_s = None,
            bytes_recebidos = None,
            url_final = None,
            erro = erro_rede.__class__.__name__,
        )


# Roda as requisições para TODAS as URLs, com limite de concorrência
async def executar(
    urls: List[str],
    concorrencia: int,
    timeout: float,
    metodo: str
) -> List[ResultadoRequisicao]:
    semaforo = asyncio.Semaphore(concorrencia)

    async with httpx.AsyncClient(
        follow_redirects = True,
        timeout = httpx.Timeout(timeout, connect = timeout, read = timeout),
        headers = {"User-Agent": "HTTP-Frequency/1.0"}
    ) as cliente:

        async def buscar_com_limite(u: str):
            # Garante que só "concorrencia" requisições rodem ao mesmo tempo
            async with semaforo:
                return await buscar(cliente, u, metodo)

        tarefas = [asyncio.create_task(buscar_com_limite(u)) for u in urls]
        resultados = await asyncio.gather(*tarefas)
        return resultados


# Pega as URLs digitadas pelo usuário no terminal
def obter_urls_do_usuario() -> List[str]:
    print("Digite as URLs que você quer testar: (Uma por linha)")
    print("\nDeixe em branco e aperte Enter para finalizar.\n")

    urls = []
    while True:
        linha = input("URL: ").strip()
        if not linha:
            break

        # Se o usuário não colocar http, colocamos https:// por padrão
        if not (linha.startswith("http://") or linha.startswith("https://")):
            linha = "https://" + linha

        urls.append(linha)

    # Remove URLs repetidas mantendo a ordem
    vistas = set()
    urls_unicas = []
    for u in urls:
        if u not in vistas:
            urls_unicas.append(u)
            vistas.add(u)

    return urls_unicas


# Mostra o relatório no terminal
def mostrar_relatorio(resultados: List[ResultadoRequisicao]):
    ok = [r for r in resultados if r.ok and r.tempo_s is not None]
    falha = [r for r in resultados if not r.ok]

    # Ordena as bem-sucedidas pelo tempo (mais rápidas primeiro)
    ok_ordenados = sorted(ok, key = lambda r: r.tempo_s)

    print("\n=== HTTP Frequency — Resultados ===")
    if ok_ordenados:
        print("\nTop URLs mais rápidas:")
        for i, r in enumerate(ok_ordenados, 1):
            print(f"{i:>2}. {r.url:<40} {r.tempo_s*1000:7.1f} ms  (HTTP {r.status})")
    else:
        print("\nNenhuma URL respondeu com sucesso.")

    if falha:
        print("\nFalhas / erros de rede:")
        for r in falha:
            msg_erro = r.erro or (f"HTTP {r.status}")
            print(f" - {r.url}  ->  erro: {msg_erro}")
    print()


def main():
    print("""
\033[31m===============================================
         H T T P   F R E Q U E N C Y
===============================================\033[0m
        \033[32mAnalisador de Desempenho HTTP
            by Gabriel de Vargas\033[0m
\033[31m-----------------------------------------------\033[0m""")
    urls = obter_urls_do_usuario()
    if not urls:
        print("Nenhuma URL informada.")
        return

    # Pergunta a concorrência
    try:
        texto_conc = input("\nConcorrência (requisições simultâneas) [recomendado = 5]: ").strip()
        concorrencia = int(texto_conc) if texto_conc else 5
    except ValueError:
        concorrencia = 5

    # Pergunta o intervalo de tempo
    try:
        texto_timeout = input("Timeout em segundos [recomendado = 5]: ").strip()
        timeout = float(texto_timeout) if texto_timeout else 5.0
    except ValueError: #se o valor digitado der erro, recebera 5.0
        timeout = 5.0

    metodo = "GET"  # deixei fixo em GET 

    print(f"\nTestando {len(urls)} URL(s) | conc={concorrencia} | timeout={timeout}s | método={metodo}")
    resultados = asyncio.run(executar(urls, concorrencia, timeout, metodo))
    mostrar_relatorio(resultados)


if __name__ == "__main__":
    main()
import asyncio
import time
from dataclasses import dataclass
from typing import Optional, List

import httpx


@dataclass
class ProbeResult:
    url: str
    ok: bool
    status: Optional[int]
    elapsed_s: Optional[float]
    bytes_rcv: Optional[int]
    final_url: Optional[str]
    error: Optional[str]


async def fetch_one(client: httpx.AsyncClient, url: str, method: str = "GET") -> ProbeResult:
    start = time.perf_counter()
    try:
        r = await client.request(method, url)
        elapsed = time.perf_counter() - start
        body = r.content if r.content is not None else b""
        return ProbeResult(
            url=url,
            ok=r.status_code < 400,
            status=r.status_code,
            elapsed_s=elapsed,
            bytes_rcv=len(body),
            final_url=str(r.url),
            error=None,
        )
    except httpx.HTTPError as e:
        return ProbeResult(
            url=url,
            ok=False,
            status=None,
            elapsed_s=None,
            bytes_rcv=None,
            final_url=None,
            error=str(e.__class__.__name__),
        )


async def run_probe(urls: List[str], concurrency: int, timeout: float, method: str) -> List[ProbeResult]:
    sem = asyncio.Semaphore(concurrency)

    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=httpx.Timeout(timeout, connect=timeout, read=timeout),
        headers={"User-Agent": "HTTP-Frequency/1.0"}
    ) as client:

        async def bound_fetch(u: str):
            async with sem:
                return await fetch_one(client, u, method)

        tasks = [asyncio.create_task(bound_fetch(u)) for u in urls]
        return await asyncio.gather(*tasks)


def get_urls_from_input() -> List[str]:
    print("Digite as URLs que você quer testar.")
    print("Uma por linha. Deixe em branco e aperte Enter para finalizar.\n")

    urls = []
    while True:
        linha = input("URL: ").strip()
        if not linha:
            break
        # se o usuário esquecer do http, adicionamos http:// por padrão
        if not (linha.startswith("http://") or linha.startswith("https://")):
            linha = "https://" + linha
        urls.append(linha)

    # remover duplicadas mantendo ordem
    seen = set()
    uniq = []
    for u in urls:
        if u not in seen:
            uniq.append(u)
            seen.add(u)
    return uniq


def print_report(results: List[ProbeResult]):
    ok = [r for r in results if r.ok and r.elapsed_s is not None]
    fail = [r for r in results if not r.ok]

    ok_sorted = sorted(ok, key=lambda r: r.elapsed_s)

    print("\n=== HTTP Frequency — Resultados ===")
    if ok_sorted:
        print("\nTop mais rápidos:")
        for i, r in enumerate(ok_sorted, 1):
            print(f"{i:>2}. {r.url:<40} {r.elapsed_s*1000:7.1f} ms  (HTTP {r.status})")
    else:
        print("\nNenhum site respondeu com sucesso.")

    if fail:
        print("\nFalhas/erros:")
        for r in fail:
            print(f" - {r.url}  ->  erro: {r.error or ('HTTP ' + str(r.status))}")
    print()


def main():
    print("=== HTTP Frequency ===")
    urls = get_urls_from_input()
    if not urls:
        print("Nenhuma URL informada. Encerrando.")
        return

    # parâmetros básicos com valores padrão
    try:
        conc_str = input("\nConcorrência (requisições simultâneas) [padrão 5]: ").strip()
        concurrency = int(conc_str) if conc_str else 5
    except ValueError:
        concurrency = 5

    try:
        tout_str = input("Timeout em segundos [padrão 5]: ").strip()
        timeout = float(tout_str) if tout_str else 5.0
    except ValueError:
        timeout = 5.0

    method = "GET"  # para o trabalho, manter fixo em GET (poderíamos perguntar também)

    print(f"\nTestando {len(urls)} URL(s) | conc={concurrency} | timeout={timeout}s | method={method}")
    results = asyncio.run(run_probe(urls, concurrency, timeout, method))
    print_report(results)


if __name__ == "__main__":
    main()

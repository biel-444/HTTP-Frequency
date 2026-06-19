"""
runner.py — execução avulsa via terminal (sem API).
Útil para testes locais ou agendamentos via cron.
"""

import asyncio

from app.database import criar_execucao, salvar_resultados
from app.service import run_probe


URLS_PADRAO = [
    "https://google.com",
    "https://github.com",
    "https://owasp.org",
]


async def main(
    urls: list[str] = URLS_PADRAO,
    concurrency: int = 5,
    timeout: float = 5.0,
):
    print(f"\n=== HTTPFrequency Runner ===")
    print(f"URLs: {len(urls)} | Concorrência: {concurrency} | Timeout: {timeout}s\n")

    execution = criar_execucao()
    execution_id = execution["id"]

    resultados = await run_probe(
        urls=urls,
        concurrency=concurrency,
        timeout=timeout,
    )

    salvar_resultados(
        execution_id=execution_id,
        resultados=resultados,
    )

    # --- relatório no terminal com ranking ---
    ok = sorted(
        [r for r in resultados if r.ok and r.elapsed_s is not None],
        key=lambda r: r.elapsed_s,
    )
    fail = [r for r in resultados if not r.ok]

    print("Ranking (mais rápidas primeiro):")
    for i, r in enumerate(ok, 1):
        print(f"  {i:>2}. {r.url:<45} {r.elapsed_s * 1000:7.1f} ms  HTTP {r.status}")

    if fail:
        print("\nFalhas:")
        for r in fail:
            erro = r.error or f"HTTP {r.status}"
            print(f"  - {r.url}  →  {erro}")

    print(f"\nExecution ID salvo: {execution_id}")
    print("Concluído.\n")


if __name__ == "__main__":
    asyncio.run(main())

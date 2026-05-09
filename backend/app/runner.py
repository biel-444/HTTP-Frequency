import asyncio

from backend.app.database import (
    listar_urls,
    salvar_resultados
)

from backend.app.service import run_probe


async def main():

    urls_db = listar_urls()

    if not urls_db:
        print("Nenhuma URL cadastrada")
        return

    urls = [u["url"] for u in urls_db]

    url_map = {
        u["url"]: u["id"]
        for u in urls_db
    }

    resultados = await run_probe(
        urls=urls,
        concurrency=5,
        timeout=5
    )

    salvar_resultados(resultados, url_map)

    print("Monitoramento concluído")


if __name__ == "__main__":
    asyncio.run(main())
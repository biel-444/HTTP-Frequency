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


async def fetch_one(
    client: httpx.AsyncClient,
    url: str,
    method: str = "GET"
) -> ProbeResult:

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

    except Exception as e:

        return ProbeResult(
            url=url,
            ok=False,
            status=None,
            elapsed_s=None,
            bytes_rcv=None,
            final_url=None,
            error=str(type(e).__name__),
        )


async def run_probe(
    urls: List[str],
    concurrency: int = 5,
    timeout: float = 5.0,
    method: str = "GET"
):

    sem = asyncio.Semaphore(concurrency)

    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=httpx.Timeout(
            timeout,
            connect=timeout,
            read=timeout
        ),
        headers={
            "User-Agent": "HTTPFrequency/1.0"
        }
    ) as client:

        async def bound_fetch(u: str):
            async with sem:
                return await fetch_one(client, u, method)

        tasks = [
            asyncio.create_task(bound_fetch(u))
            for u in urls
        ]

        return await asyncio.gather(*tasks)
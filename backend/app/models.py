from typing import List

from pydantic import BaseModel, field_validator


class ExecutionRequest(BaseModel):
    urls: List[str]
    concurrency: int = 5
    timeout: float = 5.0

    @field_validator("urls", mode="before")
    @classmethod
    def normalizar_urls(cls, urls):
        normalizadas = []
        for url in urls:
            url = url.strip()
            if not url:
                continue
            if not url.startswith("http://") and not url.startswith("https://"):
                url = "https://" + url
            normalizadas.append(url)
        if not normalizadas:
            raise ValueError("Nenhuma URL válida fornecida.")
        return normalizadas

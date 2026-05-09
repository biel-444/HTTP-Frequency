from typing import List

from pydantic import BaseModel, HttpUrl


class ExecutionRequest(BaseModel):
    urls: List[HttpUrl]
    concurrency: int = 5
    timeout: float = 5.0
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Locale = Literal["ru", "en"]


class APIModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class HealthResponse(APIModel):
    status: Literal["ok"] = Field(examples=["ok"])
    service: str = Field(examples=["ragu-web-api"])
    version: str = Field(examples=["0.1.0"])
    time: datetime


class CapabilitiesResponse(APIModel):
    preindexed_datasets: bool
    graph_explorer: bool
    agent_chat: bool
    upload_document: bool
    upload_index: bool
    live_indexing: bool
    job_queue: bool
    gpu_worker: bool


class ErrorDetail(APIModel):
    code: str = Field(examples=["dataset_not_found"])
    message: str = Field(examples=["Dataset 'unknown' was not found."])


class ErrorResponse(APIModel):
    detail: ErrorDetail

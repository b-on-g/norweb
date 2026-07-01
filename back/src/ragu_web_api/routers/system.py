from datetime import datetime, timezone
from fastapi import APIRouter

from ragu_web_api import __version__
from ragu_web_api.schemas.common import CapabilitiesResponse, HealthResponse

router = APIRouter(tags=["System"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health check",
)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="ragu-web-api",
        version=__version__,
        time=datetime.now(timezone.utc),
    )


@router.get(
    "/capabilities",
    response_model=CapabilitiesResponse,
    summary="Runtime feature flags",
)
async def capabilities() -> CapabilitiesResponse:
    return CapabilitiesResponse(
        preindexed_datasets=True,
        graph_explorer=True,
        agent_chat=True,
        upload_document=False,
        upload_index=False,
        live_indexing=False,
        job_queue=False,
        gpu_worker=False,
    )

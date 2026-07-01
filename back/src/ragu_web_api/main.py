from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ragu_web_api import __version__
from ragu_web_api.routers import api_router


OPENAPI_TAGS = [
    {
        "name": "System",
        "description": "Health checks and runtime feature flags.",
    },
    {
        "name": "Datasets",
        "description": "Preindexed dataset gallery contract.",
    },
    {
        "name": "Graph Explorer",
        "description": "Node-link graph, entity cards, neighborhoods, and communities.",
    },
    {
        "name": "Agent",
        "description": "Question answering over a selected graph with structured traces.",
    },
]


def create_app() -> FastAPI:
    app = FastAPI(
        title="RAGU Web API Gateway",
        version=__version__,
        summary="Typed API contract for the RAGU web demo.",
        description=(
            "Mock-first FastAPI gateway for Gallery, Graph Explorer, and Agent "
            "screens. Live indexing, job queues, GPU workers, and cloud-specific "
            "flows are intentionally not exposed."
        ),
        openapi_tags=OPENAPI_TAGS,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:9080",
            "http://127.0.0.1:9080",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api/v1")
    return app


app = create_app()

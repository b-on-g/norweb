from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from ragu_web_api import __version__
from ragu_web_api.routers import api_router


# Use the endpoint function name as the OpenAPI operationId so codegen produces
# short, stable identifiers ( `get_graph` instead of the auto-generated
# `get_graph_api_v1_datasets__dataset_id__graph_get` ).
def _short_operation_id(route: APIRoute) -> str:
    return route.name


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
        generate_unique_id_function=_short_operation_id,
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

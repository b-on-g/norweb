from fastapi import APIRouter

from ragu_web_api.routers.agent import router as agent_router
from ragu_web_api.routers.datasets import router as datasets_router
from ragu_web_api.routers.graph import router as graph_router
from ragu_web_api.routers.system import router as system_router

api_router = APIRouter()
api_router.include_router(system_router)
api_router.include_router(datasets_router)
api_router.include_router(graph_router)
api_router.include_router(agent_router)

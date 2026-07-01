# RAGU Web API

FastAPI gateway contract for the RAGU web demo. The current implementation is
mock-first: it exposes stable OpenAPI/Pydantic schemas for the frontend and uses
deterministic in-memory data instead of live indexing, Redis queues, GPU workers,
or cloud infrastructure.

## Run

```bash
cd web/back
python -m pip install -e ".[dev]"
uvicorn ragu_web_api.main:app --reload --port 8000
```

Open Swagger UI at `http://localhost:8000/docs`.

## API

All application endpoints are under `/api/v1`.

- `GET /health`
- `GET /capabilities`
- `GET /datasets`
- `GET /datasets/{dataset_id}`
- `GET /datasets/{dataset_id}/graph`
- `GET /datasets/{dataset_id}/graph/nodes/{node_id}`
- `GET /datasets/{dataset_id}/graph/nodes/{node_id}/neighbors`
- `GET /datasets/{dataset_id}/graph/communities`
- `POST /datasets/{dataset_id}/agent/messages`
- `GET /datasets/{dataset_id}/agent/suggestions`

Upload, job queue, live indexing, GPU worker, and Yandex Cloud flows are not
implemented. Frontend code should use `/api/v1/capabilities` to hide or disable
those UI actions.

## Tests

```bash
cd web/back
pytest
```

## OpenAPI spec

`openapi.json` next to this README is the source-of-truth spec — dumped from
FastAPI and committed for the frontend codegen. Regenerate after schema changes:

```bash
python -c 'from ragu_web_api.main import create_app; import json; print(json.dumps(create_app().openapi(), indent=2))' > openapi.json
```

The frontend's typed client `web/front/api/ragu.openapi.ts` is generated from
this file. Regen the client with `openapi-typescript` after the spec updates.

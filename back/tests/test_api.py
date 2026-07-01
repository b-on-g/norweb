from fastapi.testclient import TestClient

from ragu_web_api.main import app

client = TestClient(app)


def test_openapi_has_expected_tags_and_no_live_indexing_paths() -> None:
    response = client.get("/openapi.json")
    assert response.status_code == 200
    payload = response.json()
    assert {tag["name"] for tag in payload["tags"]} >= {
        "System",
        "Datasets",
        "Graph Explorer",
        "Agent",
    }
    paths = set(payload["paths"])
    assert "/api/v1/datasets" in paths
    assert "/api/v1/datasets/{dataset_id}/agent/messages" in paths
    forbidden = ("upload", "job", "jobs", "indexing", "live-index")
    assert not any(any(term in path for term in forbidden) for path in paths)


def test_capabilities_disable_upload_queue_and_gpu() -> None:
    response = client.get("/api/v1/capabilities")
    assert response.status_code == 200
    payload = response.json()
    assert payload["preindexed_datasets"] is True
    assert payload["graph_explorer"] is True
    assert payload["agent_chat"] is True
    for key in ("upload_document", "upload_index", "live_indexing", "job_queue", "gpu_worker"):
        assert payload[key] is False


def test_list_datasets_returns_builtin_gallery_contract() -> None:
    response = client.get("/api/v1/datasets?locale=en")
    assert response.status_code == 200
    payload = response.json()
    assert [item["id"] for item in payload] == ["law", "un", "papers", "medical", "wiki"]
    first = payload[0]
    assert first["stats"]["nodes"] > 0
    assert first["preview"]["kind"] == "graph"
    assert first["suggested_questions"]


def test_graph_filters_by_type_and_strength() -> None:
    response = client.get(
        "/api/v1/datasets/wiki/graph",
        params={"entity_types": ["PERSON"], "min_strength": 0.7},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["nodes"]
    assert {node["entity_type"] for node in payload["nodes"]} == {"PERSON"}
    assert all(edge["strength"] >= 0.7 for edge in payload["edges"])
    assert payload["meta"]["filters"]["entity_types"] == ["PERSON"]


def test_node_detail_and_neighbors() -> None:
    detail = client.get("/api/v1/datasets/wiki/graph/nodes/wiki-n1")
    assert detail.status_code == 200
    detail_payload = detail.json()
    assert detail_payload["node"]["id"] == "wiki-n1"
    assert detail_payload["provenance_chunks"]
    assert detail_payload["incoming_relations"] or detail_payload["outgoing_relations"]

    neighbors = client.get("/api/v1/datasets/wiki/graph/nodes/wiki-n1/neighbors?depth=1")
    assert neighbors.status_code == 200
    neighbor_payload = neighbors.json()
    assert any(node["id"] == "wiki-n1" for node in neighbor_payload["nodes"])
    assert neighbor_payload["edges"]


def test_communities_endpoint() -> None:
    response = client.get("/api/v1/datasets/wiki/graph/communities")
    assert response.status_code == 200
    payload = response.json()
    assert payload["dataset_id"] == "wiki"
    assert len(payload["communities"]) == 2
    assert payload["communities"][0]["node_ids"]


def test_agent_response_contains_trace_and_highlight() -> None:
    response = client.post(
        "/api/v1/datasets/wiki/agent/messages",
        json={
            "message": "Who wrote the Norwegian anthem and when?",
            "engine": "local",
            "top_k": 3,
            "rerank": True,
            "include_trace": True,
            "locale": "en",
        },
    )
    assert response.status_code == 200
    payload = response.json()
    message = payload["message"]
    assert message["role"] == "assistant"
    assert "Mock answer using local" in message["content"]
    trace = message["trace"]
    assert trace["engine"] == "local"
    assert trace["entities"]
    assert trace["chunks"]
    assert trace["timings"]["total_ms"] >= trace["timings"]["retrieval_ms"]
    assert trace["energy"]["watt_hours"] > 0
    assert trace["highlight"]["node_ids"]


def test_404_for_unknown_dataset_and_node() -> None:
    dataset_response = client.get("/api/v1/datasets/missing")
    assert dataset_response.status_code == 404
    assert dataset_response.json()["detail"]["code"] == "dataset_not_found"

    node_response = client.get("/api/v1/datasets/wiki/graph/nodes/missing")
    assert node_response.status_code == 404
    assert node_response.json()["detail"]["code"] == "node_not_found"

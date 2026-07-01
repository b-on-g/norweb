from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

CREATED_AT = datetime(2026, 6, 30, 12, 0, tzinfo=timezone.utc)
UPDATED_AT = datetime(2026, 7, 1, 12, 0, tzinfo=timezone.utc)

ENGINES = ["local", "global", "naive", "mix", "query_plan"]

DATASETS: list[dict[str, Any]] = [
    {
        "id": "law",
        "title": {"ru": "Russian law corpus", "en": "Russian law corpus"},
        "domain": {"ru": "Law", "en": "Law"},
        "description": {
            "ru": "Preindexed legal graph with codes, courts, obligations, and statutes.",
            "en": "Preindexed legal graph with codes, courts, obligations, and statutes.",
        },
        "language": "ru",
        "tags": ["law", "NEREL", "preindexed"],
        "stats": {"nodes": 18400, "edges": 52000, "communities": 210, "chunks": 4100, "documents": 18},
        "badges": [
            {"label": "model", "value": "meno-lite-7b"},
            {"label": "preset", "value": "demo"},
        ],
        "suggested_questions": {
            "ru": [
                "Which entities connect civil liability and court practice?",
                "What legal acts regulate contractual obligations?",
            ],
            "en": [
                "Which entities connect civil liability and court practice?",
                "What legal acts regulate contractual obligations?",
            ],
        },
        "primary_entity_types": ["LAW", "ORGANIZATION", "PERSON"],
    },
    {
        "id": "un",
        "title": {"ru": "United Nations corpus", "en": "United Nations corpus"},
        "domain": {"ru": "International relations", "en": "International relations"},
        "description": {
            "ru": "UN Charter and selected resolutions represented as a knowledge graph.",
            "en": "UN Charter and selected resolutions represented as a knowledge graph.",
        },
        "language": "en",
        "tags": ["UN", "resolutions", "preindexed"],
        "stats": {"nodes": 9100, "edges": 27000, "communities": 96, "chunks": 2300, "documents": 12},
        "badges": [
            {"label": "model", "value": "meno-lite-7b"},
            {"label": "preset", "value": "demo"},
        ],
        "suggested_questions": {
            "ru": [
                "How does the Security Council connect to UN resolutions?",
                "Which bodies are described in the UN Charter?",
            ],
            "en": [
                "How does the Security Council connect to UN resolutions?",
                "Which bodies are described in the UN Charter?",
            ],
        },
        "primary_entity_types": ["ORGANIZATION", "LAW", "COUNTRY"],
    },
    {
        "id": "papers",
        "title": {"ru": "GraphRAG papers", "en": "GraphRAG papers"},
        "domain": {"ru": "Research", "en": "Research"},
        "description": {
            "ru": "RAGU article and cited GraphRAG works with methods and metrics.",
            "en": "RAGU article and cited GraphRAG works with methods and metrics.",
        },
        "language": "en",
        "tags": ["research", "GraphRAG", "benchmarks"],
        "stats": {"nodes": 1200, "edges": 3400, "communities": 24, "chunks": 480, "documents": 9},
        "badges": [
            {"label": "model", "value": "meno-lite-7b"},
            {"label": "preset", "value": "accurate"},
        ],
        "suggested_questions": {
            "ru": [
                "How does RAGU compare with LightRAG?",
                "Which metrics are used for answer quality?",
            ],
            "en": [
                "How does RAGU compare with LightRAG?",
                "Which metrics are used for answer quality?",
            ],
        },
        "primary_entity_types": ["PRODUCT", "WORK_OF_ART", "NUMBER"],
    },
    {
        "id": "medical",
        "title": {"ru": "Medical GraphRAG-Bench", "en": "Medical GraphRAG-Bench"},
        "domain": {"ru": "Medicine", "en": "Medicine"},
        "description": {
            "ru": "Medical benchmark slice with diseases, drugs, symptoms, and evidence.",
            "en": "Medical benchmark slice with diseases, drugs, symptoms, and evidence.",
        },
        "language": "en",
        "tags": ["medical", "benchmark", "preindexed"],
        "stats": {"nodes": 6700, "edges": 19000, "communities": 71, "chunks": 1600, "documents": 15},
        "badges": [
            {"label": "model", "value": "meno-lite-7b"},
            {"label": "preset", "value": "accurate"},
        ],
        "suggested_questions": {
            "ru": [
                "Which treatment entities connect to diabetes?",
                "What evidence is attached to cardiovascular risk?",
            ],
            "en": [
                "Which treatment entities connect to diabetes?",
                "What evidence is attached to cardiovascular risk?",
            ],
        },
        "primary_entity_types": ["DISEASE", "PRODUCT", "ORGANIZATION"],
    },
    {
        "id": "wiki",
        "title": {"ru": "Wikipedia literature slice", "en": "Wikipedia literature slice"},
        "domain": {"ru": "Wikipedia", "en": "Wikipedia"},
        "description": {
            "ru": "Compact topic graph around Norwegian writers, works, events, and dates.",
            "en": "Compact topic graph around Norwegian writers, works, events, and dates.",
        },
        "language": "mixed",
        "tags": ["wikipedia", "literature", "demo"],
        "stats": {"nodes": 2400, "edges": 7100, "communities": 38, "chunks": 320, "documents": 6},
        "badges": [
            {"label": "model", "value": "meno-lite-7b"},
            {"label": "preset", "value": "demo"},
        ],
        "suggested_questions": {
            "ru": [
                "Who wrote the Norwegian anthem and when?",
                "What connects Ibsen and Bjoernson?",
            ],
            "en": [
                "Who wrote the Norwegian anthem and when?",
                "What connects Ibsen and Bjoernson?",
            ],
        },
        "primary_entity_types": ["PERSON", "WORK_OF_ART", "DATE"],
    },
]


GRAPH_SEEDS: dict[str, dict[str, Any]] = {
    "law": {
        "nodes": [
            ("law-n1", "Civil Code", "LAW", "Core legal act for civil obligations."),
            ("law-n2", "Supreme Court", "ORGANIZATION", "Court body shaping practice reviews."),
            ("law-n3", "Contract", "LAW", "Legal instrument creating civil obligations."),
            ("law-n4", "Legal entity", "ORGANIZATION", "Participant in civil legal relations."),
            ("law-n5", "Property", "PRODUCT", "Object of ownership and transactions."),
            ("law-n6", "Federal law", "LAW", "Normative act referenced by the code."),
            ("law-n7", "Court practice", "WORK_OF_ART", "Aggregated decisions and explanations."),
            ("law-n8", "Liability", "PENALTY", "Consequence of breach of obligation."),
        ],
        "communities": [
            ("law-c1", "Civil obligations", "Contracts, property, and liability rules.", ["law-n1", "law-n3", "law-n5", "law-n8"]),
            ("law-c2", "Legal institutions", "Courts, entities, and statutory sources.", ["law-n2", "law-n4", "law-n6", "law-n7"]),
        ],
        "chunks": [
            ("law-chunk-1", "Civil obligations are regulated by the Civil Code and related federal laws.", "law-doc-1"),
            ("law-chunk-2", "Court practice explains how liability applies to contractual breaches.", "law-doc-2"),
            ("law-chunk-3", "Legal entities may own property and enter contracts.", "law-doc-3"),
        ],
    },
    "un": {
        "nodes": [
            ("un-n1", "United Nations", "ORGANIZATION", "International organization founded after World War II."),
            ("un-n2", "Security Council", "ORGANIZATION", "UN body responsible for peace and security."),
            ("un-n3", "General Assembly", "ORGANIZATION", "Deliberative body of UN member states."),
            ("un-n4", "UN Charter", "LAW", "Foundational treaty of the United Nations."),
            ("un-n5", "Resolution 242", "LAW", "Security Council resolution on Middle East peace."),
            ("un-n6", "Human rights", "IDEOLOGY", "Normative area referenced across UN documents."),
            ("un-n7", "Member states", "COUNTRY", "States represented in UN bodies."),
            ("un-n8", "International Court of Justice", "ORGANIZATION", "Principal judicial organ of the UN."),
        ],
        "communities": [
            ("un-c1", "UN institutions", "Core organs and member-state representation.", ["un-n1", "un-n2", "un-n3", "un-n7", "un-n8"]),
            ("un-c2", "Legal documents", "Charter provisions and selected resolutions.", ["un-n4", "un-n5", "un-n6"]),
        ],
        "chunks": [
            ("un-chunk-1", "The UN Charter defines the principal organs of the organization.", "un-doc-1"),
            ("un-chunk-2", "The Security Council adopts resolutions related to peace and security.", "un-doc-2"),
            ("un-chunk-3", "Member states participate in the General Assembly.", "un-doc-3"),
        ],
    },
    "papers": {
        "nodes": [
            ("papers-n1", "RAGU", "PRODUCT", "GraphRAG system demonstrated in the article."),
            ("papers-n2", "GraphRAG", "PRODUCT", "Retrieval approach using a graph knowledge structure."),
            ("papers-n3", "meno-lite 7B", "PRODUCT", "Compact local model used for graph construction."),
            ("papers-n4", "LightRAG", "PRODUCT", "Baseline system compared in experiments."),
            ("papers-n5", "Answer Correctness", "NUMBER", "Evaluation metric for generated answers."),
            ("papers-n6", "Evidence Recall", "NUMBER", "Metric for retrieving supporting evidence."),
            ("papers-n7", "EMNLP 2026", "EVENT", "Target system demonstration venue."),
            ("papers-n8", "QueryPlanEngine", "PRODUCT", "Engine that decomposes complex questions."),
        ],
        "communities": [
            ("papers-c1", "Systems", "RAGU and related GraphRAG systems.", ["papers-n1", "papers-n2", "papers-n3", "papers-n4", "papers-n8"]),
            ("papers-c2", "Evaluation", "Metrics and venue context.", ["papers-n5", "papers-n6", "papers-n7"]),
        ],
        "chunks": [
            ("papers-chunk-1", "RAGU compares graph construction quality against LightRAG-style baselines.", "papers-doc-1"),
            ("papers-chunk-2", "Answer Correctness and Evidence Recall summarize answer quality.", "papers-doc-2"),
            ("papers-chunk-3", "QueryPlanEngine decomposes complex user questions into subqueries.", "papers-doc-3"),
        ],
    },
    "medical": {
        "nodes": [
            ("medical-n1", "Diabetes mellitus", "DISEASE", "Metabolic disease involving blood glucose regulation."),
            ("medical-n2", "Insulin", "PRODUCT", "Hormone therapy connected with glucose control."),
            ("medical-n3", "Glucose", "PRODUCT", "Blood sugar measurement and metabolic substrate."),
            ("medical-n4", "Metformin", "PRODUCT", "Common oral antidiabetic medicine."),
            ("medical-n5", "Cardiovascular risk", "DISEASE", "Risk cluster often evaluated in diabetes care."),
            ("medical-n6", "Clinical guideline", "WORK_OF_ART", "Document describing recommended medical practice."),
            ("medical-n7", "Patient cohort", "ORGANIZATION", "Grouped patients used for evidence extraction."),
            ("medical-n8", "Evidence Recall", "NUMBER", "Benchmark metric for retrieved evidence."),
        ],
        "communities": [
            ("medical-c1", "Diabetes treatment", "Disease, medicines, and glucose control.", ["medical-n1", "medical-n2", "medical-n3", "medical-n4"]),
            ("medical-c2", "Clinical evidence", "Guidelines, cohorts, risk, and benchmark evidence.", ["medical-n5", "medical-n6", "medical-n7", "medical-n8"]),
        ],
        "chunks": [
            ("medical-chunk-1", "Diabetes treatment may involve insulin, metformin, and glucose monitoring.", "medical-doc-1"),
            ("medical-chunk-2", "Clinical guidelines discuss cardiovascular risk for patient cohorts.", "medical-doc-2"),
            ("medical-chunk-3", "Evidence Recall measures whether relevant medical context was retrieved.", "medical-doc-3"),
        ],
    },
    "wiki": {
        "nodes": [
            ("wiki-n1", "Bjoernstjerne Bjoernson", "PERSON", "Norwegian writer associated with the national anthem."),
            ("wiki-n2", "Norwegian anthem", "WORK_OF_ART", "National anthem text connected to Bjoernson."),
            ("wiki-n3", "Henrik Ibsen", "PERSON", "Norwegian playwright and contemporary literary figure."),
            ("wiki-n4", "Nobel Prize", "AWARD", "Award received by Bjoernson in literature."),
            ("wiki-n5", "1859", "DATE", "Year associated with the anthem text."),
            ("wiki-n6", "Norway", "COUNTRY", "Country connected to the anthem and writers."),
            ("wiki-n7", "Literature", "WORK_OF_ART", "Creative field connecting authors and works."),
            ("wiki-n8", "A Doll's House", "WORK_OF_ART", "Play written by Henrik Ibsen."),
        ],
        "communities": [
            ("wiki-c1", "Norwegian literature", "Writers, works, awards, and literary context.", ["wiki-n1", "wiki-n3", "wiki-n4", "wiki-n7", "wiki-n8"]),
            ("wiki-c2", "National symbols", "Anthem, country, and date context.", ["wiki-n2", "wiki-n5", "wiki-n6"]),
        ],
        "chunks": [
            ("wiki-chunk-1", "Bjoernstjerne Bjoernson wrote the text of the Norwegian anthem in 1859.", "wiki-doc-1"),
            ("wiki-chunk-2", "Henrik Ibsen and Bjoernson are central figures in Norwegian literature.", "wiki-doc-2"),
            ("wiki-chunk-3", "A Doll's House is a work by Henrik Ibsen.", "wiki-doc-3"),
        ],
    },
}

EDGE_PATTERN = [
    ("e1", 0, 1, "REFERS_TO", 0.82),
    ("e2", 0, 2, "PART_OF", 0.76),
    ("e3", 1, 3, "ORGANIZES", 0.71),
    ("e4", 2, 4, "LOCATED_IN", 0.63),
    ("e5", 3, 5, "MEMBER_OF", 0.69),
    ("e6", 4, 6, "MENTIONS", 0.58),
    ("e7", 5, 7, "CITES", 0.74),
    ("e8", 6, 0, "ASSOCIATED_WITH", 0.67),
    ("e9", 7, 2, "DESCRIBES", 0.61),
    ("e10", 1, 6, "REFERS_TO", 0.88),
]

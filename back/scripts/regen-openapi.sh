#!/usr/bin/env bash
# Regenerates the API contract for the frontend.
#   1. Dumps openapi.json from the running FastAPI app (no server needed —
#      reflects create_app() directly).
#   2. Runs regen-openapi-client.mjs to rebuild ragu.openapi.ts.
#
# Exits 0 on success, 0 on skip (missing deps), non-zero only on genuine
# regen failure. Callers (e.g. git hook) can decide whether to enforce.
set -eu
HERE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACK="$( cd "$HERE/.." && pwd )"
REPO="$( cd "$BACK/../../.." && pwd )"

PYTHON="${PYTHON:-}"
if [ -z "$PYTHON" ]; then
	for candidate in "$BACK/.venv/bin/python" /tmp/ragu_venv/bin/python python3 python; do
		if command -v "$candidate" >/dev/null 2>&1; then PYTHON="$candidate"; break; fi
	done
fi

if [ -z "$PYTHON" ]; then
	echo "[regen-openapi] no python found — skipping" >&2
	exit 0
fi

if ! "$PYTHON" -c 'import ragu_web_api' >/dev/null 2>&1; then
	echo "[regen-openapi] ragu_web_api not importable — skipping (install: pip install -e '$BACK[dev]')" >&2
	exit 0
fi

"$PYTHON" -c 'from ragu_web_api.main import create_app; import json; print(json.dumps(create_app().openapi(), indent=2))' > "$BACK/openapi.json"

cd "$REPO"
node "$HERE/regen-openapi-client.mjs"

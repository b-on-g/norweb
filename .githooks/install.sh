#!/bin/sh
# Активировать кастомные git hooks из .githooks/
# Запустить один раз после клона: ./.githooks/install.sh
set -e

REPO="$(git rev-parse --show-toplevel)"
cd "$REPO"

chmod +x .githooks/pre-commit .githooks/pre-push
git config core.hooksPath .githooks

echo "✓ hooks активированы (.githooks/pre-commit, .githooks/pre-push)"
echo "  отключить: git config --unset core.hooksPath"

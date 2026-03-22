#!/usr/bin/env bash
set -euo pipefail

compose_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/infrastructure/test" && pwd)"

cleanup() {
  (cd "$compose_dir" && docker compose down -v)
}

trap cleanup EXIT

(cd "$compose_dir" && docker compose up -d db)

cd "$(dirname "${BASH_SOURCE[0]}")/api"
DB_PORT=5433 DB_NAME=bookearth_test npm test

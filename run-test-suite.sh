#!/usr/bin/env bash
set -euo pipefail

compose_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/infrastructure/test" && pwd)"

cleanup() {
  (cd "$compose_dir" && docker compose down -v)
}

trap cleanup EXIT

(cd "$compose_dir" && docker compose up -d db)

for attempt in {1..10}; do
  if docker exec test-db-1 pg_isready -U bookearth -d bookearth_test >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

cd "$(dirname "${BASH_SOURCE[0]}")/backend"
BACKEND_ENV=test go test -v ./...

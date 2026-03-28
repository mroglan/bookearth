#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
compose_dir="$root_dir/infrastructure/test"

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

cd "$root_dir/backend"
BACKEND_ENV=test go test -v ./...

cd "$root_dir/frontend"
npm test

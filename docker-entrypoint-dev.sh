#!/usr/bin/env sh
set -e
cd /app

LOCK_SUM=$(sha256sum package-lock.json | awk '{print $1}')
MARKER="node_modules/.docker-lock-sum"

run_ci() {
  echo "docker-entrypoint-dev: syncing node_modules from package-lock.json (npm ci)..."
  npm ci
  mkdir -p node_modules
  echo "$LOCK_SUM" > "$MARKER"
}

if [ "${FORCE_NPM_CI:-}" = "1" ] || [ "${FORCE_NPM_CI:-}" = "true" ]; then
  echo "docker-entrypoint-dev: FORCE_NPM_CI set."
  run_ci
elif [ ! -f "$MARKER" ] || [ "$(cat "$MARKER" 2>/dev/null)" != "$LOCK_SUM" ] || [ ! -d node_modules/@auth0/nextjs-auth0 ]; then
  run_ci
fi

exec npm run dev:local

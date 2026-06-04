#!/usr/bin/env bash
# Upload deploy secrets only to Infisical (public vars are in config/deploy.yml).
#
# Usage:
#   KEYCLOAK_CLIENT_SECRET='<from Keycloak>' ./scripts/infisical-bootstrap-deploy-dev.sh
#   OPENAI_API_KEY=sk-... ./scripts/infisical-bootstrap-deploy-dev.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

: "${KEYCLOAK_CLIENT_SECRET:?Set KEYCLOAK_CLIENT_SECRET (Keycloak avcd-web client secret)}"

OUT="$(mktemp)"
trap 'rm -f "$OUT"' EXIT

AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -base64 32)}"

cat >"$OUT" <<EOF
AUTH_SECRET=${AUTH_SECRET}
KEYCLOAK_CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET}
EOF

if [[ -n "${OPENAI_API_KEY:-}" ]]; then
  printf 'OPENAI_API_KEY=%s\n' "$OPENAI_API_KEY" >>"$OUT"
fi

chmod 600 "$OUT"
INFISICAL_PUSH_FILE="$OUT" make upload-secret
make validate-secrets

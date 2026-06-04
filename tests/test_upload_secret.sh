#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MAKEFILE="$ROOT/Makefile"
SCRIPT="$ROOT/scripts/infisical-upload-env.sh"
ALLOWLIST="$ROOT/config/infisical-secret-keys.list"
PROJECT_ID="4c32b3c4-fb30-44a2-81bb-2ae4211404a3"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

pass() {
  echo "PASS: $1"
}

[[ -f "$MAKEFILE" ]] || fail "Makefile missing"
[[ -x "$SCRIPT" ]] || fail "scripts/infisical-upload-env.sh must be executable"
[[ -f "$ALLOWLIST" ]] || fail "config/infisical-secret-keys.list missing"
grep -q '^upload-secret:' "$MAKEFILE" || fail "upload-secret target missing"
grep -q 'infisical-upload-env.sh' "$MAKEFILE" || fail "upload script not wired in Makefile"
grep -q "$PROJECT_ID" "$MAKEFILE" || fail "avcd-web project id default missing"
grep -q 'INFISICAL_PUSH_FILE ?= .env.local' "$MAKEFILE" || fail "default push file must be .env.local"
grep -q 'is_allowlisted_secret' "$SCRIPT" || fail "secret allowlist filter not implemented"
grep -q 'infisical-secret-keys.list' "$SCRIPT" || fail "allowlist path not referenced"
grep -q 'secrets set --file' "$SCRIPT" || fail "infisical secrets set --file not used"
grep -q 'env:' "$ROOT/config/deploy.yml" || fail "deploy.yml env section missing"
grep -q 'clear:' "$ROOT/config/deploy.yml" || fail "deploy.yml env.clear missing"
grep -q 'NEXT_PUBLIC_APP_NAME' "$ROOT/config/deploy.yml" || fail "public vars should be in deploy.yml clear"
pass "Infisical upload uses allowlist; public vars in Kamal deploy.yml"

#!/usr/bin/env bash
# Render .kamal/secrets on the deploy host (can reach secrets.dev.avcd.ai) and copy back.
# GitHub-hosted runners cannot reach the dev Infisical host; OIDC + export run over SSH.
set -euo pipefail

: "${DEPLOY_HOST:?}"
: "${DEPLOY_USER:?}"
: "${OIDC_JWT:?}"
: "${INFISICAL_API_URL:?}"
: "${INFISICAL_PROJECT_ID:?}"
: "${INFISICAL_INFRA_PROJECT_ID:?}"
: "${INFISICAL_OIDC_IDENTITY_ID:?}"
: "${INFISICAL_ENV_SLUG:=dev}"
: "${PUBLIC_HOST:?}"
: "${REPO_ROOT:?}"

INFISICAL_DOMAIN="${INFISICAL_API_URL%/api}"
REMOTE_DIR="/tmp/avcd-web-kamal-secrets-$$"
SSH_TARGET="${DEPLOY_USER}@${DEPLOY_HOST}"

install -d -m 700 .kamal
tar -C "$REPO_ROOT" -czf /tmp/kamal-secrets-bundle.tgz .kamal/secrets.ci.template
scp -o BatchMode=yes /tmp/kamal-secrets-bundle.tgz "${SSH_TARGET}:/tmp/kamal-secrets-bundle.tgz"

OIDC_B64=$(printf '%s' "$OIDC_JWT" | base64 -w0 2>/dev/null || printf '%s' "$OIDC_JWT" | base64)

ssh -o BatchMode=yes "${SSH_TARGET}" bash -s <<REMOTE
set -euo pipefail
REMOTE_DIR="${REMOTE_DIR}"
mkdir -p "\$REMOTE_DIR/.kamal"
tar -xzf /tmp/kamal-secrets-bundle.tgz -C "\$REMOTE_DIR"
rm -f /tmp/kamal-secrets-bundle.tgz

if ! command -v infisical >/dev/null 2>&1; then
  curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash
  apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y infisical
fi

OIDC_JWT="\$(printf '%s' '${OIDC_B64}' | base64 -d)"
export INFISICAL_TOKEN
INFISICAL_TOKEN=\$(infisical login --method=oidc-auth \
  --machine-identity-id="${INFISICAL_OIDC_IDENTITY_ID}" \
  --oidc-jwt="\$OIDC_JWT" \
  --domain="${INFISICAL_DOMAIN}" --silent --plain)

export INFISICAL_API_URL="${INFISICAL_API_URL}"
export INFISICAL_PROJECT_ID="${INFISICAL_PROJECT_ID}"
export INFISICAL_INFRA_PROJECT_ID="${INFISICAL_INFRA_PROJECT_ID}"
export INFISICAL_ENV="${INFISICAL_ENV_SLUG}"
export INFISICAL_SECRETS_PATH="/"
export INFISICAL_BOOTSTRAP_PATH="/infra"
export PUBLIC_HOST="${PUBLIC_HOST}"

cd "\$REMOTE_DIR"
bash .kamal/secrets.ci.template > .kamal/secrets
chmod 600 .kamal/secrets
test -s .kamal/secrets
REMOTE

scp -o BatchMode=yes "${SSH_TARGET}:${REMOTE_DIR}/.kamal/secrets" .kamal/secrets
chmod 600 .kamal/secrets
cp .kamal/secrets .kamal/secrets-common
chmod 600 .kamal/secrets-common
cp .kamal/secrets .kamal/secrets.development
chmod 600 .kamal/secrets.development

ssh -o BatchMode=yes "${SSH_TARGET}" "rm -rf ${REMOTE_DIR} /tmp/kamal-secrets-bundle.tgz"

echo "✓ Rendered .kamal/secrets via ${DEPLOY_USER}@${DEPLOY_HOST}"

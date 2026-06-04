# Web — local dev and Infisical secrets (project avcd-web)
.DEFAULT_GOAL := help

INFISICAL_API_URL ?= https://secrets.avcd.ai/api
# avcd-web — Infisical → Settings → General (or: make infisical-info)
INFISICAL_PROJECT_ID ?= 4c32b3c4-fb30-44a2-81bb-2ae4211404a3
INFISICAL_SECRET_PATH ?= /
INFISICAL_ENV ?= dev
INFISICAL_PUSH_FILE ?= .env
INFISICAL_PULL_FILE ?= .env.infisical
INFISICAL_CREDENTIALS_FILE ?= ../infisical/.env
INFISICAL_SKIP_KEYS ?= NODE_ENV,WATCHPACK_POLLING
# Keys expected for DO deploy (pulumi web-secrets + deploy-digitalocean-*.yml)
INFISICAL_REQUIRED_SECRETS := AUTH_SECRET KEYCLOAK_URL KEYCLOAK_REALM KEYCLOAK_CLIENT_ID KEYCLOAK_CLIENT_SECRET KEYCLOAK_AUDIENCE KEYCLOAK_OIDC_SCOPE AUTH_URL APP_BASE_URL PUBLIC_HOST NEXT_PUBLIC_GRAPHQL_ENDPOINT NEXT_PUBLIC_MCP_SERVER_URL CHAT_MODEL

.PHONY: help check upload-secret upload-secrets pull-secrets infisical-check infisical-info validate-secrets

help:
	@echo "Usage (from web/):"
	@echo ""
	@echo "CI parity:"
	@echo "  make check              lint + unit tests (CI mode) + production build"
	@echo ""
	@echo "Infisical (project avcd-web on secrets.avcd.ai):"
	@echo "  make upload-secret      Upload keys from .env → Infisical ($(INFISICAL_ENV))"
	@echo "  make pull-secrets       Export Infisical secrets → $(INFISICAL_PULL_FILE)"
	@echo "  make validate-secrets   Check deploy-required keys exist in Infisical"
	@echo "  make infisical-check    Verify Infisical CLI + credentials"
	@echo "  make infisical-info     Show project URL and secret counts"
	@echo ""
	@echo "Variables (override as needed):"
	@echo "  INFISICAL_API_URL=$(INFISICAL_API_URL)"
	@echo "  INFISICAL_PROJECT_ID=$(INFISICAL_PROJECT_ID)"
	@echo "  INFISICAL_ENV=$(INFISICAL_ENV)"
	@echo "  INFISICAL_PUSH_FILE=$(INFISICAL_PUSH_FILE)"
	@echo "  INFISICAL_CREDENTIALS_FILE=$(INFISICAL_CREDENTIALS_FILE)"
	@echo ""
	@echo "Example:"
	@echo "  make upload-secret INFISICAL_ENV=dev"
	@echo "  make upload-secret INFISICAL_PUSH_FILE=.env.dev INFISICAL_ENV=prod"

check:
	npm run lint
	CI=true E2E_SKIP_DEPLOY=1 npm test
	NEXT_TELEMETRY_DISABLED=1 \
	  AUTH_SECRET=build-time-placeholder-secret-min-32-chars-long-for-auth0-x \
	  APP_BASE_URL=http://localhost:3000 \
	  KEYCLOAK_URL=https://placeholder.keycloak.example \
	  KEYCLOAK_REALM=avcd \
	  KEYCLOAK_CLIENT_ID=build-placeholder \
	  KEYCLOAK_CLIENT_SECRET=build-placeholder \
	  KEYCLOAK_AUDIENCE=https://placeholder.example/api \
	  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql \
	  NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV=true \
	  npm run build

infisical-check:
	@command -v infisical >/dev/null 2>&1 || (echo "❌ Infisical CLI not installed. Run: brew install infisical/get-cli/infisical" && exit 1)
	@test -f "$(INFISICAL_CREDENTIALS_FILE)" || test -n "$$INFISICAL_CLIENT_ID" || (echo "❌ Missing INFISICAL_CLIENT_ID/SECRET or $(INFISICAL_CREDENTIALS_FILE)" && exit 1)
	@echo "✓ Infisical CLI ready"

upload-secret: infisical-check
	@chmod +x scripts/infisical-upload-env.sh
	@INFISICAL_API_URL="$(INFISICAL_API_URL)" \
	  INFISICAL_PROJECT_ID="$(INFISICAL_PROJECT_ID)" \
	  INFISICAL_SECRET_PATH="$(INFISICAL_SECRET_PATH)" \
	  INFISICAL_ENV="$(INFISICAL_ENV)" \
	  INFISICAL_PUSH_FILE="$(INFISICAL_PUSH_FILE)" \
	  INFISICAL_CREDENTIALS_FILE="$(INFISICAL_CREDENTIALS_FILE)" \
	  INFISICAL_SKIP_KEYS="$(INFISICAL_SKIP_KEYS)" \
	  ./scripts/infisical-upload-env.sh

upload-secrets: upload-secret

pull-secrets: infisical-check
	@set -a; [ -f "$(INFISICAL_CREDENTIALS_FILE)" ] && . "$(INFISICAL_CREDENTIALS_FILE)"; set +a; \
	export INFISICAL_API_URL="$(INFISICAL_API_URL)"; \
	INFISICAL_TOKEN=$$(infisical login --method=universal-auth \
	  --client-id="$$INFISICAL_CLIENT_ID" --client-secret="$$INFISICAL_CLIENT_SECRET" \
	  --domain="$${INFISICAL_API_URL%/api}" --silent --plain); \
	infisical export --env="$(INFISICAL_ENV)" --path="$(INFISICAL_SECRET_PATH)" \
	  --projectId="$(INFISICAL_PROJECT_ID)" --token="$$INFISICAL_TOKEN" \
	  --format=dotenv --domain="$${INFISICAL_API_URL%/api}" --silent \
	  > "$(INFISICAL_PULL_FILE)"; \
	test -s "$(INFISICAL_PULL_FILE)" || (echo "❌ Infisical export empty" && exit 1); \
	echo "✓ Exported → $(INFISICAL_PULL_FILE)"

infisical-info: infisical-check
	@set -a; [ -f "$(INFISICAL_CREDENTIALS_FILE)" ] && . "$(INFISICAL_CREDENTIALS_FILE)"; set +a; \
	export INFISICAL_API_URL="$(INFISICAL_API_URL)"; \
	INFISICAL_TOKEN=$$(infisical login --method=universal-auth \
	  --client-id="$$INFISICAL_CLIENT_ID" --client-secret="$$INFISICAL_CLIENT_SECRET" \
	  --domain="$${INFISICAL_API_URL%/api}" --silent --plain); \
	echo "Project avcd-web ID: $(INFISICAL_PROJECT_ID)"; \
	echo "  $(INFISICAL_API_URL%/api)/projects/secret-management/$(INFISICAL_PROJECT_ID)/secrets/$(INFISICAL_ENV)"; \
	INFISICAL_ENCODED_PATH=$$(python3 -c "from urllib.parse import quote; print(quote('$(INFISICAL_SECRET_PATH)', safe=''))"); \
	for env in dev prod; do \
	  code=$$(curl -sS -o /tmp/web-infisical-count.json -w "%{http_code}" -H "Authorization: Bearer $$INFISICAL_TOKEN" \
	    "$(INFISICAL_API_URL)/v3/secrets/raw?workspaceId=$(INFISICAL_PROJECT_ID)&environment=$$env&secretPath=$$INFISICAL_ENCODED_PATH"); \
	  if [ "$$code" = "200" ]; then \
	    n=$$(python3 -c "import json; print(len(json.load(open('/tmp/web-infisical-count.json')).get('secrets',[])))"); \
	    echo "  $$env $(INFISICAL_SECRET_PATH): $$n secret(s)"; \
	  else echo "  $$env: HTTP $$code (check project access)"; fi; \
	done; \
	rm -f /tmp/web-infisical-count.json

validate-secrets: infisical-check
	@echo "Checking required secrets in $(INFISICAL_SECRET_PATH) ($(INFISICAL_ENV))..."
	@set -a; [ -f "$(INFISICAL_CREDENTIALS_FILE)" ] && . "$(INFISICAL_CREDENTIALS_FILE)"; set +a; \
	export INFISICAL_API_URL="$(INFISICAL_API_URL)"; \
	INFISICAL_TOKEN=$$(infisical login --method=universal-auth \
	  --client-id="$$INFISICAL_CLIENT_ID" --client-secret="$$INFISICAL_CLIENT_SECRET" \
	  --domain="$${INFISICAL_API_URL%/api}" --silent --plain); \
	missing=0; \
	for s in $(INFISICAL_REQUIRED_SECRETS); do \
	  if infisical secrets get "$$s" --env="$(INFISICAL_ENV)" --path="$(INFISICAL_SECRET_PATH)" \
	    --projectId="$(INFISICAL_PROJECT_ID)" --token="$$INFISICAL_TOKEN" \
	    --domain="$${INFISICAL_API_URL%/api}" --silent >/dev/null 2>&1; then \
	    echo "  ✓ $$s"; \
	  else echo "  ✗ $$s (missing)"; missing=1; fi; \
	done; \
	test $$missing -eq 0

# Production deployment (manual fallback)

**Primary path:** GitHub Actions deploys with **Kamal** + **Infisical OIDC**.

| Environment | Trigger | Workflow |
|-------------|---------|----------|
| Development | Push to `main` | `.github/workflows/deploy-digitalocean-dev.yml` |
| Production | Tag `vX.Y.Z-release` | `.github/workflows/deploy-digitalocean-prod.yml` |

```bash
# Production release (from repo root)
git tag v1.0.0-release
git push origin v1.0.0-release
```

Secrets live in Infisical project **avcd-web** (`make upload-secret`, `make validate-secrets`). GitHub Environment variables are provisioned via **pulumi-infra** `github` stack.

## Manual Compose fallback

Use this only for emergency debugging on a host where Kamal is not used.

### Prerequisites

1. Traefik network: `docker network create avcd_edge`
2. Runtime env in `.env.infisical` (from `make pull-secrets INFISICAL_ENV=prod`)

### Required environment variables

- `PUBLIC_HOST` — public hostname (e.g. `avcd.ai`)
- `AUTH_SECRET` — Auth.js session secret (32+ chars)
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_AUDIENCE`
- `APP_BASE_URL`, `AUTH_URL` — canonical HTTPS origin

### Deploy

From this directory:

```bash
docker compose up -d --build
docker compose logs -f web
curl -fsS "https://${PUBLIC_HOST}/health"
```

### Rollback

Redeploy a previous release tag via GitHub Actions, or on the host:

```bash
docker compose down
# restore previous image/tag manually
```

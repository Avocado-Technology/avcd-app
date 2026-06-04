# Deploy web (DigitalOcean / Traefik / Kamal)

The Next.js app runs in Docker with **`output: "standalone"`** (see [`Dockerfile`](../Dockerfile)) on the shared network **`avcd_edge`**. **Traefik** terminates TLS and routes by host. CI uses the org composite:

```yaml
uses: Avocado-Technology/avcd-actions/kamal-deploy@v5.5
```

Workflows:

- [`.github/workflows/deploy-digitalocean-dev.yml`](../.github/workflows/deploy-digitalocean-dev.yml) — `environment: development`, push to `main`
- [`.github/workflows/release.yml`](../.github/workflows/release.yml) — [semantic-release](https://github.com/semantic-release/semantic-release) on `main` → `CHANGELOG.md`, GitHub Release, tag `vX.Y.Z-release`
- [`.github/workflows/deploy-digitalocean-prod.yml`](../.github/workflows/deploy-digitalocean-prod.yml) — tag `*-release` (e.g. `v1.2.3-release` → Kamal `--version=1.2.3`)
- [`.github/workflows/pr-checks.yml`](../.github/workflows/pr-checks.yml) — lint, test, build, [Conventional Commits](https://www.conventionalcommits.org/) validation on PRs

Kamal config: [`config/deploy.yml`](../config/deploy.yml), destinations [`config/deploy.development.yml`](../config/deploy.development.yml) / [`config/deploy.production.yml`](../config/deploy.production.yml). Secrets template: [`.kamal/secrets.ci.template`](../.kamal/secrets.ci.template).

## GitHub variables and secrets

Configure **Settings → Environments** → `development` / `production` (from **pulumi-infra** `github` stack).

| Name | Type | Purpose |
|------|------|---------|
| `DO_DEPLOY_HOST` | Variable or secret | SSH host (also Traefik `Host()` after CI render) |
| `DO_DEPLOY_USER` | Variable or secret | SSH user |
| `DO_DEPLOY_SSH_KEY` | **Secret** | Private SSH key |
| `DO_PUBLIC_HOST` or `PUBLIC_HOST` | Variable | Public hostname for health verify and Infisical URL injection |
| `DO_WEB_HEALTH_URL` | Variable | Full HTTPS health URL (e.g. `https://dev.avcd.ai/health`) |
| `DOCR_REGISTRY_URL` | Variable | DigitalOcean container registry URL |
| `INFISICAL_PROJECT_ID` | Variable | Infisical **avcd-web** project ID |
| `INFISICAL_OIDC_IDENTITY_ID` | Variable | Machine identity for GitHub OIDC |
| `INFISICAL_API_URL` | Variable | `https://secrets.dev.avcd.ai/api` (dev instance; CI reaches it via SSH on deploy host) |
| `INFISICAL_OIDC_AUDIENCE` | Variable | Default `https://github.com/Avocado-Technology` |
| `INFISICAL_INFRA_PROJECT_ID` | Variable | **avcd-infra** project for `/ci-bootstrap` (DOCR creds) |
| `KAMAL_VERSION` | Variable | Optional Kamal gem pin (default `2.11.0` in workflow) |

App runtime secrets are **not** stored in GitHub; they are exported from Infisical at deploy time via OIDC.

Health endpoint: **`/health`** returns JSON with `"status":"ok"` for CI verify.

### Private **avcd-actions**

In **avcd-actions**: **Settings → Actions → General → Access** — allow **avcd-web**. After changing `kamal-deploy`, release tag **v5.5** via **Actions → Release avcd-actions**.

## Deploy order on a new host

1. **Traefik** — creates **`avcd_edge`**
2. **API** — joins `avcd_edge`
3. **Keycloak** — `https://auth.avcd.ai`
4. **pulumi-infra** — `keycloak-config` + `web-secrets`, then `github` stack
5. **Web** — Kamal deploy workflows

## Operator commands

```bash
# Dev (automatic on merge to main)
git push origin main

# Prod (automatic: push to main → semantic-release → vX.Y.Z-release → prod deploy)
# Use Conventional Commits: feat:, fix:, BREAKING CHANGE:

# Prod (manual tag, if needed)
git tag v1.2.3-release
git push origin v1.2.3-release

# Rollback / first-time setup (manual workflow_dispatch)
gh workflow run deploy-digitalocean-prod.yml -f kamal_command=rollback
gh workflow run deploy-digitalocean-prod.yml -f kamal_command=setup -f version=1.2.3
```

## Manual Compose fallback

See [`deploy/production/README.md`](../deploy/production/README.md) for legacy `docker compose` on the droplet.

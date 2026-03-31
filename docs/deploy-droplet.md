# Deploy web (DigitalOcean / Traefik)

The Next.js app runs in Docker with **`output: "standalone"`** (see [`Dockerfile`](../Dockerfile)) and joins the shared Docker network **`avcd_edge`** so **Traefik** can terminate TLS and route by host. CI uses the org composite:

```yaml
uses: Avocado-Technology/avcd-actions/droplet-compose-deploy@v1
```

([`avcd-actions`](https://github.com/Avocado-Technology/avcd-actions) — tag `v1`.)

Workflows:

- [`.github/workflows/deploy-digitalocean-dev.yml`](../.github/workflows/deploy-digitalocean-dev.yml) — `environment: development`
- [`.github/workflows/deploy-digitalocean-prod.yml`](../.github/workflows/deploy-digitalocean-prod.yml) — tag `*-release` or manual

## GitHub variables and secrets

Configure **Settings → Environments** → `development` / `production` (recommended), or **Settings → Secrets and variables → Actions** at the repo level.

Use a **different** `DO_DEPLOY_PATH` on the droplet than Traefik and the API (each stack rsyncs with `--delete` to its own directory).

| Name | Type | Purpose |
|------|------|---------|
| `DO_DEPLOY_HOST` | Variable or secret | SSH host |
| `DO_DEPLOY_USER` | Variable or secret | SSH user |
| `DO_DEPLOY_PATH` | Variable or secret | Absolute deploy path on the server (e.g. `/home/deploy/avcd-web`) |
| `DO_WEB_HEALTH_URL` | Variable | Full HTTPS URL for post-deploy verify, e.g. `https://dev.example.com/health` |
| `DO_DEPLOY_SSH_KEY` | **Secret** | Private SSH key (never commit) |

The health endpoint is served at **`/health`** (see [`app/health/route.ts`](../app/health/route.ts)) and returns JSON including `"status":"ok"` for CI.

### Private **avcd-actions** (“Cannot access repositories”)

In **avcd-actions**: **Settings → Actions → General → Access** — add **avcd-web** (or allow the whole org). Otherwise workflows fail before any deploy step runs.

Alternatively make **avcd-actions** **public** if it only contains the composite.

## Deploy order on a new host

1. **Traefik** — creates **`avcd_edge`** (or run `docker network create avcd_edge` once before anything else).
2. **API** — joins `avcd_edge`; `/api` routes work.
3. **Web** (this repo) — joins `avcd_edge`; host rule uses `PUBLIC_HOST` (see [`docker-compose.yml`](../docker-compose.yml), priority **50**, below API path rules).

## `.env` on the server

Rsync excludes `.env`. After the first deploy, create `.env` under `DO_DEPLOY_PATH` (same directory as `docker-compose.yml`). Copy from [`.env.example`](../.env.example).

| Variable | Notes |
|----------|--------|
| `PUBLIC_HOST` | Hostname Traefik matches (no `https://`), e.g. `app.example.com`. Required for Traefik labels. |
| `AUTH_URL` | **Public** origin: `https://<PUBLIC_HOST>`. Do **not** use `http://web:3000` or OAuth will fail. |
| `AUTH_SECRET` | Strong secret (`openssl rand -base64 32`). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth Web client. |
| `AVCD_API_URL` | For server actions inside Docker on `avcd_edge`, use **`http://api:8000`** (same pattern as [`.env.example`](../.env.example)). |

Optional: `NEXT_PUBLIC_AVCD_API_URL` if you need a public API base in the browser (e.g. `https://<same-host>/api`).

## Google Cloud Console

For production (and dev) hostnames:

- **Authorized JavaScript origins**: `https://<PUBLIC_HOST>`
- **Authorized redirect URIs**: `https://<PUBLIC_HOST>/api/auth/callback/google` (exact match)

## Same host as Traefik

The workflow passes `clear_published_ports: "none"` so Traefik keeps ports 80/443. Runtime TLS and `PUBLIC_HOST` come from the server `.env` and Traefik, not from CI (`pass_compose_tls_env: "false"`), matching **avcd-api**.

Set **`DO_WEB_HEALTH_URL`** to `https://<PUBLIC_HOST>/health` so CI can verify the site after deploy.

## Sizing

Running Traefik, API (Mongo/Redis), and Next.js on **one** droplet needs enough **RAM and CPU** for builds at deploy time and steady-state traffic. Prefer a plan that comfortably fits all stacks or split Traefik/API and web later.

## Monorepo note

If the Git checkout root is a monorepo, set `compose_subdirectory` in the workflow to the folder that contains this repo’s `docker-compose.yml` (not `"."` at monorepo root unless compose lives there).

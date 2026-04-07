# Deploy web (DigitalOcean / Traefik)

The Next.js app runs in Docker with **`output: "standalone"`** (see [`Dockerfile`](../Dockerfile)) and joins the shared Docker network **`avcd_edge`** so **Traefik** can terminate TLS and route by host. CI uses the org composite:

```yaml
uses: ./.github/actions/droplet-compose-deploy
```

The composite is **vendored** under [`.github/actions/droplet-compose-deploy`](../.github/actions/droplet-compose-deploy) so deploys do not depend on the org repo’s `avcd-actions@v1` tag staying in sync. **Traefik** and **API** stacks can keep using `Avocado-Technology/avcd-actions/droplet-compose-deploy@v1` or vendor the same folder.

**`avcd-app` (or any fork):** copy `.github/actions/droplet-compose-deploy/` and the `uses: ./.github/actions/droplet-compose-deploy` workflow lines from this repo so behavior matches.

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
| `DO_PUBLIC_HOST` or `PUBLIC_HOST` | Variable or secret | Hostname for Traefik (optional if **`DO_WEB_HEALTH_URL`** is set). The workflow “Resolve Traefik public hostname” step fills `public_host`; the **vendored composite** also derives the hostname from **`verify_url`** (`DO_WEB_HEALTH_URL`) when `public_host` is empty so `.compose.ci.env` always gets the right `PUBLIC_HOST`. |
| `DO_WEB_HEALTH_URL` | Variable | Full HTTPS URL for post-deploy verify, e.g. `https://dev.example.com/health` (also used to infer hostname for Compose if needed). |
| `DO_DEPLOY_SSH_KEY` | **Secret** | Private SSH key (never commit) |

### Web app secrets (GitHub-managed `.env` on the droplet)

If **`WEB_AUTH_SECRET`** is set, the vendored composite **writes** `DO_DEPLOY_PATH`/`docker-compose.yml` directory **`.env`** on each deploy (rsync never ships `.env`). Omit **`WEB_AUTH_SECRET`** only if you maintain `.env` on the server yourself.

| Name | Type | Purpose |
|------|------|--------|
| `WEB_AUTH_SECRET` | **Secret** | Auth.js `AUTH_SECRET` (e.g. `openssl rand -base64 32`). |
| `WEB_GOOGLE_CLIENT_ID` | **Secret** | Google OAuth web client ID (`GOOGLE_CLIENT_ID`). |
| `WEB_GOOGLE_CLIENT_SECRET` | **Secret** | Google OAuth client secret (`GOOGLE_CLIENT_SECRET`). |
| `WEB_AVCD_AUTH_URL` | Variable (optional) | Issuer base for `POST …/google/token`. If unset, CI-written `.env` still sets **`AVCD_AUTH_URL=http://auth:8000`** (override for Traefik, e.g. `https://your-host/auth`). |
| `WEB_AUTH_URL` | Variable (optional) | Public site origin for NextAuth (`AUTH_URL`). If unset, CI sets `https://<PUBLIC_HOST>` (no trailing slash), using the hostname from `public_host` / `DO_WEB_HEALTH_URL`. |

Values must be **single-line** (no raw newlines). **`NEXT_PUBLIC_AVCD_API_URL`** is not written by deploy: it is **build-time** in Next.js unless you add Docker build args (see [`Dockerfile`](../Dockerfile)); do not expect runtime `.env` alone to change the MCP installer hint on the home page.

The health endpoint is served at **`/health`** (see [`app/health/route.ts`](../app/health/route.ts)) and returns JSON including `"status":"ok"` for CI.

### Private **avcd-actions** (“Cannot access repositories”)

In **avcd-actions**: **Settings → Actions → General → Access** — add **avcd-web** (or allow the whole org). Otherwise workflows fail before any deploy step runs.

Alternatively make **avcd-actions** **public** if it only contains the composite.

## Deploy order on a new host

1. **Traefik** — creates **`avcd_edge`** (or run `docker network create avcd_edge` once before anything else).
2. **API** — joins `avcd_edge`; `/api` routes work.
3. **Web** (this repo) — joins `avcd_edge`; host rule uses `PUBLIC_HOST` (see [`docker-compose.yml`](../docker-compose.yml), priority **50**, below API path rules).

## `.env` on the server

Rsync excludes `.env`. **Recommended:** set **`WEB_AUTH_SECRET`** (+ Google secrets) in GitHub so CI writes `.env` on every deploy (see table above). **`PUBLIC_HOST`** for Traefik still comes from CI (`.compose.ci.env`), not from that file.

**Manual fallback:** if you do **not** use GitHub-managed secrets, create `.env` under `DO_DEPLOY_PATH` (next to `docker-compose.yml`). Copy from [`.env.example`](../.env.example).

| Variable | Notes |
|----------|--------|
| `PUBLIC_HOST` | From CI `.compose.ci.env` when using workflows; optional in manual `.env` if you export it another way. |
| `AUTH_URL` | **Public** origin: `https://<PUBLIC_HOST>`. Do **not** use `http://web:3000` or OAuth will fail. |
| `AUTH_SECRET` | Strong secret (`openssl rand -base64 32`). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth Web client. |
| `AVCD_AUTH_URL` | On `avcd_edge`, typically **`http://auth:8000`** (compose default if omitted). |

Optional: `NEXT_PUBLIC_AVCD_API_URL` requires a **build** change to take effect in the browser (see note above).

## Google Cloud Console

For production (and dev) hostnames:

- **Authorized JavaScript origins**: `https://<PUBLIC_HOST>`
- **Authorized redirect URIs**: `https://<PUBLIC_HOST>/api/auth/callback/google` (exact match)

## Same host as Traefik

The workflow passes `clear_published_ports: "none"` so Traefik keeps ports 80/443. **`PUBLIC_HOST`** is injected by CI (`.compose.ci.env`). **`AUTH_URL`** defaults to `https://<PUBLIC_HOST>` when not set in **`WEB_AUTH_URL`** (`pass_compose_tls_env: "false"`), matching **avcd-api**.

Set **`DO_WEB_HEALTH_URL`** to `https://<PUBLIC_HOST>/health` so CI can verify the site after deploy.

## Sizing

Running Traefik, API (Mongo/Redis), and Next.js on **one** droplet needs enough **RAM and CPU** for builds at deploy time and steady-state traffic. Prefer a plan that comfortably fits all stacks or split Traefik/API and web later.

## Monorepo note

If the Git checkout root is a monorepo, set `compose_subdirectory` in the workflow to the folder that contains this repo’s `docker-compose.yml` (not `"."` at monorepo root unless compose lives there).

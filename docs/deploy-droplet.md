# Deploy web (DigitalOcean / SSH)

Deployments use the org composite:

```yaml
uses: Avocado-Technology/avcd-actions/droplet-compose-deploy@v1
```

([`avcd-actions`](https://github.com/Avocado-Technology/avcd-actions) — tag `v1`.)

Workflows:

- [`.github/workflows/deploy-digitalocean-dev.yml`](../.github/workflows/deploy-digitalocean-dev.yml) — `environment: development`, pushes to `main` (path filters) or manual
- [`.github/workflows/deploy-digitalocean-prod.yml`](../.github/workflows/deploy-digitalocean-prod.yml) — tag `*-release` or manual

When **`DO_WEB_URL`** is set, post-deploy verification curls that URL (strict TLS) and expects HTTP **200** with body containing **`AVCD Tech`**. If **`DO_WEB_URL`** is unset, the workflow still deploys but skips that check (you will see a warning in the log).

## GitHub variables and secrets

Configure **Settings → Environments** → `development` / `production` (recommended), or **Settings → Secrets and variables → Actions** at the repo level.

| Name | Type | Purpose |
|------|------|---------|
| `DO_DEPLOY_HOST` | Variable or secret | SSH host |
| `DO_DEPLOY_USER` | Variable or secret | SSH user |
| `DO_DEPLOY_PATH` | Variable or secret | Absolute deploy path on the server (**use a path used only for this repo**; rsync uses `--delete`) |
| `DO_WEB_URL` | Variable | Optional but recommended: full URL for post-deploy curl, e.g. `https://dev.example.com/` (must return 200 through Traefik and include “AVCD Tech” in the body when set) |
| `DO_DEPLOY_SSH_KEY` | **Secret** | Private SSH key (never commit) |

Use a **different** `DO_DEPLOY_PATH` than the Traefik and API stacks on the same droplet.

### Private **avcd-actions** (“Cannot access repositories”)

In **avcd-actions**: **Settings → Actions → General → Access** — allow **avcd-web** (or the whole org). The **avcd-api** repo documents the same composite and droplet pattern in its `docs/deploy-droplet.md`.

## `.env` on the server

Rsync excludes `.env`. After the first deploy, create `.env` on the droplet under `DO_DEPLOY_PATH` (see [.env.example](../.env.example)).

**Required for Traefik routing:** set **`PUBLIC_HOST`** to the same hostname Traefik uses (e.g. `dev.example.com`). It is interpolated into compose labels; without it, routing uses `localhost` and HTTPS verification will fail.

**Auth:** set **`AUTH_URL`** to the public origin (e.g. `https://dev.example.com`), **`AUTH_SECRET`**, and Google OAuth vars. Do not leave `AUTH_URL` at `http://localhost:3000` on a deployed host.

**API:** set **`AVCD_API_URL`** for server-side calls. With API and web on the same Docker host attached to **`avcd_edge`**, use **`http://api:8000`** (service name from the API compose project), unless your layout differs.

Optional: **`NEXT_PUBLIC_AVCD_API_URL`** for the signed-in MCP installer hint (browser-visible API base).

## Traefik + shared Docker network

Join **`avcd_edge`** (same network as Traefik and API). The deploy action ensures the network exists before `docker compose up`. Deploy **Traefik** (or run `docker network create avcd_edge` once) before relying on TLS routers.

The web router uses **priority 50**; API **`/api`** uses higher priority so paths do not collide.

## Related docs

Same deployment model as **avcd-api** and **avcd-traefik** (`docs/deploy-droplet.md` in each repo).

# AVCD web

Next.js app with **Google sign-in** (Auth.js). After sign-in, your name appears in the top bar with a **Sign out** control.

## Environment

Create **`web/.env.local`** (or set the same variables via Docker Compose for the `web` service). Next.js only auto-loads env files under `web/`. The repo-root [`.env.example`](../.env.example) groups the same Web variables with a minimal API block for Compose; optional API settings are in [`api/JWT_AUTH.md`](../api/JWT_AUTH.md).

**Required for Google login:**

| Variable | Purpose |
| -------- | ------- |
| `AUTH_SECRET` | Cookie encryption (`openssl rand -base64 32`) |
| `AUTH_URL` | Public site origin, no path (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth **Web** client ID |
| `GOOGLE_CLIENT_SECRET` | Web client secret |

Optional aliases: `NEXTAUTH_SECRET` / `NEXTAUTH_URL`, `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (see [`auth.ts`](auth.ts)).

**Redirect URI** in Google Cloud Console must be exactly:

`{AUTH_URL}/api/auth/callback/google`  
Example: `http://localhost:3000/api/auth/callback/google`

The web app does **not** call the FastAPI backend for sign-in; only Auth.js + Google OAuth.

**API keys (home page):** After sign-in, the home page **mints one browser API key** automatically and offers **Copy** and **Refresh**. Server actions call FastAPI using **`AVCD_API_URL`** (server-only). For `next dev`, set e.g. `AVCD_API_URL=http://127.0.0.1:8000` in `web/.env.local`. Docker Compose sets `AVCD_API_URL=http://api:8000` for the `web` service. The API needs **`JWT_SECRET`**, **`AUTH_API_KEYS_ENABLED=true`**, and portal token enabled (**`AUTH_PORTAL_ENABLED`**, default true). Compose defaults **`AUTH_API_KEYS_ENABLED`** to **false** unless your repo-root **`.env`** sets it to **true** (see repo [`.env.example`](../.env.example)). End-to-end details: [`TOKEN_FLOW.md`](TOKEN_FLOW.md).

## Run

```bash
cd web && npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
cd web && npm run build && npm start
```

## Docker

**Full stack** (MongoDB, Redis, API, web) from the **repository root**:

```bash
docker compose up --build -d
```

The `web` image is built from [`Dockerfile`](Dockerfile) with build context **`web/`** (see root `docker-compose.yml`). The app is on [http://localhost:3000](http://localhost:3000).

**Web only** (e.g. behind Traefik next to the API), from **`web/`**:

```bash
docker compose up --build -d
```

See [`docker-compose.yml`](docker-compose.yml) in this folder for Traefik labels and `avcd_edge`.

## Droplet deploy (GitHub Actions)

CI uses the org composite **droplet-compose-deploy** (same pattern as API). Configure environments, `DO_WEB_URL`, and server `.env` per [`docs/deploy-droplet.md`](docs/deploy-droplet.md).

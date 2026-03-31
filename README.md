# AVCD web

Next.js app with **Google sign-in** (Auth.js). After sign-in, your name appears in the top bar with a **Sign out** control.

## Environment

Create **`web/.env.local`** (or set the same variables via Docker Compose for the `web` service, or in the **Vercel** dashboard for production). Next.js only auto-loads env files under `web/`. Copy from [`.env.example`](.env.example). Optional API settings are in [`api/JWT_AUTH.md`](../api/JWT_AUTH.md) (sibling repo).

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

**API keys (home page):** After sign-in, the home page **mints one browser API key** automatically and offers **Copy** and **Refresh**. Server actions call FastAPI using **`AVCD_API_URL`** (server-only). For `next dev`, use e.g. `http://127.0.0.1:8000` in `.env.local`. On **Vercel**, set **`AVCD_API_URL`** to your **public HTTPS** API base (not `http://api:8000`). Docker Compose uses `http://api:8000` for the `web` service. The API needs **`JWT_SECRET`**, **`AUTH_API_KEYS_ENABLED=true`**, and portal enabled (**`AUTH_PORTAL_ENABLED`**, default true). End-to-end details: [`TOKEN_FLOW.md`](TOKEN_FLOW.md).

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

See [`docker-compose.yml`](docker-compose.yml) in this folder for Traefik labels and `avcd_edge` (local / optional VM use).

## Production deploy

You can host the app in either of these ways:

### Vercel

Fully managed edge hosting. Connect the repo, set **Root Directory** to `web` if needed, and configure environment variables plus Google OAuth as in [`docs/deploy-vercel.md`](docs/deploy-vercel.md). The API can stay on DigitalOcean behind Traefik; use a public **`AVCD_API_URL`** in Vercel (not `http://api:8000`). If the browser calls the API directly, add your Vercel origin to the API’s **`CORS_ALLOW_ORIGINS`** (see **avcd-api** `JWT_AUTH.md`).

**When to choose Vercel:** you want zero VM ops, preview URLs, and the API or other backends elsewhere.

### DigitalOcean droplet + Traefik

Run the same **Docker** image next to **Traefik** and the API on your infra provisioned droplet (`avcd_edge`, Let’s Encrypt on the proxy). GitHub Actions deploy via [`droplet-compose-deploy`](https://github.com/Avocado-Technology/avcd-actions); see [`docs/deploy-droplet.md`](docs/deploy-droplet.md) for secrets, server `.env` (`PUBLIC_HOST`, `AUTH_URL`, `AVCD_API_URL=http://api:8000`), OAuth redirects, and deploy order (Traefik → API → web).

**When to choose the droplet:** you want the frontend colocated with the API and a single TLS edge, without a separate frontend host.

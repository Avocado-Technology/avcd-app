# AVCD web

Next.js app with **Google sign-in** (Auth.js). After sign-in, your name appears in the top bar with a **Sign out** control.

## Environment

Create **`web/.env.local`** (or set the same variables via Docker Compose for the `web` service, or in the **Vercel** dashboard for production). Next.js only auto-loads env files under `web/`. Copy from [`.env.example`](.env.example). Optional API settings are in [`api/JWT_AUTH.md`](../api/JWT_AUTH.md) (sibling repo).

**Required for Google login:**

| Variable | Purpose |
| -------- | ------- |
| `AUTH_SECRET` | Cookie encryption (`openssl rand -base64 32`) |
| `AUTH_URL` | Public site origin, no path (e.g. `http://localhost:3000`). **Must match how you open the app** (`http` vs `https`) — Auth.js picks session cookie names from this; a mismatch breaks server actions that read the session JWT even when sign-in looks fine. |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth **Web** client ID |
| `GOOGLE_CLIENT_SECRET` | Web client secret |

Optional aliases: `NEXTAUTH_SECRET` / `NEXTAUTH_URL`, `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (see [`auth.ts`](auth.ts)).

**Troubleshooting access token / “No Google sign-in token”:** set **`AUTH_DEBUG=1`** (or **`AVCD_AUTH_DEBUG=1`**) in **`.env.local`** (or **`.env`**). **Docker:** `web/docker-compose.yml` loads both files; do not expect debug if the flag is only in a file Compose does not mount. Follow logs with **`docker compose logs -f web`** (stdout/stderr from `node server.js`). You should see a line at startup when debug is on: **`instrumentation register(): debug ON`**. Never commit debug in production if logs are sensitive.

**Redirect URI** in Google Cloud Console must be exactly:

`{AUTH_URL}/api/auth/callback/google`  
Example: `http://localhost:3000/api/auth/callback/google`

**Auth issuer (JWT for API):** set **`AVCD_AUTH_URL`** (server-only) to the FastAPI auth service — e.g. `http://127.0.0.1:8010` locally when Compose publishes auth on 8010, or `http://auth:8000` from the `web` container. Production: `https://YOUR_HOST/auth` (Traefik). Must match **`GOOGLE_CLIENT_IDS`** on the issuer. See [`TOKEN_FLOW.md`](TOKEN_FLOW.md).

The web app does **not** call the FastAPI backend for sign-in; only Auth.js + Google OAuth.

**Access JWT (home page):** After sign-in, the app shows the AVCD **JWT** from the session or by calling **`AVCD_AUTH_URL`** (`POST .../google/token`) when needed. It does **not** call the main API. Local `.env.local` example: `AVCD_AUTH_URL=http://127.0.0.1:8010` when auth publishes **8010**. Docker **`web`** (`web/docker-compose.yml`): default **`http://host.docker.internal:8010`**; override with `http://auth:8000` on **`avcd_edge`**. Optional **`NEXT_PUBLIC_AVCD_API_URL`**: public API base for the MCP installer hint only. See [`TOKEN_FLOW.md`](TOKEN_FLOW.md).

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

Fully managed edge hosting. Connect the repo, set **Root Directory** to `web` if needed, and configure environment variables plus Google OAuth as in [`docs/deploy-vercel.md`](docs/deploy-vercel.md). Set a public **`AVCD_AUTH_URL`** (HTTPS issuer URL, not `http://auth:8000`). Optional **`NEXT_PUBLIC_AVCD_API_URL`** if you want the installer hint to show your API base. If the **browser** calls the API directly, add your Vercel origin to the API’s **`CORS_ALLOW_ORIGINS`** (see **avcd-api** `JWT_AUTH.md`).

**When to choose Vercel:** you want zero VM ops, preview URLs, and the API or other backends elsewhere.

### DigitalOcean droplet + Traefik

Run the same **Docker** image next to **Traefik** and the API on your infra provisioned droplet (`avcd_edge`, Let’s Encrypt on the proxy). GitHub Actions deploy via [`droplet-compose-deploy`](https://github.com/Avocado-Technology/avcd-actions); see [`docs/deploy-droplet.md`](docs/deploy-droplet.md) for secrets, server `.env` (`PUBLIC_HOST`, `AUTH_URL`, `AVCD_AUTH_URL=http://auth:8000` on **`avcd_edge`**), OAuth redirects, and deploy order (Traefik → API → web).

**When to choose the droplet:** you want the frontend colocated with the API and a single TLS edge, without a separate frontend host.

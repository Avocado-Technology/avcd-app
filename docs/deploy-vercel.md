# Deploy web (Vercel)

Production hosting for this Next.js app is **Vercel**. The FastAPI backend can stay on DigitalOcean (Traefik, `/api` or a dedicated API host).

## 1. Create the project

- [Vercel](https://vercel.com) → **Add New Project** → import your Git repository.
- **Root Directory**: use `web` if the repo root is a monorepo; leave empty if this repo is only the web app.
- **Framework**: Next.js (default).
- If the build fails on `next build --turbopack`, set **Build Command** to `next build` in Project Settings.

## 2. Environment variables

**Project → Settings → Environment Variables.** Add for **Production** (and **Preview** if you want OAuth on preview URLs).

| Name | Notes |
|------|--------|
| `AUTH_SECRET` | `openssl rand -base64 32` — mark **Sensitive** |
| `AUTH_URL` | Canonical public origin, e.g. `https://your-domain.com` or `https://<name>.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Web client |
| `GOOGLE_CLIENT_SECRET` | **Sensitive** |
| `AVCD_AUTH_URL` | Public HTTPS base for the auth issuer (no trailing slash), e.g. `https://dev.example.com/auth` if Traefik strips to FastAPI under `/auth` |
| `NEXT_PUBLIC_AVCD_API_URL` | Optional; public API base for the signed-in MCP installer hint in the browser |

Server actions call **only the auth issuer** to refresh the access JWT, so **`AVCD_AUTH_URL` must not** be `http://auth:8000` (Docker-only). Use the same HTTPS URL you would `curl` from the internet.

## 3. Google Cloud Console

For each deployment origin you use:

- **Authorized JavaScript origins**: your `AUTH_URL` origin(s).
- **Authorized redirect URIs**: `{AUTH_URL}/api/auth/callback/google` (exact match).

Preview deployments use unique `*.vercel.app` hosts; add each preview base to the OAuth client if you need sign-in there, or use Production only.

## 4. Backend (DigitalOcean / elsewhere)

- Ensure **`AVCD_AUTH_URL`** is reachable over **HTTPS** from Vercel’s servers (issuer health: `GET …/health`).
- Server Actions do not need CORS for issuer calls. If the **browser** calls the API directly, set **`CORS_ALLOW_ORIGINS`** on the API to include your Vercel origin (see **avcd-api** `JWT_AUTH.md`).

## 5. Custom domain

**Project → Settings → Domains** → add your domain and apply the DNS records Vercel shows. Set **`AUTH_URL`** to match the canonical HTTPS URL.

## 6. Verify

Open the deployed site, sign in with Google, and confirm the access token appears on the home page. If errors mention the issuer, fix **`AVCD_AUTH_URL`**, TLS, or firewall rules.

## Local / optional self-host

Docker Compose and [`docker-compose.yml`](../docker-compose.yml) remain for local dev or optional VM deploy; they are not used by Vercel.

API and Traefik repos keep their own **GitHub Actions** + droplet docs (`docs/deploy-droplet.md` in those repos).

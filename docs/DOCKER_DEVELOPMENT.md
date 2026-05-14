# Docker Development Guide

## Quick Start

```bash
cd web
npm run dev
```

This starts Docker Compose with [Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/) for hot reload (recommended 2025+ workflow).

Edit files locally — changes sync into the container and Next.js hot reloads.

## Alternative: Local development (without Docker)

```bash
npm run dev:local
```

Runs Next.js directly on the host. Use when Docker is unavailable or for debugging outside the container.

## Turbopack (local only)

```bash
npm run dev:turbo
```

Runs `next dev --turbopack` on the host (not inside Docker).

## How it works

1. On the **host**, `npm run dev` runs `docker compose up --watch` (Compose Watch + this file).
2. Inside the **container**, `docker-entrypoint-dev.sh` runs `npm run dev:local` → `next dev`.
3. `Dockerfile.dev` installs dependencies in the container.
4. `develop.watch` in `docker-compose.yml` syncs source files (`app/`, `lib/`, `components/`, `public/`, etc.) into the container on change (no bind mount needed).
5. Named volumes (`app_node_modules`, `app_next`) isolate container dependencies and build cache from the host.
6. `WATCHPACK_POLLING=true` helps Next.js detect synced file changes on macOS/Windows Docker Desktop.

## Prerequisites

- Docker and Docker Compose v2.22+ (for `docker compose up --watch`)
- `.env` committed defaults; copy `.env.local.example` → `.env.local` for Auth0 and other secrets

## Environment variables

The development setup supports these environment variables (with defaults in `.env` and secrets in `.env.local`):

```bash
# Auth0 (set in .env.local — see docs/setup-guides/AUTH0_LOCALHOST_SETUP.md)
AUTH0_SECRET=your-secret-here
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://dev.avcd.ai/api

# API URLs
NEXT_PUBLIC_AVCD_API_URL=http://localhost:8000
AVCD_AUTH_URL=http://host.docker.internal:8010

# MCP
NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID=your-mcp-client-id
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:8000/mcp
```

## Troubleshooting

### Hot reload not working?

1. Confirm you ran `npm run dev` (uses `docker compose up --watch`) or `docker compose up --watch`
2. Check `WATCHPACK_POLLING=true` in `docker-compose.yml` / `.env`
3. Verify volumes: `docker compose config`
4. Logs: `docker compose logs -f web`

### Port already in use?

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Use 3001 on host instead
```

### Permission errors on Linux?

If you see EACCES errors:

```bash
# Option 1: Run dev server as current user (uses Next.js inside the container)
docker compose run --user $(id -u):$(id -g) web npm run dev:local

# Option 2: Fix ownership inside container
docker compose exec web chown -R node:node /app
```

### Container crashes on startup?

1. Check for syntax errors in your code
2. Review logs: `docker compose logs web`
3. Rebuild from scratch:
   ```bash
   docker compose down -v
   docker compose up --build --watch
   ```

## Commands

```bash
# Recommended: watch + hot reload (same as npm run dev)
docker compose up --watch

# Foreground without watch (no file syncing; use watch for dev)
docker compose up

# Background
docker compose up -d --watch

# Logs
docker compose logs -f web

# Rebuild image after Dockerfile or dependency changes
docker compose up --build --watch

# Stop
docker compose down

# Stop and remove volumes
docker compose down -v

# Shell into container
docker compose exec web sh
```

## Differences from production

See [DOCKER_SETUPS_COMPARISON.md](../DOCKER_SETUPS_COMPARISON.md) for a detailed comparison.

Key differences:

- Development uses `Dockerfile.dev` (single-stage, fast)
- Source code synced via Compose Watch (fast, reliable, no bind mount conflicts)
- Named volumes isolate `node_modules` and `.next` from the host
- No Traefik labels (local only)
- No optimization or minification

# Docker Development Guide

## Quick Start

```bash
cd web
docker compose up --build
```

Edit files locally → Changes appear instantly (hot reload)

## How It Works

1. `Dockerfile.dev` installs dependencies in container
2. Source code mounted via volumes
3. Next.js dev server watches for changes
4. `WATCHPACK_POLLING` enables file watching in Docker

## Prerequisites

- Docker and Docker Compose installed
- Optional: `.env.local` file with Auth0 secrets

## Environment Variables

The development setup supports these environment variables (with defaults):

```bash
# Auth0 Configuration
AUTH0_SECRET=your-secret-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-audience

# API URLs
NEXT_PUBLIC_AVCD_API_URL=http://localhost:8000
AVCD_AUTH_URL=http://host.docker.internal:8010

# MCP Configuration
NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID=your-mcp-client-id
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:8000/mcp
```

## Troubleshooting

### Hot reload not working?

1. Check `WATCHPACK_POLLING=true` in docker-compose.yml
2. Verify volumes are mounted:
   ```bash
   docker compose config
   ```
3. Check container logs:
   ```bash
   docker compose logs -f
   ```
4. Ensure the container is running:
   ```bash
   docker compose ps
   ```

### Port already in use?

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use 3001 on host instead
```

### Permission errors on Linux?

If you see EACCES errors:

```bash
# Option 1: Run as current user
docker compose run --user $(id -u):$(id -g) web npm run dev

# Option 2: Fix ownership inside container
docker compose exec web chown -R node:node /app
```

### Container crashes on startup?

1. Check for syntax errors in your code
2. Review logs: `docker compose logs web`
3. Rebuild from scratch:
   ```bash
   docker compose down -v
   docker compose up --build
   ```

## Commands

```bash
# Start in foreground (see logs)
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f web

# Rebuild image
docker compose up --build

# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Shell into container
docker compose exec web sh
```

## Differences from Production

See [DOCKER_SETUPS_COMPARISON.md](../DOCKER_SETUPS_COMPARISON.md) for a detailed comparison.

Key differences:
- Development uses `Dockerfile.dev` (single-stage, fast)
- Source code mounted via volumes (instant updates)
- No Traefik labels (local only)
- Hot reload enabled with `WATCHPACK_POLLING`
- No optimization or minification

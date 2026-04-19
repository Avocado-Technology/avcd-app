# Production Deployment - Next.js Web

## Prerequisites

1. Traefik network exists: `docker network create avcd_edge`
2. Auth0 configured (see .env.example)
3. Environment variables in `.env` file

## Required Environment Variables

- `PUBLIC_HOST` - Your domain (e.g., dev.avcd.ai)
- `AUTH0_SECRET` - Session encryption key (32+ chars)
- `AUTH0_ISSUER_BASE_URL` - Auth0 tenant URL
- `AUTH0_CLIENT_ID` - Auth0 web client ID
- `AUTH0_CLIENT_SECRET` - Auth0 web client secret
- `AUTH0_AUDIENCE` - API identifier

## Deployment

From this directory:

```bash
# Deploy
docker compose up -d --build

# Check logs
docker compose logs -f web

# Check health
curl https://${PUBLIC_HOST}/health
```

## Traefik Routes

- Primary: `https://${PUBLIC_HOST}/` → web:3000
- Auth routes: `https://${PUBLIC_HOST}/api/auth/*` → web:3000 (priority 150)

## Rollback

```bash
docker compose down
git checkout <previous-commit>
docker compose up -d --build
```

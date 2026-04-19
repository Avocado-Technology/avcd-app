# Docker Setups Comparison

This document compares the development and production Docker setups for the Next.js web application.

## Overview

The web application now uses two separate Docker configurations:

- **Development**: Fast iteration with hot reload (optimized for developer experience)
- **Production**: Optimized build for deployment (optimized for performance and security)

## Detailed Comparison

| Aspect                  | Development                      | Production                             |
|-------------------------|----------------------------------|----------------------------------------|
| **File**                | `docker-compose.yml`             | `deploy/production/docker-compose.yml` |
| **Dockerfile**          | `Dockerfile.dev`                 | `Dockerfile`                           |
| **Command**             | `npm run dev`                    | `node server.js`                       |
| **Build Type**          | Single-stage                     | Multi-stage (deps → builder → runner)  |
| **Volumes**             | Source mounted                   | No volumes                             |
| **Hot Reload**          | ✅ Yes                           | ❌ No                                  |
| **Build Time**          | ~30s                             | ~2-3min                                |
| **Image Size**          | ~1.5GB                           | ~200MB                                 |
| **Traefik**             | ❌ No                            | ✅ Yes                                 |
| **Networks**            | Default bridge                   | `avcd_edge` (external)                 |
| **Usage**               | Local development                | Production deployment                  |
| **NODE_ENV**            | `development`                    | `production`                           |
| **WATCHPACK_POLLING**   | `true`                           | Not set                                |
| **Optimization**        | None (fast startup)              | Full (minification, tree-shaking)      |
| **Source Code Location**| Volume mount (editable)          | Baked into image                       |
| **Rebuild Required**    | No (hot reload)                  | Yes (for code changes)                 |
| **Security**            | Running as root                  | Non-root user (nextjs)                 |

## When to Use Each

### Development (`docker-compose.yml`)

Use when:
- Developing locally
- Testing changes quickly
- Debugging issues
- Learning the codebase
- Running alongside local services (API, databases)

**Command:**
```bash
cd web
docker compose up
```

### Production (`deploy/production/docker-compose.yml`)

Use when:
- Deploying to dev/staging/production environments
- Testing production build locally
- Verifying Traefik routing
- Simulating production environment
- CI/CD pipelines (GitHub Actions)

**Command:**
```bash
cd web/deploy/production
docker compose up -d --build
```

## File Structure

```
web/
├── Dockerfile                    # Production (multi-stage, optimized)
├── Dockerfile.dev                # Development (single-stage, hot reload)
├── docker-compose.yml            # Development compose (local)
├── deploy/
│   └── production/
│       ├── docker-compose.yml    # Production compose (deployment)
│       └── README.md             # Production deployment guide
└── docs/
    └── DOCKER_DEVELOPMENT.md     # Development guide
```

## GitHub Actions Integration

GitHub Actions workflows use the **production** setup:

- `.github/workflows/deploy-digitalocean-dev.yml` → Uses `deploy/production/`
- `.github/workflows/deploy-digitalocean-prod.yml` → Uses `deploy/production/`

Both workflows specify:
```yaml
compose_subdirectory: "deploy/production"
```

This ensures:
1. The correct production compose file is used
2. Build context points to `web/` directory (via `context: ../..`)
3. Traefik routing is configured
4. Production optimizations are applied

## Migration Notes

If you were using the old setup (single compose file at root):

### Before:
```bash
cd web
docker compose up  # Used production Dockerfile
```

### After:
```bash
# Development
cd web
docker compose up  # Now uses Dockerfile.dev with hot reload

# Production testing
cd web/deploy/production
docker compose up -d --build
```

The old `docker-compose.yml` has been backed up as `docker-compose.yml.backup`.

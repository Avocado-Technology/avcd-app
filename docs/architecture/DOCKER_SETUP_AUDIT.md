# Docker Setup Audit

## Current State Analysis

### Findings

1. **Current docker-compose.yml is for DEPLOYMENT** (not development)
   - Located at: `web/docker-compose.yml`
   - Contains Traefik labels for routing
   - Joins `avcd_edge` network (external)
   - Uses production Dockerfile (multi-stage build)
   - Configured for CI/CD deployment

2. **Current Dockerfile is PRODUCTION-READY**
   - Multi-stage build (deps → builder → runner)
   - Optimized for size and security
   - Uses Node 22 bookworm-slim
   - Creates non-root user (nextjs)
   - Build-time and runtime separation
   - Standalone output mode

3. **No development-specific setup exists**
   - No `Dockerfile.dev`
   - No local dev docker-compose configuration
   - Current setup requires full rebuild on every code change

4. **Hot reload currently IMPOSSIBLE**
   - Production Dockerfile copies source code at build time
   - No volume mounts for source code
   - No file watching configuration
   - Would require full rebuild for every file change

### API Pattern Verification

Confirmed the API follows this pattern:

**Development:**
- `api/docker-compose.yml` - Simple, local development
- Uses single Dockerfile
- No Traefik labels
- Connects to local databases

**Production:**
- `api/deploy/production/docker-compose.yml` - Deployment configuration
- Build context: `../..` (builds from api/ directory)
- Has Traefik labels and routing
- Joins `avcd_edge` network
- Configured for managed databases

### Conclusion

The web service needs to be restructured to match the API pattern:

1. Create `Dockerfile.dev` for development (fast, hot reload)
2. Create new `docker-compose.yml` in root for development (no Traefik)
3. Move existing `docker-compose.yml` to `deploy/production/` (keep as-is for deployment)
4. Update GitHub Actions workflows to use `deploy/production/` subdirectory
5. Configure Next.js for Docker file watching with `WATCHPACK_POLLING`

## Impact Assessment

### Breaking Changes
- GitHub Actions workflows MUST be updated (critical)
- Existing `docker-compose.yml` location will change
- New development workflow requires different commands

### Benefits
- Fast hot reload for local development
- Separate dev/prod configurations (clearer separation of concerns)
- Matches API pattern (consistency across stack)
- No rebuild required during development
- Better developer experience

## Next Steps

Proceed with Phase 1: Create Development Docker Setup following TDD approach.

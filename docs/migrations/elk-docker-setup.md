# ELK.js Docker Setup Guide

## Overview

When using elkjs in Docker with Next.js Turbopack, special configuration is required to handle dynamic imports and module resolution.

## Required Dependencies

Ensure these are in your `package.json`:

```json
{
  "dependencies": {
    "elkjs": "^0.11.1",
    "web-worker": "^1.5.0"
  }
}
```

## Import Strategy

Use **dynamic import** instead of static import to avoid module resolution issues with Turbopack:

```typescript
// ❌ Static import (causes issues in Docker/Turbopack)
import ELK from 'elkjs/lib/elk.bundled.js'

// ✅ Dynamic import (works everywhere)
const ELK = (await import('elkjs/lib/elk.bundled.js')).default
const elk = new ELK()
```

## Next.js Configuration

Add Turbopack configuration in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
    resolveAlias: {
      'elkjs': 'elkjs/lib/main.js',
    }
  },
  
  webpack: (config, { isServer }) => {
    // Configure fallbacks for elkjs dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'web-worker': false,
      };
    }
    return config;
  },
}
```

## Docker Build Process

### 1. Dockerfile Setup

Your `Dockerfile.dev` should follow this pattern:

```dockerfile
FROM node:22-bookworm-slim

WORKDIR /app

# Install dependencies (will be cached)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code (overridden by volume mount)
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 2. Build and Start Container

```bash
# Stop existing container
docker compose down

# Rebuild with new dependencies
docker compose up --build
```

The `--build` flag ensures:
- Docker rebuilds the image
- `npm ci` installs elkjs and web-worker
- Fresh node_modules in container

### 3. Verify Installation

Once container is running, verify elkjs is installed:

```bash
docker compose exec web-dev npm list elkjs
```

Should show:
```
web@0.1.0 /app
└── elkjs@0.11.1
```

## Troubleshooting

### Error: "Module not found: Can't resolve 'elkjs'"

**Cause:** Dependencies not installed in container

**Solution:**
```bash
# Stop container
docker compose down

# Remove volumes to force fresh install
docker compose down -v

# Rebuild
docker compose up --build
```

### Error: "Module not found: Can't resolve 'elkjs/lib/elk.bundled.js'"

**Cause:** Using static import instead of dynamic import

**Solution:** Use dynamic import pattern:
```typescript
const ELK = (await import('elkjs/lib/elk.bundled.js')).default
```

### Error: "Module not found: Can't resolve 'web-worker'"

**Cause:** web-worker not installed

**Solution:**
```bash
npm install web-worker
docker compose up --build
```

### Container Shows Old Code

**Cause:** Volume mount caching

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart container
docker compose restart web-dev
```

## Performance Notes

- **Dynamic import** reduces initial bundle size (329 KB vs 759 KB for /org route)
- elkjs is only loaded when org chart components are used
- No impact on build time
- Works identically in local dev and Docker

## Verification Checklist

Before deploying:

- [ ] `elkjs` in package.json dependencies
- [ ] `web-worker` in package.json dependencies
- [ ] Dynamic import used in layout-utils.ts
- [ ] Turbopack config in next.config.ts
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Local dev works: `npm run dev`
- [ ] Docker build works: `docker compose up --build`
- [ ] No "Module not found" errors in container logs

## References

- [elkjs npm package](https://www.npmjs.com/package/elkjs)
- [React Flow elkjs example](https://reactflow.dev/examples/layout/elkjs)
- [Next.js Turbopack configuration](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack)

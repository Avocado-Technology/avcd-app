# syntax=docker/dockerfile:1
#
# Single Dockerfile for all environments.
#
#   dev    — hot-reload dev server (docker compose up --watch)
#   runner — production standalone Next.js server
#
# Build targets:
#   docker build --target dev .        # selects the dev stage
#   docker build .                      # defaults to runner (production)
#
# Compose usage:
#   Local dev:   docker-compose.yml sets `target: dev`
#   Production:  deploy/production/docker-compose.yml omits target → runner
#
# After changing package-lock.json the entrypoint runs npm ci automatically.
# Force a full reinstall: FORCE_NPM_CI=1 docker compose up --build --watch

# ── Base: shared Node runtime ──────────────────────────────────────────────
FROM node:22-bookworm-slim AS base
WORKDIR /app

# ── Deps: install node_modules from lock file ──────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Dev: hot-reload development server ────────────────────────────────────
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
# Source is overridden by Compose Watch volume syncs at runtime
COPY . .
EXPOSE 3000
# Entrypoint re-runs npm ci when package-lock.json changes (volume over node_modules)
ENTRYPOINT ["sh", "./docker-entrypoint-dev.sh"]

# ── Builder: production Next.js build ─────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Auth0 build-time placeholders; real secrets come from runtime env in compose/K8s.
ENV AUTH0_SECRET=build-time-placeholder-secret-min-32-chars-long-for-auth0-x
# Canonical public origin for Next.js metadataBase (must match Auth0 app URLs in production).
# Override at image build: docker build --build-arg AUTH0_BASE_URL=https://your-host ...
ARG AUTH0_BASE_URL=http://localhost:3000
ENV AUTH0_BASE_URL=$AUTH0_BASE_URL
ENV AUTH0_ISSUER_BASE_URL=https://placeholder.auth0.com
ENV AUTH0_CLIENT_ID=build-placeholder
ENV AUTH0_CLIENT_SECRET=build-placeholder
# Keycloak build-time placeholders; real values come from runtime env in compose/K8s.
ENV AUTH_SECRET=build-time-placeholder-secret-min-32-chars-long-for-auth0-x
ENV APP_BASE_URL=$AUTH0_BASE_URL
ENV KEYCLOAK_URL=https://placeholder.keycloak.example
ENV KEYCLOAK_REALM=avcd
ENV KEYCLOAK_CLIENT_ID=build-placeholder
ENV KEYCLOAK_CLIENT_SECRET=build-placeholder
ENV KEYCLOAK_AUDIENCE=https://placeholder.example/api
# So server bundles keep runtime lookup for AVCD_AUTH_URL (same default as compose / runner image).
ENV AVCD_AUTH_URL=http://auth:8000

# GraphQL endpoint (build arg with default for local dev, override in CI/CD)
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Client feature flags — must exist at `next build` (inlined into browser bundles).
ARG NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV=true
ENV NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV=$NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV

RUN npx next build

# ── Runner: minimal production image ──────────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Auth issuer for server-side token exchange (overridable via compose env_file / K8s env).
ENV AVCD_AUTH_URL=http://auth:8000

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

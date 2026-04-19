# Build context must be the web/ directory (e.g. docker build -f Dockerfile . from web/).
# Used by repo-root docker-compose (web service) and web/docker-compose.yml.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Auth0 build-time placeholders; real secrets come from runtime env in compose/K8s.
ENV AUTH0_SECRET=build-time-placeholder-secret-min-32-chars-long-for-auth0-x
ENV AUTH0_BASE_URL=http://localhost:3000
ENV AUTH0_ISSUER_BASE_URL=https://placeholder.auth0.com
ENV AUTH0_CLIENT_ID=build-placeholder
ENV AUTH0_CLIENT_SECRET=build-placeholder
# So server bundles keep runtime lookup for AVCD_AUTH_URL (same default as compose / runner image).
ENV AVCD_AUTH_URL=http://auth:8000

# GraphQL endpoint (build arg with default for local dev, override in CI/CD)
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT

RUN npx next build

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

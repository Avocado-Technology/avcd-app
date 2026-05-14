# Auth0 Localhost Setup Guide

This guide explains how to configure Auth0 authentication for local development with the AVCD web application.

## Overview

The AVCD platform uses Auth0 for authentication with the following components:

- **Auth0 Tenant**: `avcdtech.us.auth0.com`
- **Web Application**: Regular Web App (port 3000)
- **MCP Server**: Native App with PKCE (port 3001)
- **GraphQL API**: Resource Server (audience: `https://dev.avcd.ai/api`)

## Prerequisites

1. ✅ **Terraform Infrastructure Applied**
   - The Auth0 resources must be provisioned via Terraform
   - Located in: `/infra/modules/auth0/`
   - Apply with: `cd infra && terraform apply`

2. ✅ **Manual Auth0 Dashboard Configuration**
   - These 2 settings CANNOT be automated via Terraform
   - **CRITICAL**: Must be enabled before localhost auth will work

### Required Manual Configuration

Navigate to [Auth0 Dashboard](https://manage.auth0.com/dashboard) → **Settings** → **Advanced** → **OAuth**

Enable these two settings:

1. **Resource Parameter Compatibility Profile**
   - Enables RFC 8707 `resource` parameter in OAuth requests
   - Without this: "Service not found" errors occur
   - Reference: [Auth0 MCP Docs](https://auth0.com/ai/docs/mcp/guides/resource-param-compatibility-profile)

2. **Enable Application Connections**
   - Allows apps to specify which OAuth connections to use
   - Required for Google OAuth integration

See: `/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md` for details

## Localhost Configuration

### 1. Terraform Configuration ✅

The Terraform configuration (`/infra/modules/auth0/main.tf`) already includes localhost URLs:

**Web App (port 3000):**
- Callback: `http://localhost:3000/api/auth/callback`
- Logout: `http://localhost:3000/`
- Web Origins: `http://localhost:3000`

**MCP App (port 3001):**
- Callbacks: `http://localhost:3001/mcp/oauth/callback`, `http://localhost:3001/callback`
- Logout: `http://localhost:3001/`
- Web Origins: `http://localhost:3001`

### 2. Environment Variables

The project uses a two-file approach following Next.js best practices:

**`.env`** — Committed to git, contains public defaults (API URLs, feature flags).  
**`.env.local`** — Git-ignored, contains your secrets (Auth0 credentials, API keys).

#### Quick setup

```bash
cd web/

# 1. Copy the secrets template
cp .env.local.example .env.local

# 2. Fill in Auth0 credentials (from Terraform)
cd ../infra/
./scripts/update-web-env.sh
# Or manually:
# terraform output auth0_web_client_id
# terraform output auth0_web_client_secret
# terraform output auth0_mcp_client_id
```

#### Required variables in `.env.local`

| Variable | Source | Purpose |
|----------|--------|---------|
| `AUTH0_SECRET` | `openssl rand -base64 32` | Session encryption |
| `APP_BASE_URL` | `http://localhost:3000` | OAuth redirect base (Auth0 v4) |
| `AUTH0_DOMAIN` | `terraform output` / tenant hostname only | Auth0 tenant (v4) |
| `AUTH0_CLIENT_ID` | `terraform output` | Web app client ID |
| `AUTH0_CLIENT_SECRET` | `terraform output` | Web app secret |
| `AUTH0_AUDIENCE` | `terraform output auth0_graphql_api_identifier` | GraphQL API audience (must end with `/api`) |
| `OPENAI_API_KEY` | OpenAI dashboard | Chat feature (optional) |

**Important:** `AUTH0_AUDIENCE` must match `terraform output -raw auth0_graphql_api_identifier` (typically `https://dev.avcd.ai/api`). The MCP server and Claude clients use `terraform output -raw auth0_mcp_api_identifier` (typically `https://dev.avcd.ai/mcp`). Using just `https://dev.avcd.ai/` will cause "Service not found" errors.

**Note:** Prefer Auth0 v4 names (`APP_BASE_URL`, `AUTH0_DOMAIN`). Deprecated v3 names (`AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`) still work as fallbacks in `lib/auth0.ts` but are not recommended for new setups.

Public values such as `NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID` can live in `.env` (defaults) or be overridden in `.env.local` if your Terraform script sets them there.

### Critical: Auth0 Dashboard Manual Setup

**Before OAuth will work, you MUST enable these settings in Auth0 Dashboard:**

1. Go to: https://manage.auth0.com/dashboard → **Settings** → **Advanced** → **OAuth**
2. Enable: **"Resource Parameter Compatibility Profile"** (fixes "Service not found" errors)
3. Enable: **"Enable Application Connections"**
4. Click **Save Changes**

These settings cannot be managed via Terraform. See [`/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md`](/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md) for full details.

### 3. Retrieve Auth0 Credentials

After applying Terraform, use the provided script to automatically update `.env.local`:

```bash
cd infra/
./scripts/update-web-env.sh
```

This script will:
- Extract Auth0 credentials from Terraform outputs
- Update your `.env.local` file automatically
- Create a backup (`.env.local.backup`)
- Show you the updated values

**Manual Alternative:**

```bash
cd infra/

# Get Web App credentials
terraform output auth0_web_client_id
terraform output auth0_web_client_secret

# Get MCP Client ID (public)
terraform output auth0_mcp_client_id

# Get API identifiers (GraphQL for web; MCP for MCP server / Claude)
terraform output auth0_graphql_api_identifier
terraform output auth0_mcp_api_identifier

# Deprecated alias (same value as auth0_graphql_api_identifier)
terraform output auth0_api_identifier
```

Then manually update `/web/.env.local` with these values.

## Local Development Workflow

### First-Time Setup

1. **Apply Terraform Infrastructure**
   ```bash
   cd infra/
   terraform init
   terraform apply
   ```

2. **Configure Auth0 Dashboard (One-Time)**
   - Go to: https://manage.auth0.com/dashboard
   - Settings → Advanced → OAuth
   - Enable: "Resource Parameter Compatibility Profile"
   - Enable: "Enable Application Connections"

3. **Create local secrets file**
   ```bash
   cd web/
   cp .env.local.example .env.local
   ```

4. **Update Web Environment Variables**
   ```bash
   cd ../infra/
   ./scripts/update-web-env.sh
   ```

5. **Start Web Application**
   ```bash
   cd ../web/
   docker compose up
   # or: npm run dev
   ```

6. **Access Application**
   - Open: http://localhost:3000
   - Click "Sign In with Google"
   - Authenticate with Google
   - You should be redirected back to localhost with an Auth0 session

### Daily Development

```bash
# Start the web app with hot reload
cd web/
docker compose up

# Or run tests inside the container (another terminal)
docker compose exec web npm test

# View logs
docker compose logs -f web

# Access the app
open http://localhost:3000
```

## Troubleshooting

### "Service not found" Error

**Symptom:** Auth0 returns "Service not found: http://localhost:3000" during OAuth flow

**Solution:** Enable "Resource Parameter Compatibility Profile" in Auth0 Dashboard
- Go to: Settings → Advanced → OAuth
- Enable: "Resource Parameter Compatibility Profile"

### "Callback URL mismatch" Error

**Symptom:** Auth0 rejects the callback URL

**Solution:** Verify Terraform has been applied and includes localhost URLs
```bash
cd infra/
terraform state show 'auth0_client.web_app[0]' | grep callbacks
```

Should include: `http://localhost:3000/api/auth/callback`

### Missing Client ID/Secret

**Symptom:** `.env.local` has `TBD_FROM_TERRAFORM` values

**Solution:** Run the update script or manually retrieve from Terraform:
```bash
cd infra/
./scripts/update-web-env.sh
```

### Auth0 Session Errors

**Symptom:** "AUTH0_SECRET must be at least 32 characters" or session decode errors

**Solution:** Generate a new secret:
```bash
openssl rand -base64 32
```

Update `AUTH0_SECRET` in `.env.local`

### Docker Container Issues

**Symptom:** Web container won't start or shows auth errors

**Solution:**
```bash
cd web/

# Stop and remove containers
docker-compose down

# Rebuild with updated env vars
docker-compose build web

# Start fresh
docker-compose up -d web

# Check logs
docker-compose logs -f web
```

## Security Notes

### Secrets Management

- **Never commit** `.env.local` to git (already in .gitignore)
- **AUTH0_SECRET**: Generate unique secret per environment
- **AUTH0_CLIENT_SECRET**: Keep private, never expose in frontend code
- **NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID**: Public client ID, safe to expose

### Local Development

- `AUTH0_BASE_URL=http://localhost:3000` is correct for local dev
- Auth0 allows `http://` for localhost (not HTTPS)
- For production, always use `https://` URLs

## Architecture

### Auth0 Applications

1. **AVCD Web Portal** (Regular Web Application)
   - Used by: Next.js web frontend
   - Auth Method: Client Secret (confidential client)
   - Token Storage: Server-side session cookies
   - Grants: `authorization_code`, `refresh_token`

2. **AVCD MCP Server** (Native Application)
   - Used by: Claude Desktop, MCP clients
   - Auth Method: PKCE (public client, no secret)
   - Token Storage: Client-managed
   - Grants: `authorization_code`, `refresh_token`

### Authentication Flow

```
User                    Web App                  Auth0                   Google
 |                         |                        |                        |
 |--- Click "Sign In" ---> |                        |                        |
 |                         |--- Redirect to /authorize                       |
 |                         |                        |                        |
 | <---------------------- Redirect to Auth0 ---------------------->        |
 |                         |                        |                        |
 |--- Click "Google" ----> |                        |--- Initiate OAuth ---> |
 |                         |                        |                        |
 | <---------------------- Google Login Screen -----------------------       |
 |                         |                        |                        |
 |--- Authenticate ------> |                        |                        |
 |                         |                        | <----- Google Token ---|
 |                         |                        |                        |
 | <---------------------- Redirect to callback with code ------------       |
 |                         |                        |                        |
 |--- GET /api/auth/callback (code) -------------> |                        |
 |                         |                        |                        |
 |                         | <-- Exchange code for tokens ---------------    |
 |                         |                        |                        |
 | <-- Set session cookie and redirect to / -------|                        |
 |                         |                        |                        |
```

## Related Documentation

- **Terraform Auth0 Setup**: `/infra/AUTH0_SETUP.md`
- **Critical Manual Steps**: `/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md`
- **Web Environment Template**: `/web/.env.example`
- **Auth0 Terraform Module**: `/infra/modules/auth0/main.tf`
- **Auth0 MCP Documentation**: https://auth0.com/ai/docs/mcp/get-started/authorization-for-your-mcp-server

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review Docker logs: `docker-compose logs -f web`
3. Check Auth0 logs: https://manage.auth0.com/dashboard → Monitoring → Logs
4. Verify manual Auth0 settings are enabled
5. Confirm Terraform outputs are correctly set in `.env.local`

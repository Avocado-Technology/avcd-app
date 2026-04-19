# Auth0 Localhost Setup - Complete ✅

## Summary of Changes

All necessary configuration has been completed to make Auth0 work with localhost. This document summarizes what was done and what you need to do next.

---

## ✅ Completed Configuration

### 1. Environment Files Updated

**`.env.local`** - Updated for localhost development with Auth0:
- ✅ Switched from NextAuth.js variables to Auth0 variables
- ✅ Configured `AUTH0_BASE_URL=http://localhost:3000`
- ✅ Set Auth0 tenant to `avcdtech.us.auth0.com`
- ✅ Added proper scopes and audience
- ✅ Client ID and Secret marked as `TBD_FROM_TERRAFORM` (to be filled after terraform apply)

**`.env`** - Template for different environments:
- ✅ Contains correct Auth0 structure
- ✅ Has development values pre-configured

**`.env.example`** - Updated template:
- ✅ Shows all required Auth0 variables
- ✅ Includes helpful comments and instructions

### 2. Docker Configuration Updated

**`docker-compose.yml`**:
- ✅ Removed old NextAuth.js environment variables
- ✅ Added Auth0 environment variable interpolation
- ✅ Configured to load from `.env.local` and `.env`

**`Dockerfile`**:
- ✅ Already configured with Auth0 build-time placeholders
- ✅ Runtime values will come from docker-compose environment

### 3. Terraform Configuration Verified

**`/infra/modules/auth0/main.tf`**:
- ✅ Localhost URLs already configured for Web App (port 3000):
  - Callback: `http://localhost:3000/api/auth/callback`
  - Logout: `http://localhost:3000/`
  - Web Origins: `http://localhost:3000`
- ✅ Localhost URLs already configured for MCP App (port 3001):
  - Callbacks: `http://localhost:3001/mcp/oauth/callback`, `http://localhost:3001/callback`
  - Logout: `http://localhost:3001/`
  - Web Origins: `http://localhost:3001`

### 4. Helper Scripts Created

**`/infra/scripts/update-web-env.sh`**:
- ✅ Automatically retrieves Auth0 credentials from Terraform outputs
- ✅ Updates `.env.local` with real client ID and secret
- ✅ Creates backup before making changes
- ✅ Shows summary of updated values

**`/web/scripts/verify-auth0-setup.sh`**:
- ✅ Validates all required Auth0 environment variables
- ✅ Checks for placeholder values that need updating
- ✅ Verifies localhost URLs are configured
- ✅ Provides actionable error messages

### 5. Documentation Created

**`/web/AUTH0_LOCALHOST_SETUP.md`**:
- ✅ Comprehensive guide for Auth0 localhost configuration
- ✅ Step-by-step setup instructions
- ✅ Troubleshooting section
- ✅ Architecture diagrams and flow explanations

**`/web/AUTH0_SETUP_COMPLETE.md`** (this file):
- ✅ Summary of all changes made
- ✅ Next steps checklist

---

## 🚨 Required: Manual Auth0 Dashboard Configuration

These 2 settings **CANNOT** be automated via Terraform and **MUST** be enabled manually:

### Step 1: Navigate to Auth0 Dashboard
Go to: [https://manage.auth0.com/dashboard](https://manage.auth0.com/dashboard)

### Step 2: Enable OAuth Settings
Navigate to: **Settings** → **Advanced** → **OAuth**

Enable these two toggles:

1. **✅ Resource Parameter Compatibility Profile**
   - Enables RFC 8707 `resource` parameter in OAuth requests
   - Without this: "Service not found" errors will occur
   - Reference: [Auth0 MCP Docs](https://auth0.com/ai/docs/mcp/guides/resource-param-compatibility-profile)

2. **✅ Enable Application Connections**
   - Allows apps to specify which OAuth connections to use
   - Required for Google OAuth integration

### Why These Are Required
- Auth0 Terraform provider does not expose these flags
- Auth0 Management API supports them, but Terraform resource does not
- These are tenant-level settings that rarely change
- Manual configuration is recommended by Auth0 for these settings

See: `/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md` for more details

---

## 📋 Next Steps Checklist

### Step 1: Apply Terraform Infrastructure

If you haven't already deployed Auth0 resources:

```bash
cd /Users/genarionogueira/Documents/avcd/infra

# Initialize Terraform (if not already done)
terraform init

# Review what will be created
terraform plan

# Apply the configuration
terraform apply
```

This will create:
- Auth0 Web Application (for Next.js)
- Auth0 MCP Application (for Claude Desktop)
- Auth0 API Resource Server (for GraphQL API)
- Google OAuth Connection
- All necessary scopes and permissions

### Step 2: Configure Auth0 Dashboard (CRITICAL)

⚠️ **This step is required before authentication will work**

1. Go to: https://manage.auth0.com/dashboard
2. Navigate to: **Settings** → **Advanced** → **OAuth**
3. Enable: "**Resource Parameter Compatibility Profile**"
4. Enable: "**Enable Application Connections**"

### Step 3: Update Web Environment Variables

After Terraform apply completes, run the update script:

```bash
cd /Users/genarionogueira/Documents/avcd/infra
./scripts/update-web-env.sh
```

This will automatically:
- Extract Auth0 credentials from Terraform outputs
- Update `/web/.env.local` with real values
- Create a backup of your original file
- Show you what was updated

**Manual Alternative:**

```bash
cd /Users/genarionogueira/Documents/avcd/infra

# Get the credentials
terraform output auth0_web_client_id
terraform output auth0_web_client_secret
terraform output auth0_mcp_client_id

# Then manually update /web/.env.local with these values
```

### Step 4: Verify Setup

Run the verification script to confirm everything is configured:

```bash
cd /Users/genarionogueira/Documents/avcd/web
./scripts/verify-auth0-setup.sh
```

You should see all green checkmarks except possibly for warnings about optional settings.

### Step 5: Start the Web Application

```bash
cd /Users/genarionogueira/Documents/avcd/web

# Option 1: Docker Compose
docker-compose build web
docker-compose up -d web

# Option 2: Local Development
npm install
npm run dev
```

### Step 6: Test Authentication

1. Open: http://localhost:3000
2. Click "Sign In" or "Login with Google"
3. You should be redirected to Auth0
4. Authenticate with Google
5. You should be redirected back to localhost with an active session

---

## 🔍 Verification Commands

### Check if Auth0 credentials are set

```bash
cd /Users/genarionogueira/Documents/avcd/web
./scripts/verify-auth0-setup.sh
```

### Check Terraform outputs

```bash
cd /Users/genarionogueira/Documents/avcd/infra
terraform output
```

### View web app logs

```bash
cd /Users/genarionogueira/Documents/avcd/web
docker-compose logs -f web
```

### Check Auth0 callback URLs in Terraform

```bash
cd /Users/genarionogueira/Documents/avcd/infra
terraform state show 'auth0_client.web_app[0]' | grep -A 5 callbacks
```

---

## 🐛 Troubleshooting

### Issue: "Service not found" error

**Symptom:** Auth0 returns "Service not found: http://localhost:3000"

**Solution:** Enable "Resource Parameter Compatibility Profile" in Auth0 Dashboard
- Go to: Settings → Advanced → OAuth
- Enable the toggle

### Issue: Client ID/Secret are placeholders

**Symptom:** `.env.local` still shows `TBD_FROM_TERRAFORM`

**Solution:**
```bash
cd /Users/genarionogueira/Documents/avcd/infra
./scripts/update-web-env.sh
```

### Issue: Terraform not initialized

**Symptom:** `terraform output` fails

**Solution:**
```bash
cd /Users/genarionogueira/Documents/avcd/infra
terraform init
terraform apply
```

### Issue: Docker build fails

**Symptom:** Container won't start or shows auth errors

**Solution:**
```bash
cd /Users/genarionogueira/Documents/avcd/web

# Rebuild with fresh environment
docker-compose down
docker-compose build --no-cache web
docker-compose up -d web

# Check logs
docker-compose logs -f web
```

---

## 📚 Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Localhost Setup Guide | `/web/AUTH0_LOCALHOST_SETUP.md` | Complete setup instructions |
| Critical Manual Steps | `/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md` | Manual Auth0 configuration |
| Terraform Auth0 Setup | `/infra/AUTH0_SETUP.md` | Terraform deployment guide |
| Environment Template | `/web/.env.example` | Template for environment variables |
| Terraform Auth0 Module | `/infra/modules/auth0/main.tf` | Auth0 infrastructure code |

---

## ✅ Configuration Status

| Component | Status | Notes |
|-----------|--------|-------|
| `.env.local` | ✅ Updated | Client ID/Secret need Terraform values |
| `.env` | ✅ Updated | Template for deployments |
| `.env.example` | ✅ Updated | Reference template |
| `docker-compose.yml` | ✅ Updated | Auth0 environment variables |
| `Dockerfile` | ✅ Verified | Already configured for Auth0 |
| Terraform (localhost URLs) | ✅ Verified | Already configured |
| Helper Scripts | ✅ Created | `/infra/scripts/` and `/web/scripts/` |
| Documentation | ✅ Created | This file + localhost setup guide |

---

## 🎯 Quick Start (TL;DR)

If you just want to get started quickly:

```bash
# 1. Apply Terraform
cd /Users/genarionogueira/Documents/avcd/infra
terraform init && terraform apply

# 2. Configure Auth0 Dashboard (MANUAL - see "Required: Manual Auth0 Dashboard Configuration" above)
open https://manage.auth0.com/dashboard
# Enable: Resource Parameter Compatibility Profile
# Enable: Enable Application Connections

# 3. Update environment variables
./scripts/update-web-env.sh

# 4. Verify setup
cd ../web
./scripts/verify-auth0-setup.sh

# 5. Start web app
docker-compose up -d web

# 6. Test
open http://localhost:3000
```

---

## 🔐 Security Notes

- **Never commit** `.env.local` to git (already in `.gitignore`)
- `AUTH0_CLIENT_SECRET` is confidential - never expose in frontend code
- `NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID` is public and safe to expose
- Generate unique `AUTH0_SECRET` per environment: `openssl rand -base64 32`
- Localhost can use `http://`, production must use `https://`

---

## 📝 Summary

All code changes and configurations are complete for Auth0 localhost support. The only remaining steps are:

1. ⚠️ **Apply Terraform** (`terraform apply` in `/infra`)
2. 🚨 **Enable manual Auth0 Dashboard settings** (Resource Parameter Compatibility Profile + Enable Application Connections)
3. ✅ **Update `.env.local`** with Terraform outputs (run `/infra/scripts/update-web-env.sh`)
4. ✅ **Start the web app** (`docker-compose up -d web`)
5. ✅ **Test authentication** (visit http://localhost:3000)

Everything is ready to go! 🚀

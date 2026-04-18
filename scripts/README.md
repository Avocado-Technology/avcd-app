# Web Project Scripts

This directory contains helper scripts for the AVCD web application.

## Available Scripts

### `verify-auth0-setup.sh`

**Purpose:** Validates that Auth0 is properly configured for local development.

**Usage:**
```bash
cd /Users/genarionogueira/Documents/avcd/web
./scripts/verify-auth0-setup.sh
```

**What it checks:**
- ✅ `.env.local` file exists
- ✅ Required Auth0 environment variables are set
- ✅ Values are not placeholders
- ✅ Auth0 secret meets minimum 32-character requirement
- ✅ URLs are configured for localhost
- ✅ MCP client ID is set
- ✅ API URLs are configured

**Exit codes:**
- `0` - All checks passed (may have warnings)
- `1` - One or more errors found

**Example output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Auth0 Localhost Setup Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ .env.local exists

Checking Auth0 Configuration...

✓ AUTH0_SECRET is set (44 characters)
✓ AUTH0_BASE_URL: http://localhost:3000
✓ AUTH0_ISSUER_BASE_URL: https://avcdtech.us.auth0.com
✓ AUTH0_CLIENT_ID: abc123...
✓ AUTH0_CLIENT_SECRET: xyz789...
✓ AUTH0_AUDIENCE: https://dev.avcd.ai/api
✓ AUTH0_SCOPE: openid profile email offline_access

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ All checks passed!

Your Auth0 configuration is ready for localhost development.

Next steps:
  docker-compose up -d web
  open http://localhost:3000
```

---

## Related Scripts

### `/infra/scripts/update-web-env.sh`

**Purpose:** Automatically retrieves Auth0 credentials from Terraform outputs and updates `.env.local`.

**Usage:**
```bash
cd /Users/genarionogueira/Documents/avcd/infra
./scripts/update-web-env.sh
```

**What it does:**
1. Extracts Auth0 credentials from Terraform state
2. Backs up `.env.local` to `.env.local.backup`
3. Updates Auth0 variables in `.env.local`
4. Shows summary of changes

**Prerequisites:**
- Terraform has been initialized (`terraform init`)
- Terraform has been applied (`terraform apply`)
- `jq` is installed (`brew install jq` on macOS)

---

## Common Workflows

### First-Time Setup

```bash
# 1. Apply Terraform infrastructure
cd /Users/genarionogueira/Documents/avcd/infra
terraform init
terraform apply

# 2. Update web environment variables
./scripts/update-web-env.sh

# 3. Verify Auth0 setup
cd ../web
./scripts/verify-auth0-setup.sh

# 4. Start web application
docker-compose up -d web

# 5. Check logs
docker-compose logs -f web
```

### After Terraform Changes

```bash
# 1. Re-apply Terraform
cd /Users/genarionogueira/Documents/avcd/infra
terraform apply

# 2. Update credentials
./scripts/update-web-env.sh

# 3. Restart web app
cd ../web
docker-compose restart web
```

### Troubleshooting Authentication Issues

```bash
# 1. Verify configuration
cd /Users/genarionogueira/Documents/avcd/web
./scripts/verify-auth0-setup.sh

# 2. Check for errors
# Fix any reported issues

# 3. Rebuild and restart
docker-compose down
docker-compose build --no-cache web
docker-compose up -d web

# 4. Check logs
docker-compose logs -f web

# 5. Test authentication
open http://localhost:3000
```

---

## Environment Variables Reference

### Required Auth0 Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH0_SECRET` | Session encryption secret (32+ chars) | Generate with: `openssl rand -base64 32` |
| `AUTH0_BASE_URL` | Base URL of your application | `http://localhost:3000` |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant domain | `https://avcdtech.us.auth0.com` |
| `AUTH0_CLIENT_ID` | Web app client ID | From Terraform output |
| `AUTH0_CLIENT_SECRET` | Web app client secret | From Terraform output |
| `AUTH0_AUDIENCE` | API identifier | `https://dev.avcd.ai/api` |
| `AUTH0_SCOPE` | OAuth scopes | `"openid profile email offline_access"` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUTH0_DEBUG` | Enable debug logging | `0` |
| `NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID` | MCP client ID (public) | From Terraform |
| `NEXT_PUBLIC_MCP_SERVER_URL` | MCP server URL | `http://localhost:3001/mcp` |

---

## Troubleshooting Script Issues

### Script Permission Denied

```bash
# Make script executable
chmod +x /Users/genarionogueira/Documents/avcd/web/scripts/verify-auth0-setup.sh
```

### Source Command Fails

If you see errors like "command not found" when sourcing `.env.local`:
- Check that environment variable values with spaces are quoted
- Example: `AUTH0_SCOPE="openid profile email offline_access"`

### jq Not Found (for update-web-env.sh)

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

---

## Documentation

- **Localhost Setup Guide**: `/web/AUTH0_LOCALHOST_SETUP.md`
- **Setup Complete Summary**: `/web/AUTH0_SETUP_COMPLETE.md`
- **Terraform Auth0 Setup**: `/infra/AUTH0_SETUP.md`
- **Critical Manual Steps**: `/infra/CRITICAL_MANUAL_SETUP_REQUIRED.md`

---

## Support

For issues or questions:

1. Check the troubleshooting sections in the documentation
2. Run `./scripts/verify-auth0-setup.sh` to diagnose issues
3. Review Docker logs: `docker-compose logs -f web`
4. Check Auth0 logs: https://manage.auth0.com/dashboard → Monitoring → Logs

# Web Login Issue - Diagnosis and Fix

**Date**: 2026-04-09  
**Status**: 🔴 BROKEN - Users cannot login and get API tokens

## Root Cause

The auth service and API are using **different MongoDB databases**, causing authentication to fail.

### Current Configuration (BROKEN)

| Service | Database Variable | Value | Status |
|---------|-------------------|-------|--------|
| **Auth service** | `AUTH_MONGODB_DATABASE` | `auth` | ❌ Wrong |
| **API** | `MONGODB_DATABASE` | `avcd` | ✅ Correct |
| **Web app** | N/A | Uses auth service | ❌ Fails |

### What Happens

1. User signs in with Google on web app
2. Web app sends Google ID token to auth service at `https://dev.avcd.ai/auth/google/token`
3. Auth service **creates/updates user** in `portal_users` collection in **`auth` database**
4. Auth service returns JWT with `sub: "portal:<ObjectId>"`
5. **Problem**: The API expects portal users in the **`avcd` database**, not `auth`
6. Result: JWT is valid but user doesn't exist in the database the API uses

## Fix Required

### Option 1: Change Auth Service Database (Recommended)

Update the GitHub variable to use the same database as the API:

```bash
cd /Users/genarionogueira/Documents/avcd/auth

# Update the development environment variable
gh variable set AUTH_MONGODB_DATABASE --body "avcd" --env development

# Redeploy the auth service
git commit --allow-empty -m "trigger: redeploy auth with correct database"
git push origin main
```

### Option 2: Verify Deployment Configuration

After changing the variable, verify it was applied:

1. **Check GitHub variable**:
   ```bash
   gh variable list --env development
   ```
   Should show: `AUTH_MONGODB_DATABASE   avcd`

2. **Check deployed service**:
   - SSH to server: `ssh root@dev.avcd.ai`
   - Check env file: `cat /home/deploy/avcd-auth/.compose.ci.github.env`
   - Should contain: `MONGODB_DATABASE=avcd`
   - Check logs: `cd /home/deploy/avcd-auth && docker compose logs auth`

3. **Test authentication flow**:
   ```bash
   # Test health check
   curl https://dev.avcd.ai/auth/health
   # Should return: {"status":"ok"}
   
   # After redeployment, try logging in on the web app
   # User should now get a JWT token displayed on the home page
   ```

## Additional Checks

### Google Client IDs

The `AUTH_GOOGLE_CLIENT_IDS` secret must include the web app's Google OAuth Client ID.

**Web app uses**:
- From GitHub: `WEB_GOOGLE_CLIENT_ID` secret
- Expected format: `434051895633-t68apb1lfiui2p9sh6lkhhot4gbl0cb0.apps.googleusercontent.com`

**Auth service needs**:
- `AUTH_GOOGLE_CLIENT_IDS` secret (comma-separated if multiple)
- Must include the web app's client ID

Verify:
```bash
cd /Users/genarionogueira/Documents/avcd/auth

# Check if the secret is set (you won't see the value, just confirmation)
gh secret list --env development

# The AUTH_GOOGLE_CLIENT_IDS should exist
# To update if needed (replace with actual client IDs):
# gh secret set AUTH_GOOGLE_CLIENT_IDS --body "CLIENT_ID_1,CLIENT_ID_2" --env development
```

### JWT Secret Match

Both services must use the **same JWT_SECRET**:
- Auth service: `AUTH_JWT_SECRET` (mints tokens)
- API: `JWT_SECRET` (validates tokens)

If these don't match, the API will reject all JWTs from the auth service.

## Testing After Fix

### 1. Test Auth Service Directly

```bash
# This requires a real Google ID token - you can get one by:
# 1. Sign in to the web app with browser DevTools open
# 2. Check Network tab for the Google OAuth response
# 3. Copy the id_token from the callback

curl -X POST https://dev.avcd.ai/auth/google/token \
  -H "Content-Type: application/json" \
  -d '{"id_token":"<GOOGLE_ID_TOKEN>"}' | jq .

# Should return:
# {
#   "access_token": "eyJ...",
#   "token_type": "bearer",
#   "expires_in": 3600
# }
```

### 2. Test Full Login Flow

1. Go to `https://dev.avcd.ai`
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. You should see the home page with:
   - Your name and email
   - An **API Access Token** section with a JWT token
   - Copy button to copy the token

### 3. Test Token with MCP

Once you have the token:

1. Install the MCP bundle (if not already installed)
2. Configure with:
   - **API base URL**: `https://dev.avcd.ai/api`
   - **API bearer token**: Paste the JWT from the web app
3. Test queries:
   ```
   Use the hr_get_employees tool to list all employees
   ```

## Service URLs Reference

| Service | Health Check | Main Endpoint |
|---------|--------------|---------------|
| **Web app** | `https://dev.avcd.ai/health` | `https://dev.avcd.ai` |
| **Auth service** | `https://dev.avcd.ai/auth/health` | `https://dev.avcd.ai/auth/google/token` |
| **API** | `https://dev.avcd.ai/api/health` | `https://dev.avcd.ai/api/graphql` |

## Deployment Status

- ✅ Web app: Deployed successfully (April 8, 2026)
- ✅ Auth service: Deployed successfully (April 7, 2026) - **needs database fix**
- ✅ API: Deployed successfully (see DEPLOYMENT_TEST_RESULTS.md)

## Summary

**Immediate Action Required**:
1. Change `AUTH_MONGODB_DATABASE` from `"auth"` to `"avcd"`
2. Redeploy auth service (push triggers auto-deploy)
3. Test login flow on web app
4. Verify JWT token appears on home page

**Expected Time to Fix**: ~5 minutes (variable change + auto-deploy)

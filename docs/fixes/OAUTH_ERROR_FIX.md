# OAuth Error Fix - Google Sign-In Redirect Issue

**Date**: 2026-04-09  
**Error**: Redirects to `https://dev.avcd.ai/api/auth/error` after Google login  
**Status**: 🔴 Configuration Issue

## Root Cause

The Google OAuth application is likely **missing the correct redirect URI** or the wrong OAuth credentials are being used.

## Required Google OAuth Configuration

### Redirect URIs That Must Be Configured

Your Google Cloud Console OAuth 2.0 Client ID **must** have these redirect URIs:

1. **Production**: `https://dev.avcd.ai/api/auth/callback/google` ✅ REQUIRED
2. **Local dev**: `http://localhost:3000/api/auth/callback/google` (optional)

### How to Fix in Google Cloud Console

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project

2. **Find your OAuth 2.0 Client ID**:
   - Look for the client ID that starts with: `434051895633-...`
   - This should match your `WEB_GOOGLE_CLIENT_ID` secret

3. **Edit the OAuth 2.0 Client**:
   - Click on the client ID name
   - Scroll to "Authorized redirect URIs"

4. **Add the redirect URI**:
   ```
   https://dev.avcd.ai/api/auth/callback/google
   ```
   
   **Important**: 
   - Must be **https** (not http)
   - Must include `/api/auth/callback/google` (Auth.js convention)
   - Must match exactly (no trailing slash)

5. **Save** the changes

6. **Wait 5 minutes** for Google to propagate the changes

7. **Test** the login flow again

## Verification Steps

### Step 1: Check Which Client ID Is Being Used

The deployment uses `WEB_GOOGLE_CLIENT_ID` from GitHub secrets. Check if this matches what's in your Google Console:

```bash
cd /Users/genarionogueira/Documents/avcd/web

# This will show when the secret was last updated
gh secret list -e development | grep WEB_GOOGLE_CLIENT_ID
```

Expected: `WEB_GOOGLE_CLIENT_ID	2026-04-07T01:39:02Z`

### Step 2: Verify Deployment Configuration

The web app should be using these values (from GitHub):

| Variable | Source | Expected Value |
|----------|--------|----------------|
| `AUTH_URL` | `WEB_AUTH_URL` variable | `https://dev.avcd.ai` ✅ |
| `GOOGLE_CLIENT_ID` | `WEB_GOOGLE_CLIENT_ID` secret | `434051895633-...` |
| `GOOGLE_CLIENT_SECRET` | `WEB_GOOGLE_CLIENT_SECRET` secret | Hidden |
| `AUTH_SECRET` | `WEB_AUTH_SECRET` secret | Hidden |
| `AVCD_AUTH_URL` | `WEB_AVCD_AUTH_URL` variable | `https://dev.avcd.ai/auth` ✅ |

### Step 3: Enable Debug Logging

To see what's happening during the OAuth flow, enable debug logging:

1. **SSH to the server**:
   ```bash
   ssh root@dev.avcd.ai
   cd /opt/avcd-app
   ```

2. **Add debug flag to .env**:
   ```bash
   echo "AUTH_DEBUG=1" >> .env
   ```

3. **Restart the web service**:
   ```bash
   docker compose restart web
   ```

4. **Watch logs**:
   ```bash
   docker compose logs -f web
   ```

5. **Try logging in** and check the logs for `[avcd:auth-debug]` messages

### Step 4: Check For Common Issues

#### Issue 1: Wrong OAuth Client ID

If you have multiple OAuth clients in Google Console, you might be using the wrong one. The client ID should:
- Start with `434051895633-`
- Be the same in both places:
  1. Google Console → Credentials
  2. GitHub → Secrets → `WEB_GOOGLE_CLIENT_ID`

#### Issue 2: Authorized Domains

In Google Cloud Console, check "OAuth consent screen":
- **Authorized domains** should include: `avcd.ai`

#### Issue 3: App Not Published

If your OAuth consent screen is in "Testing" mode:
- Add your test users' email addresses
- Or publish the app (if ready for production)

## Testing After Fix

### 1. Clear Browser Cookies

Before testing, clear cookies for `dev.avcd.ai`:
1. Open DevTools (F12)
2. Go to Application → Cookies
3. Delete all cookies for `dev.avcd.ai`

### 2. Test OAuth Flow

1. **Go to**: https://dev.avcd.ai
2. **Open DevTools** (F12) → Network tab
3. **Click** "Sign in with Google"
4. **Watch the redirects**:
   - Should go to: `https://accounts.google.com/o/oauth2/v2/auth?...`
   - Then back to: `https://dev.avcd.ai/api/auth/callback/google?...`
   - Finally to: `https://dev.avcd.ai` (home page)

5. **If successful**, you should see:
   - Your name and email
   - An API Access Token section with a JWT

### 3. Check for Errors

If you still get redirected to `/api/auth/error`, check the URL parameters:

```
https://dev.avcd.ai/api/auth/error?error=Configuration
```

Common error types:
- `Configuration` → Missing or invalid OAuth settings
- `AccessDenied` → User cancelled or app not authorized
- `Verification` → Email not verified
- `Callback` → Redirect URI mismatch ← **Most likely**

## Alternative: Create New OAuth Client

If you can't find the existing OAuth client or it's misconfigured, create a new one:

### Create New OAuth 2.0 Client ID

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Click**: "Create Credentials" → "OAuth 2.0 Client ID"
3. **Application type**: Web application
4. **Name**: "AVCD Web (dev.avcd.ai)"
5. **Authorized JavaScript origins**:
   ```
   https://dev.avcd.ai
   ```
6. **Authorized redirect URIs**:
   ```
   https://dev.avcd.ai/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
7. **Click**: Create
8. **Copy** the Client ID and Client Secret

### Update GitHub Secrets

```bash
cd /Users/genarionogueira/Documents/avcd/web

# Update the secrets with your new OAuth credentials
gh secret set WEB_GOOGLE_CLIENT_ID -b "YOUR_NEW_CLIENT_ID" -e development
gh secret set WEB_GOOGLE_CLIENT_SECRET -b "YOUR_NEW_CLIENT_SECRET" -e development
```

### Redeploy

```bash
# Trigger a redeploy
git commit --allow-empty -m "redeploy: test new Google OAuth credentials"
git push origin main

# Wait for deployment to complete (~2 minutes)
gh run watch

# Test the login flow again
```

## Quick Diagnostic Commands

Run these to check the current configuration:

```bash
# Check GitHub variables
cd /Users/genarionogueira/Documents/avcd/web
gh variable list -e development

# Check recent deployments
gh run list --limit 3

# Check if services are healthy
curl -sSf https://dev.avcd.ai/health
curl -sSf https://dev.avcd.ai/auth/health
curl -sSf https://dev.avcd.ai/api/health
```

## Expected Configuration Summary

| Component | Setting | Value |
|-----------|---------|-------|
| **Web App** | AUTH_URL | `https://dev.avcd.ai` |
| **Web App** | AVCD_AUTH_URL | `https://dev.avcd.ai/auth` |
| **Google OAuth** | Redirect URI | `https://dev.avcd.ai/api/auth/callback/google` |
| **Google OAuth** | JavaScript Origin | `https://dev.avcd.ai` |
| **Google OAuth** | Authorized Domain | `avcd.ai` |

## Next Steps

1. ✅ **Verify redirect URI** in Google Console
2. ✅ **Wait 5 minutes** for propagation
3. ✅ **Clear browser cookies**
4. ✅ **Test login** at https://dev.avcd.ai
5. ✅ **Enable debug logging** if still failing
6. ✅ **Check logs** for specific error messages

## Related Files

- [TOKEN_FLOW.md](TOKEN_FLOW.md) - Complete authentication flow
- [LOGIN_FIX_COMPLETE.md](LOGIN_FIX_COMPLETE.md) - Previous database fix
- [auth.ts](auth.ts) - Auth.js configuration
- [docker-compose.yml](docker-compose.yml) - Deployment configuration

# 🔍 Test OAuth with Debug Logging

**Status**: ✅ Debug logging is now enabled on production  
**Deployment**: Completed successfully (2026-04-09 02:02 UTC)

## Quick Test Steps

### 1. Try Signing In

1. **Clear your browser cookies** for `dev.avcd.ai`:
   - Open DevTools (F12)
   - Go to Application → Cookies
   - Delete all cookies for `dev.avcd.ai`

2. **Go to**: https://dev.avcd.ai

3. **Click**: "Sign in with Google"

4. **Observe the result**:
   - ✅ **Success**: You land on the home page with a JWT token displayed
   - ❌ **Still fails**: You get redirected to `/api/auth/error`

### 2. Check Debug Logs (If Still Failing)

The deployed app now has `AUTH_DEBUG=1` enabled, which logs detailed information about the OAuth flow.

#### Option A: View Logs from Your Terminal

```bash
# View the last 50 lines with auth-related messages
ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs --tail=50 web' 2>&1 | grep -E "(avcd:auth|error|Error|OAuth)"
```

#### Option B: Live Tail the Logs

```bash
# Watch logs in real-time (Ctrl+C to stop)
ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs -f web' 2>&1 | grep --line-buffered -E "(avcd:auth|error|Error)"
```

#### Option C: View All Logs

```bash
# See everything (might be verbose)
ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs --tail=100 web'
```

### 3. What to Look For in the Logs

Debug logs will show messages prefixed with `[avcd:auth-debug]`. Look for:

#### At Startup
```
[avcd:auth-debug] instrumentation register(): debug logging is ON
[avcd:auth-debug] process env snapshot {
  NODE_ENV: 'production',
  hasAuthSecret: true,
  AUTH_DEBUG: '1',
  AVCD_AUTH_URL: 'https://dev.avcd.ai/auth'
}
[avcd:auth-debug] NextAuth init {
  hasAuthSecret: true,
  hasGoogleClientId: true,
  hasGoogleClientSecret: true,
  authUrl: 'https://dev.avcd.ai',
  nodeEnv: 'production'
}
```

#### During Sign-In Attempt
```
[avcd:auth-debug] jwt callback {
  trigger: 'signIn',
  accountPresent: true,
  accountIdTokenChars: 1234,
  ...
}
```

#### If Token Exchange Succeeds
```
[avcd:auth-debug] jwt callback: stored avcdAccessJwt; dropped googleIdToken to keep session cookie small {
  avcdAccessJwtChars: 567
}
```

#### If Token Exchange Fails
```
[avcd:auth-debug] jwt callback: issuer exchange failed or AVCD_AUTH_URL unset; keeping googleIdToken
```

## Common Error Patterns

### Error 1: Google Client ID/Secret Mismatch

**Log Message**:
```
Error: Invalid client_id or client_secret
```

**Fix**: The `WEB_GOOGLE_CLIENT_ID` or `WEB_GOOGLE_CLIENT_SECRET` GitHub secrets don't match your Google Console credentials.

```bash
cd /Users/genarionogueira/Documents/avcd/web

# Update with the correct values from Google Console
gh secret set WEB_GOOGLE_CLIENT_ID -b "434051895633-t68apb1lfiui2p9sh6lkhhot4gbl0cb0.apps.googleusercontent.com" -e development
gh secret set WEB_GOOGLE_CLIENT_SECRET -b "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" -e development

# Redeploy
git commit --allow-empty -m "redeploy: update OAuth secrets"
git push origin main
```

### Error 2: Redirect URI Mismatch

**Log Message**:
```
redirect_uri_mismatch
```

**Fix**: Even though you showed the redirect URI is correct in Google Console, it might need time to propagate. Wait 5-10 minutes and try again.

### Error 3: OAuth Consent Screen Issues

**Log Message**:
```
Access blocked: This app's request is invalid
```

**Fix**: Check OAuth consent screen at https://console.cloud.google.com/apis/credentials/consent
- Authorized domains must include: `avcd.ai`
- If in "Testing" mode, add your email to test users

### Error 4: AVCD Auth Service Fails

**Log Message**:
```
[avcd:auth-debug] jwt callback: issuer exchange failed
```

**Fix**: The token exchange with the AVCD auth service failed. Check:

```bash
# Test auth service directly
curl -sSf https://dev.avcd.ai/auth/health

# Expected: {"status":"ok"}
```

If auth service is down, check its logs:
```bash
ssh root@dev.avcd.ai 'cd /home/deploy/avcd-auth && docker compose logs --tail=50 auth'
```

## After You Get It Working

Once the login works successfully, **remove debug logging** for production:

### Option 1: Remove AUTH_DEBUG from Deployment

```bash
cd /Users/genarionogueira/Documents/avcd/web

# Revert the debug change
git revert HEAD --no-edit

# Push to deploy without debug logging
git push origin main
```

### Option 2: Keep It But Comment It Out

Edit `.github/actions/droplet-compose-deploy/render-web-env.py`:

```python
lines = [
    "AUTH_SECRET=" + esc(os.environ["E_AS"]),
    "GOOGLE_CLIENT_ID=" + esc(os.environ["E_GID"]),
    "GOOGLE_CLIENT_SECRET=" + esc(os.environ["E_GSEC"]),
    "AUTH_URL=" + esc(auth_url),
    "AVCD_AUTH_URL=" + esc(avcd),
    # "AUTH_DEBUG=1",  # Commented out - enable when debugging OAuth issues
]
```

## Summary

Your OAuth configuration looks correct:
- ✅ Client ID: `434051895633-t68apb1lfiui2p9sh6lkhhot4gbl0cb0.apps.googleusercontent.com`
- ✅ Redirect URI: `https://dev.avcd.ai/api/auth/callback/google`
- ✅ JavaScript Origins: `https://dev.avcd.ai`
- ✅ Debug logging: Enabled

**Next Steps**:
1. Clear browser cookies
2. Try signing in at https://dev.avcd.ai
3. If it fails, check the debug logs using the commands above
4. Look for the specific error pattern in the logs
5. Apply the appropriate fix

The debug logs will tell us exactly what's failing!

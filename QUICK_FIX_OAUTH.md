# 🔥 Quick Fix for OAuth Error

**Issue**: Clicking "Sign in with Google" redirects to `/api/auth/error`  
**Most Likely Cause**: Missing redirect URI in Google OAuth configuration

## ⚡ Quick Fix (5 minutes)

### Step 1: Add Redirect URI to Google Console

1. **Open Google Cloud Console**:
   - Go to: https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client**:
   - Look for the client ID starting with `434051895633-`
   - Click on its name to edit

3. **Add this redirect URI**:
   ```
   https://dev.avcd.ai/api/auth/callback/google
   ```
   
   **Copy-paste exactly** (including the https and /google at the end)

4. **Save** and wait 5 minutes

5. **Test**: Go to https://dev.avcd.ai and try signing in again

---

## 🔍 If That Doesn't Work

### Enable Debug Logging

Run this script to see what's actually failing:

```bash
cd /Users/genarionogueira/Documents/avcd/web
./enable-debug.sh
```

Then try logging in and check the server logs for the actual error message.

### Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. **Authorized domains** must include: `avcd.ai`
3. If app is in "Testing" mode, add your email to "Test users"

### Verify Redirect URI Format

The redirect URI must be **exactly**:
- ✅ `https://dev.avcd.ai/api/auth/callback/google`
- ❌ `https://dev.avcd.ai/api/auth/callback` (missing /google)
- ❌ `https://dev.avcd.ai/auth/callback/google` (wrong path)
- ❌ `http://dev.avcd.ai/api/auth/callback/google` (http instead of https)

---

## 🎯 What Should Happen

**Correct OAuth Flow**:
1. Click "Sign in with Google" on https://dev.avcd.ai
2. Redirect to `accounts.google.com` (Google sign-in page)
3. Choose your Google account
4. Redirect back to `https://dev.avcd.ai/api/auth/callback/google?code=...`
5. Land on https://dev.avcd.ai home page
6. **See your JWT token** displayed on the page ✅

**Current (Broken) Flow**:
1. Click "Sign in with Google"
2. Redirect to Google ✅
3. Redirect back but to **error page** ❌
4. End up at `https://dev.avcd.ai/api/auth/error`

---

## 📋 Full Checklist

- [ ] Google OAuth redirect URI includes: `https://dev.avcd.ai/api/auth/callback/google`
- [ ] OAuth consent screen has authorized domain: `avcd.ai`
- [ ] Waited 5 minutes after saving Google Console changes
- [ ] Cleared browser cookies for `dev.avcd.ai`
- [ ] Tried signing in again
- [ ] If still failing: Enabled debug logging with `./enable-debug.sh`
- [ ] If still failing: Read [OAUTH_ERROR_FIX.md](OAUTH_ERROR_FIX.md) for detailed troubleshooting

---

## 🆘 Need More Help?

See the full troubleshooting guide: [OAUTH_ERROR_FIX.md](OAUTH_ERROR_FIX.md)

Or contact the team with:
- The URL you're redirected to (check for `?error=...` parameters)
- Screenshot of the error page
- Output from debug logs if you enabled them

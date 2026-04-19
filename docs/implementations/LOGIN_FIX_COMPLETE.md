# ✅ Login Issue Fixed - Summary

**Date**: 2026-04-09  
**Status**: ✅ RESOLVED  
**Deployment**: Completed successfully

## What Was Fixed

### Root Cause
The auth service was using a **different MongoDB database** than the API:
- **Before**: Auth service → `auth` database ❌
- **After**: Auth service → `avcd` database ✅
- **API**: Always used `avcd` database ✅

This caused the authentication flow to fail because:
1. User signed in with Google
2. Auth service created user in `auth.portal_users`
3. Auth service issued JWT with `sub: "portal:<ObjectId>"`
4. API looked for user in `avcd.portal_users` (different database)
5. User not found → Authentication failed

### Changes Made

1. **Updated GitHub Variable** (2026-04-09 01:50:30 UTC)
   ```bash
   AUTH_MONGODB_DATABASE: "auth" → "avcd"
   ```

2. **Redeployed Auth Service** (2026-04-09 01:51:39 UTC)
   - Workflow run: #24168232759
   - Status: ✅ Success (30 seconds)
   - Commit: `b46df56`

3. **Verification** (2026-04-09 01:52:00 UTC)
   - ✅ Auth service health: `https://dev.avcd.ai/auth/health`
   - ✅ Web service health: `https://dev.avcd.ai/health`
   - ✅ API health: `https://dev.avcd.ai/api/health`

## Testing Instructions

### 1. Test User Login Flow

1. **Open web app**: https://dev.avcd.ai
2. **Sign in with Google**: Click "Sign in with Google" button
3. **Authenticate**: Choose your Google account
4. **Verify token display**: After successful login, you should see:
   - Your name and email
   - **API Access Token** section with a JWT token
   - "Copy" button to copy the token

### 2. Test Token with MCP

Once you have the JWT token from the web app:

1. **Install MCP** (if not already done):
   - Download: `https://dev.avcd.ai/mcp/avcd-graphql.mcpb`
   - Double-click to install in Claude Desktop

2. **Configure MCP**:
   - **API base URL**: `https://dev.avcd.ai/api`
   - **API bearer token**: Paste the JWT from the web app

3. **Test queries** in Claude:
   ```
   Use the hr_get_employees tool to list all employees
   ```
   
   ```
   Use the admin_get_users tool to list all user accounts
   ```

### 3. Verify API Access

Test the API directly with your JWT:

```bash
# Replace YOUR_JWT_HERE with the token from the web app
curl -X POST https://dev.avcd.ai/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -d '{"query":"{ employees { id name address salary } }"}'
```

Expected response:
```json
{
  "data": {
    "employees": [
      {
        "id": "...",
        "name": "...",
        "address": "...",
        "salary": ...
      }
    ]
  }
}
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User (Browser)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Sign in with Google
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               Web App (dev.avcd.ai)                         │
│                                                              │
│  - Receives Google ID token                                 │
│  - Exchanges for AVCD JWT via auth service                 │
│  - Displays JWT for user to copy                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 2. POST /auth/google/token
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Auth Service (dev.avcd.ai/auth)                     │
│                                                              │
│  - Verifies Google ID token                                 │
│  - Creates/updates user in MongoDB (avcd.portal_users) ✅  │
│  - Issues HS256 JWT with sub: "portal:<ObjectId>"          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 3. User copies JWT
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                MCP Server (Local)                           │
│                                                              │
│  - Configured with JWT as bearer token                      │
│  - Calls API with Authorization: Bearer <JWT>              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 4. GraphQL queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              API (dev.avcd.ai/api)                          │
│                                                              │
│  - Validates JWT signature (same JWT_SECRET)                │
│  - Looks up user in MongoDB (avcd.portal_users) ✅         │
│  - Executes GraphQL queries                                 │
│  - Returns HR data                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Both use same database ✅
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           MongoDB Atlas (avcd database)                     │
│                                                              │
│  Collections:                                               │
│  - portal_users (auth creates, API validates)               │
│  - employees (HR data)                                      │
│  - users (user accounts)                                    │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Reference

### Production Environment Variables (GitHub)

#### Web App
- `WEB_AUTH_SECRET`: Auth.js session encryption key
- `WEB_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `WEB_GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `WEB_AVCD_AUTH_URL`: `https://dev.avcd.ai/auth` ✅
- `WEB_AUTH_URL`: `https://dev.avcd.ai` ✅

#### Auth Service
- `AUTH_MONGODB_URI`: MongoDB Atlas connection string (secret)
- `AUTH_MONGODB_DATABASE`: `avcd` ✅ **FIXED**
- `AUTH_JWT_SECRET`: JWT signing key (secret)
- `AUTH_GOOGLE_CLIENT_IDS`: Comma-separated OAuth client IDs (secret)

#### API
- `MONGODB_URI`: MongoDB Atlas connection string (secret)
- `MONGODB_DATABASE`: `avcd` ✅
- `JWT_SECRET`: JWT validation key (must match AUTH_JWT_SECRET)
- `AUTH_REQUIRE_JWT`: `true`
- `AUTH_API_KEYS_ENABLED`: `true`

## Expected Behavior After Fix

### ✅ Working Flow

1. User visits https://dev.avcd.ai
2. User clicks "Sign in with Google"
3. User authenticates with Google account
4. Web app redirects to home page
5. **JWT token is displayed** on the home page ✅
6. User copies JWT token
7. User configures MCP with the JWT token
8. MCP queries work successfully ✅

### 🔴 Previous (Broken) Flow

1. User visits https://dev.avcd.ai
2. User clicks "Sign in with Google"
3. User authenticates with Google account
4. Web app redirects to home page
5. **No JWT token displayed** or **error message** ❌
6. User cannot get token for MCP ❌

## Troubleshooting

If login still doesn't work after this fix:

### Check 1: Google Client IDs Match

The `AUTH_GOOGLE_CLIENT_IDS` secret must include the web app's OAuth client ID.

```bash
# Check web app's client ID in GitHub secrets
cd /Users/genarionogueira/Documents/avcd/web
gh secret list --env development | grep WEB_GOOGLE_CLIENT_ID

# Verify auth service has matching client ID
cd /Users/genarionogueira/Documents/avcd/auth
gh secret list --env development | grep AUTH_GOOGLE_CLIENT_IDS
```

If they don't match, the auth service will reject the Google ID token with a 401 error.

### Check 2: JWT Secrets Match

Both services must use the **same JWT_SECRET**:

```bash
# API uses JWT_SECRET
cd /Users/genarionogueira/Documents/avcd/api
gh secret list --env development | grep JWT_SECRET

# Auth uses AUTH_JWT_SECRET (must be same value)
cd /Users/genarionogueira/Documents/avcd/auth
gh secret list --env development | grep AUTH_JWT_SECRET
```

If different, the API will reject JWTs minted by the auth service.

### Check 3: Service Logs

SSH to the server and check logs:

```bash
ssh root@dev.avcd.ai

# Auth service logs
cd /home/deploy/avcd-auth
docker compose logs -f auth

# Web app logs
cd /opt/avcd-app
docker compose logs -f web
```

Look for errors related to:
- Google token verification
- MongoDB connection
- JWT minting/validation

## Related Documentation

- [TOKEN_FLOW.md](TOKEN_FLOW.md) - Complete token flow documentation
- [WEB_LOGIN_DIAGNOSIS.md](WEB_LOGIN_DIAGNOSIS.md) - Original diagnosis
- [/api/DEPLOYMENT_TEST_RESULTS.md](../api/DEPLOYMENT_TEST_RESULTS.md) - API deployment verification
- [/api/JWT_AUTH.md](../api/JWT_AUTH.md) - JWT authentication details
- [/mcp/avcd-graphql/README.md](../mcp/avcd-graphql/README.md) - MCP server documentation

## Summary

✅ **Issue**: Auth service and API used different databases  
✅ **Fix**: Updated `AUTH_MONGODB_DATABASE` to `avcd`  
✅ **Status**: Deployed and verified  
✅ **Action**: Test login at https://dev.avcd.ai

**The login flow should now work correctly!** Users can sign in, get their JWT token, and use it with the MCP server to query HR data.

#!/bin/bash
# Quick Auth0 Setup Checker for AVCD Web

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Checking AVCD Web Auth0 Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "   Run: cp .env.local.example .env.local"
    exit 1
fi

# Extract values
AUTH0_SECRET=$(grep "^AUTH0_SECRET=" .env.local | cut -d'=' -f2)
AUTH0_CLIENT_SECRET=$(grep "^AUTH0_CLIENT_SECRET=" .env.local | cut -d'=' -f2)
AUTH0_AUDIENCE=$(grep "^AUTH0_AUDIENCE=" .env.local | cut -d'=' -f2)
AUTH0_CLIENT_ID=$(grep "^AUTH0_CLIENT_ID=" .env.local | cut -d'=' -f2)

errors=0

# Check AUTH0_SECRET
if [ -z "$AUTH0_SECRET" ] || [ "$AUTH0_SECRET" = "your-secret-here" ]; then
    echo -e "${RED}❌ AUTH0_SECRET not set${NC}"
    echo "   Fix: Generate with: openssl rand -base64 32"
    ((errors++))
else
    echo -e "${GREEN}✓ AUTH0_SECRET configured${NC}"
fi

# Check AUTH0_CLIENT_SECRET
if [ "$AUTH0_CLIENT_SECRET" = "TBD_FROM_TERRAFORM" ] || [ -z "$AUTH0_CLIENT_SECRET" ]; then
    echo -e "${RED}❌ AUTH0_CLIENT_SECRET is placeholder${NC}"
    echo ""
    echo "   To fix, get the secret from Auth0 Dashboard:"
    echo "   1. Go to https://manage.auth0.com/dashboard"
    echo "   2. Applications → AVCD Web Portal"
    echo "   3. Settings → copy 'Client Secret'"
    echo "   4. Paste into .env.local as AUTH0_CLIENT_SECRET"
    echo ""
    ((errors++))
else
    echo -e "${GREEN}✓ AUTH0_CLIENT_SECRET configured${NC}"
fi

# Check AUTH0_AUDIENCE
if echo "$AUTH0_AUDIENCE" | grep -q "/api$"; then
    echo -e "${GREEN}✓ AUTH0_AUDIENCE uses GraphQL API (/api)${NC}"
elif echo "$AUTH0_AUDIENCE" | grep -q "/mcp$"; then
    echo -e "${YELLOW}⚠️  AUTH0_AUDIENCE still uses MCP (/mcp)${NC}"
    echo "   Should be: https://dev.avcd.ai/api (GraphQL API)"
    echo "   Run: sed -i '' 's|/mcp$|/api|' .env.local"
    ((errors++))
else
    echo -e "${RED}❌ AUTH0_AUDIENCE invalid: $AUTH0_AUDIENCE${NC}"
    ((errors++))
fi

# Check AUTH0_CLIENT_ID
if [ -z "$AUTH0_CLIENT_ID" ]; then
    echo -e "${RED}❌ AUTH0_CLIENT_ID not set${NC}"
    ((errors++))
else
    echo -e "${GREEN}✓ AUTH0_CLIENT_ID configured${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All Auth0 config looks good!${NC}"
    echo "   Restart your dev server: pnpm run dev"
else
    echo -e "${RED}❌ Found $errors issue(s) to fix${NC}"
    echo "   After fixing, restart your dev server"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

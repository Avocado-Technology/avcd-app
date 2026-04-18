#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Verify Auth0 Localhost Setup
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# This script verifies that Auth0 is properly configured for localhost development.
# It checks:
#   - Required environment variables are set
#   - Values are not placeholders
#   - Auth0 secret meets minimum requirements
#   - URLs are configured for localhost
#
# Usage:
#   cd web/
#   ./scripts/verify-auth0-setup.sh
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_LOCAL="$WEB_DIR/.env.local"

ERRORS=0
WARNINGS=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Auth0 Localhost Setup Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if .env.local exists
if [ ! -f "$ENV_LOCAL" ]; then
    echo -e "${RED}✗ .env.local not found${NC}"
    echo "  Location: $ENV_LOCAL"
    echo "  Run: cp .env.example .env.local"
    exit 1
fi
echo -e "${GREEN}✓${NC} .env.local exists"

# Load .env.local
set -a
source "$ENV_LOCAL"
set +a

# Check required Auth0 variables
echo
echo "Checking Auth0 Configuration..."
echo

# AUTH0_SECRET
if [ -z "$AUTH0_SECRET" ]; then
    echo -e "${RED}✗ AUTH0_SECRET not set${NC}"
    echo "  Generate with: openssl rand -base64 32"
    ERRORS=$((ERRORS + 1))
elif [ ${#AUTH0_SECRET} -lt 32 ]; then
    echo -e "${RED}✗ AUTH0_SECRET too short (${#AUTH0_SECRET} chars, need 32+)${NC}"
    echo "  Generate with: openssl rand -base64 32"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_SECRET is set (${#AUTH0_SECRET} characters)"
fi

# AUTH0_BASE_URL
if [ -z "$AUTH0_BASE_URL" ]; then
    echo -e "${RED}✗ AUTH0_BASE_URL not set${NC}"
    ERRORS=$((ERRORS + 1))
elif [[ ! "$AUTH0_BASE_URL" =~ ^http://localhost:3000 ]]; then
    echo -e "${YELLOW}⚠${NC} AUTH0_BASE_URL not set to localhost: $AUTH0_BASE_URL"
    echo "  Expected: http://localhost:3000"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_BASE_URL: $AUTH0_BASE_URL"
fi

# AUTH0_ISSUER_BASE_URL
if [ -z "$AUTH0_ISSUER_BASE_URL" ]; then
    echo -e "${RED}✗ AUTH0_ISSUER_BASE_URL not set${NC}"
    ERRORS=$((ERRORS + 1))
elif [[ "$AUTH0_ISSUER_BASE_URL" == *"your-tenant"* ]] || [[ "$AUTH0_ISSUER_BASE_URL" == *"placeholder"* ]]; then
    echo -e "${RED}✗ AUTH0_ISSUER_BASE_URL is a placeholder: $AUTH0_ISSUER_BASE_URL${NC}"
    echo "  Expected: https://avcdtech.us.auth0.com"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_ISSUER_BASE_URL: $AUTH0_ISSUER_BASE_URL"
fi

# AUTH0_CLIENT_ID
if [ -z "$AUTH0_CLIENT_ID" ]; then
    echo -e "${RED}✗ AUTH0_CLIENT_ID not set${NC}"
    echo "  Run: cd ../infra && ./scripts/update-web-env.sh"
    ERRORS=$((ERRORS + 1))
elif [[ "$AUTH0_CLIENT_ID" == *"TBD"* ]] || [[ "$AUTH0_CLIENT_ID" == *"placeholder"* ]]; then
    echo -e "${RED}✗ AUTH0_CLIENT_ID is a placeholder: $AUTH0_CLIENT_ID${NC}"
    echo "  Run: cd ../infra && ./scripts/update-web-env.sh"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_CLIENT_ID: ${AUTH0_CLIENT_ID:0:20}..."
fi

# AUTH0_CLIENT_SECRET
if [ -z "$AUTH0_CLIENT_SECRET" ]; then
    echo -e "${RED}✗ AUTH0_CLIENT_SECRET not set${NC}"
    echo "  Run: cd ../infra && ./scripts/update-web-env.sh"
    ERRORS=$((ERRORS + 1))
elif [[ "$AUTH0_CLIENT_SECRET" == *"TBD"* ]] || [[ "$AUTH0_CLIENT_SECRET" == *"placeholder"* ]]; then
    echo -e "${RED}✗ AUTH0_CLIENT_SECRET is a placeholder: $AUTH0_CLIENT_SECRET${NC}"
    echo "  Run: cd ../infra && ./scripts/update-web-env.sh"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_CLIENT_SECRET: ${AUTH0_CLIENT_SECRET:0:20}..."
fi

# AUTH0_AUDIENCE
if [ -z "$AUTH0_AUDIENCE" ]; then
    echo -e "${RED}✗ AUTH0_AUDIENCE not set${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_AUDIENCE: $AUTH0_AUDIENCE"
fi

# AUTH0_SCOPE
if [ -z "$AUTH0_SCOPE" ]; then
    echo -e "${YELLOW}⚠${NC} AUTH0_SCOPE not set (will use default)"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} AUTH0_SCOPE: $AUTH0_SCOPE"
fi

# NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID
echo
echo "Checking MCP Configuration..."
echo

if [ -z "$NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID" ]; then
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID not set"
    echo "  This is needed to display MCP setup instructions to users"
    WARNINGS=$((WARNINGS + 1))
elif [[ "$NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID" == *"TBD"* ]] || [[ "$NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID" == *"placeholder"* ]]; then
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID is a placeholder"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID: $NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID"
fi

# Check API URLs
echo
echo "Checking API Configuration..."
echo

if [ -z "$NEXT_PUBLIC_AVCD_API_URL" ]; then
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_AVCD_API_URL not set"
    WARNINGS=$((WARNINGS + 1))
elif [[ "$NEXT_PUBLIC_AVCD_API_URL" =~ ^http://(localhost|127\.0\.0\.1):8000 ]]; then
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_AVCD_API_URL: $NEXT_PUBLIC_AVCD_API_URL (localhost)"
else
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_AVCD_API_URL: $NEXT_PUBLIC_AVCD_API_URL"
fi

# Summary
echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo
    echo "Your Auth0 configuration is ready for localhost development."
    echo
    echo "Next steps:"
    echo "  docker-compose up -d web"
    echo "  open http://localhost:3000"
    echo
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo
    echo "Your Auth0 configuration should work, but some optional settings are missing."
    echo
    echo "You can proceed with:"
    echo "  docker-compose up -d web"
    echo "  open http://localhost:3000"
    echo
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo
    echo "Please fix the errors above before starting the web app."
    echo
    echo "Common fixes:"
    echo "  1. Run: cd ../infra && ./scripts/update-web-env.sh"
    echo "  2. Generate secret: openssl rand -base64 32"
    echo "  3. Check: AUTH0_LOCALHOST_SETUP.md"
    echo
    exit 1
fi

# Manual Auth0 Dashboard reminder
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠ REMINDER: Manual Auth0 Dashboard Configuration${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo "These 2 settings must be enabled manually in Auth0 Dashboard:"
echo
echo "  1. Resource Parameter Compatibility Profile"
echo "  2. Enable Application Connections"
echo
echo "Location: https://manage.auth0.com/dashboard"
echo "Path: Settings → Advanced → OAuth"
echo
echo "Without these settings, authentication will fail with 'Service not found' errors."
echo
echo "See: ../infra/CRITICAL_MANUAL_SETUP_REQUIRED.md"
echo

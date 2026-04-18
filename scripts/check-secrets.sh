#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Check for Accidentally Committed Secrets
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# This script checks for common secret patterns in tracked files to prevent
# accidental commits of sensitive information.
#
# Usage:
#   cd web/
#   ./scripts/check-secrets.sh
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$WEB_DIR"

ISSUES_FOUND=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Security Check: Scanning for Secrets in Git${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check 1: Verify sensitive files are ignored
echo "Checking .gitignore configuration..."
echo

SENSITIVE_FILES=(
    ".env"
    ".env.local"
    ".env.dev"
    ".env.production"
    "GET_CLIENT_SECRET.md"
)

for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        if git check-ignore -q "$file"; then
            echo -e "${GREEN}✓${NC} $file is properly ignored"
        else
            echo -e "${RED}✗${NC} $file exists but is NOT ignored!"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    fi
done

echo

# Check 2: Scan tracked files for secret patterns
echo "Scanning tracked files for secret patterns..."
echo

# Patterns to search for (common secret indicators)
SECRET_PATTERNS=(
    "AUTH0_CLIENT_SECRET=[^T][^B][^D]"  # Not TBD_FROM_TERRAFORM
    "GOOGLE_CLIENT_SECRET=GOCSPX-"
    "DIGITALOCEAN_TOKEN="
    "AWS_SECRET_ACCESS_KEY="
    "SPACES_SECRET_ACCESS_KEY="
    "mongodb\+srv://.*:[^@]+@"
    "postgres://.*:[^@]+@"
    "redis://.*:[^@]+@"
    "Bearer [A-Za-z0-9_-]{20,}"
    "sk_live_[A-Za-z0-9]{20,}"
    "-----BEGIN PRIVATE KEY-----"
    "-----BEGIN RSA PRIVATE KEY-----"
)

# Get list of tracked files (excluding node_modules, .next, etc.)
TRACKED_FILES=$(git ls-files | grep -v -E "node_modules|\.next|build|coverage|\.lock|package-lock\.json")

for pattern in "${SECRET_PATTERNS[@]}"; do
    MATCHES=$(echo "$TRACKED_FILES" | xargs grep -l -E "$pattern" 2>/dev/null || true)
    
    if [ -n "$MATCHES" ]; then
        echo -e "${RED}✗ Found potential secret pattern: $pattern${NC}"
        echo "$MATCHES" | while read -r file; do
            echo -e "  ${YELLOW}→${NC} $file"
        done
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        echo
    fi
done

# Check 3: Verify .env.example doesn't contain real secrets
echo "Checking .env.example for placeholder values..."
echo

if [ -f ".env.example" ]; then
    REAL_SECRETS=$(grep -E "AUTH0_CLIENT_SECRET=[^<]|GOOGLE_CLIENT_SECRET=GOCSPX-|CLIENT_SECRET=[^<]" .env.example || true)
    
    if [ -n "$REAL_SECRETS" ]; then
        echo -e "${RED}✗ .env.example contains what looks like real secrets!${NC}"
        echo "$REAL_SECRETS"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo -e "${GREEN}✓${NC} .env.example only contains placeholder values"
    fi
else
    echo -e "${YELLOW}⚠${NC} .env.example not found"
fi

echo

# Check 4: Verify no .env files are staged
echo "Checking staged files..."
echo

STAGED_ENV_FILES=$(git diff --cached --name-only | grep -E "^\.env$|^\.env\.local$|^\.env\.dev$|^\.env\.prod$" || true)

if [ -n "$STAGED_ENV_FILES" ]; then
    echo -e "${RED}✗ Environment files are staged for commit!${NC}"
    echo "$STAGED_ENV_FILES" | while read -r file; do
        echo -e "  ${YELLOW}→${NC} $file"
    done
    echo
    echo "Run: git reset HEAD <file> to unstage"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓${NC} No sensitive environment files staged"
fi

echo

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ No security issues found!${NC}"
    echo
    echo "Your repository appears to be free of common secret leaks."
    echo
    exit 0
else
    echo -e "${RED}✗ $ISSUES_FOUND security issue(s) found${NC}"
    echo
    echo "Please review and fix the issues above before committing."
    echo
    echo "If you've already committed secrets:"
    echo "  1. Remove them from the files"
    echo "  2. Rotate the secrets (generate new ones)"
    echo "  3. Use git filter-branch or BFG Repo-Cleaner to remove from history"
    echo "  4. Force push (if needed and safe to do so)"
    echo
    exit 1
fi

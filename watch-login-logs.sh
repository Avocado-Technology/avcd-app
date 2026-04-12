#!/bin/bash
# Watch login logs in real-time
# Run this in one terminal, then try signing in from your browser

echo "🔍 Watching web logs in real-time..."
echo "📱 NOW: Open https://dev.avcd.ai in incognito mode and try signing in with Google"
echo "📋 This terminal will show what happens during the OAuth flow"
echo ""
echo "Press Ctrl+C to stop watching"
echo ""
echo "=========================================="
echo ""

ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs -f --tail=0 web' 2>&1 | grep --line-buffered -E "(avcd:auth|error|Error|GET /api/auth|POST /api/auth|callback)"

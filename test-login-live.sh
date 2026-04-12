#!/bin/bash
# Watch logs in real-time and test login
echo "🔍 Starting live log monitoring..."
echo ""
echo "📱 NOW: Try signing in at https://dev.avcd.ai"
echo "   1. Open https://dev.avcd.ai in incognito"
echo "   2. Click 'Sign in with Google'"
echo "   3. Watch the output below"
echo ""
echo "Press Ctrl+C to stop"
echo "=========================================="
echo ""

ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs -f --tail=5 web'

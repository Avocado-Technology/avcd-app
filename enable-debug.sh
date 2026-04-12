#!/bin/bash
# Enable Auth.js debug logging on the deployed web app
# Usage: ./enable-debug.sh

set -euo pipefail

echo "🔍 Enabling AUTH_DEBUG on dev.avcd.ai..."

# SSH to the server and enable debug logging
ssh root@dev.avcd.ai <<'REMOTE_SCRIPT'
set -euo pipefail

cd /opt/avcd-app

# Add AUTH_DEBUG to .env if not already present
if ! grep -q "AUTH_DEBUG" .env 2>/dev/null; then
    echo "AUTH_DEBUG=1" >> .env
    echo "✅ Added AUTH_DEBUG=1 to .env"
else
    # Update existing AUTH_DEBUG line
    sed -i 's/^AUTH_DEBUG=.*/AUTH_DEBUG=1/' .env
    echo "✅ Updated AUTH_DEBUG=1 in .env"
fi

echo ""
echo "📋 Current .env (AUTH_DEBUG line):"
grep AUTH_DEBUG .env || echo "(not found)"

echo ""
echo "🔄 Restarting web service..."
docker compose restart web

echo ""
echo "⏳ Waiting 5 seconds for service to start..."
sleep 5

echo ""
echo "📊 Web service status:"
docker compose ps web

echo ""
echo "✅ Debug logging enabled!"
echo ""
echo "📝 To view logs, run:"
echo "   ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs -f web'"
echo ""
echo "🧪 Now try signing in at: https://dev.avcd.ai"
echo "   Watch for [avcd:auth-debug] messages in the logs"

REMOTE_SCRIPT

echo ""
echo "🎯 Quick test from your local machine:"
echo "   Open: https://dev.avcd.ai"
echo "   Click: Sign in with Google"
echo ""
echo "📡 To watch logs in real-time:"
echo "   ssh root@dev.avcd.ai 'cd /opt/avcd-app && docker compose logs -f web | grep -E \"(avcd:auth|error|Error)\"'"

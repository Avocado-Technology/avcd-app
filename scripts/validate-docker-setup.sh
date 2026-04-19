#!/bin/bash
# Comprehensive validation of Docker setup

set -e

echo "🔍 Validating Docker Setup..."

# Check files exist
echo "📁 Checking file structure..."
test -f Dockerfile || { echo "❌ Dockerfile missing"; exit 1; }
test -f Dockerfile.dev || { echo "❌ Dockerfile.dev missing"; exit 1; }
test -f docker-compose.yml || { echo "❌ docker-compose.yml missing"; exit 1; }
test -f deploy/production/docker-compose.yml || { echo "❌ Production compose missing"; exit 1; }

# Validate development setup
echo "🛠️  Validating development setup..."
grep -q "Dockerfile.dev" docker-compose.yml || { echo "❌ Dev compose not using Dockerfile.dev"; exit 1; }
grep -q "WATCHPACK_POLLING" docker-compose.yml || { echo "❌ WATCHPACK_POLLING not set"; exit 1; }
grep -q "volumes:" docker-compose.yml || { echo "❌ No volumes in dev compose"; exit 1; }
grep -q '"npm", "run", "dev"' Dockerfile.dev || { echo "❌ Dev Dockerfile not using npm run dev"; exit 1; }

# Validate production setup
echo "🚀 Validating production setup..."
grep -q "traefik.enable=true" deploy/production/docker-compose.yml || { echo "❌ Traefik not enabled"; exit 1; }
grep -q "PUBLIC_HOST" deploy/production/docker-compose.yml || { echo "❌ PUBLIC_HOST not required"; exit 1; }
grep -q "avcd_edge" deploy/production/docker-compose.yml || { echo "❌ Not joining avcd_edge network"; exit 1; }

# Ensure dev doesn't have production labels
echo "🔒 Checking separation of concerns..."
if grep -q "traefik" docker-compose.yml; then
  echo "❌ Dev compose should not have Traefik labels"
  exit 1
fi

# Validate build context in production
echo "🔧 Validating production build context..."
grep -q "context: \.\./\.\." deploy/production/docker-compose.yml || { echo "❌ Build context not set to ../.."; exit 1; }

# Validate GitHub Actions workflows
echo "🔄 Validating GitHub Actions workflows..."
grep -q 'compose_subdirectory: "deploy/production"' .github/workflows/deploy-digitalocean-dev.yml || { echo "❌ Dev workflow not updated"; exit 1; }
grep -q 'compose_subdirectory: "deploy/production"' .github/workflows/deploy-digitalocean-prod.yml || { echo "❌ Prod workflow not updated"; exit 1; }
grep -q "deploy/production/\*\*" .github/workflows/deploy-digitalocean-dev.yml || { echo "❌ Workflow paths not updated"; exit 1; }

echo "✅ All validations passed!"

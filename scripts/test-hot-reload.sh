#!/bin/bash
# Test hot reload functionality in Docker

set -e

echo "🧪 Testing Hot Reload in Docker..."

# Start container
docker compose up -d

# Wait for container to be ready with health check
echo "Waiting for container..."
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Container ready!"
    break
  fi
  sleep 1
done

# Check if container is running
if ! docker compose ps | grep -q "running"; then
  echo "❌ Container not running"
  docker compose logs
  exit 1
fi

# Create a test file change
echo "Creating test file change..."
echo "export default function Test() { return <div>Hot Reload Works!</div> }" > app/test-hot-reload-marker.tsx

# Wait for Next.js to detect change
sleep 3

# Check logs for compilation
if docker compose logs | grep -q "Compiled"; then
  echo "✅ Hot reload detected file change"
else
  echo "❌ Hot reload not working"
  docker compose logs
  rm -f app/test-hot-reload-marker.tsx
  docker compose down
  exit 1
fi

# Cleanup
rm -f app/test-hot-reload-marker.tsx
docker compose down

echo "✅ Hot reload test passed!"

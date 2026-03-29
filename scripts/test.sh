#!/bin/bash
set -e

API_BASE="${API_BASE:-http://localhost:8080/api}"

echo "Testing AI Documentation Assistant..."

echo "1) Testing ${API_BASE}/health"
code=$(curl -s -o /dev/null -w "%{http_code}" "${API_BASE}/health")
if [ "$code" = "200" ]; then
  echo "✓ Health check passed"
else
  echo "✗ Health check failed: $code"
fi

echo "2) Testing ${API_BASE}/search"
curl -s -X POST "${API_BASE}/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"test query","limit":3}' >/dev/null
echo "✓ Search request sent"

echo "Done."


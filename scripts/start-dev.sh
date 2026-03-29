#!/bin/bash
set -e

echo "Starting local dev stack..."

echo "1) Starting Postgres (pgvector) ..."
docker-compose -f docker/docker-compose.yml up -d

echo "2) Applying migrations ..."
(cd backend && go run cmd/migrate/main.go)

echo "3) Starting backend ..."
(cd backend && go run cmd/server/main.go) &
BACKEND_PID=$!

echo "4) Starting frontend ..."
(cd frontend && npm run dev -- --port 5173) &
FRONTEND_PID=$!

trap 'echo "Stopping..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; docker-compose -f docker/docker-compose.yml down' EXIT

wait


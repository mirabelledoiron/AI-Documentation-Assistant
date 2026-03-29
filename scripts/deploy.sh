#!/bin/bash

set -e

echo "🚀 Deploying AI Documentation Assistant..."

# Build backend
echo "📦 Building backend..."
cd backend
make build
docker build -t ai-doc-assistant-backend:latest .
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
make build
docker build -t ai-doc-assistant-frontend:latest .
cd ..

# Deploy with docker-compose
echo "🐳 Deploying with Docker Compose..."
cd docker
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!"
echo ""
echo "Services are running:"
echo "- Backend: http://localhost:8080"
echo "- Frontend: http://localhost:80"
echo "- Health check: http://localhost:8080/health"

#!/bin/bash
# scripts/setup.sh

echo "Setting up AI-Powered Documentation Assistant..."

# Create necessary directories
mkdir -p backend/logs
mkdir -p frontend/logs

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Copy environment files
if [ ! -f backend/.env ]; then
    echo "Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "Please edit backend/.env with your OpenAI API key"
fi

if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend environment file..."
    cat > frontend/.env.local <<EOF
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
EOF
fi

# Start database only
echo "Starting Postgres (pgvector)..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

echo ""
echo "Setup complete!"
echo ""
echo "Next:"
echo "  1) cd backend && go run cmd/migrate/main.go"
echo "  2) cd backend && go run cmd/server/main.go"
echo "  3) cd frontend && npm install && npm run dev"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080"
echo ""
echo "To stop the services:"
echo "  docker-compose -f docker/docker-compose.yml down"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker/docker-compose.yml logs -f"

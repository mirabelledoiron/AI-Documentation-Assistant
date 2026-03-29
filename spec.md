# AI Documentation Assistant - Complete Specification

## Project Structure

```bash
ai-documentation-assistant/
├── .gitignore
├── README.md
├── Makefile
├── docker/
│   ├── docker-compose.yml
│   └── postgres/
│       └── init.sql
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers.go
│   │   │   └── middleware.go
│   │   ├── models/
│   │   │   └── models.go
│   │   ├── services/
│   │   │   ├── embeddings.go
│   │   │   ├── search.go
│   │   │   └── chat.go
│   │   └── database/
│   │       └── database.go
│   ├── go.mod
│   ├── go.sum
│   ├── .env.example
│   └── Dockerfile
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── components/
    │   │   ├── ChatInterface.tsx
    │   │   ├── SearchInterface.tsx
    │   │   └── Admin/
    │   │       └── DocumentUpload.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── styles/
    │       └── globals.css
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── vite.config.ts
    └── Dockerfile
```

## Technology Stack

- Backend: Go 1.21 + Gin + GORM + pgvector + OpenAI API
- Frontend: React 18 + TypeScript + Tailwind CSS + Vite
- Database: PostgreSQL with pgvector extension
- Container: Docker + Docker Compose

## Root Node tooling vs `frontend/` (how to know which you use)

This repo contains **two** `package.json` files:

- **`frontend/package.json` (the real web app)**:
  - This is the React/Vite UI you open in the browser.
  - You use it when you run commands **inside `frontend/`**:
    - `cd frontend && npm run dev`
    - `cd frontend && npm test`
    - `cd frontend && npm run build`

- **Root `package.json` (optional tooling / separate Vite app)**:
  - This is only for **repo-level tooling** (sometimes Storybook, linting, a separate demo app, etc).
  - You use it when you run commands **from the repo root**:
    - `cd . && npm run dev`
    - `cd . && npm run build`

### How to know if you will use the root Vite app

You will use the root Vite app **only if** you intentionally run root scripts and expect a site to appear:

1. **Try this** (repo root):
   - `npm run dev`
   - If it serves a page and you care about that page, you’re using the root Vite app.

2. **If you only ever do**:
   - `cd frontend && npm run dev`
   - then the root Vite app is **not required** for local development.

### Can the root Node tooling be removed later?

Yes, **if** all of these are true:
- You never run `npm` commands from the repo root
- CI doesn’t run root Node scripts
- You don’t rely on root Storybook / root lint config

If you’re unsure: keep it. It’s safe because it’s `"private": true`.

## Key Features

1. Natural Language Search (semantic search)
2. AI Chat with RAG (Retrieval-Augmented Generation)
3. Real-time streaming responses
4. Document management interface
5. Source citations in responses

## How to Continue in Cursor:

1. Create the folder structure above
2. Use @ references in Cursor to ask about specific files
3. Use "Cmd+Shift+L" to open chat with specific context
4. Mention "following spec.md" in your prompts

## Local Development Setup & Testing Guide

### 1. Prerequisites Installation

```bash
# Check your tools
go version  # Should be 1.21+
docker --version
docker-compose --version  # or 'docker compose version'
node --version  # 18+
npm --version
```

### 2. Environment Setup

Create `.env` files:

#### Backend (`backend/.env`):

```ts
POSTGRES_USER=admin
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=docs_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgres://admin:secretpassword@localhost:5432/docs_db?sslmode=disable

OPENAI_API_KEY=your_openai_key_here
JWT_SECRET=your_jwt_secret_key_here
PORT=8080
ENVIRONMENT=development

FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

#### Frontend (`frontend/.env.local`):

```ts
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

### 3. Database Setup with Docker

```bash
# Start PostgreSQL with pgvector
docker-compose -f docker/docker-compose.yml up -d

# Check if it's running
docker ps

# Connect to test
docker exec -it postgres-vector-db psql -U admin -d docs_db

# In psql, verify pgvector is installed:
SELECT * FROM pg_available_extensions WHERE name = 'vector';
\q
```

#### 4. Backend Testing

```bash
# Navigate to backend
cd backend

# Install dependencies
go mod download

# Run database migrations
go run cmd/migration/migration.go  # If you have migration files

# Start server in development mode
go run cmd/server/main.go

# Or with auto-reload using air (install: go install github.com/cosmtrek/air@latest)
air

# Test API endpoints
curl http://localhost:8080/api/health
curl http://localhost:8080/api/documents
```

#### 5. Frontend Testing

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

#### 6. Manual API Testing via cURL

```bash
# Health check
curl http://localhost:8080/api/health

# Upload a document (mock)
curl -X POST http://localhost:8080/api/documents \
  -H "Content-Type: application/json" \
  -d '{"content": "Sample documentation", "title": "Test Doc"}'

# Search document
curl -X POST http://localhost:8080/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "how to use the API"}'

# Chat endpoint
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What can this system do?", "session_id": "test123"}'
```

#### 7. Automated Testing

Create a simple test script (`test.sh`):

```bash
#!/bin/bash
echo "Testing AI Documentation Assistant..."

# Test 1: Health Check
echo "1. Testing /api/health"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)
if [ "$response" = "200" ]; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed: $response"
fi

# Test 2: Search API
echo "2. Testing search endpoint"
search_response=$(curl -s -X POST http://localhost:8080/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}')
echo "Search response status: OK"

echo "Testing complete!"
```

#### 8. Create a Makefile for Easy Testing

```bash
# backend/Makefile
.PHONY: run test build migrate clean

# Run development server
run:
	go run cmd/server/main.go

# Run tests
test:
	go test ./... -v

# Build binary
build:
	go build -o bin/server cmd/server/main.go

# Database migrations
migrate:
	go run cmd/migration/migration.go

# Cleanup
clean:
	rm -rf bin/
	go clean

# Start all services
dev: up-frontend up-backend

up-backend:
	go run cmd/server/main.go

up-frontend:
	cd ../frontend && npm run dev

# Docker compose
docker-up:
	docker-compose -f ../docker/docker-compose.yml up -d

docker-down:
	docker-compose -f ../docker/docker-compose.yml down
```

#### 9. Run Complete Stack

```bash
# Terminal 1: Start database
make docker-up

# Terminal 2: Start backend
cd backend
make run

# Terminal 3: Start frontend
cd frontend
npm run dev
```

#### 10.Integration Testing

Create `backend/tests/integration_test.go`:

```bash
package tests

import (
    "testing"
    "net/http"
    "bytes"
    "encoding/json"
)

func TestSearchEndpoint(t *testing.T) {
    payload := map[string]string{"query": "test document"}
    jsonData, _ := json.Marshal(payload)
    
    resp, err := http.Post("http://localhost:8080/api/search", 
        "application/json", 
        bytes.NewBuffer(jsonData))
    
    if err != nil {
        t.Fatalf("Failed to make request: %v", err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusOK {
        t.Errorf("Expected status 200, got %v", resp.StatusCode)
    }
}
```

#### 11. Sample Test Data

Create `backend/testdata/init.sql`:

```sql
-- Sample documents for testing
INSERT INTO documents (id, title, content, embedding) VALUES
('doc-001', 'Getting Started', 'This is a guide to get started with our API...', 
 '[-0.012, 0.045, ...]::vector(1536)'),
('doc-002', 'API Reference', 'Complete API reference with all endpoints...', 
 '[0.023, -0.018, ...]::vector(1536)');
```

#### 12. Quick Test Commands

```bash
# Start everything in one command (after setup)
./start-dev.sh

# Individual service testing
go test ./internal/api        # Test API handlers
go test ./internal/services   # Test service layer

# Postman collection file available here:
# (Create postman_collection.json in tests folder)
```

#### 13. Troubleshooting Common Issues

##### Database connection failing:

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs postgres-vector-db

# Recreate container
docker-compose down
docker-compose up -d
```

### Embedding issues:

- Verify OpenAI API key in .env
- Check internet connection for API calls

### CORS issues:

- Ensure frontend URL in CORS configuration
- Check if frontend is running on correct port (5173)

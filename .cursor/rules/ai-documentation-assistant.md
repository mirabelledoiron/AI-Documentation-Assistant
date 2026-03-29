# PROJECT: AI Documentation Assistant with RAG

## TECHNOLOGY:
- Backend: Go 1.21, Gin, GORM, pgvector, OpenAI API
- Frontend: React 18, TypeScript, Tailwind CSS, Vite
- Database: PostgreSQL with vector extension
- Architecture: Modular with proper separation of concerns

## PATTERNS TO FOLLOW:
1. Use Go for high-performance backend with clean architecture
2. Implement RAG pattern: Embeddings → Vector search → Context augmentation → AI response
3. Use React functional components with TypeScript interfaces
4. Implement streaming responses using SSE
5. Follow security best practices (JWT, CORS, rate limiting)

## FILE STRUCTURE:

```bash
backend/
├── cmd/server/main.go
├── internal/
│   ├── api/handlers.go
│   ├── services/search.go
│   ├── models/models.go
│   └── database/database.go
frontend/
├── src/components/ChatInterface.tsx
├── src/services/api.ts
└── src/types/index.ts
```

## IMPLEMENTATION PRIORITY:
1. Database setup with pgvector
2. Embedding generation service
3. Search API endpoint
4. Chat streaming API
5. React frontend components
6. Docker containers

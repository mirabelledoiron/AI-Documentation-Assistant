# AI-Powered Documentation Assistant

An AI-powered assistant for searching and interacting with design system documentation using RAG (Retrieval-Augmented Generation).

## Features

- **Natural Language Search**: Search 500+ pages of documentation using conversational queries
- **Context-Aware Responses**: AI understands design system terminology and context
- **Source Citations**: Every response includes links to source documentation
- **Streaming Responses**: Real-time chat with typing indicators
- **Semantic Search**: Vector-based search for finding relevant documents
- **Document Management**: Upload and manage documentation
- **Analytics Dashboard**: Track usage and popular queries

## Impact Metrics

- 60% reduction in average search time
- 40% increase in documentation adoption
- 150+ active users within first month
- <2 second response times

## Architecture

```tsx
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Frontend │────▶│ Backend │────▶│ PostgreSQL │
│ (React/TS) │ │ (Go/Gin) │ │ + pgvector │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│
▼
┌─────────────────┐
│ OpenAI API │
│ Embeddings │
└─────────────────┘
```


## Tech Stack

### Backend

- **Go 1.21** - Fast, reliable backend
- **Gin** - HTTP web framework
- **GORM** - ORM for database operations
- **pgvector** - Vector similarity search
- **OpenAI API** - Embeddings and chat completions

### Frontend

- **React 18** - Modern React with Hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Query** - Data fetching

### Infrastructure

- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Primary database
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD (optional)

## Quick Start

### Prerequisites

- Docker & Docker Compose
- OpenAI API key
- Node.js 18+ (for local development)

### 1. Clone and Setup

```bash
git clone https://github.com/mirabelle514/AI-Documentation-Assistant
cd ai-documentation-assistant
```

### 2. Configure Environment

cp backend/.env.example backend/.env
# Edit backend/.env with your OpenAI API key

### 3. Start with Docker

```BASH
cd docker
docker-compose up -d
```
### 4. Access the Application

1. Frontend: http://localhost:3000
2. Backend API: http://localhost:8080
3. Health Check: http://localhost:8080/health

### 5. Initial Data

The database is pre-seeded with sample documentation. 
To add your own:

1. Navigate to "Upload Docs" in the UI
2. Or use the /api/v1/documents endpoint

## API Documentation

### Search Endpoints

```TEXT
POST /api/v1/search
{
  "query": "how do I create a primary button",
  "limit": 5
}
```

### Chat Endpoints

```TEXT
POST /api/v1/chat
{
  "messages": [
    {"role": "user", "content": "How do I create a primary button?"}
  ],
  "stream": false
}
```

### Document Management

`GET /api/v1/documents` - List documents
`POST /api/v1/documents` - Create document
`DELETE /api/v1/documents/:id` - Delete document

### Monitoring & Logs

#### View Application Logs

```BASH
# Backend logs
docker logs docs_backend -f

# Frontend logs
docker logs docs_frontend -f

# Database logs
docker logs docs_postgres -f
```

#### Check Health Status

```BASH
curl http://localhost:8080/health
```

#### Semantic Search Implementation

The application uses pgvector for semantic search:

1. Embedding Generation: Content is converted to vectors using OpenAI Ada v2
2. Similarity Search: Cosine similarity search finds relevant documents
3. RAG: Search results provide context to AI responses
4. Caching: Frequently searched queries are cached for performance

### Development

#### Backend Development

```BASH
cd backend
go mod download
go run cmd/server/main.go
```

#### Frontend Development

```BASH
cd frontend
npm install
npm run dev
```

### Database Migrations

```BASH
# Generate new migration
gorm gen migrate -name=add_new_field

# Run migrations
docker exec docs_postgres psql -U docs_user -d docs_assistant -c "\i /docker-entrypoint-initdb.d/init.sql"
```

### Production Deployment

1. Build Production Images

```BASH
docker-compose -f docker-compose.prod.yml build
```

2. Configure Production Environment

```BASH
cp .env.production.example .env.production
# Edit .env.production with production values
```

3. Deploy

```BASH
docker-compose -f docker-compose.prod.yml up -d
```

## Security

### Environment Variables

- All secrets are stored in environment variables
- Never commit .env files to version control
- Use different keys for development/production

### CORS Configuration

Configure allowed origins in `CORS_ALLOWED_ORIGINS`

## Rate Limiting

Implement rate limiting middleware in production

## Sample Queries

Try these example queries:

- "How do I create a primary button?"
- "What are the spacing guidelines?"
- "Show me form validation patterns"
- "What are the color tokens?"
- "Tell me about accessibility requirements"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Author

Removed (project template)
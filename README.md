# AI-Powered Documentation Assistant

Full-stack documentation assistant for searching and chatting with your design system docs using RAG (Retrieval-Augmented Generation).

## Features

- **Semantic search (pgvector)**: Vector similarity search over uploaded docs
- **RAG chat**: Retrieves relevant docs and injects context into chat
- **Streaming chat (SSE)**: Real-time responses when using OpenAI
- **Document management**: Create/list/delete documents
- **Query log**: Tracks recent/popular queries
- **Per-user provider keys**: Add OpenAI / Anthropic keys in the UI (stored in your browser)

## How it works

1. **Documents** are stored in Postgres.
2. **Embeddings** are generated for doc content (OpenAI embeddings) and stored in `pgvector`.
3. **Search** embeds your query, runs a vector similarity query, and returns top matches.
4. **Chat** performs a search, formats the results as context, and asks the model to answer using that context.

Notes on providers:
- **OpenAI**: used for embeddings + chat; streaming supported.
- **Anthropic**: chat supported (non-stream). Search/RAG still requires an OpenAI key for embeddings.

## Case Studies / Use Cases

This project is a **Design System Knowledge Assistant**. It ingests your design-system documentation (Storybook/MDX, tokens, guidelines) and makes it searchable + chat-able with citations.

The same backend can power multiple “surfaces” depending on how your team works:

### 1) Web (what’s included today)

- Best for: designers + engineers browsing the design system
- Pitch: Ask design system questions, get answers with links back to canonical docs

### 2) Slack / Teams bot (B2B-friendly)

- Best for: teams that live in chat
- Example: `/atelier How do I use the Button?` → short answer + links
- Value: fewer interruptions, faster onboarding, consistent answers across the org

### 3) IDE integration (engineers)

- VS Code extension / JetBrains plugin calls the same backend endpoints (`/api/chat`, `/api/search`)
- Value: answers in-context while building features, plus links to the DS source of truth

### B2B framing

- Primary buyers: DX / DesignOps / Design System teams
- Outcomes: fewer repeated questions, faster onboarding, fewer UI inconsistencies, searchable institutional knowledge

### B2C framing

- For individual builders or open-source design systems
- Outcome: turn Storybook + MDX + tokens into an assistant quickly

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

- Docker (for Postgres)
- Go 1.21+
- Node.js 18+

### 1. Clone and setup

```bash
git clone https://github.com/mirabelledoiron/AI-Documentation-Assistant
cd AI-Documentation-Assistant
```

### 2. Start Postgres (pgvector)

This repo’s docker compose file starts **Postgres only**.

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 3. Backend (migrations + server)

```bash
cd backend
cp .env.example .env

# Optional: put OPENAI_API_KEY in backend/.env

go run cmd/migrate/main.go
go run cmd/server/main.go
```

Backend runs on `http://localhost:8080`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### About `node_modules` (why there are two)

This repo contains **two npm projects**: one in the repo root and one in `frontend/`.

Since you picked “keep both”: that’s totally fine and safe. It just means:

- `cd frontend && npm install` installs the UI dependencies into `frontend/node_modules`
- `npm install` at repo root installs root tooling into `node_modules` (often unnecessary unless you run root scripts/tooling directly)

If you want it “clean + fast” while still keeping both, the practical rule is: **only run installs where you need them**. If you never run any root tooling, you can even delete root `node_modules` and it’ll come back only if you later run `npm install` at root.

### 5. Add your provider key

In the app, go to `API Keys` (route `/settings/api-keys`) and paste your key.

- This saves to your browser’s `localStorage` and sends it to the backend on each request.
- Alternative: set `OPENAI_API_KEY` in `backend/.env`.

### 6. Optional: one-command dev script

```bash
./scripts/start-dev.sh
```

Health checks:

- `http://localhost:8080/health`
- `http://localhost:8080/api/health`

## Using the app

- Upload docs: `http://localhost:5173/upload`
- Chat: `http://localhost:5173/chat`
- Query Log: `http://localhost:5173/analytics`

## API Documentation

### Search Endpoints

```TEXT
POST /api/search
{
  "query": "how do I create a primary button",
  "limit": 5
}
```

Back-compat routes also exist under `/api/v1/*`.

### Chat Endpoints

```TEXT
POST /api/chat
{
  "messages": [
    {"role": "user", "content": "How do I create a primary button?"}
  ],
  "stream": false
}
```

Streaming (SSE):

```text
POST /api/chat/stream
```

### Document Management

`GET /api/documents` - List documents
`POST /api/documents` - Create document
`DELETE /api/documents/:id` - Delete document

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

### Database migrations

```bash
cd backend
go run cmd/migrate/main.go
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

Built by <a href="https://www.mirabelledoiron.com/">Mirabelle</a> as part of <a href="https://www.thewednesdaycollective.com/">The Wednesday Collective</a>
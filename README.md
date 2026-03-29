# AI-Powered Documentation Assistant

A design system documentation tool that helps developers find the right component, understand its API, and use it correctly -- using RAG (Retrieval-Augmented Generation) to bridge the gap between how people ask questions and where answers live.

## The Problem

Design systems fail at adoption, not implementation. When docs are scattered across Storybook, Notion, Figma, and Slack threads, developers give up searching and build one-off components instead. The cost isn't duplication -- it's inconsistency, tech debt, and a system nobody trusts.

## The Approach

This tool centralizes design system knowledge and makes it searchable by intent, not keywords. A developer asking "how do I show a loading state?" gets an answer that pulls from Skeleton docs, Spinner docs, and Button loading props -- even though they never mentioned any of those components.

**Key design decisions:**

- **Semantic search over keyword search** -- because developers describe what they want to do, not the component name
- **Cited responses** -- every AI answer links to the source docs so engineers can verify and go deeper
- **Query logging** -- popular queries reveal gaps in your documentation, turning support questions into improvement signals
- **Accessibility mode** -- WCAG-compliant enhancements (high contrast, larger text, focus rings, no motion) toggled from the nav
- **Low Carbon mode** -- strips images, shadows, web fonts, and motion to reduce data transfer and energy use
- **Light/Dark theming** -- CSS custom property architecture with design tokens, not hardcoded values

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Go 1.21, Gin, GORM |
| Database | PostgreSQL 16 + pgvector |
| AI | OpenAI (embeddings + chat), Anthropic (chat) |
| Infrastructure | Docker, Nginx, GitHub Actions |

## Quick Start

```bash
git clone https://github.com/mirabelledoiron/AI-Documentation-Assistant
cd AI-Documentation-Assistant

# Start Postgres
docker compose -f docker/docker-compose.yml up -d

# Backend
cd backend
cp .env.example .env
go run cmd/migrate/main.go
go run cmd/server/main.go

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and add your API key in Settings > API Keys.

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search` | POST | Semantic search over documents |
| `/api/chat` | POST | RAG chat (single response) |
| `/api/chat/stream` | POST | RAG chat (SSE streaming) |
| `/api/documents` | GET/POST/DELETE | Document management |
| `/api/health` | GET | Health check |

## Architecture

```
Frontend (React/TS) --> Backend (Go/Gin) --> PostgreSQL + pgvector
                                         --> OpenAI API (embeddings)
```

Documents are chunked, embedded via OpenAI, and stored as vectors. Search and chat queries embed the user's question, find semantically similar docs, and compose an answer grounded in the retrieved context.

## Design Process

See the [Design Process page](/process) in the app for the full rationale -- problem discovery, user research insights, and why each technical decision was made.

## Author

Built by [Mirabelle Doiron](https://www.mirabelledoiron.com/)

## License

MIT

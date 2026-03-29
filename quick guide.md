# Quick Guide

## 1) Which `package.json` to use

- **Frontend app (the UI you open in the browser):**
  - Run commands from `frontend/`
  - Example:

```bash
cd "/Users/mirabelle/Desktop/DEV computer 2/AI-Documentation-Assistant/frontend"
npm run dev
```

- **Root Node project (optional tooling / separate root Vite app):**
  - Only if you intentionally run commands from the repo root:

```bash
cd "/Users/mirabelle/Desktop/DEV computer 2/AI-Documentation-Assistant"
npm run dev
```

You only “need” the root Node project if you want root-level tooling (storybook, shared linting across multiple JS packages, or a separate demo app).

## 2) What you need installed to run locally

- **Backend needs Go**: `go: command not found` → install Go 1.21+
- **Database needs Docker**: `docker: command not found` → install Docker Desktop

## 3) Correct local run order (once Go + Docker are installed)

**Terminal A (DB):**
```bash
cd "/Users/mirabelle/Desktop/DEV computer 2/AI-Documentation-Assistant"
docker compose -f docker/docker-compose.yml up -d
```

**Terminal B (Backend):**

```bash
cd "/Users/mirabelle/Desktop/DEV computer 2/AI-Documentation-Assistant/backend"
go mod tidy
go run cmd/migrate/main.go
go run cmd/server/main.go
```

**Terminal C (Frontend):**

```bash
cd "/Users/mirabelle/Desktop/DEV computer 2/AI-Documentation-Assistant/frontend"
npm install
npm run dev
```

## 3.1) Using the app (what to click)

- **Overview**: go to `http://localhost:5173/` to see what the app does.
- **Chat**: go to `http://localhost:5173/chat` and ask a question in the chat UI.
- **Search**: go to `http://localhost:5173/search` and run a semantic search.
- **Upload docs**: go to `http://localhost:5173/upload` to add a document to the database.
- **Analytics**: go to `http://localhost:5173/analytics` to see recent queries logged by the backend.

Note: Right now there is **no login/auth UI**. Endpoints are public in local dev so you can use the app end-to-end.

## 4) URLs

- **Frontend**: `http://localhost:5173`
- **Backend health**: `http://localhost:8080/health`
- **API health**: `http://localhost:8080/api/health`

## 6) Figma integration status

- **Not connected to Figma by default.** This project currently indexes docs you provide (via upload/seed) into Postgres + pgvector and uses OpenAI for embeddings/chat.
- If you want Figma integration later, typical options are:
  - Import component docs/tokens from the Figma API on a schedule
  - Build a small Figma plugin that exports component metadata into this app

## 7) Tailwind + tokens (yes, you can use tokens)

Tailwind is in the project, so you can implement design tokens by:
- defining CSS variables (e.g. `--color-primary`) in `frontend/src/styles/globals.css`
- mapping Tailwind theme colors to those variables in `frontend/tailwind.config.js`

That gives you “token-driven” Tailwind classes (e.g. `bg-primary`, `text-primary`).

## 8) Supabase DB (how to connect)

Supabase is Postgres. To connect the backend:
- Create a Supabase project
- Enable `vector` extension in Supabase SQL editor:
  - `CREATE EXTENSION IF NOT EXISTS vector;`
- Set `backend/.env`:
  - `DATABASE_URL=<your Supabase connection string>`
  - For Supabase you typically need SSL: add `?sslmode=require` to the URL if it’s not already there.

## 9) Deploying (Vercel + hosted backend + Supabase)

Important: Vercel can host the **frontend only**. The Go backend must be hosted separately (Fly.io/Render/Railway/etc).

### Frontend on Vercel
In Vercel project settings:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Environment Variables (Vercel):
- `VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api`

SPA routing:
- This repo includes `frontend/vercel.json` to rewrite routes to `index.html` (so refresh on `/chat`, `/analytics`, etc works).

### Backend + Supabase
Backend environment variables (wherever you host the Go API):
- `DATABASE_URL=postgres://... (Supabase, usually with sslmode=require)`
- `OPENAI_API_KEY=...`
- `CORS_ORIGINS=https://YOUR_VERCEL_DOMAIN`

### Security note
Never put Supabase DB credentials into frontend env vars.

## 5) The two “gotchas” you hit (so you remember)

- `docker-compose` not found → use **`docker compose`** (space) on new Docker Desktop
- `go.sum malformed` → your `backend/go.sum` was corrupted; fixed by deleting it + running `go mod tidy`

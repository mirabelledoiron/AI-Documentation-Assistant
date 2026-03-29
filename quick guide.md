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

- **Chat**: go to `http://localhost:5173/` and ask a question in the chat UI.
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

## 5) The two “gotchas” you hit (so you remember)

- `docker-compose` not found → use **`docker compose`** (space) on new Docker Desktop
- `go.sum malformed` → your `backend/go.sum` was corrupted; fixed by deleting it + running `go mod tidy`

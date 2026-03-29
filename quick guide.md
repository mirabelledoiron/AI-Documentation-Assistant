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

## 4) URLs

- **Frontend**: `http://localhost:5173`
- **Backend health**: `http://localhost:8080/health`
- **API health**: `http://localhost:8080/api/health`

## 5) The two “gotchas” you hit (so you remember)

- `docker-compose` not found → use **`docker compose`** (space) on new Docker Desktop
- `go.sum malformed` → your `backend/go.sum` was corrupted; fixed by deleting it + running `go mod tidy`

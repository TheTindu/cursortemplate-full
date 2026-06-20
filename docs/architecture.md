# Architecture

> **Status**: Stack chosen (demo). Updated as tech decisions are made.
> This document describes how the system is built and why.
> Agents read this before proposing structural changes.

---

## System Overview

A single-user todo app that runs locally. A React SPA talks over HTTP to a Hono API, which persists Tasks to a local SQLite file. No auth, no accounts — the single user is implicit.

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │◄───────►│   Backend    │◄───────►│   Database   │
│ React + Vite │  HTTP   │     Hono     │         │   SQLite     │
│ TanStack Qry │ /api/v1 │ @hono/node   │  file   │ better-sqlite│
└──────────────┘         └──────────────┘         └──────────────┘
```

Filtering (All / Active / Completed) and the Remaining count are computed client-side; the API is plain CRUD. See [ADR-002](decisions/ADR-002-client-server-sqlite-for-demo.md) and [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md).

---

## Tech Stack

| Layer | Technology | Decision |
|-------|------------|----------|
| Frontend | React + Vite (TypeScript) | [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md) |
| Styling | Tailwind CSS v4 | [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md) |
| Server state | TanStack Query (optimistic mutations) | [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md) |
| Backend | Node.js 20 + Hono (`@hono/node-server`) | [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md) |
| Validation | Zod + `@hono/zod-validator` | [ADR-001](decisions/ADR-001-typescript-conventions.md) |
| Database | SQLite via `better-sqlite3` | [ADR-002](decisions/ADR-002-client-server-sqlite-for-demo.md), [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md) |
| Auth | None (single-user, local) | [ADR-002](decisions/ADR-002-client-server-sqlite-for-demo.md) |
| Tests | Vitest (shared schemas + API integration) | |
| Hosting / Infra | Local only (demo) | |
| CI/CD | GitHub Actions — lint + typecheck | `.github/workflows/ci.yml` |

---

## Repository Layout

```
src/
├── frontend/     ← React + Vite SPA (UI, TanStack Query, optimistic updates)
│   └── ...
├── backend/      ← Hono API + better-sqlite3 persistence
│   └── ...
└── shared/       ← Zod schemas + inferred types for the Task contract
    └── ...
```

---

## API Design

- Style: **REST**, JSON.
- Base path: `/api/v1/`
- Auth: none (single-user, local — see [ADR-002](decisions/ADR-002-client-server-sqlite-for-demo.md)).
- Validation: every request body / params validated with Zod (`@hono/zod-validator`) at the boundary.

### Endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/tasks` | — | List all Tasks, ordered by creation (oldest first). |
| `POST` | `/api/v1/tasks` | `{ title }` | Create a Task. Returns the created Task. |
| `PATCH` | `/api/v1/tasks/:id` | `{ title?, completed? }` | Update a Task's title and/or completed state. |
| `DELETE` | `/api/v1/tasks/:id` | — | Hard-delete a Task. |
| `DELETE` | `/api/v1/tasks` | — | Hard-delete all Completed Tasks (clear completed). |

Filtering and the Remaining count are **not** server concerns — the client fetches all Tasks and derives both in memory.

- Error format:
  ```json
  {
    "error": {
      "code": "RESOURCE_NOT_FOUND",
      "message": "Human readable message.",
      "details": {}
    }
  }
  ```

---

## Data Model

A single entity. See `docs/CONTEXT.md` for the domain glossary.

| Entity | Description |
|--------|-------------|
| `Task` | A thing the user intends to do. The list is an ordered collection of Tasks. |

**`Task` fields**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer (autoincrement) | Primary key; also defines creation order. |
| `title` | text | Trimmed, non-empty, ≤ 500 chars. Duplicates allowed. |
| `completed` | boolean (0/1) | `false` = Active, `true` = Completed. Reversible. |
| `createdAt` | ISO 8601 string | Set on creation. |

---

## Authentication & Authorisation

None. The app is single-user and runs locally, so there are no accounts, sessions, or permissions. See [ADR-002](decisions/ADR-002-client-server-sqlite-for-demo.md).

---

## Environment Variables

> Document every env var the application reads. Group by concern.

```bash
# Core
NODE_ENV=development          # development | production | test

# Backend (Hono)
PORT=3000                     # API server port
DATABASE_PATH=./data/todo.db  # SQLite file location (created if missing)

# Frontend (Vite) — only VITE_-prefixed vars are exposed to the client
VITE_API_BASE_URL=/api/v1     # API base; in dev, Vite proxies this to the backend
```

All backend env vars are validated at startup with Zod in a single config module — never read `process.env.X` inline (per AGENTS.md).

Never commit `.env` files. Provide a `.env.example` with all keys (values blank or with safe placeholders).

---

## Security Considerations

- All user input validated and sanitised at the API boundary.
- Secrets stored in env vars only — never in source code or version control.

---

## Performance Considerations

Local single-user app. Optimistic mutations in TanStack Query deliver instant UI feedback regardless of server round-trip time.

---

## Observability

| Concern | Approach |
|---------|----------|
| Logging | Console output (dev); structured logging TBD if deployed. |
| Metrics | Out of scope for local demo. |
| Tracing | Out of scope for local demo. |
| Alerting | Out of scope for local demo. |

---

## Key Constraints

- Functional TypeScript throughout — no classes, no decorators (see [ADR-001](decisions/ADR-001-typescript-conventions.md)).
- Single-user, local only — no multi-tenancy, no auth.

---

## Architecture Decision Records

Full ADRs are in `docs/decisions/`. A brief index:

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-001](decisions/ADR-001-typescript-conventions.md) | Functional TypeScript with Zod-based validation | Accepted |
| [ADR-002](decisions/ADR-002-client-server-sqlite-for-demo.md) | Client + server + SQLite for a single-user local app | Accepted |
| [ADR-003](decisions/ADR-003-stack-hono-react-sqlite.md) | Stack — Hono, React/Vite, better-sqlite3 | Accepted |

New ADRs: copy [`decisions/TEMPLATE.md`](decisions/TEMPLATE.md) to `decisions/ADR-NNN-short-title.md`.

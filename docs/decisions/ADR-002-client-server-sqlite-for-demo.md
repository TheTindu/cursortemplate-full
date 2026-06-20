# ADR-002: Client + server + SQLite for a single-user local app

**Date**: 2026-06-20
**Status**: Accepted

---

## Context

The product is a single-user todo app that runs on one person's laptop with no accounts or logins (see `docs/spec.md`). The obvious minimal implementation is a pure client-side app that persists to the browser (`localStorage` / IndexedDB) with no server at all.

However, this repository exists as a **demo** intended to exercise the full boilerplate — the `frontend`, `backend`, and `shared` workspaces, the API conventions in `docs/architecture.md`, and the functional + Zod conventions in [ADR-001](ADR-001-typescript-conventions.md). A backend with a real persistence layer is wanted to show those pieces working end-to-end.

## Decision

Build a three-part application: a **frontend** SPA, a **backend** HTTP API, and a **SQLite** file database on the laptop. The frontend never touches the database directly; all reads and writes go through the API.

## Consequences

### Positive

- Exercises the full boilerplate (frontend ↔ backend ↔ DB) and the `/api/v1/` + Zod conventions end-to-end.
- SQLite is a single local file — zero server setup, easy to reset, fits "on my laptop".
- A real API boundary gives a clean place to validate input (per AGENTS.md).

### Negative / Trade-offs

- More moving parts than a single-user app strictly needs: a server process and a DB file to run alongside the UI.
- Requires running two processes in development (Vite dev server + API), versus opening a single static page.

### Neutral

- Because the app is single-user and local, the API needs no authentication or multi-tenancy. The server is effectively a thin, validated persistence layer.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Pure client-side, browser storage (no backend) | Simplest for the user, but defeats the purpose of demoing the backend/shared workspaces and API conventions. |
| Frontend + backend + a server database (Postgres, etc.) | Operational overhead (a DB server to run) with no benefit for a single-user local demo. |
| Backend with an in-memory store only | Data would not survive a restart; the spec wants the list to be there every time the app opens. |

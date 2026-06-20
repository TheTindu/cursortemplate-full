# ADR-003: Stack — Hono, React/Vite, better-sqlite3

**Date**: 2026-06-20
**Status**: Accepted

---

## Context

With the architectural shape settled ([ADR-002](ADR-002-client-server-sqlite-for-demo.md): frontend + backend + SQLite), the concrete frameworks and libraries need choosing. All choices must respect [ADR-001](ADR-001-typescript-conventions.md): functional TypeScript, no classes/decorators, Zod for runtime validation. Node is pinned to 20 (`.nvmrc`), which rules out the built-in experimental `node:sqlite` (Node 22+).

## Decision

| Layer | Choice |
|-------|--------|
| Backend framework | **Hono** via `@hono/node-server`, with `@hono/zod-validator` for boundary validation |
| Database driver | **better-sqlite3** — synchronous, no async ceremony for a local file DB |
| Frontend | **React + Vite** (TypeScript) |
| Styling | **Tailwind CSS v4** (Vite plugin) |
| Server state | **TanStack Query** with optimistic mutations |
| Shared types | Zod schemas in `src/shared`, types inferred from them |
| Tests | **Vitest** — shared schema unit tests + Hono route integration tests against in-memory SQLite |

Filtering (All / Active / Completed) and the Remaining count are computed **client-side**; the API stays plain CRUD.

## Consequences

### Positive

- Hono and React both favour plain functions and hooks — a clean fit with ADR-001 (no classes).
- `@hono/zod-validator` and shared Zod schemas mean one source of truth for validation and types across frontend and backend.
- `better-sqlite3` is synchronous and reliable, keeping data-access code simple.
- TanStack Query's optimistic mutations deliver the "snappy, instant" feel the spec asks for.

### Negative / Trade-offs

- `better-sqlite3` is a native module (needs a compile/prebuild step on install).
- TanStack Query is an extra dependency over hand-rolled fetch + state; justified by optimistic updates and cache handling.

### Neutral

- Client-side filtering keeps the API minimal but means the client always fetches the full list. Fine for a single local user; would need revisiting at scale.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Fastify / Express backend | Both viable; Hono chosen for its tiny footprint and first-class functional TS ergonomics. |
| `node:sqlite` (built-in) | Experimental and unavailable on the pinned Node 20. |
| Svelte / Vue frontend | Both fit; React chosen for familiarity and ease of review in a demo. |
| Plain CSS / CSS Modules | Workable, but Tailwind v4 gives a clean, consistent look faster. |
| Hand-rolled fetch + state | Simpler deps, but loses TanStack Query's optimistic-update and caching ergonomics. |
| Server-side filtering + count | Unnecessary query complexity for a single-user local list. |

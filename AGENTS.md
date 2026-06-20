# AGENTS.md

## Project Overview

> TODO: What this product does, who it serves, what problem it solves.

**Status**: Stack chosen. See `docs/architecture.md` for the full tech stack and `docs/spec.md` for product requirements.

---

## Repository Structure

```
.
├── docs/
│   ├── spec.md             ← Product spec and requirements.
│   ├── architecture.md     ← System design and architectural decisions.
│   ├── CONTEXT.md          ← Domain glossary (ubiquitous language).
│   └── decisions/          ← Architecture Decision Records (ADRs).
├── src/
│   ├── frontend/           ← Frontend application (framework TBD).
│   ├── backend/            ← Backend application (framework TBD).
│   └── shared/             ← Shared package (types, utils, contracts) used by both frontend and backend.
├── .agents/skills/         ← Agent skills (cross-tool).
├── .cursor/
│   ├── rules/              ← File-scoped Cursor rules (always-on conventions live in AGENTS.md).
│   └── hooks/              ← Agent hooks (auto-format edited files with Biome).
├── .github/workflows/      ← CI (lint + typecheck).
├── tsconfig.json           ← Strict TypeScript base config.
└── biome.json              ← Lint + format config.
```

---

## Docs

Full context lives in `docs/` — read the relevant file before making changes, not this file.

| File | When to read | When to update |
|------|-------------|----------------|
| `docs/spec.md` | Before any feature work | When requirements or user flows change |
| `docs/architecture.md` | Before structural or cross-cutting changes | When a tech decision, API shape, or env var is added or changed |
| `docs/CONTEXT.md` | Before naming domain concepts in code or docs | When a domain term is introduced, renamed, or its meaning changes |
| `docs/decisions/` | When a significant trade-off was already made | When making a new architectural decision — write an ADR |

**Keep `docs/` current.** After any change that affects product behaviour, system design, or a technical decision, update the relevant doc in the same commit. Do not leave docs stale.

---

## Coding Conventions

- All code in English. Prefer explicit over implicit.
- Match the style already used in the file you are editing.
- Shared code between frontend and backend goes in `src/shared/` — no direct `frontend ↔ backend` imports.
- Validate all external input at the API boundary.
- Validate required env vars at startup — centralise in a config module, never read `process.env.X` inline.
- Never hardcode secrets. Document new env vars in `docs/architecture.md`.
- TypeScript/Node style (naming, types, functions, error handling): see `.cursor/rules/typescript.mdc`.

## Commands
- `npm run lint` — Biome lint + format check (also runs in CI).
- `npm run lint:fix` — Biome auto-fix.
- `npm run format` — Biome format-write.
- `npm run typecheck` — `tsc --noEmit` (also runs in CI).

## Git Commits
- Conventional Commits, atomic: `type(scope): description` — `feat` `fix` `chore` `docs` `refactor` `test` `perf`.
- Keep the title brief; add detail in the body.

## Documentation
- Write in active voice, present tense.
- Be concise — no filler. Use lists and tables where appropriate.

---

## Before Writing Code

- If the task is ambiguous or has trade-offs, ask a short clarifying question — don't guess.
- If a feature touches auth, payments, or personal data, stop and confirm scope.
- Check whether a `.agents/skills/` skill already covers the task.
- Don't add new dependencies without checking what is already installed.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` \| `production` \| `test` |

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-20 | Functional TS + Zod validation | See [ADR-001](docs/decisions/ADR-001-typescript-conventions.md). Rules out NestJS-style stacks. |
| 2026-06-20 | Client + server + SQLite for demo | See [ADR-002](docs/decisions/ADR-002-client-server-sqlite-for-demo.md). |
| 2026-06-20 | Stack: Hono + React/Vite + better-sqlite3 | See [ADR-003](docs/decisions/ADR-003-stack-hono-react-sqlite.md). |

---

## Do Not

- Install packages without checking what is already in use.
- Add `.env` files or hardcoded credentials.
- Rename top-level folders without updating this file.
- Ignore linter errors — fix them or surface them to the user.
- Leave TODO comments without a matching task in `docs/spec.md`.
- Modify this file unless the project has actually changed.

# Project Name

> TODO: One-line description of what this does.

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10

## Getting started

```bash
npm install      # install dev tooling (TypeScript, Biome)

npm run lint     # Biome lint + format check
npm run format   # Biome format-write
npm run typecheck # tsc --noEmit
```

> A `dev` script will be added once the frontend/backend frameworks are chosen.

## Project structure

```
.
├── AGENTS.md           ← AI agent guidance (read this first if you're an agent)
├── docs/
│   ├── spec.md         ← Product specification
│   ├── architecture.md ← System design
│   └── decisions/      ← Architecture Decision Records
├── src/
│   ├── frontend/       ← Frontend app (framework TBD)
│   ├── backend/        ← Backend API (framework TBD)
│   └── shared/         ← Code shared across frontend and backend
├── .agents/skills/     ← Agent skills (cross-tool)
├── .cursor/            ← Cursor rules + hooks
├── tsconfig.json       ← Strict TypeScript config
└── biome.json          ← Lint + format config
```

## AI tooling

This repo is set up to be productive with AI agents out of the box:

| Mechanism | Location | Purpose |
|-----------|----------|---------|
| Agent context | `AGENTS.md` | Always-on, cross-tool conventions and constraints |
| Scoped rules | `.cursor/rules/*.mdc` | Load only for matching files (e.g. TS rules for `*.ts`) |
| Skills | `.agents/skills/` | Reusable agent workflows (e.g. `add-env-var`) |
| Hooks | `.cursor/hooks/` | Auto-format edited files with Biome after each edit |
| Editor config | `.vscode/` | Biome as format-on-save + recommended extension (same rules as hook & CI) |
| Docs | `docs/` | Spec, architecture, and ADRs agents read for context |
| CI | `.github/workflows/ci.yml` | Lint + typecheck on every push/PR |

### Adding agent skills

Skills teach the AI how to perform project-specific tasks. Install them from GitHub using the [`skills` CLI](https://skills.sh):

```bash
# Search for skills
npx skills find <keywords>

# Install from a GitHub repo
npx skills add <owner/repo>

# Example
npx skills add vercel-labs/agent-skills
```

Skills land in `.agents/skills/` — the cross-agent standard that works across Cursor, Claude Code, Codex, and others.

## Documentation

| Doc | Purpose |
|-----|---------|
| [`AGENTS.md`](AGENTS.md) | Conventions, structure, and guidance for AI agents |
| [`docs/spec.md`](docs/spec.md) | Product requirements and user flows |
| [`docs/architecture.md`](docs/architecture.md) | System design and tech stack decisions |
| [`docs/decisions/`](docs/decisions/) | Architecture Decision Records |

## Contributing

- Follow [Conventional Commits](https://www.conventionalcommits.org/).
- Keep `AGENTS.md` and `docs/architecture.md` up to date when making structural changes.
- Run the linter before opening a PR.

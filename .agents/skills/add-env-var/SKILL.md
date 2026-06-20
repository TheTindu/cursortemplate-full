---
name: add-env-var
description: Add a new environment variable to this project consistently across every file that must know about it. Use when introducing a new env var, config value, secret, or when the user mentions adding something to .env.
---

# Add Environment Variable

This project keeps environment variables documented in **three** places. Adding one means updating all of them in the same change — never just `.env`.

## Steps

1. **`.env.example`** — add the key with a safe placeholder or blank value, plus a short inline comment. Never put a real secret here.
2. **`AGENTS.md`** → "Environment Variables" table — add a row: `| NAME | Yes/No | description |`.
3. **`docs/architecture.md`** → "Environment Variables" section — add the key to the documented block, grouped by concern.
4. **Add runtime validation** — the variable must be validated at startup in the config module (fail fast if required and missing). Never read `process.env.X` inline in business logic.

## Checklist

```
- [ ] .env.example updated (placeholder, not a real value)
- [ ] AGENTS.md env table updated
- [ ] docs/architecture.md env section updated
- [ ] Startup validation added (required vars fail fast)
- [ ] Secret? Confirmed it is NOT committed anywhere
```

## Example

Adding `DATABASE_URL` (required):

- `.env.example`: `DATABASE_URL=postgres://user:password@localhost:5432/mydb`
- `AGENTS.md`: `| DATABASE_URL | Yes | Postgres connection string. |`
- `docs/architecture.md`: add under a `# Database` group in the env block.
- Config module: throw on startup if `DATABASE_URL` is unset.

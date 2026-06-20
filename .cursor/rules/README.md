# Cursor Rules

Always-on conventions live in `AGENTS.md` at the repo root (read by every agent, cross-tool).

Use this folder only for **file-scoped** rules — ones that should load just for matching files:

```
---
description: React component patterns
globs: src/frontend/**/*.tsx
alwaysApply: false
---
```

If a rule should apply everywhere, put it in `AGENTS.md` instead.

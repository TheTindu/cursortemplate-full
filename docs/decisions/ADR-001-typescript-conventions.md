# ADR-001: Functional TypeScript with Zod-based validation

**Date**: 2026-06-20
**Status**: Accepted

---

## Context

The project is greenfield with the frontend and backend frameworks still undecided. However, code style and validation strategy can be settled now, independently of framework choice, so that tooling (`tsconfig.json`, Biome) and agent rules (`.cursor/rules/typescript.mdc`) can enforce a consistent style from the first line of code.

## Decision

Adopt a **functional, type-first** TypeScript style across the codebase:

- Prefer functions and plain data over classes.
- `strict` TypeScript; `any` is disallowed.
- No `enum` — use `const` maps with derived union types.
- Prefer `interface` over `type` for extendable object shapes.
- Use **Zod** for runtime validation, and infer static types from the schemas (single source of truth).
- Use `import type` for type-only imports.

These rules live in `.cursor/rules/typescript.mdc` and are enforced by Biome + `tsc`.

## Consequences

### Positive

- Consistent style enforceable by tooling before any framework is chosen.
- Zod gives runtime safety at boundaries (API input, env vars) with zero type/validation drift.
- Functional style keeps the shared package portable between frontend and backend.

### Negative / Trade-offs

- **Rules out class/decorator-heavy frameworks** as a natural fit — notably NestJS and TypeORM. Choosing one later would require revisiting this ADR and `typescript.mdc`.
- Zod adds a runtime dependency and a small validation overhead at boundaries.

### Neutral

- Frameworks that align well (Express/Fastify/Hono on the backend, React/Vue/Svelte on the frontend) remain open.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| OOP / class-based (NestJS-style) | Heavier, decorator-driven; less portable shared code; premature given undecided stack. |
| `type` aliases everywhere instead of `interface` | Interfaces extend more cleanly for object shapes; minor but consistent choice. |
| Validation via plain TS types only | No runtime safety at boundaries; types erased at compile time. |
| io-ts / Yup instead of Zod | Zod has the best TS inference ergonomics and ecosystem momentum. |

# 0002: Stack: Node + TypeScript + Vitest

- **Status:** Accepted
- **Date:** 2026-10-18

## Context

Cat Roster is a single-user CLI for tracking cats (name, breed, personality,
favorite activities, drama level). Requirements: runs locally on the command
line; no servers or databases; fast feedback for a solo developer plus AI
agents; easy to test. The repo template is deliberately stack-agnostic, so the
first structural decision is the toolchain.

## Decision

Node 22+ (ESM) with strict TypeScript, npm for packages, and Vitest for tests.
The roster is in-memory for now; JSON file persistence is planned — no database
yet.

## Options considered

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **TypeScript + Node + Vitest (chosen)** | Typed code and tests; Vitest needs zero config for ESM TS and types tests from the same tsconfig | Requires a `tsc` build step before running |
| Plain JavaScript + Node + `node:test` | No build step; fewer deps | Untyped — AI agents lose compile-time safety on refactors |
| TypeScript + Deno | TS and test runner built in | Different runtime and tooling from the ecosystem |
| Python + `pytest` | Good CLI experience | Not the direction already implied by the TS-based template |
| Add a database now (SQLite or JSON) | Persistence from day one | YAGNI; adds schema and I/O before the model is settled |

## Consequences

- Easier: one language for code and tests; `npm test` and `npm run typecheck`
  are the gates; zero runtime dependencies so far.
- Harder: must build before running (`npm start` does this); Vitest doesn't
  typecheck, so `npm run typecheck` must run too.
- Revisit if: the CLI needs a real database (supersede with a storage ADR), or
  multi-user/remote access is wanted (then a server + DB supersedes this ADR).
# AGENTS.md

> Read this first. It is the minimum context needed to work in this repo.
> Keep it under ~150 lines. Details belong in `docs/`.

## Project

Cat Roster is a single-user TypeScript CLI for tracking household cats — name,
breed, personality, favorite activities, and drama level. Runs on Node 22+, no
servers or database. **Phase:** scaffolded (stack + docs in place); the cat
model, CLI commands, and JSON persistence are next.

## Stack

TypeScript (Node 22+, ESM, strict) · Vitest for tests · npm for packages.
No database yet — roster is in-memory, JSON file persistence planned.
See ADR 0002 for the stack decision.

## Commands

| Task             | Command                    |
| ---------------- | -------------------------- |
| Install          | `npm install`              |
| Run              | `npm start`                |
| Test (all)       | `npm test`                 |
| Test (one file)  | `npx vitest run test/cat.test.ts` |
| Lint / format    | `npm run typecheck` (no linter yet) |

## Where things live

| Path                     | What                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `docs/progress.md`       | Current state, next steps, **known gotchas**. Read first.   |
| `docs/changes/`          | Doc fragments from branches not yet consolidated. **Read these too.** |
| `docs/architecture.md`   | Structure, key flows, **change impact map**.                |
| `docs/workflow.md`       | One-agent and parallel-agent flow (diagram).                |
| `docs/adr/`              | Decisions and the reasoning behind them.                    |
| `.agents/skills/`        | `plan`, `build`, `review`, `sync-docs`, `merge`, `consolidate-docs`. |
| `scripts/`               | Helper scripts (e.g. `agent-worktree.ps1`, `merge-pr.ps1`). |
| `src/`                   | Source code: CLI entry (`index.ts`), domain model (`cat.ts`). |
| `test/`                  | Vitest tests, one file per module (`cat.test.ts`).          |

## Workflow

Every task follows: **plan -> build (incl. tests) -> review -> sync-docs**.

Parallel agents add: one worktree each, plans compared for overlap, the `merge`
skill for one-PR-at-a-time updates, and `consolidate-docs` for fragments.
See `docs/workflow.md`.

Each step is a skill at `.agents/skills/<name>/SKILL.md`. If your tool does not
load skills automatically, open and follow the file directly.

## Hard rules

1. **Never commit to `main`.** Work on `agent/<issue#>-<short-name>`. A human merges via PR.
2. **Check impact before editing.** Before changing a function, module, schema, or
   interface: search for its callers and check the *Change impact map* in
   `docs/architecture.md` and any impact rows in `docs/changes/`.
3. **Every bug fix gets a regression test** that fails before the fix and passes after.
4. **Run the full test suite**, not just new tests, before calling anything done (except docs-only / comment edits).
5. **Max 3 fix attempts** on a failing test. Then stop, summarize what you tried, and ask.
6. **Don't undo a previous fix** without checking *Known gotchas* in `docs/progress.md`
   and `docs/changes/`. If you're about to reverse earlier behavior, say so explicitly.
7. **Sync docs** (`sync-docs` skill) before ending any turn that changed code. On a
   branch, write only your fragment `docs/changes/<branch>.md`; never edit shared docs.
8. **No new dependencies** without stating why. Structural choices get an ADR.
9. **Pin major dependencies** at scaffold time. Toolchain major updates often silently change defaults (e.g. compiler flags, auto-included types).
10. **Align before assuming:** If requirements, output formats, or edge cases are unclear, ask. Don't assume or hide confusion; surface trade-offs early.
11. **Minimal implementation:** Write the simplest code that completely solves the problem. Avoid speculative features, premature abstractions, and unrequested complexity.

## Conventions

**Status:** `docs/progress.md` is the single source of truth for project status and roadmap. Link to it; do not duplicate status tables in `README.md`.

**Code:** ESM (`"type": "module"`), strict TypeScript, named exports only. Relative
imports use `.js` extensions (NodeNext), e.g. `import "./cat.js"`. Tests live
in `test/`, one file per module, named `*.test.ts`. No linter yet —
`npm run typecheck` is the gate; keep formatting tidy. Vitest transpiles without
typechecking, so run both `npm test` and `npm run typecheck`.

**PRs:** When creating a PR, always fill out `.github/pull_request_template.md` (via
`gh pr create --body-file <temp-file>` or `gh pr create --fill`). Never pass
inline markdown containing backticks to `--body "..."` (PowerShell interprets
backticks as escape characters and mangles code spans).

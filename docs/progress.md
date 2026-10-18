# Progress

> Short-term memory for you and any agent. Newest entries first.
> Trim old log entries once they are captured in an ADR or no longer matter.
> **Don't edit this on a feature branch.** Write `docs/changes/<branch>.md` instead;
> `consolidate-docs` folds fragments in here. Unconsolidated fragments count too.
> (Bootstrap exception: the scaffold turn filled in the `TODO(project)` placeholders directly.)

## Current state

- **Phase:** Scaffolded — TypeScript + Vitest running, docs filled in
- **Working:** —
- **In progress / broken:** —

## Next steps

1. Finalize the cat model (`src/cat.ts`: fields, defaults, validation).
2. CLI commands: add / list / show a roster.
3. JSON persistence (`data/roster.json`).
4. Protect `main` on GitHub once real features land.

## Known gotchas

Things that bit us before. **Check here before "fixing" something that was already fixed.**

- **Vitest transpiles TS without typechecking.** A type error can pass `npm test`
  and fail `npm run build`. Always run both.
- **ESM relative imports need `.js` extensions** in source (`import "./cat.js"`),
  even though the file is `cat.ts` (NodeNext).
- Shared docs were edited directly by the bootstrap branch (exception to the
  fragment rule, per plan approval).

## Log

<!-- Copy this block for each entry. Keep it to a few lines. -->

### 2026-10-18: Scaffold Cat Roster (bootstrap, branch `agent/scaffold-cat-roster`)

- **Did:** Filled `TODO(project)` markers in `AGENTS.md`, `README.md`, and `docs/`;
  added `package.json` (TypeScript + Vitest), `tsconfig*.json`, `src/cat.ts`,
  `src/index.ts`, `test/cat.test.ts`; drafted ADR 0002.
- **Decided:** Stack = Node 22 (ESM) + TypeScript (strict) + Vitest, no DB yet (ADR 0002).
- **Broke / fixed:** —
- **Next:** cat model, CLI commands, JSON persistence.
# Progress

> Short-term memory for you and any agent. Newest entries first.
> Trim old log entries once they are captured in an ADR or no longer matter.
> **Don't edit this on a feature branch.** Write `docs/changes/<branch>.md` instead;
> `consolidate-docs` folds fragments in here. Unconsolidated fragments count too.
> (Bootstrap exception: the scaffold turn filled in the `TODO(project)` placeholders directly.)

## Current state

- **Phase:** MVP CLI — `add` / `list` / `show` working on an in-memory roster
- **Working:** —
- **In progress / broken:** —

## Next steps

1. JSON persistence (`data/roster.json`) so `add` survives restarts.
2. Optional: `edit` / `remove` commands.
3. Protect `main` on GitHub once persistence lands.

## Known gotchas

Things that bit us before. **Check here before "fixing" something that was already fixed.**

- **Vitest transpiles TS without typechecking.** A type error can pass `npm test`
  and fail `npm run build`. Always run both.
- **ESM relative imports need `.js` extensions** in source (`import "./cat.js"`),
  even though the file is `cat.ts` (NodeNext).
- **TypeScript 7 does not auto-include `@types/*` packages.** `tsconfig.json`
  needs an explicit `"types": ["node"]`, or `tsc` fails with TS2591 on `process`
  even when `@types/node` is installed.
- Shared docs were edited directly by the bootstrap branch (exception to the
  fragment rule, per plan approval).

## Log

<!-- Copy this block for each entry. Keep it to a few lines. -->

### 2026-10-18: In-memory CLI commands (PR #2, branch `agent/cat-model-cli`)

- **Did:** Runtime validation (`parseDramaLevel`, `makeCat`); new `src/cli.ts`
  (`parseCommand`, `execute`); `src/index.ts` became a dispatcher; `@types/node`
  devDep + `"types": ["node"]`; README Usage section.
- **Decided:** Hand-rolled arg parsing (zero runtime deps); drama defaults to 3;
  roster in-memory per run — JSON persistence is next.
- **Broke / fixed:** `npm start` no longer prints the sample roster; shows help.
- **Next:** JSON persistence.

### 2026-10-18: Scaffold Cat Roster (bootstrap, branch `agent/scaffold-cat-roster`)

- **Did:** Filled `TODO(project)` markers in `AGENTS.md`, `README.md`, and `docs/`;
  added `package.json` (TypeScript + Vitest), `tsconfig*.json`, `src/cat.ts`,
  `src/index.ts`, `test/cat.test.ts`; drafted ADR 0002.
- **Decided:** Stack = Node 22 (ESM) + TypeScript (strict) + Vitest, no DB yet (ADR 0002).
- **Broke / fixed:** —
- **Next:** cat model, CLI commands, JSON persistence.
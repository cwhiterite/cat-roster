# Progress

> Short-term memory for you and any agent. Newest entries first.
> Trim old log entries once they are captured in an ADR or no longer matter.
> **Don't edit this on a feature branch.** Write `docs/changes/<branch>.md` instead;
> `consolidate-docs` folds fragments in here. Unconsolidated fragments count too.
> (Bootstrap exception: the scaffold turn filled in the `TODO(project)` placeholders directly.)

## Current state

- **Phase:** Interactive REPL + full CRUD (`add`, `list`, `show`, `edit`, `remove`) + JSON persistence (`data/roster.json`) + formatting
- **Working:** `add` / `list` / `show` / `edit` / `remove` / `help` via interactive REPL (`npm start`) or one-shot CLI commands; auto-persistence to `data/roster.json`
- **In progress / broken:** —

## Next steps

1. Protect `main` on GitHub (branch protection rules).

## Known gotchas

Things that bit us before. **Check here before "fixing" something that was already fixed.**

- **PowerShell NativeCommandError with external CLIs** — Under `$ErrorActionPreference = "Stop"`, commands writing to stderr (such as `gh pr view` when no PR matches) trigger terminating exceptions. Wrap or lower `$ErrorActionPreference` to `"Continue"` during stderr probes.
- **Git worktree branch deletion lock** — `git branch -d <branch>` fails if that branch is still checked out in an active worktree. Check `git worktree list` and remove the worktree before deleting the local branch.
- **Data path is relative to CWD** — run from the project root (`data/roster.json`), or adjust the path if the binary moves.
- **Toughening `makeCat` rules later can make existing `data/roster.json` files fail to load** — validation runs on every load.
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

### 2026-10-20: Merge script & workflow rules (PR #11, branch `agent/merge-script-and-workflow-rules`)

- **Did:** Added `scripts/merge-pr.ps1` for automating post-PR merge ritual (GitHub merge, branch deletion, linked worktree cleanup, and fragment checks) with `-WhatIf` and `-Strategy` flags; harmonized `.agents/skills/plan/SKILL.md` Fast lane policy with `AGENTS.md` Hard Rule 4 (exempting only docs/comment/typo edits from full test runs); documented `merge-pr.ps1` in `AGENTS.md` and `.agents/skills/merge/SKILL.md`; added Rules 9–11 and Status/Code/PR conventions in `AGENTS.md`.
- **Decided:** `merge-pr.ps1` is dedicated as a human convenience tool, preserving agent boundary rules; script uses `git worktree list --porcelain` to detect and safely clean up linked worktrees before branch deletion.
- **Broke / fixed:** Fixed PowerShell native command stderr handling during `gh` queries under `$ErrorActionPreference = "Stop"` so absent PRs do not produce terminating NativeCommandError exceptions; excluded primary worktree from branch removal map.
- **Next:** Protect `main` on GitHub (branch protection rules).

### 2026-10-19: PR template conventions (PR #9, branch `agent/pr-template-convention`)

- **Did:** Updated `## Conventions` in `AGENTS.md` to instruct agents to fill out
  `.github/pull_request_template.md` (via `--body-file <temp-file>` or `gh pr create --fill`)
  when creating PRs, avoiding PowerShell backtick mangling.
- **Decided:** Formalize PR creation conventions in `AGENTS.md` for consistent PR descriptions.
- **Broke / fixed:** —
- **Next:** —

### 2026-10-19: Edit and remove commands (PR #8, branch `agent/edit-remove-commands`)

- **Did:** Added `edit` and `remove` (with `rm`/`delete` aliases) commands to
  `src/cli.ts`; supported partial updates via `--name`, `--breed`, `--personality`,
  `--activities`, and `--drama` with collision detection and validation via `makeCat`;
  updated CLI help text and `README.md` Usage; added unit and REPL tests (51 passing).
- **Decided:** Both interactive REPL and one-shot modes inherit `edit` and `remove`
  via `execute`, persisting mutations to `data/roster.json`; renaming checks for
  existing cat name collisions.
- **Broke / fixed:** —
- **Next:** Optional: protect `main` on GitHub.

### 2026-10-19: REPL formatting & sample data (PR #6, branch `agent/repl-cats-formatting`)

- **Did:** Replaced `data/roster.json` with 5 sample cats; added `formatDrama` visual
  mask indicator; updated `catSummary` and `rosterSummary` with multi-line layout, paw
  bullets (`🐾`), banner header, and drama statistics; added welcome banner to `runRepl`;
  expanded test suite (38 tests).
- **Decided:** Output formatting matches the light-hearted theme across both REPL and
  one-shot commands while preserving the `Cat` schema.
- **Broke / fixed:** Missing `vitest` imports in `test/cat.test.ts` caught and fixed on attempt 1.
- **Next:** Optional `edit` / `remove` commands.

### 2026-10-18: Interactive REPL & JSON persistence (PR #5, branch `agent/repl-persistence`)

- **Did:** Added `src/storage.ts` (load/save `data/roster.json`, validation on load)
  and `src/repl.ts` (quote-aware tokenizer + `cat>` session on `node:readline/promises`);
  `src/index.ts` opens REPL with no args and loads/saves in one-shot mode; `data/roster.json`
  gitignored; 12 new tests.
- **Decided:** Persistence is CWD-relative `data/roster.json`; load validates every stored
  cat via `makeCat` and fails loud on corrupt/hand-edited files; REPL saves after each mutation;
  zero new dependencies (`readline/promises`, `fs` are Node built-ins).
- **Broke / fixed:** `npm start` opens REPL instead of printing help (`npm start -- help`
  still works); one-shot `list` shows saved roster.
- **Next:** REPL formatting and sample cat data.

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
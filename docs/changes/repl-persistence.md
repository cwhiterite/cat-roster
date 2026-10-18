# repl-persistence (interactive session + JSON storage)

## Log  -> progress.md *Log*

- **Date:** 2026-10-18
- **Did:** Added `src/storage.ts` (load/save `data/roster.json`, validation on
  load) and `src/repl.ts` (quote-aware tokenizer + `cat>` session on
  `node:readline/promises`); `src/index.ts` now opens the REPL with no args and
  loads/saves in one-shot mode; `data/roster.json` gitignored; 12 new tests
  (37 total).
- **Decided:** Persistence is CWD-relative `data/roster.json`; load validates
  every stored cat via `makeCat` and fails loud on corrupt/hand-edited files;
  REPL saves after each mutation; zero new dependencies (`readline/promises`,
  `fs` are Node built-ins).
- **Broke / fixed:** `npm start` now opens the REPL instead of printing help
  (`npm start -- help` still works); one-shot `list` shows the saved roster.
- **Next:** optional `edit` / `remove` commands.

## Known gotchas  -> progress.md *Known gotchas*

- Data path is relative to CWD — run from the project root (or adjust the path
  if the binary moves).
- Toughening `makeCat` rules later can make existing `data/roster.json` files
  fail to load — validation runs on every load.

## Impact map rows  -> architecture.md *Change impact map*

| If you change… | Also check / update… | Why | Guarded by test |
| -------------- | -------------------- | --- | --------------- |
| `makeCat` validation rules | `loadRoster` (stored cats are validated on load) | A stricter rule can brick existing rosters | `test/storage.test.ts` |
| Roster file format (`Cat` fields) | `data/roster.json`, README Usage | The file format mirrors the `Cat` type | `test/storage.test.ts` |
| REPL commands / prompts | `npm start` behavior, README Usage | Interactive and one-shot share `parseCommand` | `test/repl.test.ts` |

## Architecture updates  -> architecture.md *Modules / Components / Key flows / Data*

- New modules: `src/storage.ts`, `src/repl.ts`; `src/index.ts` gained load/save
  orchestration and a REPL entry.
- Data: the roster now persists to `data/roster.json` (CWD-relative); `makeCat`
  validates both CLI input and stored data.
- Key flows: `index.ts` -> `runRepl` (interactive) or `parseCommand`/`execute`
  (one-shot), both backed by `loadRoster`/`saveRoster`.

## ADRs drafted  -> adr/README.md index

- None (Node built-ins only; storage approach recorded in architecture).

## AGENTS.md proposals  -> for the human to approve

- None.
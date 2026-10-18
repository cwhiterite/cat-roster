# cat-model-cli (in-memory commands)

## Log  -> progress.md *Log*

- **Date:** 2026-10-18
- **Did:** Added runtime model validation (`parseDramaLevel`, `makeCat` in
  `src/cat.ts`); new `src/cli.ts` (`parseCommand`, `execute`) with
  `add`/`list`/`show`/`help`; rewrote `src/index.ts` as a thin dispatcher
  (errors to stderr + exit 1); added `@types/node` devDep and
  `"types": ["node"]` to `tsconfig.json`; added README Usage section.
- **Decided:** Hand-rolled arg parsing (no runtime deps); default drama level 3;
  roster stays in-memory per run (JSON persistence is the next branch).
- **Broke / fixed:** `src/index.ts` no longer prints the Miso/Wasabi sample;
  plain `npm start` now shows help text.
- **Next:** JSON persistence (`data/roster.json`).

## Known gotchas  -> progress.md *Known gotchas*

- **TypeScript 7 does not auto-include `@types/*` packages.** Needed an explicit
  `"types": ["node"]` in `tsconfig.json` or `tsc` fails with TS2591 on `process`
  even with `@types/node` installed.

## Impact map rows  -> architecture.md *Change impact map*

| If you change… | Also check / update… | Why | Guarded by test |
| -------------- | -------------------- | --- | --------------- |
| `Cat` fields / `makeCat` validation | `cli.ts` `parseAdd`, help text, README Usage examples | CLI builds cats from raw strings | `test/cli.test.ts` |
| CLI command set | `src/index.ts` dispatcher, help text, README Usage | A command surfaces in three places | `test/cli.test.ts` |

## Architecture updates  -> architecture.md *Modules / Components / Key flows / Data*

- New module `src/cli.ts` (command parsing + execution); `src/index.ts` is now a
  10-line dispatcher; new `test/cli.test.ts` (16 tests).
- Key flow: `argv` -> `parseCommand` -> `execute` -> stdout / stderr + exit code.

## ADRs drafted  -> adr/README.md index

- None.

## AGENTS.md proposals  -> for the human to approve

- None.
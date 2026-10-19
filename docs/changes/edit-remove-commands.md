# edit-remove-commands

## Log  -> progress.md *Log*

- **Date:** 2026-10-19
- **Did:** Added `edit` and `remove` (with `rm`/`delete` aliases) commands to
  `src/cli.ts`; supported partial updates via `--name`, `--breed`, `--personality`,
  `--activities`, and `--drama` with collision detection and validation via `makeCat`;
  updated CLI help text and `README.md` Usage; added unit and REPL tests (51 passing).
- **Decided:** Both interactive REPL and one-shot modes inherit `edit` and `remove`
  via `execute`, persisting mutations to `data/roster.json`; renaming checks for
  existing cat name collisions.
- **Broke / fixed:** —
- **Next:** Optional: protect `main` on GitHub.

## Impact map rows  -> architecture.md *Change impact map*

| If you change… | Also check / update… | Why | Guarded by test |
| -------------- | -------------------- | --- | --------------- |
| `Command` set / flags | `src/cli.ts` help text, `README.md` Usage | Commands and options are documented in both places | `test/cli.test.ts` |

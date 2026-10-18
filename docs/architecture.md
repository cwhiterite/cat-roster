# Architecture

> Agents read this instead of scanning the whole codebase. Keep it accurate and terse.
> **Don't edit this on a feature branch.** `sync-docs` writes to `docs/changes/<branch>.md`;
> `consolidate-docs` folds those fragments in here. Check `docs/changes/` for newer impact rows.

## Overview

Cat Roster is a single-user CLI that keeps a roster of cats (name, breed,
personality, favorite activities, drama level). The CLI entry (`src/index.ts`)
dispatches parsed commands from `src/cli.ts` against the domain model
(`src/cat.ts`). Commands: `add` / `list` / `show`. The roster is in-memory and
resets each run; JSON persistence is planned.

## Components

```mermaid
flowchart LR
    CLI["CLI entry (src/index.ts)"] --> CMD["Commands (src/cli.ts)"]
    CMD --> DOM["Domain model (src/cat.ts)"]
    DOM --> FILE[("roster.json — planned")]
```

## Modules

| Module | Path | Responsibility | Depends on |
| ------ | ---- | -------------- | ---------- |
| CLI entry | `src/index.ts` | Parses argv and dispatches, prints result, sets exit code | `src/cli.ts` |
| CLI layer | `src/cli.ts` | `parseCommand`, `execute`; `add`/`list`/`show`/`help` | `src/cat.ts` |
| Cat model | `src/cat.ts` | `Cat`, `makeCat`, `parseDramaLevel`, `catSummary()` | — |
| Tests | `test/cat.test.ts`, `test/cli.test.ts` | Vitest coverage for model and CLI | `src/cat.ts`, `src/cli.ts` |

## Key flows

Run the CLI:

```mermaid
sequenceDiagram
    participant U as User
    participant C as CLI entry (index.ts)
    participant P as CLI layer (cli.ts)
    participant M as Cat model
    U->>C: node dist/index.js <command>
    C->>P: parseCommand(argv)
    P-->>C: command or error
    C->>P: execute(command, roster)
    P->>M: makeCat / catSummary / rosterSummary
    M-->>P: result
    P-->>C: output + exit code
    C-->>U: stdout / stderr
```

## Change impact map

**"If you change X, also check Y."** The most important section in this file.

Add a row whenever:

- a change in one place broke something somewhere else, or
- two parts are coupled in a way that isn't obvious from imports (shared names,
  config keys, column order, file formats, env vars, etc.).

| If you change… | Also check / update… | Why | Guarded by test |
| -------------- | -------------------- | --- | --------------- |
| `Cat` fields in `src/cat.ts` | `catSummary`, `rosterSummary`, sample roster in `src/index.ts` | Summary text and samples embed field values | `test/cat.test.ts` |
| Module layout of `src/` or `test/` | `AGENTS.md` *Where things live*, `README.md` layout | Both tables mirror the layout | — |
| Package manager / test script | `AGENTS.md` *Commands*, `README.md` | Commands are duplicated in both | — |
| `Cat` fields / `makeCat` validation | `cli.ts` `parseAdd`, help text, README Usage examples | CLI builds cats from raw strings | `test/cli.test.ts` |
| CLI command set | `src/index.ts` dispatcher, help text, README Usage | A command surfaces in three places | `test/cli.test.ts` |

## Data

No database. The roster is in-memory and starts empty each run; `add` appends
for the life of the process. JSON file persistence (`data/roster.json`) is
planned. The schema lives with the `Cat` type in `src/cat.ts`.
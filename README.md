# Cat Roster

A TypeScript CLI for tracking the cats in your household: **name, breed,
personality, favorite activities, and drama level**.

No servers, no database. The roster is an in-memory model, with JSON file
persistence planned. Everything runs from the command line.

Built for a solo developer working with AI agents — the repo ships the
`plan -> build -> review -> sync-docs` workflow and a set of agent skills to
run it.

## Stack

- **Node 22+** (ESM), **TypeScript** (strict) — see [ADR 0002](docs/adr/0002-stack-choice.md).
- **Vitest** for tests, **npm** for packages.

## Quick start

```powershell
npm install
npm start        # builds and runs the CLI
```

## Commands

| Task             | Command                                  |
| ---------------- | ---------------------------------------- |
| Install          | `npm install`                            |
| Run              | `npm start`                              |
| Build            | `npm run build`                          |
| Test (all)       | `npm test`                               |
| Test (one file)  | `npx vitest run test/cat.test.ts`        |
| Typecheck        | `npm run typecheck`                      |

## Usage

The roster is in-memory: every run starts empty, so `add` is mainly useful to
preview the format until persistence lands.

```powershell
npm start                                            # help text
npm start -- add Miso --breed Tabby --personality "sweet chaos" --activities "boxes,sunbeams" --drama 4
npm start -- list                                    # "(no cats yet)" in a fresh run
npm start -- show Miso
```

To call the compiled CLI directly (no npm passthrough):

```powershell
node dist/index.js add Miso --breed Tabby --personality "sweet chaos" --activities "boxes,sunbeams" --drama 4
```

- `list` — one line per cat, or `(no cats yet)`.
- `show <name>` — one cat's summary, case-insensitive name match.
- `add <name> --breed <b> --personality <p> [--activities a,b] [--drama 1-5]` —
  drama defaults to 3; invalid input prints an error to stderr and exits 1.

## Repo layout

| Path                     | What                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `src/`                   | CLI entry (`index.ts`) and domain model (`cat.ts`)          |
| `test/`                  | Vitest tests, one file per module                           |
| `AGENTS.md`              | Agent onboarding: stack, commands, hard rules.              |
| `docs/`                  | Progress, architecture, workflow, ADRs, per-branch fragments |
| `.agents/skills/`        | `plan` -> `build` -> `review` -> `sync-docs`, plus `merge`, `consolidate-docs` |
| `scripts/`               | `agent-worktree.ps1` for parallel agents                    |

## Status

| Item | Status |
| ---- | ------ |
| Scaffold: TypeScript + Vitest, docs filled in, ADR 0002 (stack choice) | Done |
| Cat model: fields, defaults, validation (`parseDramaLevel`, `makeCat`) | Done |
| CLI commands: add / list / show (in-memory, resets each run) | Done |
| JSON persistence (`data/roster.json`) | Planned |

New items start with a blank Status until they're specced.

## Day-to-day

- **One agent:** open the repo and ask it to plan an issue. It follows the skills.
- **Two or three agents:** run `.\scripts\agent-worktree.ps1 -Name <issue#>-<name>`
  once per agent, have each agent plan, then compare the plans and split into
  waves. Full flow: [`docs/workflow.md`](docs/workflow.md).
- **Docs:** run `consolidate-docs` to fold `docs/changes/` into the master docs.
- **Review:** ask a second agent to run the `review` skill on a PR.

## Decisions

- [ADR 0001](docs/adr/0001-parallel-agents-workflow.md) — parallel-agents workflow.
- [ADR 0002](docs/adr/0002-stack-choice.md) — stack: Node + TypeScript + Vitest.
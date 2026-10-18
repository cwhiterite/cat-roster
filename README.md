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

- [x] Scaffold: TypeScript + Vitest, docs filled in, ADR 0002 (stack choice)
- [ ] Finalize the cat model (fields, defaults, validation)
- [ ] CLI commands: add / list / show
- [ ] JSON persistence (`data/roster.json`)

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
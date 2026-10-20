# merge-script-and-workflow-rules

## Log  -> progress.md *Log*

- **Date:** 2026-10-20
- **Did:** Added `scripts/merge-pr.ps1` for automating post-PR merge ritual (GitHub merge, branch deletion, linked worktree cleanup, and fragment checks) with `-WhatIf` and `-Strategy` flags; harmonized `.agents/skills/plan/SKILL.md` Fast lane policy with `AGENTS.md` Hard Rule 4 (exempting only docs/comment/typo edits from full test runs); documented `merge-pr.ps1` in `AGENTS.md` and `.agents/skills/merge/SKILL.md`; added Rules 9–11 and Status/Code/PR conventions in `AGENTS.md`.
- **Decided:** `merge-pr.ps1` is dedicated as a human convenience tool, preserving agent boundary rules; script uses `git worktree list --porcelain` to detect and safely clean up linked worktrees before branch deletion.
- **Broke / fixed:** Fixed PowerShell native command stderr handling during `gh` queries under `$ErrorActionPreference = "Stop"` so absent PRs do not produce terminating NativeCommandError exceptions.
- **Next:** Push branch and create PR for human review and merge.

## Known gotchas  -> progress.md *Known gotchas*

- **PowerShell NativeCommandError with external CLIs:** Under `$ErrorActionPreference = "Stop"`, commands writing to stderr (such as `gh pr view` when no PR matches) trigger terminating exceptions. Wrap or lower `$ErrorActionPreference` to `"Continue"` during stderr probes.
- **Git worktree branch deletion lock:** `git branch -d <branch>` fails if that branch is still checked out in an active worktree. Check `git worktree list` and remove the worktree before deleting the local branch.

## Architecture updates  -> architecture.md *Modules / Components / Key flows / Data*

- Added `scripts/merge-pr.ps1` to helper scripts collection for human operators.

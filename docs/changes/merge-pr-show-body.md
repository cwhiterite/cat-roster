# merge-pr-show-body

## Log  -> progress.md *Log*

- **Date:** 2026-10-20
- **Did:** Enhanced `scripts/merge-pr.ps1` `-WhatIf` mode to display the PR URL and render the full PR body description formatted in a boxed preview in the terminal.
- **Decided:** Include the PR description by default during `-WhatIf` previews so operators can inspect the full context before merging without extra flags.
- **Broke / fixed:** —
- **Next:** Push branch and open PR.

## Architecture updates  -> architecture.md *Modules / Components / Key flows / Data*

- `scripts/merge-pr.ps1`: `-WhatIf` previews now query `body` and `url` from `gh pr view` and render the formatted description.

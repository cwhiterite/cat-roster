import { execute, parseCommand } from "./cli.js";
import { runRepl } from "./repl.js";
import { DEFAULT_ROSTER_PATH, loadRoster, saveRoster } from "./storage.js";

const argv = process.argv.slice(2);

// No arguments: interactive session with a disk-backed roster.
if (argv.length === 0) {
  await runRepl({
    input: process.stdin,
    output: process.stdout,
    roster: loadRoster(DEFAULT_ROSTER_PATH),
    onSave: (roster) => saveRoster(DEFAULT_ROSTER_PATH, roster),
  });
  process.exit(0);
}

// One-shot mode: load, run, persist if the roster changed, exit with a code.
const parsed = parseCommand(argv);
if (parsed.status === "error") {
  console.error(parsed.message);
  process.exit(1);
}

const roster = loadRoster(DEFAULT_ROSTER_PATH);
const result = execute(parsed.command, roster);
if (result.roster !== roster) {
  saveRoster(DEFAULT_ROSTER_PATH, result.roster);
}
console.log(result.output);
process.exit(result.exitCode);
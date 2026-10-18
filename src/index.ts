import { execute, parseCommand } from "./cli.js";

const argv = process.argv.slice(2);

const parsed = parseCommand(argv);
if (parsed.status === "error") {
  console.error(parsed.message);
  process.exit(1);
}

// The roster is in-memory: every run starts empty (persistence is planned).
const result = execute(parsed.command, []);
console.log(result.output);
process.exit(result.exitCode);
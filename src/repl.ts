import { createInterface } from "node:readline/promises";
import { execute, parseCommand } from "./cli.js";
import type { Cat } from "./cat.js";

export interface ReplOptions {
  input: NodeJS.ReadableStream;
  output: NodeJS.WritableStream;
  roster: Cat[];
  /** Called with the updated roster whenever a command mutates it. */
  onSave: (roster: readonly Cat[]) => void;
}

/**
 * Splits a typed line into arguments, honouring double and single quotes,
 * so `add Miso --personality "sweet chaos"` behaves like shell argv.
 */
export function splitArgs(line: string): string[] {
  const args: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(line)) !== null) {
    args.push(match[1] ?? match[2] ?? match[3]);
  }
  return args;
}

/**
 * Runs an interactive session: prompts for commands, keeps the roster in
 * memory for the session, persists after mutations, and survives bad input.
 * Ends on `exit`/`quit`, Ctrl+C, or end of input.
 */
export async function runRepl(options: ReplOptions): Promise<void> {
  const { input, output, onSave } = options;
  let roster: readonly Cat[] = options.roster;

  const readline = createInterface({ input, output, prompt: "cat> " });
  const write = (text: string): void => {
    output.write(`${text}\n`);
  };

  write("🐱 Welcome to Cat Roster!");
  write("Type 'help' for commands, 'list' to view cats, or 'exit' to quit.\n");

  readline.prompt();
  for await (const raw of readline) {
    const line = raw.trim();
    if (line === "exit" || line === "quit") {
      write("bye");
      break;
    }
    if (line === "") {
      readline.prompt();
      continue;
    }

    const parsed = parseCommand(splitArgs(line));
    if (parsed.status === "error") {
      write(parsed.message);
      readline.prompt();
      continue;
    }

    const result = execute(parsed.command, roster);
    write(result.output);
    if (result.roster !== roster) {
      roster = result.roster;
      onSave(roster);
    }
    readline.prompt();
  }

  readline.close();
}
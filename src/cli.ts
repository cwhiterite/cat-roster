import { catSummary, makeCat, rosterSummary, type Cat } from "./cat.js";

export type Command =
  | { kind: "add"; cat: Cat }
  | { kind: "list" }
  | { kind: "show"; name: string }
  | { kind: "help" };

export type ParsedCommand =
  | { status: "ok"; command: Command }
  | { status: "error"; message: string };

/** Parses CLI arguments into a command, or returns a user-facing error. */
export function parseCommand(argv: readonly string[]): ParsedCommand {
  const [head, ...rest] = argv;
  switch (head) {
    case undefined:
    case "-h":
    case "--help":
    case "help":
      return { status: "ok", command: { kind: "help" } };
    case "list":
      return { status: "ok", command: { kind: "list" } };
    case "show": {
      const name = rest[0]?.trim();
      if (!name) {
        return { status: "error", message: "usage: cat-roster show <name>" };
      }
      return { status: "ok", command: { kind: "show", name } };
    }
    case "add":
      return parseAdd(rest);
    default:
      return {
        status: "error",
        message: `unknown command: "${head}" (try: cat-roster help)`,
      };
  }
}

const DEFAULT_DRAMA_LEVEL = 3;

function parseAdd(argv: readonly string[]): ParsedCommand {
  const rawName = argv[0];
  if (!rawName) {
    return {
      status: "error",
      message:
        "usage: cat-roster add <name> --breed <b> --personality <p> [--activities a,b] [--drama 1-5]",
    };
  }

  let breed = "";
  let personality = "";
  const activityLists: string[] = [];
  let dramaRaw = "";

  let i = 1;
  while (i < argv.length) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case "--breed":
        breed = value ?? "";
        break;
      case "--personality":
        personality = value ?? "";
        break;
      case "--activities":
        if (value) activityLists.push(value);
        break;
      case "--drama":
        dramaRaw = value ?? "";
        break;
      default:
        return {
          status: "error",
          message: `unknown flag: "${flag}" (usage: --breed, --personality, --activities, --drama)`,
        };
    }
    i += 2;
  }

  try {
    const cat = makeCat({
      name: rawName,
      breed,
      personality,
      favoriteActivities: activityLists.flatMap((list) => list.split(",")),
      dramaLevel: dramaRaw === "" ? DEFAULT_DRAMA_LEVEL : Number(dramaRaw),
    });
    return { status: "ok", command: { kind: "add", cat } };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export interface ExecuteResult {
  output: string;
  roster: readonly Cat[];
  exitCode: number;
}

/** Runs a parsed command against an in-memory roster. */
export function execute(command: Command, roster: readonly Cat[]): ExecuteResult {
  switch (command.kind) {
    case "help":
      return {
        output: [
          "cat-roster — track household cats",
          "",
          "usage:",
          "  cat-roster list                    list all cats",
          "  cat-roster show <name>             show one cat",
          "  cat-roster add <name> --breed <b> --personality <p>",
          "                                    [--activities a,b] [--drama 1-5]",
          "",
          "note: the roster is in-memory and resets when the command exits.",
        ].join("\n"),
        roster,
        exitCode: 0,
      };
    case "list":
      return { output: rosterSummary(roster), roster, exitCode: 0 };
    case "show": {
      const cat = roster.find(
        (candidate) => candidate.name.toLowerCase() === command.name.toLowerCase(),
      );
      if (!cat) {
        return { output: `no cat named "${command.name}"`, roster, exitCode: 1 };
      }
      return { output: catSummary(cat), roster, exitCode: 0 };
    }
    case "add":
      return {
        output: `added ${command.cat.name} (drama level ${command.cat.dramaLevel}/5)`,
        roster: [...roster, command.cat],
        exitCode: 0,
      };
  }
}
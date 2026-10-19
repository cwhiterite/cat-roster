import { catSummary, formatDrama, makeCat, rosterSummary, type Cat } from "./cat.js";

export type CatUpdates = {
  name?: string;
  breed?: string;
  personality?: string;
  favoriteActivities?: string[];
  dramaLevel?: number;
};

export type Command =
  | { kind: "add"; cat: Cat }
  | { kind: "list" }
  | { kind: "show"; name: string }
  | { kind: "edit"; name: string; updates: CatUpdates }
  | { kind: "remove"; name: string }
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
    case "edit":
      return parseEdit(rest);
    case "remove":
    case "rm":
    case "delete": {
      const name = rest[0]?.trim();
      if (!name) {
        return { status: "error", message: "usage: cat-roster remove <name>" };
      }
      return { status: "ok", command: { kind: "remove", name } };
    }
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

function parseEdit(argv: readonly string[]): ParsedCommand {
  const targetName = argv[0]?.trim();
  if (!targetName) {
    return {
      status: "error",
      message:
        "usage: cat-roster edit <name> [--name <n>] [--breed <b>] [--personality <p>] [--activities a,b] [--drama 1-5]",
    };
  }

  let newName: string | undefined;
  let breed: string | undefined;
  let personality: string | undefined;
  const activityLists: string[] = [];
  let dramaRaw: string | undefined;
  let hasActivities = false;

  let i = 1;
  while (i < argv.length) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case "--name":
        newName = value ?? "";
        break;
      case "--breed":
        breed = value ?? "";
        break;
      case "--personality":
        personality = value ?? "";
        break;
      case "--activities":
        hasActivities = true;
        if (value) activityLists.push(value);
        break;
      case "--drama":
        dramaRaw = value ?? "";
        break;
      default:
        return {
          status: "error",
          message: `unknown flag: "${flag}" (usage: --name, --breed, --personality, --activities, --drama)`,
        };
    }
    i += 2;
  }

  if (
    newName === undefined &&
    breed === undefined &&
    personality === undefined &&
    !hasActivities &&
    dramaRaw === undefined
  ) {
    return {
      status: "error",
      message:
        "usage: cat-roster edit <name> [--name <n>] [--breed <b>] [--personality <p>] [--activities a,b] [--drama 1-5]",
    };
  }

  const updates: CatUpdates = {};
  if (newName !== undefined) updates.name = newName;
  if (breed !== undefined) updates.breed = breed;
  if (personality !== undefined) updates.personality = personality;
  if (hasActivities) {
    updates.favoriteActivities = activityLists.flatMap((list) => list.split(","));
  }
  if (dramaRaw !== undefined) {
    updates.dramaLevel = Number(dramaRaw);
  }

  return { status: "ok", command: { kind: "edit", name: targetName, updates } };
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
          "  cat-roster edit <name> [--name <n>] [--breed <b>] [--personality <p>]",
          "                        [--activities a,b] [--drama 1-5]",
          "  cat-roster remove <name>           remove a cat",
          "",
          "note: changes persist automatically to data/roster.json.",
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
        output: `added ${command.cat.name} 🐾 (drama level: ${formatDrama(command.cat.dramaLevel)} ${command.cat.dramaLevel}/5)`,
        roster: [...roster, command.cat],
        exitCode: 0,
      };
    case "remove": {
      const cat = roster.find(
        (candidate) => candidate.name.toLowerCase() === command.name.toLowerCase(),
      );
      if (!cat) {
        return { output: `no cat named "${command.name}"`, roster, exitCode: 1 };
      }
      const updatedRoster = roster.filter(
        (candidate) => candidate.name.toLowerCase() !== command.name.toLowerCase(),
      );
      return {
        output: `removed ${cat.name} 🐾`,
        roster: updatedRoster,
        exitCode: 0,
      };
    }
    case "edit": {
      const catIndex = roster.findIndex(
        (candidate) => candidate.name.toLowerCase() === command.name.toLowerCase(),
      );
      if (catIndex === -1) {
        return { output: `no cat named "${command.name}"`, roster, exitCode: 1 };
      }
      const targetCat = roster[catIndex];

      if (
        command.updates.name &&
        command.updates.name.toLowerCase() !== targetCat.name.toLowerCase()
      ) {
        const nameCollision = roster.find(
          (candidate, i) =>
            i !== catIndex &&
            candidate.name.toLowerCase() === command.updates.name!.trim().toLowerCase(),
        );
        if (nameCollision) {
          return {
            output: `a cat named "${command.updates.name.trim()}" already exists`,
            roster,
            exitCode: 1,
          };
        }
      }

      try {
        const updatedCat = makeCat({
          name: command.updates.name ?? targetCat.name,
          breed: command.updates.breed ?? targetCat.breed,
          personality: command.updates.personality ?? targetCat.personality,
          favoriteActivities:
            command.updates.favoriteActivities ?? targetCat.favoriteActivities,
          dramaLevel: command.updates.dramaLevel ?? targetCat.dramaLevel,
        });

        const updatedRoster = [...roster];
        updatedRoster[catIndex] = updatedCat;

        return {
          output: `updated ${updatedCat.name} 🐾 (drama level: ${formatDrama(updatedCat.dramaLevel)} ${updatedCat.dramaLevel}/5)`,
          roster: updatedRoster,
          exitCode: 0,
        };
      } catch (error) {
        return {
          output: error instanceof Error ? error.message : String(error),
          roster,
          exitCode: 1,
        };
      }
    }
  }
}
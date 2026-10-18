import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { makeCat, type Cat } from "./cat.js";

/** Where the roster lives, relative to the current working directory. */
export const DEFAULT_ROSTER_PATH = join("data", "roster.json");

/** True when a read failed because the file doesn't exist yet. */
function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}

/**
 * Loads the roster from a JSON file. A missing file means an empty roster;
 * a file that is corrupt, not an array, or contains an invalid cat fails loud
 * with the file name so hand-edits can't silently corrupt data.
 */
export function loadRoster(filePath: string): Cat[] {
  let text: string;
  try {
    text = readFileSync(filePath, "utf8");
  } catch (error) {
    if (isMissingFile(error)) {
      return [];
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`${filePath} is not valid JSON`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`${filePath} must contain a JSON array of cats`);
  }

  return parsed.map((entry, index) => {
    try {
      return makeCat(entry as Parameters<typeof makeCat>[0]);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`${filePath}: invalid cat at index ${index}: ${reason}`);
    }
  });
}

/** Writes the roster to a JSON file, creating parent directories as needed. */
export function saveRoster(filePath: string, cats: readonly Cat[]): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(cats, null, 2) + "\n", "utf8");
}
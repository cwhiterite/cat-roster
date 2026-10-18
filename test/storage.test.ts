import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadRoster, saveRoster } from "../src/storage.js";
import { makeCat, type Cat } from "../src/cat.js";

let dir: string | undefined;

afterEach(() => {
  if (dir) {
    rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  }
});

function tempFile(name = "roster.json"): string {
  dir = mkdtempSync(join(tmpdir(), "cat-roster-"));
  return join(dir, name);
}

const miso: Cat = makeCat({
  name: "Miso",
  breed: "Tabby",
  personality: "sweet chaos",
  favoriteActivities: ["boxes", "sunbeams"],
  dramaLevel: 4,
});

describe("loadRoster", () => {
  it("returns an empty roster for a missing file", () => {
    expect(loadRoster(tempFile("does-not-exist.json"))).toEqual([]);
  });

  it("round-trips cats through saveRoster", () => {
    const file = tempFile();
    saveRoster(file, [miso]);
    expect(loadRoster(file)).toEqual([miso]);
  });

  it("keeps nested-folder paths working by creating them on save", () => {
    const file = tempFile("deep/nested/roster.json");
    saveRoster(file, []);
    expect(readFileSync(file, "utf8")).toContain("[]");
  });

  it("throws a clear error on corrupt JSON", () => {
    const file = tempFile();
    writeFileSync(file, "{not json", "utf8");
    expect(() => loadRoster(file)).toThrow(/not valid JSON/);
  });

  it("throws on a non-array root value", () => {
    const file = tempFile();
    writeFileSync(file, '{"name":"Miso"}', "utf8");
    expect(() => loadRoster(file)).toThrow(/array/);
  });

  it("rejects an invalid cat with its index and reason", () => {
    const file = tempFile();
    writeFileSync(file, '[{"name":"","breed":"Tabby","personality":"x","favoriteActivities":[],"dramaLevel":3}]', "utf8");
    expect(() => loadRoster(file)).toThrow(/invalid cat at index 0.*name/);
  });
});
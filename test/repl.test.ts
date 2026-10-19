import { Writable } from "node:stream";
import { Readable } from "node:stream";
import { describe, expect, it } from "vitest";
import { runRepl, splitArgs } from "../src/repl.js";
import type { Cat } from "../src/cat.js";

function sessionOutput(): { collect: () => string; sink: Writable } {
  let text = "";
  const sink = new Writable({
    write(chunk: unknown, _enc: string, callback: (error?: Error | null) => void) {
      text += String(chunk);
      callback();
    },
  });
  return { collect: () => text, sink };
}

function runSession(lines: readonly string[], roster: Cat[] = []) {
  const { collect, sink } = sessionOutput();
  const input = Readable.from([...lines.map((line) => `${line}\n`), "\n"]);
  const saves: Cat[][] = [];
  return {
    promise: runRepl({
      input,
      output: sink,
      roster,
      onSave: (next) => saves.push([...next]),
    }),
    collect,
    saves,
  };
}

describe("splitArgs", () => {
  it("splits on whitespace", () => {
    expect(splitArgs("add Miso --breed Tabby")).toEqual(["add", "Miso", "--breed", "Tabby"]);
  });

  it("keeps double- and single-quoted values intact", () => {
    expect(splitArgs('add Miso --personality "sweet chaos"')).toEqual([
      "add",
      "Miso",
      "--personality",
      "sweet chaos",
    ]);
    expect(splitArgs("show 'Miso the Third'")).toEqual(["show", "Miso the Third"]);
  });

  it("keeps empty quoted strings", () => {
    expect(splitArgs('add Miso --personality ""')).toEqual(["add", "Miso", "--personality", ""]);
  });
});

describe("runRepl", () => {
  it("runs add, list, and exit in one session, saving on add", async () => {
    const session = runSession(["add Miso --breed Tabby --personality quiet --drama 4", "list", "exit"]);
    await session.promise;

    const output = session.collect();
    expect(output).toContain("added Miso");
    expect(output).toContain("Miso (Tabby)");
    expect(output).toContain("bye");
    expect(session.saves).toHaveLength(1);
    expect(session.saves[0]).toHaveLength(1);
    expect(session.saves[0][0].name).toBe("Miso");
  });

  it("reuses the existing roster across commands in the session", async () => {
    const existing: Cat[] = [
      {
        name: "Wasabi",
        breed: "Siamese",
        personality: "dignified",
        favoriteActivities: ["yelling at 5am"],
        dramaLevel: 2,
      },
    ];
    const session = runSession(["list", "exit"], existing);
    await session.promise;
    expect(session.collect()).toContain("Wasabi (Siamese)");
    expect(session.saves).toHaveLength(0);
  });

  it("keeps the session alive after an unknown command or parse error", async () => {
    const session = runSession(["frobnicate", "add Miso", "list", "exit"]);
    await session.promise;

    const output = session.collect();
    expect(output).toContain("🐱 Welcome to Cat Roster!");
    expect(output).toContain('unknown command: "frobnicate"');
    expect(output).toContain("breed is required");
    expect(output).toContain("(no cats yet)");
    expect(output).toContain("bye");
  });
});
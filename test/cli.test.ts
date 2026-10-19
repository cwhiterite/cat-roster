import { describe, expect, it } from "vitest";
import { execute, parseCommand } from "../src/cli.js";
import { type Cat } from "../src/cat.js";

const miso: Cat = {
  name: "Miso",
  breed: "Tabby",
  personality: "sweet chaos",
  favoriteActivities: ["boxes", "sunbeams"],
  dramaLevel: 4,
};

describe("parseCommand", () => {
  it("parses no args and help variants as help", () => {
    for (const argv of [[], ["-h"], ["--help"], ["help"]]) {
      expect(parseCommand(argv)).toEqual({ status: "ok", command: { kind: "help" } });
    }
  });

  it("parses list", () => {
    expect(parseCommand(["list"])).toEqual({ status: "ok", command: { kind: "list" } });
  });

  it("parses show with a name", () => {
    expect(parseCommand(["show", "Miso"])).toEqual({
      status: "ok",
      command: { kind: "show", name: "Miso" },
    });
  });

  it("rejects show without a name", () => {
    expect(parseCommand(["show"])).toEqual({
      status: "error",
      message: expect.stringMatching(/show <name>/),
    });
  });

  it("parses an add with all flags", () => {
    const parsed = parseCommand([
      "add",
      "Miso",
      "--breed",
      "Tabby",
      "--personality",
      "sweet chaos",
      "--activities",
      "boxes,sunbeams",
      "--drama",
      "4",
    ]);
    expect(parsed).toEqual({
      status: "ok",
      command: {
        kind: "add",
        cat: miso,
      },
    });
  });

  it("defaults drama to 3 when not given", () => {
    const parsed = parseCommand(["add", "Miso", "--breed", "Tabby", "--personality", "quiet"]);
    expect(parsed.status).toBe("ok");
    if (parsed.status === "ok" && parsed.command.kind === "add") {
      expect(parsed.command.cat.dramaLevel).toBe(3);
      expect(parsed.command.cat.favoriteActivities).toEqual([]);
    }
  });

  it("rejects an out-of-range drama level with a helpful message", () => {
    const parsed = parseCommand(["add", "Miso", "--breed", "Tabby", "--personality", "quiet", "--drama", "9"]);
    expect(parsed.status).toBe("error");
    if (parsed.status === "error") {
      expect(parsed.message).toMatch(/1-5/);
    }
  });

  it("rejects missing required fields", () => {
    const parsed = parseCommand(["add", "Miso"]);
    expect(parsed.status).toBe("error");
    if (parsed.status === "error") {
      expect(parsed.message).toMatch(/breed/);
    }
  });

  it("rejects unknown flags", () => {
    const parsed = parseCommand(["add", "Miso", "--wat"]);
    expect(parsed.status).toBe("error");
    if (parsed.status === "error") {
      expect(parsed.message).toMatch(/unknown flag/);
    }
  });

  it("parses remove with a name, including aliases", () => {
    for (const cmd of ["remove", "rm", "delete"]) {
      expect(parseCommand([cmd, "Miso"])).toEqual({
        status: "ok",
        command: { kind: "remove", name: "Miso" },
      });
    }
  });

  it("rejects remove without a name", () => {
    expect(parseCommand(["remove"])).toEqual({
      status: "error",
      message: expect.stringMatching(/remove <name>/),
    });
  });

  it("parses edit with flags", () => {
    const parsed = parseCommand([
      "edit",
      "Miso",
      "--name",
      "Miso Soup",
      "--personality",
      "chaotic good",
      "--drama",
      "5",
      "--activities",
      "napping,snacking",
    ]);
    expect(parsed).toEqual({
      status: "ok",
      command: {
        kind: "edit",
        name: "Miso",
        updates: {
          name: "Miso Soup",
          personality: "chaotic good",
          dramaLevel: 5,
          favoriteActivities: ["napping", "snacking"],
        },
      },
    });
  });

  it("rejects edit without a name or flags", () => {
    expect(parseCommand(["edit"])).toEqual({
      status: "error",
      message: expect.stringMatching(/edit <name>/),
    });
    expect(parseCommand(["edit", "Miso"])).toEqual({
      status: "error",
      message: expect.stringMatching(/edit <name>/),
    });
  });

  it("rejects edit with unknown flag", () => {
    expect(parseCommand(["edit", "Miso", "--bogus"])).toEqual({
      status: "error",
      message: expect.stringMatching(/unknown flag/),
    });
  });

  it("rejects unknown commands", () => {
    expect(parseCommand(["frobnicate"])).toEqual({
      status: "error",
      message: expect.stringMatching(/unknown command/),
    });
  });
});

describe("execute", () => {
  it("lists the roster one line per cat", () => {
    const result = execute({ kind: "list" }, [miso]);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("Miso (Tabby)");
  });

  it("shows \"(no cats yet)\" for an empty roster", () => {
    const result = execute({ kind: "list" }, []);
    expect(result.output).toBe("(no cats yet)");
  });

  it("shows a cat by name, case-insensitively", () => {
    const result = execute({ kind: "show", name: "miso" }, [miso]);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("drama level 4/5");
  });

  it("reports a missing cat with exit code 1", () => {
    const result = execute({ kind: "show", name: "Wasabi" }, [miso]);
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('no cat named "Wasabi"');
  });

  it("adds a cat to the roster", () => {
    const result = execute({ kind: "add", cat: miso }, []);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("added Miso");
    expect(result.roster).toEqual([miso]);
  });

  it("removes a cat from the roster case-insensitively", () => {
    const result = execute({ kind: "remove", name: "miso" }, [miso]);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("removed Miso");
    expect(result.roster).toEqual([]);
  });

  it("reports an error when removing a nonexistent cat", () => {
    const result = execute({ kind: "remove", name: "Wasabi" }, [miso]);
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('no cat named "Wasabi"');
    expect(result.roster).toEqual([miso]);
  });

  it("edits an existing cat's fields", () => {
    const result = execute(
      {
        kind: "edit",
        name: "miso",
        updates: { personality: "super sweet", dramaLevel: 5 },
      },
      [miso],
    );
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("updated Miso");
    expect(result.roster[0].personality).toBe("super sweet");
    expect(result.roster[0].dramaLevel).toBe(5);
    expect(result.roster[0].breed).toBe("Tabby");
  });

  it("edits and renames an existing cat", () => {
    const result = execute(
      { kind: "edit", name: "miso", updates: { name: "Miso Soup" } },
      [miso],
    );
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("updated Miso Soup");
    expect(result.roster[0].name).toBe("Miso Soup");
  });

  it("prevents renaming to an existing cat's name", () => {
    const wasabi: Cat = {
      name: "Wasabi",
      breed: "Siamese",
      personality: "chill",
      favoriteActivities: [],
      dramaLevel: 2,
    };
    const result = execute(
      { kind: "edit", name: "miso", updates: { name: "wasabi" } },
      [miso, wasabi],
    );
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('a cat named "wasabi" already exists');
    expect(result.roster).toEqual([miso, wasabi]);
  });

  it("reports an error when editing a nonexistent cat", () => {
    const result = execute(
      { kind: "edit", name: "Ghost", updates: { dramaLevel: 1 } },
      [miso],
    );
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('no cat named "Ghost"');
  });

  it("reports validation error when editing invalid drama level", () => {
    const result = execute(
      { kind: "edit", name: "miso", updates: { dramaLevel: 9 } },
      [miso],
    );
    expect(result.exitCode).toBe(1);
    expect(result.output).toMatch(/1-5/);
  });

  it("prints usage for help", () => {
    const result = execute({ kind: "help" }, []);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("usage:");
  });
});
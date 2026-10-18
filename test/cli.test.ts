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

  it("prints usage for help", () => {
    const result = execute({ kind: "help" }, []);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("usage:");
  });
});
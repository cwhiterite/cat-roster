import { describe, expect, it } from "vitest";
import { catSummary, makeCat, parseDramaLevel, rosterSummary, type Cat } from "../src/cat.js";

const miso: Cat = {
  name: "Miso",
  breed: "Tabby",
  personality: "sweet chaos",
  favoriteActivities: ["knocking things off shelves"],
  dramaLevel: 4,
};

describe("catSummary", () => {
  it("includes name, breed, personality, activities, and drama level", () => {
    const summary = catSummary(miso);
    expect(summary).toContain("Miso");
    expect(summary).toContain("Tabby");
    expect(summary).toContain("sweet chaos");
    expect(summary).toContain("knocking things off shelves");
    expect(summary).toContain("drama level 4/5");
  });

  it("joins multiple favorite activities", () => {
    const busy: Cat = {
      ...miso,
      favoriteActivities: ["chipmunks", "boxes", "midnight zoomies"],
    };
    expect(catSummary(busy)).toContain("chipmunks, boxes, midnight zoomies");
  });
});

describe("rosterSummary", () => {
  it("renders one line per cat", () => {
    const wasabi: Cat = {
      name: "Wasabi",
      breed: "Siamese",
      personality: "dignified",
      favoriteActivities: ["yelling at 5am"],
      dramaLevel: 2,
    };
    const lines = rosterSummary([miso, wasabi]).split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("Miso");
    expect(lines[1]).toContain("Wasabi");
  });

  it("handles an empty roster", () => {
    expect(rosterSummary([])).toBe("(no cats yet)");
  });
});

describe("parseDramaLevel", () => {
  it("accepts the levels 1-5", () => {
    expect(parseDramaLevel("1")).toBe(1);
    expect(parseDramaLevel("5")).toBe(5);
    expect(parseDramaLevel(" 3 ")).toBe(3);
  });

  it("rejects out-of-range, non-integer, and empty values", () => {
    expect(() => parseDramaLevel("0")).toThrow(/1-5/);
    expect(() => parseDramaLevel("6")).toThrow(/1-5/);
    expect(() => parseDramaLevel("abc")).toThrow(/1-5/);
    expect(() => parseDramaLevel("")).toThrow(/1-5/);
  });
});

describe("makeCat", () => {
  it("returns the trimmed cat with parsed drama level", () => {
    const cat = makeCat({
      name: " Miso ",
      breed: "Tabby",
      personality: "sweet chaos",
      favoriteActivities: [" boxes ", "", "sunbeams"],
      dramaLevel: 4,
    });
    expect(cat.name).toBe("Miso");
    expect(cat.favoriteActivities).toEqual(["boxes", "sunbeams"]);
    expect(cat.dramaLevel).toBe(4);
  });

  it("rejects an empty name", () => {
    expect(() =>
      makeCat({
        name: "  ",
        breed: "Tabby",
        personality: "sweet",
        favoriteActivities: [],
        dramaLevel: 3,
      }),
    ).toThrow(/name/);
  });

  it("rejects a missing breed and an out-of-range drama level", () => {
    expect(() =>
      makeCat({
        name: "Miso",
        breed: "",
        personality: "sweet",
        favoriteActivities: [],
        dramaLevel: 3,
      }),
    ).toThrow(/breed/);

    expect(() =>
      makeCat({
        name: "Miso",
        breed: "Tabby",
        personality: "sweet",
        favoriteActivities: [],
        dramaLevel: 9,
      }),
    ).toThrow(/1-5/);
  });
});
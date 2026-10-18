import { describe, expect, it } from "vitest";
import { catSummary, rosterSummary, type Cat } from "../src/cat.js";

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
/** A single cat in the roster. */
export interface Cat {
  name: string;
  breed: string;
  personality: string;
  favoriteActivities: string[];
  /** 1 (calm) to 5 (chaos). */
  dramaLevel: 1 | 2 | 3 | 4 | 5;
}

/** One-line summary of a cat, with personality, activities, and drama. */
export function catSummary(cat: Cat): string {
  return (
    `${cat.name} (${cat.breed}) — ${cat.personality}; ` +
    `loves ${cat.favoriteActivities.join(", ")}; drama level ${cat.dramaLevel}/5`
  );
}

/** Every cat in the roster, one line each, or a placeholder when empty. */
export function rosterSummary(cats: readonly Cat[]): string {
  if (cats.length === 0) {
    return "(no cats yet)";
  }
  return cats.map(catSummary).join("\n");
}

/** Parses a drama level from user input, e.g. a CLI flag or raw JSON. */
export function parseDramaLevel(raw: string): 1 | 2 | 3 | 4 | 5 {
  const value = Number(raw.trim());
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`dramaLevel must be an integer 1-5, got "${raw}"`);
  }
  return value as 1 | 2 | 3 | 4 | 5;
}

/**
 * Builds a Cat from untrusted input, trimming strings, dropping empty
 * activities, and validating the drama level. Throws with a user-facing
 * message on invalid input.
 */
export function makeCat(input: {
  name: string;
  breed: string;
  personality: string;
  favoriteActivities: string[];
  dramaLevel: number;
}): Cat {
  const name = input.name.trim();
  const breed = input.breed.trim();
  const personality = input.personality.trim();
  if (!name) {
    throw new Error("name is required");
  }
  if (!breed) {
    throw new Error("breed is required");
  }
  if (!personality) {
    throw new Error("personality is required");
  }
  return {
    name,
    breed,
    personality,
    favoriteActivities: input.favoriteActivities
      .map((activity) => activity.trim())
      .filter((activity) => activity.length > 0),
    dramaLevel: parseDramaLevel(String(input.dramaLevel)),
  };
}
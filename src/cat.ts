/** A single cat in the roster. */
export interface Cat {
  name: string;
  breed: string;
  personality: string;
  favoriteActivities: string[];
  /** 1 (calm) to 5 (chaos). */
  dramaLevel: 1 | 2 | 3 | 4 | 5;
}

/** Visual drama bar: 🎭 for each drama level, · for remaining up to 5. */
export function formatDrama(level: number): string {
  return "🎭".repeat(level) + "·".repeat(5 - level);
}

/** Multi-line summary of a single cat with personality, drama, and activities. */
export function catSummary(cat: Cat): string {
  const header = `🐱 ${cat.name} (${cat.breed})`;
  const personality = `   Personality: ${cat.personality}`;
  const drama = `   Drama level: ${formatDrama(cat.dramaLevel)} (drama level ${cat.dramaLevel}/5)`;
  const activities =
    cat.favoriteActivities.length > 0
      ? [
          "   Favorite activities:",
          ...cat.favoriteActivities.map((activity) => `     🐾 ${activity}`),
        ].join("\n")
      : "   Favorite activities: (none)";
  return [header, personality, drama, activities].join("\n");
}

/** Rich formatted roster summary with banner, divider, cats list, and drama statistics. */
export function rosterSummary(cats: readonly Cat[]): string {
  if (cats.length === 0) {
    return "(no cats yet)";
  }

  const divider = "=".repeat(50);
  const header = ["🐱 THE PURR-FECT ROSTER 🐱", divider];

  const catBlocks = cats.map((cat, i) => {
    const num = `#${i + 1}  `;
    const title = `${num}${cat.name} (${cat.breed})`;
    const personality = `   Personality: ${cat.personality}`;
    const drama = `   Drama level: ${formatDrama(cat.dramaLevel)} (${cat.dramaLevel}/5)`;
    const activities =
      cat.favoriteActivities.length > 0
        ? [
            "   Favorite activities:",
            ...cat.favoriteActivities.map((activity) => `     🐾 ${activity}`),
          ].join("\n")
        : "   Favorite activities: (none)";
    return [title, personality, drama, activities].join("\n");
  });

  const avg = cats.reduce((sum, c) => sum + c.dramaLevel, 0) / cats.length;
  const footer = [
    divider,
    `Total cats: ${cats.length} | Average drama level: ${avg.toFixed(1)}/5`,
  ];

  return [...header, catBlocks.join("\n\n"), ...footer].join("\n");
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
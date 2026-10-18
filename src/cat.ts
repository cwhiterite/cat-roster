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
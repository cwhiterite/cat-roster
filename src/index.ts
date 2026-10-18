import { type Cat, rosterSummary } from "./cat.js";

// ESM: relative imports use the `.js` extension even though the file is `.ts`
// (NodeNext module resolution).

const cats: readonly Cat[] = [
  {
    name: "Miso",
    breed: "Tabby",
    personality: "sweet chaos",
    favoriteActivities: ["knocking things off shelves", "sunbeams"],
    dramaLevel: 4,
  },
  {
    name: "Wasabi",
    breed: "Siamese",
    personality: "dignified",
    favoriteActivities: ["yelling at 5am", "supervision"],
    dramaLevel: 2,
  },
];

console.log(rosterSummary(cats));
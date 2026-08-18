import { masteryLevels, masterySpineStats, validateMasterySpine } from "../lib/masterySpine.ts";
import { categoryIncludesStrand, masteryCategories } from "../lib/masteryCategories.ts";

const errors = validateMasterySpine();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const checkpoints = new Map([[1, "F1a"], [49, "X1"], [97, "M1a"], [135, "D1a"], [178, "G1a"], [210, "G4R"]]);
for (const [sequence, code] of checkpoints) {
  if (masteryLevels[sequence - 1]?.code !== code) {
    console.error(`Sequence ${sequence} should be ${code}; found ${masteryLevels[sequence - 1]?.code ?? "nothing"}.`);
    process.exit(1);
  }
}

const expectedCategoryCounts = new Map([
  ["algebra", 43], ["advanced-math", 36], ["problem-solving-data-analysis", 42],
  ["geometry-trigonometry", 33], ["foundations-skills", 56],
]);
for (const category of masteryCategories) {
  const count = masteryLevels.filter((level) => categoryIncludesStrand(category, level.strandCode)).length;
  if (count !== expectedCategoryCounts.get(category.id)) {
    console.error(`${category.name} should contain ${expectedCategoryCounts.get(category.id)} levels; found ${count}.`);
    process.exit(1);
  }
}
for (const level of masteryLevels) {
  const matches = masteryCategories.filter((category) => categoryIncludesStrand(category, level.strandCode));
  if (matches.length !== 1) {
    console.error(`${level.code} must belong to exactly one dashboard category; found ${matches.length}.`);
    process.exit(1);
  }
}

console.log(`Validated ${masterySpineStats.levels} levels: ${masterySpineStats.core} CORE, ${masterySpineStats.ext} EXT.`);
console.log(`Strand counts: ${Object.entries(masterySpineStats.strands).map(([code, count]) => `${code} ${count}`).join(", ")}.`);
console.log(`Dashboard categories: ${masteryCategories.map((category) => `${category.name} ${masteryLevels.filter((level) => categoryIncludesStrand(category, level.strandCode)).length}`).join(", ")}.`);

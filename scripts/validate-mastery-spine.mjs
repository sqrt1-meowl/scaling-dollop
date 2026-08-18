import { masteryLevels, masterySpineStats, validateMasterySpine } from "../lib/masterySpine.ts";

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

console.log(`Validated ${masterySpineStats.levels} levels: ${masterySpineStats.core} CORE, ${masterySpineStats.ext} EXT.`);
console.log(`Strand counts: ${Object.entries(masterySpineStats.strands).map(([code, count]) => `${code} ${count}`).join(", ")}.`);

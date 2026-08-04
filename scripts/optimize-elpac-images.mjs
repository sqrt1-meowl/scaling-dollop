import path from "node:path";
import { stat } from "node:fs/promises";
import sharp from "sharp";

const mediaDir = path.join(process.cwd(), "public", "elpac", "media");
const names = [
  "three-rs-organizer",
  "playground-survey-chart",
  "weather-chart",
  "race-preparation-organizer",
  "plant-experiment-chart",
  "two-jobs-comparison",
  "mikhail-timeline",
  "club-budget-chart",
  "energy-sources-chart",
];

for (const name of names) {
  const input = path.join(mediaDir, `${name}.png`);
  const output = path.join(mediaDir, `${name}.webp`);
  await sharp(input).webp({ quality: 84, effort: 6 }).toFile(output);
  const [before, after] = await Promise.all([stat(input), stat(output)]);
  const saved = Math.round((1 - after.size / before.size) * 100);
  console.log(`${name}: ${saved}% smaller`);
}

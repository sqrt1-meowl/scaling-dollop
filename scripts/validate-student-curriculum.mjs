import {
  studentSkills, studentStrands, studentSubskillCounts, studentSubskills, studentUnitHasWorksheets, validateStudentSubskills,
} from "../lib/studentCurriculum.ts";
import { categoryIncludesStrand, masteryCategories } from "../lib/masteryCategories.ts";

const errors = validateStudentSubskills();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const expectedCategoryCounts = new Map([
  ["algebra", 13], ["advanced-math", 13], ["problem-solving-data-analysis", 15],
  ["geometry-trigonometry", 10], ["foundations-skills", 11],
]);

for (const category of masteryCategories) {
  const count = studentSubskills.filter((level) => categoryIncludesStrand(category, level.strandCode)).length;
  if (count !== expectedCategoryCounts.get(category.id)) {
    console.error(`${category.name} should contain ${expectedCategoryCounts.get(category.id)} units; found ${count}.`);
    process.exit(1);
  }
}

for (const level of studentSubskills) {
  const matches = masteryCategories.filter((category) => categoryIncludesStrand(category, level.strandCode));
  if (matches.length !== 1) {
    console.error(`${level.code} must belong to exactly one dashboard category; found ${matches.length}.`);
    process.exit(1);
  }
}

const checkpoints = new Map([
  [1, "F1U1"], [5, "F2U3"], [6, "X1"], [8, "X3"], [9, "A1U1"], [21, "A4U3"],
  [22, "M1U1"], [34, "M3U5"], [35, "P1U1"], [49, "P6U3"], [50, "G1U1"],
  [59, "G4U2"], [60, "C1"], [62, "C3"],
]);
for (const [sequence, code] of checkpoints) {
  if (studentSubskills[sequence - 1]?.code !== code) {
    console.error(`Sequence ${sequence} should be ${code}; found ${studentSubskills[sequence - 1]?.code ?? "nothing"}.`);
    process.exit(1);
  }
}

const foundationWorksheets = studentSubskills.filter((level) => level.strandCode === "F" && studentUnitHasWorksheets(level));
if (foundationWorksheets.length) {
  console.error("Foundations must remain diagnostic-only with no worksheet sets.");
  process.exit(1);
}

console.log(`Validated ${studentSubskillCounts.total} curriculum units across ${studentSkills.length} skill groups and ${studentStrands.length} strands.`);
console.log(`Dashboard categories: ${masteryCategories.map((category) => `${category.name} ${studentSubskills.filter((level) => categoryIncludesStrand(category, level.strandCode)).length}`).join(", ")}.`);

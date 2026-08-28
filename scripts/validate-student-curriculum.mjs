import {
  studentSkills, studentStrands, studentSubskillCounts, studentSubskills, validateStudentSubskills,
} from "../lib/studentCurriculum.ts";
import { categoryIncludesStrand, masteryCategories } from "../lib/masteryCategories.ts";

const errors = validateStudentSubskills();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const expectedCategoryCounts = new Map([
  ["algebra", 15], ["advanced-math", 9], ["problem-solving-data-analysis", 17],
  ["geometry-trigonometry", 12], ["foundations-skills", 8],
]);

for (const category of masteryCategories) {
  const count = studentSubskills.filter((level) => categoryIncludesStrand(category, level.strandCode)).length;
  if (count !== expectedCategoryCounts.get(category.id)) {
    console.error(`${category.name} should contain ${expectedCategoryCounts.get(category.id)} subskills; found ${count}.`);
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

const checkpoints = new Map([[1, "F1U1"], [6, "A1U1"], [21, "M1U1"], [30, "P1U1"], [47, "G1U1"], [61, "C1U3"]]);
for (const [sequence, code] of checkpoints) {
  if (studentSubskills[sequence - 1]?.code !== code) {
    console.error(`Sequence ${sequence} should be ${code}; found ${studentSubskills[sequence - 1]?.code ?? "nothing"}.`);
    process.exit(1);
  }
}

console.log(`Validated ${studentSubskillCounts.total} PDF-aligned subskills across ${studentSkills.length} skill groups and ${studentStrands.length} strands.`);
console.log(`Dashboard categories: ${masteryCategories.map((category) => `${category.name} ${studentSubskills.filter((level) => categoryIncludesStrand(category, level.strandCode)).length}`).join(", ")}.`);

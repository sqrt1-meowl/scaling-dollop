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
  ["algebra", 43], ["advanced-math", 36], ["problem-solving-data-analysis", 42],
  ["geometry-trigonometry", 33], ["foundations-skills", 27],
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

const checkpoints = new Map([[1, "F1a"], [27, "F4R"], [28, "A1a"], [70, "A5R"], [71, "M1a"], [106, "M3R"], [107, "D1a"], [148, "D-R"], [149, "G1a"], [181, "G4R"]]);
for (const [sequence, code] of checkpoints) {
  if (studentSubskills[sequence - 1]?.code !== code) {
    console.error(`Sequence ${sequence} should be ${code}; found ${studentSubskills[sequence - 1]?.code ?? "nothing"}.`);
    process.exit(1);
  }
}

console.log(`Validated ${studentSubskillCounts.total} detailed SAT Math levels across ${studentSkills.length} skill groups and ${studentStrands.length} strands.`);
console.log(`Dashboard categories: ${masteryCategories.map((category) => `${category.name} ${studentSubskills.filter((level) => categoryIncludesStrand(category, level.strandCode)).length}`).join(", ")}.`);

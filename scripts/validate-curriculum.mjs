import { readFile } from "node:fs/promises";
import { allDrillUnits, allFrameworkTargets, allSkills, categories, questionModels, seedQuestions } from "../lib/curriculum.ts";

const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(categories.length === 4, `Expected 4 domains, found ${categories.length}`);
assert(allSkills.length === 19, `Expected 19 skills, found ${allSkills.length}`);
assert(allDrillUnits.length === 124, `Expected 124 drill units, found ${allDrillUnits.length}`);
assert(new Set(allDrillUnits.map((item) => item.id)).size === 124, "Drill unit IDs must be unique");
assert(allFrameworkTargets.every((target) => target.skillId && target.drillUnitId && target.description), "Every framework target must be fully mapped");
assert(questionModels.length === allDrillUnits.length * 2, "Every drill unit must have Easy and Medium question models");
for (const question of seedQuestions) {
  for (const field of ["domainId", "skillId", "skillName", "drillUnitId", "drillUnitName", "frameworkTargetId", "frameworkTarget", "difficulty", "questionType", "prompt", "correctAnswer", "explanation", "sourceType", "order", "status"]) assert(question[field] !== undefined && question[field] !== "", `${question.id} is missing ${field}`);
  assert(["easy", "medium", "hard"].includes(question.difficulty), `${question.id} has an invalid difficulty`);
}
const migration = await readFile(new URL("../drizzle/0001_curriculum_architecture.sql", import.meta.url), "utf8");
for (const table of ["domains", "skills", "drill_units", "framework_targets", "questions", "question_models", "skill_progress", "drill_unit_progress"]) assert(migration.includes(`TABLE IF NOT EXISTS ${table}`), `Migration is missing ${table}`);
console.log(`Validated ${categories.length} domains, ${allSkills.length} skills, ${allDrillUnits.length} drill units, ${allFrameworkTargets.length} framework targets, ${seedQuestions.length} demo questions, and ${questionModels.length} question models.`);

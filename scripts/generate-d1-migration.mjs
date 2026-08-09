import { mkdir, writeFile } from "node:fs/promises";
import { allFrameworkTargets, questionModels, seedQuestions } from "../lib/curriculum.ts";

const sql = (value) => value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const bool = (value) => value ? 1 : 0;
const upsert = (table, columns, values, updates, where = "") =>
  `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values.join(",")}) ON CONFLICT(id) DO UPDATE SET ${updates.map((column) => `${column}=excluded.${column}`).join(",")}${where}`;

const statements = ["PRAGMA foreign_keys = ON"];

allFrameworkTargets.forEach((target) => statements.push(upsert(
  "framework_targets",
  ["id", "skill_id", "drill_unit_id", "description", "sort_order"],
  [sql(target.id), sql(target.skillId), sql(target.drillUnitId), sql(target.description), target.order],
  ["skill_id", "drill_unit_id", "description", "sort_order"],
)));

questionModels.forEach((model) => statements.push(upsert(
  "question_models",
  ["id", "drill_unit_id", "framework_target_id", "name", "difficulty", "description", "template", "parameter_rules", "answer_rules", "solution_method", "forbidden_features", "is_active"],
  [sql(model.id), sql(model.drillUnitId), sql(model.frameworkTargetId), sql(model.name), sql(model.difficulty), sql(model.description), sql(model.template), sql(model.parameterRules), sql(model.answerRules), sql(model.solutionMethod), sql(model.forbiddenFeatures), bool(model.isActive)],
  ["drill_unit_id", "framework_target_id", "name", "difficulty", "description", "template", "parameter_rules", "answer_rules", "solution_method", "forbidden_features", "is_active"],
)));

const placeholderUpsert = (question) => upsert(
  "questions",
  ["id", "domain_id", "skill_id", "drill_unit_id", "framework_target_id", "difficulty", "question_type", "prompt", "choices", "correct_answer", "explanation", "question_model_id", "source_type", "source_question_id", "sort_order", "status", "requires_review", "is_gate"],
  [sql(question.id), sql(question.domainId), sql(question.skillId), sql(question.drillUnitId), sql(question.frameworkTargetId), sql(question.difficulty), sql(question.questionType), sql(question.prompt), sql(question.choices ? JSON.stringify(question.choices) : null), sql(question.correctAnswer), sql(question.explanation), sql(question.questionModelId ?? null), sql(question.sourceType), sql(question.sourceQuestionId ?? null), question.order, sql(question.status), bool(question.requiresReview), bool(question.isGate)],
  ["domain_id", "skill_id", "drill_unit_id", "framework_target_id", "difficulty", "question_type", "prompt", "choices", "correct_answer", "explanation", "question_model_id", "source_question_id", "sort_order", "status", "requires_review", "is_gate"],
  " WHERE questions.source_type='placeholder'",
);

for (const question of seedQuestions) {
  if (question.sourceType === "placeholder") statements.push(placeholderUpsert(question));
  else statements.push(`UPDATE questions SET domain_id=${sql(question.domainId)},skill_id=${sql(question.skillId)},drill_unit_id=${sql(question.drillUnitId)},framework_target_id=${sql(question.frameworkTargetId)},question_model_id=${sql(question.questionModelId ?? null)},sort_order=${question.order} WHERE id=${sql(question.id)} AND source_type='original'`);
}

statements.push("PRAGMA optimize");

await mkdir(new URL("../drizzle/", import.meta.url), { recursive: true });
await writeFile(new URL("../drizzle/0004_precise_framework_targets.sql", import.meta.url), `${statements.join(";\n")};\n`, "utf8");
console.log(`Generated precise target migration with ${allFrameworkTargets.length} targets, ${questionModels.length} question models, and ${seedQuestions.length} canonical question mappings.`);

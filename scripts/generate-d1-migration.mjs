import { mkdir, writeFile } from "node:fs/promises";
import { allDrillUnits, allFrameworkTargets, allSkills, domains, questionModels, seedQuestions } from "../lib/curriculum.ts";

const sql = (value) => value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const bool = (value) => value ? 1 : 0;
const upsert = (table, columns, values, updates, where = "") =>
  `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values.join(",")}) ON CONFLICT(id) DO UPDATE SET ${updates.map((column) => `${column}=excluded.${column}`).join(",")}${where}`;

const statements = ["PRAGMA foreign_keys = ON"];

domains.forEach((domain, index) => statements.push(upsert(
  "domains",
  ["id", "name", "short_name", "sat_weight", "accent", "sort_order", "status"],
  [sql(domain.id), sql(domain.name), sql(domain.shortName), domain.weight, sql(domain.accent), index + 1, "'active'"],
  ["name", "short_name", "sat_weight", "accent", "sort_order", "status"],
)));

allSkills.forEach((skill) => statements.push(upsert(
  "skills",
  ["id", "domain_id", "code", "name", "description", "sort_order", "gate_question_count", "gate_threshold", "status"],
  [sql(skill.id), sql(skill.domainId), sql(skill.code), sql(skill.title), sql(skill.subtitle ?? ""), skill.order, skill.gateQuestionCount, skill.gateThreshold, "'active'"],
  ["domain_id", "code", "name", "description", "sort_order", "gate_question_count", "gate_threshold", "status"],
)));

allDrillUnits.forEach((unit) => statements.push(upsert(
  "drill_units",
  ["id", "skill_id", "code", "name", "description", "sort_order", "easy_question_count", "medium_question_count", "concept_notes", "worked_example", "is_active"],
  [sql(unit.id), sql(unit.skillId), sql(unit.code), sql(unit.name), sql(unit.description), unit.order, unit.easyQuestionCount, unit.mediumQuestionCount, sql(JSON.stringify(unit.concept)), sql(JSON.stringify(unit.workedExample)), bool(unit.isActive)],
  ["skill_id", "code", "name", "description", "sort_order", "easy_question_count", "medium_question_count", "concept_notes", "worked_example", "is_active"],
)));

const retiredUnitMappings = { p2f: "p2e", p3g: "p3f", p6e: "p6d", p7e: "p7d" };
for (const [source, destination] of Object.entries(retiredUnitMappings)) {
  statements.push(
    `UPDATE questions SET drill_unit_id=${sql(destination)},framework_target_id=${sql(`${destination}-target-1`)},question_model_id=CASE WHEN difficulty IN ('easy','medium') THEN ${sql(destination)} || '-' || difficulty || '-model' ELSE NULL END,status='review',requires_review=1 WHERE drill_unit_id=${sql(source)}`,
    `INSERT INTO drill_unit_progress (user_id,drill_unit_id,easy_completed,easy_total,medium_completed,medium_total,status,updated_at) SELECT user_id,${sql(destination)},easy_completed,easy_total,medium_completed,medium_total,status,updated_at FROM drill_unit_progress WHERE drill_unit_id=${sql(source)} ON CONFLICT(user_id,drill_unit_id) DO UPDATE SET easy_completed=MAX(drill_unit_progress.easy_completed,excluded.easy_completed),medium_completed=MAX(drill_unit_progress.medium_completed,excluded.medium_completed),status=CASE WHEN drill_unit_progress.status='complete' OR excluded.status='complete' THEN 'complete' WHEN drill_unit_progress.status='review' OR excluded.status='review' THEN 'review' WHEN drill_unit_progress.status='in_progress' OR excluded.status='in_progress' THEN 'in_progress' WHEN drill_unit_progress.status='available' OR excluded.status='available' THEN 'available' ELSE 'locked' END,updated_at=MAX(drill_unit_progress.updated_at,excluded.updated_at)`,
    `DELETE FROM drill_unit_progress WHERE drill_unit_id=${sql(source)}`,
    `UPDATE questions SET question_model_id=NULL WHERE question_model_id IN (SELECT id FROM question_models WHERE drill_unit_id=${sql(source)})`,
    `DELETE FROM question_models WHERE drill_unit_id=${sql(source)}`,
    `DELETE FROM framework_targets WHERE drill_unit_id=${sql(source)}`,
    `DELETE FROM drill_units WHERE id=${sql(source)}`,
  );
}

const unitIds = allDrillUnits.map((unit) => sql(unit.id)).join(",");
const targetIds = allFrameworkTargets.map((target) => sql(target.id)).join(",");
statements.push(
  `UPDATE questions SET question_model_id=NULL WHERE question_model_id IN (SELECT id FROM question_models WHERE drill_unit_id NOT IN (${unitIds}) OR framework_target_id NOT IN (${targetIds}))`,
  `UPDATE questions SET framework_target_id=NULL,status='review',requires_review=1 WHERE framework_target_id IS NOT NULL AND framework_target_id NOT IN (${targetIds})`,
  `DELETE FROM question_models WHERE drill_unit_id NOT IN (${unitIds}) OR framework_target_id NOT IN (${targetIds})`,
  `DELETE FROM framework_targets WHERE id NOT IN (${targetIds})`,
  `UPDATE questions SET drill_unit_id=NULL,status='review',requires_review=1 WHERE drill_unit_id IS NOT NULL AND drill_unit_id NOT IN (${unitIds})`,
  `DELETE FROM drill_unit_progress WHERE drill_unit_id NOT IN (${unitIds})`,
  `DELETE FROM drill_units WHERE id NOT IN (${unitIds})`,
);

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

const questionUpsert = (question) => upsert(
  "questions",
  ["id", "domain_id", "skill_id", "drill_unit_id", "framework_target_id", "difficulty", "question_type", "prompt", "choices", "correct_answer", "explanation", "question_model_id", "source_type", "source_question_id", "sort_order", "status", "requires_review", "is_gate"],
  [sql(question.id), sql(question.domainId), sql(question.skillId), sql(question.drillUnitId), sql(question.frameworkTargetId), sql(question.difficulty), sql(question.questionType), sql(question.prompt), sql(question.choices ? JSON.stringify(question.choices) : null), sql(question.correctAnswer), sql(question.explanation), sql(question.questionModelId ?? null), sql(question.sourceType), sql(question.sourceQuestionId ?? null), question.order, sql(question.status), bool(question.requiresReview), bool(question.isGate)],
  ["domain_id", "skill_id", "drill_unit_id", "framework_target_id", "difficulty", "question_type", "prompt", "choices", "correct_answer", "explanation", "question_model_id", "source_question_id", "sort_order", "status", "requires_review", "is_gate"],
  " WHERE questions.source_type='placeholder'",
);
seedQuestions.forEach((question) => statements.push(questionUpsert(question)));

statements.push("PRAGMA optimize");

await mkdir(new URL("../drizzle/", import.meta.url), { recursive: true });
await writeFile(new URL("../drizzle/0002_complete_sat_curriculum.sql", import.meta.url), `${statements.join(";\n")};\n`, "utf8");
const g1fQuestionStatements = ["PRAGMA foreign_keys = ON", ...seedQuestions.filter((question) => question.drillUnitId === "g1f").map(questionUpsert), "PRAGMA optimize"];
await writeFile(new URL("../drizzle/0003_seed_g1f_questions.sql", import.meta.url), `${g1fQuestionStatements.join(";\n")};\n`, "utf8");
console.log(`Generated curriculum reconciliation migration with ${domains.length} domains, ${allSkills.length} skills, ${allDrillUnits.length} units, ${allFrameworkTargets.length} targets, ${questionModels.length} models, and ${seedQuestions.length} canonical questions.`);

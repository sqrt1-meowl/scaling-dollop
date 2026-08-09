import { readFile } from "node:fs/promises";
import { allDrillUnits, allFrameworkTargets, allSkills, categories, questionModels, seedQuestions } from "../lib/curriculum.ts";
import { frameworkTargetCodes, frameworkTargetsByUnit } from "../lib/frameworkTargets.ts";

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const expected = {
  A1: ["A1a|Fluent solving", "A1b|Strategic algebraic structure", "A1c|Number of solutions", "A1d|Creating equations from context", "A1e|Interpreting equations in context"],
  A2: ["A2a|Ordered pairs and values of two-variable equations", "A2b|Tables, equations, and graphs", "A2c|Slope and equations of lines", "A2d|Writing equations of lines", "A2e|Parallel and perpendicular lines", "A2f|Modeling and interpreting two-variable equations"],
  A3: ["A3a|Function notation: input → output", "A3b|Rate of change and initial value", "A3c|Tables, graphs, and equations", "A3d|Creating linear functions", "A3e|Interpreting linear functions in context"],
  A4: ["A4a|Solving by substitution", "A4b|Solving by elimination", "A4c|Algebraic and graphical solutions", "A4d|Number of solutions", "A4e|Systems from context"],
  A5: ["A5a|One-variable inequalities", "A5b|Two-variable inequalities", "A5c|Tables, equations, and graphs", "A5d|Systems of linear inequalities", "A5e|Modeling and interpreting inequalities"],
  AM1: ["AM1a|Polynomial operations", "AM1b|Common-factor factoring", "AM1c|Difference of squares and trinomial factoring", "AM1d|Other polynomial factoring", "AM1e|Simple rational-expression rewriting", "AM1f|Rational exponents and radical form", "AM1g|Strategic equivalent forms"],
  AM2: ["AM2a|Quadratics using factoring and algebraic structure", "AM2b|Quadratics using square-root structure", "AM2c|Quadratic formula", "AM2d|Completing the square", "AM2e|Number of real quadratic solutions", "AM2f|Linear absolute-value equations", "AM2g|Simple radical equations", "AM2h|Simple rational equations", "AM2i|Polynomial equations in factored form", "AM2j|Linear and nonlinear systems", "AM2k|Rearranging multivariable equations and formulas"],
  AM3: ["AM3a|Nonlinear function notation: input → output", "AM3b|Quadratic functions and key features", "AM3c|Quadratic representations and transformations", "AM3d|Exponential growth and decay", "AM3e|Exponential representations and transformations", "AM3f|Polynomial functions", "AM3g|Simple rational functions", "AM3h|Radical and other nonlinear functions", "AM3i|Connecting nonlinear representations", "AM3j|Creating and selecting quadratic/exponential models", "AM3k|Key features, parameters, and useful forms"],
  P1: ["P1a|Ratios and proportional relationships", "P1b|Rates and unit rates", "P1c|Proportional contexts and scale drawings", "P1d|One-step unit conversions", "P1e|Multistep and multidimensional unit conversions", "P1f|Derived units", "P1g|Scale factors in proportional relationships"],
  P2: ["P2a|Percent fundamentals", "P2b|Finding unknown original amounts", "P2c|Percent increase and decrease", "P2d|Percent change and growth factor", "P2e|Percent applications"],
  P3: ["P3a|Frequency tables", "P3b|Histograms and dot plots", "P3c|Box plots", "P3d|Mean, median, and range", "P3e|Effects of outliers", "P3f|Comparing distributions using center and spread"],
  P4: ["P4a|Interpreting scatterplots", "P4b|Predictions from scatterplots", "P4c|Fitting linear models", "P4d|Fitting quadratic and exponential models", "P4e|Interpreting graphs modeling two quantities", "P4f|Comparing linear and exponential growth"],
  P5: ["P5a|Relative frequency and data representations", "P5b|Probability", "P5c|Conditional probability", "P5d|Probability in context", "P5e|Missing frequencies from probability"],
  P6: ["P6a|Sample mean → population mean", "P6b|Sample proportion → population proportion", "P6c|Margin of error", "P6d|Sample size and margin of error"],
  P7: ["P7a|Random samples and generalization", "P7b|Sampling methods and limitations", "P7c|Observational studies and experiments", "P7d|Random assignment and causal conclusions"],
  G1: ["G1a|Area and perimeter", "G1b|Surface area", "G1c|Volume", "G1d|Missing geometric measures", "G1e|Scale factors", "G1f|Formula selection and mixed measurement"],
  G2: ["G2a|Vertical and related angle relationships", "G2b|Triangle angle relationships", "G2c|Parallel lines and transversals", "G2d|Similar triangles", "G2e|Congruent triangles", "G2f|Scale factors in similar figures", "G2g|Geometric sufficiency and theorem reasoning"],
  G3: ["G3a|Pythagorean theorem", "G3b|45-45-90 triangles", "G3c|30-60-90 triangles", "G3d|Right-triangle sine, cosine, and tangent", "G3e|Similarity and trigonometric ratios", "G3f|Complementary sine/cosine relationships", "G3g|Applied right-triangle problems"],
  G4: ["G4a|Radius, diameter, and basic circle relationships", "G4b|Arc length and sector area", "G4c|Circle angles and tangents", "G4d|Radian measure", "G4e|Unit-circle trigonometric ratios", "G4f|Circle equations: creating equations, center, and radius", "G4g|Circle graphs and equation changes", "G4h|Completing the square for circles", "G4i|Distance formula in circle problems"],
};

assert(categories.length === 4, `Expected 4 domains, found ${categories.length}`);
assert(allSkills.length === 19, `Expected 19 skills, found ${allSkills.length}`);
assert(allDrillUnits.length === 121, `Expected 121 drill units, found ${allDrillUnits.length}`);
assert(new Set(allDrillUnits.map((item) => item.code)).size === 121, "Drill unit codes must be unique");
assert(frameworkTargetCodes.length === 121, `Expected target metadata for 121 drill units, found ${frameworkTargetCodes.length}`);
assert(new Set(frameworkTargetCodes).size === 121, "Framework target unit codes must be unique");
assert(allFrameworkTargets.length === 507, `Expected 507 precise framework targets, found ${allFrameworkTargets.length}`);
for (const skill of allSkills) {
  const actual = skill.drillUnits.map((unit) => `${unit.code}|${unit.name}`);
  assert(JSON.stringify(actual) === JSON.stringify(expected[skill.code]), `${skill.code} drill units or ordering do not match the curriculum specification`);
  skill.drillUnits.forEach((unit, index) => {
    assert(unit.skillId === skill.id, `${unit.code} has the wrong skillId`);
    assert(unit.order === index + 1, `${unit.code} has the wrong order`);
    assert(Boolean(unit.description), `${unit.code} is missing a description`);
    assert(unit.isActive, `${unit.code} must be active`);
    assert(unit.workedExampleCount === 3 && unit.easyQuestionCount === 5 && unit.mediumQuestionCount === 5 && unit.hardQuestionCount === 3, `${unit.code} must use the simplified 3 example, 5 Easy, 5 Medium, and 3 Hard defaults`);
    const targets = frameworkTargetsByUnit[unit.code];
    assert(Boolean(targets?.length), `${unit.code} must have at least one framework target`);
    assert(targets.length >= 4 && targets.length <= 7, `${unit.code} targets must stay narrow and complete`);
    assert(new Set(targets).size === targets.length, `${unit.code} has duplicate framework targets`);
    assert(targets.every((target) => target === target.trim() && target.length >= 24), `${unit.code} has an imprecise or malformed framework target`);
  });
}
assert(frameworkTargetCodes.every((code) => allDrillUnits.some((unit) => unit.code === code)), "Framework target metadata includes an unknown drill unit");
const p3f = allDrillUnits.find((unit) => unit.code === "P3f");
assert(p3f?.description.toLowerCase().includes("do not require hand calculation"), "P3f must prohibit hand calculation of standard deviation");
const g1e = allDrillUnits.find((unit) => unit.code === "G1e");
assert(g1e?.description.includes("k²") && g1e.description.includes("k³"), "G1e must distinguish length, area, and volume scale factors");
assert(allFrameworkTargets.every((target) => target.skillId && target.drillUnitId && target.description), "Every framework target must be fully mapped");
assert(questionModels.length === allDrillUnits.length * 3, "Every drill unit must have Easy, Medium, and Hard question models");
for (const unit of allDrillUnits) {
  for (const [difficulty, count] of [["easy", unit.easyQuestionCount], ["medium", unit.mediumQuestionCount], ["hard", unit.hardQuestionCount]]) {
    const questions = seedQuestions.filter((question) => question.drillUnitId === unit.id && question.difficulty === difficulty && !question.isGate && question.id !== "g1-live-challenge");
    assert(questions.length >= count, `${unit.code} needs at least ${count} ${difficulty} practice questions`);
  }
}
for (const skill of allSkills) {
  const gates = seedQuestions.filter((question) => question.skillId === skill.id && question.isGate);
  assert(gates.length === skill.gateQuestionCount, `${skill.code} must have exactly ${skill.gateQuestionCount} skill-gate questions`);
  assert(new Set(gates.map((question) => question.drillUnitId)).size >= Math.min(skill.gateQuestionCount, skill.drillUnits.length), `${skill.code} gate questions must cover multiple drill units`);
}
for (const question of seedQuestions) {
  for (const field of ["domainId", "skillId", "skillName", "drillUnitId", "drillUnitName", "frameworkTargetId", "frameworkTarget", "difficulty", "questionType", "prompt", "correctAnswer", "explanation", "sourceType", "order", "status"]) assert(question[field] !== undefined && question[field] !== "", `${question.id} is missing ${field}`);
  assert(["easy", "medium", "hard"].includes(question.difficulty), `${question.id} has an invalid difficulty`);
}
const baseMigration = await readFile(new URL("../drizzle/0001_curriculum_architecture.sql", import.meta.url), "utf8");
for (const table of ["domains", "skills", "drill_units", "framework_targets", "questions", "question_models", "skill_progress", "drill_unit_progress"]) assert(baseMigration.includes(`TABLE IF NOT EXISTS ${table}`), `Base migration is missing ${table}`);
const reconciliation = await readFile(new URL("../drizzle/0002_complete_sat_curriculum.sql", import.meta.url), "utf8");
assert(!reconciliation.includes("DELETE FROM questions"), "Curriculum reconciliation must not delete questions");
const g1fSeed = await readFile(new URL("../drizzle/0003_seed_g1f_questions.sql", import.meta.url), "utf8");
assert((g1fSeed.match(/INSERT INTO questions/g) ?? []).length === 5, "G1f follow-up migration must preserve a complete five-question drill set");
const targetMigration = await readFile(new URL("../drizzle/0004_precise_framework_targets.sql", import.meta.url), "utf8");
assert((targetMigration.match(/INSERT INTO framework_targets/g) ?? []).length === 507, "Precise-target migration must seed every framework target");
assert(!targetMigration.includes("DELETE FROM questions") && !targetMigration.includes("DELETE FROM framework_targets"), "Precise-target migration must be non-destructive");
const progressionMigration = await readFile(new URL("../drizzle/0005_drill_unit_progression.sql", import.meta.url), "utf8");
assert(progressionMigration.includes("ADD COLUMN stage"), "Drill-unit progression migration must persist the current stage");
assert((progressionMigration.match(/INSERT INTO questions/g) ?? []).length === 72, "Drill-unit progression migration must add four gate questions for each remaining skill");
assert(!progressionMigration.includes("DELETE FROM"), "Drill-unit progression migration must be non-destructive");
const simplifiedMigration = await readFile(new URL("../drizzle/0006_simplified_unlocked_practice.sql", import.meta.url), "utf8");
assert(simplifiedMigration.includes("hard_completed") && simplifiedMigration.includes("worked_example_count"), "Simplified-practice migration must add Hard progress and worked-example configuration");
assert(simplifiedMigration.includes("CASE WHEN status='locked' THEN 'available'"), "Simplified-practice migration must unlock existing unit progress");
console.log(`Validated ${categories.length} domains, ${allSkills.length} student-facing skills, ${allDrillUnits.length} ordered drill units, ${allFrameworkTargets.length} framework targets, ${seedQuestions.length} canonical questions, and ${questionModels.length} question models.`);

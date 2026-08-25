import assert from "node:assert/strict";
import {
  allProgramQuestions,
  allProgramSkills,
  allProgramUnits,
  confidentlyMappedLegacyQuestionIds,
  legacyQuestionsNeedingReview,
  officialDomains,
  programDomains,
} from "../lib/programCurriculum.ts";
import {
  clearReview,
  makeProgramProgress,
  recordStageResult,
  retryStage,
  skipStageByPlacement,
  skipUnitByPlacement,
} from "../lib/programProgress.ts";

const officialSkills = officialDomains.flatMap((domain) => domain.skillPackets);
const officialUnits = officialSkills.flatMap((skill) => skill.units);
const foundationPackets = programDomains
  .filter((domain) => domain.officialStatus === "optional_foundation")
  .flatMap((domain) => domain.skillPackets);
const readinessPackets = programDomains
  .filter((domain) => domain.officialStatus === "test_readiness")
  .flatMap((domain) => domain.skillPackets);

assert.equal(officialDomains.length, 4, "Expected 4 official College Board domains");
assert.equal(officialSkills.length, 19, "Expected 19 official skill packets");
assert.equal(officialUnits.length, 53, "Expected 53 official-aligned units");
assert.equal(foundationPackets.length, 2, "Expected 2 optional foundation packets");
assert.equal(foundationPackets.flatMap((packet) => packet.units).length, 5, "Expected 5 optional foundation units");
assert.equal(readinessPackets.length, 1, "Expected 1 test-readiness packet");
assert.equal(readinessPackets.flatMap((packet) => packet.units).length, 3, "Expected 3 test-readiness units");
assert.equal(allProgramSkills.length, 22, "Expected 22 total packets including support packets");
assert.equal(allProgramUnits.length, 61, "Expected 61 total units including support units");

for (const [label, values] of [
  ["domain", programDomains],
  ["skill", allProgramSkills],
  ["unit", allProgramUnits],
  ["question", allProgramQuestions],
]) {
  const ids = values.map((value) => value.id);
  assert.equal(new Set(ids).size, ids.length, `Duplicate ${label} id found`);
}

for (const domain of programDomains) {
  domain.skillPackets.forEach((skill, skillIndex) => {
    assert.equal(skill.domainId, domain.id, `${skill.id} has the wrong domainId`);
    assert.equal(skill.displayOrder, skillIndex + 1, `${skill.id} has a non-sequential order`);
    skill.units.forEach((unit, unitIndex) => {
      assert.equal(unit.displayOrder, unitIndex + 1, `${unit.id} has a non-sequential order`);
      if (unit.videoUrl) assert.match(unit.videoUrl, /^https:\/\//, `${unit.id} has an invalid video URL`);
    });
  });
}

for (const question of allProgramQuestions) {
  const unit = allProgramUnits.find((item) => item.id === question.unitId);
  const skill = allProgramSkills.find((item) => item.id === question.skillId);
  assert.ok(unit, `${question.id} references a missing unit`);
  assert.ok(skill?.units.some((item) => item.id === unit.id), `${question.id} has the wrong skillId`);
  assert.equal(question.domainId, skill.domainId, `${question.id} has the wrong domainId`);
  assert.ok(question.prompt.trim(), `${question.id} is missing a prompt`);
  assert.ok(question.solution.trim(), `${question.id} is missing a solution`);
  if (question.questionType === "multiple_choice") {
    assert.ok(question.choices?.includes(question.correctAnswer), `${question.id} correct answer is not a choice`);
  }
}

const representative = allProgramUnits.find((unit) => unit.id === "A1U1");
assert.ok(representative, "Representative A1U1 unit is missing");
assert.ok(representative.workedExamples.length >= 2 && representative.workedExamples.length <= 3, "A1U1 needs 2–3 worked examples");
assert.ok(representative.questions.filter((q) => q.difficulty === "easy").length >= 5, "A1U1 needs at least 5 easy questions");
assert.ok(representative.questions.filter((q) => q.difficulty === "medium").length >= 5, "A1U1 needs at least 5 medium questions");
assert.ok(representative.questions.filter((q) => q.difficulty === "hard" && !q.isTransferQuestion).length >= 2, "A1U1 needs at least 2 hard questions");
assert.equal(representative.questions.filter((q) => q.isTransferQuestion).length, 1, "A1U1 needs one transfer question");

assert.equal(new Set(confidentlyMappedLegacyQuestionIds).size, confidentlyMappedLegacyQuestionIds.length, "Mapped legacy ids must be unique");
assert.equal(new Set(legacyQuestionsNeedingReview).size, legacyQuestionsNeedingReview.length, "Review legacy ids must be unique");
assert.ok(confidentlyMappedLegacyQuestionIds.every((id) => !legacyQuestionsNeedingReview.includes(id)), "Mapped and review legacy lists overlap");

let progress = makeProgramProgress();
assert.equal(progress.units.A1U1.state, "not_started");
progress = recordStageResult(progress, "A1U1", "learn", 100, [], true);
progress = recordStageResult(progress, "A1U1", "easy", 86, ["A1U1-QE1"], true);
progress = recordStageResult(progress, "A1U1", "medium", 83, [], true);
progress = recordStageResult(progress, "A1U1", "hard", 75, [], true);
assert.equal(progress.units.A1U1.state, "review_due", "A miss should create review_due state");
assert.equal(progress.units.A1U1.reviewDue, true);
progress = clearReview(progress, "A1U1");
assert.equal(progress.units.A1U1.state, "mastered");
assert.equal(progress.units.A1U1.missedQuestionIds.length, 0);

progress = skipStageByPlacement(progress, "A1U2", "easy");
assert.equal(progress.units.A1U2.stageStates.easy, "skipped_by_placement");
progress = skipUnitByPlacement(progress, "A1U3");
assert.equal(progress.units.A1U3.state, "skipped_by_placement");
progress = retryStage(progress, "A1U1", "medium");
assert.equal(progress.units.A1U1.stageStates.medium, "in_progress");
assert.equal(progress.units.A1U1.stageScores.easy, 86, "Retrying medium must preserve the easy score");

console.log(`Program curriculum valid: ${officialDomains.length} official domains, ${officialSkills.length} official skills, ${officialUnits.length} official units, ${allProgramUnits.length} total units, ${allProgramQuestions.length} authored/mapped questions.`);

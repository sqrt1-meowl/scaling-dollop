import type { DrillUnit, FrameworkTarget, ProgressStatus, Question, QuestionDifficulty, QuestionModel, QuestionType } from "./curriculum";
import { allDrillUnits, allSkills, areaVolumeQuestions, getDrillUnit, getSkill, questionModels, seedQuestions } from "./curriculum";

export type Role = "student" | "admin";
export type ErrorKind = "Concept" | "Procedure" | "Careless" | "Time";
export type DrillStage = "examples" | "easy" | "medium" | "hard" | "video" | "complete";
export interface Session { email: string; role: Role; name: string; }
export interface SkillProgress { skillId: string; topicId: string; easyCompleted: number; mediumCompleted: number; gateScore: number | null; status: ProgressStatus; challengeCompleted: boolean; updatedAt: string; }
export type TopicProgress = SkillProgress;
export interface DrillUnitProgress { drillUnitId: string; easyCompleted: number; easyTotal: number; mediumCompleted: number; mediumTotal: number; hardCompleted: number; hardTotal: number; stage: DrillStage; status: ProgressStatus; updatedAt: string; }
export interface ScoreRecord { id: string; date: string; score: number; }
export interface ErrorRecord { id: string; questionId: string; topicId: string; kind: ErrorKind | null; date: string; }
export interface WarmupAttempt { id: string; questionId: string; topicId: string; correct: boolean; seconds: number; date: string; }
export interface ChallengeLesson { topicId: string; title: string; questionText: string; sourceId: string; imageUrl?: string; videoUrl: string; takeaway: string; notes: string; }

export interface AppData {
  curriculumVersion: 3;
  skillProgress: Record<string, SkillProgress>;
  /** v1 compatibility alias; kept in sync with skillProgress during migration. */
  progress: Record<string, TopicProgress>;
  unitProgress: Record<string, DrillUnitProgress>;
  drillUnits: DrillUnit[];
  frameworkTargets: FrameworkTarget[];
  questionModels: QuestionModel[];
  scores: ScoreRecord[]; errors: ErrorRecord[]; warmups: WarmupAttempt[]; questions: Question[];
  challenge: ChallengeLesson; questionAttempts: number;
}

const completedSkills = new Set([
  "linear-equations-in-one-variable", "linear-equations-in-two-variables", "linear-functions",
  "equivalent-expressions", "nonlinear-equations-in-one-variable-and-systems-of-equations-in-two-variables",
  "ratios-rates-proportional-relationships-and-units", "percentages",
  "one-variable-data-distributions-and-measures-of-center-and-spread",
]);
const nowFor = (offset = 0) => new Date(Date.now() - offset * 86400000).toISOString();
const challengeSeed = (): ChallengeLesson => ({
  topicId: "area-and-volume", title: "Scale Factors and Area", sourceId: "G1-LIVE-01",
  questionText: areaVolumeQuestions.find((question) => question.difficulty === "hard")?.prompt ?? "",
  videoUrl: "https://www.youtube.com/embed/6v2L2UGZJAM",
  takeaway: "A side-length scale factor must be squared when comparing areas.",
  notes: "Pause before calculating: identify what scales linearly, by area, or by volume.",
});

const makeBase = (fresh: boolean): AppData => {
  const progress: Record<string, TopicProgress> = {};
  const unitProgress: Record<string, DrillUnitProgress> = {};
  allSkills.forEach((item, skillIndex) => {
    const isComplete = !fresh && completedSkills.has(item.id);
    const isG1 = !fresh && item.id === "area-and-volume";
    progress[item.id] = {
      skillId: item.id, topicId: item.id, easyCompleted: isComplete ? item.drillUnits.reduce((sum, u) => sum + u.easyQuestionCount, 0) : isG1 ? 10 : 0,
      mediumCompleted: isComplete ? item.drillUnits.reduce((sum, u) => sum + u.mediumQuestionCount, 0) : isG1 ? 6 : 0,
      gateScore: isComplete ? item.gateThreshold : null, status: isComplete ? "complete" : isG1 ? "in_progress" : "available",
      challengeCompleted: isComplete, updatedAt: nowFor(skillIndex),
    };
    item.drillUnits.forEach((drillUnit, unitIndex) => {
      const g1Completed = isG1 && unitIndex < 3;
      const g1Current = isG1 && unitIndex === 3;
      const freshFirst = fresh && skillIndex === 0 && unitIndex === 0;
      unitProgress[drillUnit.id] = {
        drillUnitId: drillUnit.id,
        easyCompleted: isComplete || g1Completed ? drillUnit.easyQuestionCount : g1Current ? 1 : 0,
        easyTotal: drillUnit.easyQuestionCount,
        mediumCompleted: isComplete || g1Completed ? drillUnit.mediumQuestionCount : 0,
        mediumTotal: drillUnit.mediumQuestionCount,
        hardCompleted: isComplete || g1Completed ? drillUnit.hardQuestionCount : 0,
        hardTotal: drillUnit.hardQuestionCount,
        stage: isComplete || g1Completed ? "complete" : g1Current ? "easy" : "examples",
        status: isComplete || g1Completed ? "complete" : g1Current ? "in_progress" : "available",
        updatedAt: nowFor(skillIndex + unitIndex),
      };
    });
  });
  return {
    curriculumVersion: 3, skillProgress: progress, progress, unitProgress, drillUnits: structuredClone(allDrillUnits),
    frameworkTargets: structuredClone(allDrillUnits.flatMap((item) => item.frameworkTargets)), questionModels: structuredClone(questionModels),
    scores: fresh ? [] : [{ id: "score-1", date: "2026-05-20", score: 490 }, { id: "score-2", date: "2026-06-28", score: 570 }, { id: "score-3", date: "2026-08-02", score: 620 }],
    errors: fresh ? [] : [{ id: "err-1", questionId: "g1a-medium-1", topicId: "area-and-volume", kind: "Procedure", date: "2026-08-04" }],
    warmups: [], questions: structuredClone(seedQuestions), questionAttempts: fresh ? 0 : 284, challenge: challengeSeed(),
  };
};

export const makeSeedData = () => makeBase(false);
export const makeNewStudentData = () => makeBase(true);

const legacySkillIds: Record<string, string> = {
  "linear-equations-in-one-variable": "linear-equations-in-one-variable", "linear-functions": "linear-functions",
  "linear-equations-in-two-variables": "linear-equations-in-two-variables", "systems-of-two-linear-equations": "systems-of-two-linear-equations-in-two-variables",
  "linear-inequalities": "linear-inequalities-in-one-or-two-variables", "equivalent-expressions": "equivalent-expressions",
  "nonlinear-equations-in-one-variable": "nonlinear-equations-in-one-variable-and-systems-of-equations-in-two-variables",
  "systems-of-one-linear-equation-and-one-nonlinear-equation": "nonlinear-equations-in-one-variable-and-systems-of-equations-in-two-variables",
  "nonlinear-functions": "nonlinear-functions", "ratios-rates-proportions-and-units": "ratios-rates-proportional-relationships-and-units",
  "percentages-and-growth-factor": "percentages", "one-variable-data": "one-variable-data-distributions-and-measures-of-center-and-spread",
  "two-variable-data": "two-variable-data-models-and-scatterplots", "probability-and-conditional-probability": "probability-and-conditional-probability",
  "sample-statistics-and-margin-of-error": "inference-from-sample-statistics-and-margin-of-error",
  "evaluating-statistical-claims": "evaluating-statistical-claims-observational-studies-and-experiments",
  "area-and-volume": "area-and-volume", "lines-angles-and-triangles": "lines-angles-and-triangles",
  "right-triangles-and-trigonometry": "right-triangles-and-trigonometry", circles: "circles",
};

const g1LegacyMappings: Record<string, [string, number]> = {
  e1: ["g1a", 1], e2: ["g1a", 1], e3: ["g1a", 1], e4: ["g1a", 1], e5: ["g1c", 1], e6: ["g1d", 2],
  m1: ["g1a", 1], m2: ["g1e", 2], m3: ["g1c", 1], m4: ["g1a", 1], m5: ["g1d", 4], m6: ["g1d", 2],
  g1: ["g1a", 2], g2: ["g1a", 1], g3: ["g1d", 4], g4: ["g1a", 2], challenge: ["g1e", 2],
};

const retiredUnitMappings: Record<string, string> = {
  p2f: "p2e",
  p3g: "p3f",
  p6e: "p6d",
  p7e: "p7d",
};

const mergeProgressStatus = (left: ProgressStatus, right: ProgressStatus): ProgressStatus => {
  const rank: Record<ProgressStatus, number> = { locked: 0, available: 1, in_progress: 2, review: 3, complete: 4 };
  return rank[left] >= rank[right] ? left : right;
};

const inferDrillStage = (record: Omit<DrillUnitProgress, "stage"> & { stage?: DrillStage | "concept" | "example" }): DrillStage => {
  if (record.status === "complete") return "complete";
  if ((record.hardCompleted ?? 0) >= (record.hardTotal ?? 3)) return "video";
  if ((record.hardCompleted ?? 0) > 0 || record.mediumCompleted >= record.mediumTotal) return "hard";
  if (record.mediumCompleted > 0 || record.easyCompleted >= record.easyTotal) return "medium";
  if (record.easyCompleted > 0) return "easy";
  return record.stage === "concept" || record.stage === "example" || !record.stage ? "examples" : record.stage;
};

const normalizeUnitProgress = (saved: Record<string, DrillUnitProgress> | undefined, seed: AppData["unitProgress"]) => {
  const merged = structuredClone(seed);
  for (const [savedId, record] of Object.entries(saved ?? {})) {
    const unitId = retiredUnitMappings[savedId] ?? savedId;
    const canonical = merged[unitId];
    if (!canonical) continue;
    merged[unitId] = {
      ...canonical,
      easyCompleted: Math.min(canonical.easyTotal, Math.max(canonical.easyCompleted, record.easyCompleted)),
      mediumCompleted: Math.min(canonical.mediumTotal, Math.max(canonical.mediumCompleted, record.mediumCompleted)),
      hardCompleted: Math.min(canonical.hardTotal, Math.max(canonical.hardCompleted, record.hardCompleted ?? 0)),
      stage: inferDrillStage(record),
      status: mergeProgressStatus(canonical.status, record.status),
      updatedAt: canonical.updatedAt > record.updatedAt ? canonical.updatedAt : record.updatedAt,
    };
  }
  return merged;
};

const normalizeQuestion = (question: Question): Question => {
  const mappedUnitId = retiredUnitMappings[question.drillUnitId] ?? question.drillUnitId;
  const drillUnit = getDrillUnit(mappedUnitId);
  if (!drillUnit) return { ...question, status: "review", requiresReview: true, questionModelId: undefined };
  const skill = getSkill(drillUnit.skillId)!;
  const mappedFromRetiredUnit = mappedUnitId !== question.drillUnitId;
  const target = mappedFromRetiredUnit
    ? drillUnit.frameworkTargets[0]
    : drillUnit.frameworkTargets.find((item) => item.id === question.frameworkTargetId);
  return {
    ...question,
    domainId: skill.domainId,
    domain: skill.domainId,
    skillId: skill.id,
    skillName: skill.title,
    drillUnitId: drillUnit.id,
    drillUnitName: drillUnit.name,
    frameworkTargetId: target?.id ?? "",
    frameworkTarget: target?.description ?? "Requires curriculum review",
    questionModelId: target ? `${drillUnit.id}-${question.difficulty}-model` : undefined,
    categoryId: skill.domainId,
    topicId: skill.id,
    status: mappedFromRetiredUnit || !target ? "review" : question.status ?? (question.requiresReview ? "review" : "active"),
    requiresReview: mappedFromRetiredUnit || !target || Boolean(question.requiresReview),
  };
};

const mergeSavedQuestions = (saved: Question[] | undefined, seed: Question[]) => {
  const merged = new Map(seed.map((question) => [question.id, question]));
  for (const question of saved ?? []) {
    if (merged.has(question.id) && question.sourceType === "placeholder") continue;
    merged.set(question.id, normalizeQuestion({ ...question, domainId: question.domainId ?? question.categoryId }));
  }
  return [...merged.values()];
};

type LegacyQuestion = { id: string; categoryId: string; topicId: string; difficulty: string; type: string; prompt: string; math?: string; imageUrl?: string; choices?: string[]; correctAnswer: string; explanation: string; sourceLabel?: string; sourceQuestionId?: string; order: number };
const migrateLegacyQuestion = (legacy: LegacyQuestion): Question | null => {
  const skillId = legacySkillIds[legacy.topicId]; const skill = skillId ? getSkill(skillId) : undefined; if (!skill) return null;
  const confident = legacy.topicId === "area-and-volume" ? g1LegacyMappings[legacy.id] : undefined;
  const drillUnit = confident ? getDrillUnit(confident[0]) : undefined;
  const target = drillUnit ? drillUnit.frameworkTargets[Math.min(confident![1] - 1, drillUnit.frameworkTargets.length - 1)] : undefined;
  const questionType: QuestionType = legacy.type === "student_response" ? "student_response" : "multiple_choice";
  const difficulty: QuestionDifficulty = legacy.difficulty === "hard" ? "hard" : legacy.difficulty === "easy" ? "easy" : "medium";
  return {
    id: legacy.id, domainId: skill.domainId, domain: skill.domainId, skillId: skill.id, skillName: skill.title,
    drillUnitId: drillUnit?.id ?? "", drillUnitName: drillUnit?.name ?? "Unmapped legacy question",
    frameworkTargetId: target?.id ?? "", frameworkTarget: target?.description ?? "Requires curriculum review",
    difficulty, questionType, prompt: legacy.prompt, math: legacy.math, imageUrl: legacy.imageUrl, choices: legacy.choices,
    correctAnswer: legacy.correctAnswer, explanation: legacy.explanation, sourceType: "legacy", sourceQuestionId: legacy.sourceQuestionId,
    order: legacy.order, status: target ? "active" : "review", isGate: legacy.difficulty === "gate", requiresReview: !target,
    categoryId: skill.domainId, topicId: skill.id, type: questionType, sourceLabel: legacy.sourceLabel ?? "Legacy SAT Math Drill question",
  };
};

/** Safely upgrades v1 local demo state without inventing mappings for broad legacy questions. */
export const migrateAppData = (raw: unknown, fresh = false): AppData => {
  const seed = fresh ? makeNewStudentData() : makeSeedData();
  if (!raw || typeof raw !== "object") return seed;
  const saved = raw as Omit<Partial<AppData>, "curriculumVersion"> & { curriculumVersion?: number };
  if (saved.curriculumVersion === 2 || saved.curriculumVersion === 3) {
    const savedSkillProgress = saved.skillProgress ?? saved.progress ?? {};
    const mergedProgress = { ...seed.skillProgress };
    for (const [skillId, record] of Object.entries(savedSkillProgress)) mergedProgress[skillId] = { ...mergedProgress[skillId], ...record, status: record.status === "locked" ? "available" : record.status, skillId, topicId: skillId };
    const normalizedQuestions = saved.questions?.some((item) => "drillUnitId" in item) ? mergeSavedQuestions(saved.questions, seed.questions) : seed.questions;
    return {
      ...seed, ...saved, curriculumVersion: 3,
      skillProgress: mergedProgress, progress: mergedProgress, unitProgress: normalizeUnitProgress(saved.unitProgress, seed.unitProgress),
      drillUnits: seed.drillUnits.map((unit) => {
        const savedUnit = saved.drillUnits?.find((candidate) => candidate.id === unit.id);
        return { ...unit, ...savedUnit, workedExampleCount: Math.max(2, Math.min(3, savedUnit?.workedExampleCount ?? unit.workedExampleCount)), easyQuestionCount: Math.max(5, savedUnit?.easyQuestionCount ?? unit.easyQuestionCount), mediumQuestionCount: Math.max(5, savedUnit?.mediumQuestionCount ?? unit.mediumQuestionCount), hardQuestionCount: 3, videoUrl: savedUnit?.videoUrl ?? unit.videoUrl };
      }),
      frameworkTargets: seed.frameworkTargets.map((target) => ({ ...target, ...saved.frameworkTargets?.find((savedTarget) => savedTarget.id === target.id) })),
      questionModels: seed.questionModels,
      questions: normalizedQuestions,
    };
  }
  const legacy = raw as { progress?: Record<string, Omit<SkillProgress, "skillId">>; scores?: ScoreRecord[]; errors?: ErrorRecord[]; warmups?: WarmupAttempt[]; questions?: LegacyQuestion[]; questionAttempts?: number; challenge?: ChallengeLesson };
  const migratedQuestions = legacy.questions?.map(migrateLegacyQuestion).filter((question): question is Question => Boolean(question)) ?? [];
  const migratedProgress = { ...seed.skillProgress };
  const seenLegacySkills = new Set<string>();
  for (const [legacyId, record] of Object.entries(legacy.progress ?? {})) {
    const skillId = legacySkillIds[legacyId]; if (!skillId || !migratedProgress[skillId]) continue;
    const current = migratedProgress[skillId];
    if (!seenLegacySkills.has(skillId)) migratedProgress[skillId] = { ...current, ...record, skillId, topicId: skillId };
    else {
      const bothComplete = current.status === "complete" && record.status === "complete";
      const anyStarted = current.easyCompleted + current.mediumCompleted + record.easyCompleted + record.mediumCompleted > 0;
      migratedProgress[skillId] = {
        ...current, skillId, topicId: skillId, easyCompleted: current.easyCompleted + record.easyCompleted,
        mediumCompleted: current.mediumCompleted + record.mediumCompleted, gateScore: bothComplete ? 4 : null,
        status: bothComplete ? "complete" : anyStarted ? "in_progress" : current.status,
        challengeCompleted: current.challengeCompleted && record.challengeCompleted,
        updatedAt: current.updatedAt > record.updatedAt ? current.updatedAt : record.updatedAt,
      };
    }
    seenLegacySkills.add(skillId);
  }
  for (const record of Object.values(migratedProgress)) if (record.status === "locked") record.status = "available";
  return { ...seed, skillProgress: migratedProgress, progress: migratedProgress, scores: legacy.scores ?? seed.scores, errors: legacy.errors ?? seed.errors, warmups: legacy.warmups ?? seed.warmups, questions: [...seed.questions, ...migratedQuestions], questionAttempts: legacy.questionAttempts ?? seed.questionAttempts, challenge: legacy.challenge ?? seed.challenge };
};

export const calculateSkillProgress = (skillId: string, data: AppData): TopicProgress => {
  const item = allSkills.find((candidate) => candidate.id === skillId);
  const fallback = data.skillProgress[skillId];
  if (!item) return fallback;
  const units = data.drillUnits.filter((drillUnit) => drillUnit.skillId === skillId && drillUnit.isActive).map((drillUnit) => data.unitProgress[drillUnit.id]).filter(Boolean);
  const allComplete = units.length > 0 && units.every((entry) => entry.status === "complete");
  const started = units.some((entry) => entry.status === "in_progress" || entry.stage !== "examples" || entry.easyCompleted + entry.mediumCompleted + entry.hardCompleted > 0);
  const gatePassed = (fallback?.gateScore ?? 0) >= item.gateThreshold;
  return {
    ...(fallback ?? { skillId, topicId: skillId, gateScore: null, challengeCompleted: false }), skillId, topicId: skillId,
    easyCompleted: units.reduce((sum, entry) => sum + entry.easyCompleted, 0), mediumCompleted: units.reduce((sum, entry) => sum + entry.mediumCompleted + entry.hardCompleted, 0),
    status: allComplete ? "complete" : gatePassed || started ? "in_progress" : fallback?.status === "locked" ? "available" : fallback?.status ?? "available",
    updatedAt: new Date().toISOString(),
  };
};

export const calculateSkillUnitPercent = (skillId: string, data: AppData) => {
  const units = data.drillUnits.filter((unit) => unit.skillId === skillId && unit.isActive);
  const totals = units.reduce((summary, unit) => {
    const progress = data.unitProgress[unit.id];
    if (!progress) return summary;
    summary.completed += Math.min(progress.easyCompleted, progress.easyTotal) + Math.min(progress.mediumCompleted, progress.mediumTotal) + Math.min(progress.hardCompleted, progress.hardTotal);
    summary.available += progress.easyTotal + progress.mediumTotal + progress.hardTotal;
    return summary;
  }, { completed: 0, available: 0 });
  return totals.available ? Math.round(totals.completed / totals.available * 100) : 0;
};

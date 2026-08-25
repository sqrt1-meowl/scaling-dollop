import { allProgramUnits, type ProgramMasteryState, type ProgramStage } from "./programCurriculum";

export type StageState = "not_started" | "in_progress" | "mastered" | "skipped_by_placement" | "needs_repair";

export interface UnitLearningProgress {
  unitId: string;
  state: ProgramMasteryState;
  currentStage: ProgramStage;
  stageStates: Record<ProgramStage, StageState>;
  stageScores: Partial<Record<ProgramStage, number>>;
  missedQuestionIds: string[];
  reviewDue: boolean;
  usedHelp: boolean;
  transferComplete: boolean;
  updatedAt: string;
}

export interface ProgramProgress {
  version: 1;
  units: Record<string, UnitLearningProgress>;
}

const now = () => new Date().toISOString();

export function emptyUnitProgress(unitId: string): UnitLearningProgress {
  return {
    unitId,
    state: "not_started",
    currentStage: "learn",
    stageStates: { learn: "not_started", easy: "not_started", medium: "not_started", hard: "not_started", review: "not_started" },
    stageScores: {},
    missedQuestionIds: [],
    reviewDue: false,
    usedHelp: false,
    transferComplete: false,
    updatedAt: now(),
  };
}

export function makeProgramProgress(): ProgramProgress {
  return { version: 1, units: Object.fromEntries(allProgramUnits.map((unit) => [unit.id, emptyUnitProgress(unit.id)])) };
}

export function migrateProgramProgress(input: unknown): ProgramProgress {
  const base = makeProgramProgress();
  if (!input || typeof input !== "object") return base;
  const stored = input as Partial<ProgramProgress>;
  if (!stored.units || typeof stored.units !== "object") return base;
  for (const unit of allProgramUnits) {
    const value = stored.units[unit.id];
    if (!value) continue;
    base.units[unit.id] = { ...base.units[unit.id], ...value, unitId: unit.id, stageStates: { ...base.units[unit.id].stageStates, ...value.stageStates }, stageScores: { ...value.stageScores } };
  }
  return base;
}

export function programProgressKey(email?: string) {
  return `sat-math-program-progress-v1:${email?.toLowerCase() || "guest"}`;
}

export function loadProgramProgress(email?: string): ProgramProgress {
  if (typeof window === "undefined") return makeProgramProgress();
  try {
    const saved = window.localStorage.getItem(programProgressKey(email));
    return saved ? migrateProgramProgress(JSON.parse(saved)) : makeProgramProgress();
  } catch {
    return makeProgramProgress();
  }
}

export function saveProgramProgress(progress: ProgramProgress, email?: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(programProgressKey(email), JSON.stringify(progress));
}

export function updateUnitRecord(progress: ProgramProgress, unitId: string, patch: Partial<UnitLearningProgress>): ProgramProgress {
  const previous = progress.units[unitId] ?? emptyUnitProgress(unitId);
  return { ...progress, units: { ...progress.units, [unitId]: { ...previous, ...patch, stageStates: { ...previous.stageStates, ...patch.stageStates }, stageScores: { ...previous.stageScores, ...patch.stageScores }, updatedAt: now() } } };
}

export function skipUnitByPlacement(progress: ProgramProgress, unitId: string): ProgramProgress {
  return updateUnitRecord(progress, unitId, {
    state: "skipped_by_placement",
    currentStage: "review",
    stageStates: { learn: "skipped_by_placement", easy: "skipped_by_placement", medium: "skipped_by_placement", hard: "skipped_by_placement", review: "skipped_by_placement" },
    reviewDue: false,
  });
}

export function skipStageByPlacement(progress: ProgramProgress, unitId: string, stage: ProgramStage): ProgramProgress {
  return updateUnitRecord(progress, unitId, { state: "in_progress", stageStates: { ...progress.units[unitId]?.stageStates, [stage]: "skipped_by_placement" } as Record<ProgramStage, StageState> });
}

export function retryStage(progress: ProgramProgress, unitId: string, stage: ProgramStage): ProgramProgress {
  return updateUnitRecord(progress, unitId, { state: "in_progress", currentStage: stage, stageStates: { ...progress.units[unitId]?.stageStates, [stage]: "in_progress" } as Record<ProgramStage, StageState>, stageScores: { ...progress.units[unitId]?.stageScores, [stage]: 0 } });
}

export function recordStageResult(progress: ProgramProgress, unitId: string, stage: ProgramStage, score: number, missedQuestionIds: string[], passed: boolean): ProgramProgress {
  const previous = progress.units[unitId] ?? emptyUnitProgress(unitId);
  const missed = Array.from(new Set([...previous.missedQuestionIds, ...missedQuestionIds]));
  const nextStage: ProgramStage = stage === "learn" ? "easy" : stage === "easy" ? "medium" : stage === "medium" ? "hard" : "review";
  return updateUnitRecord(progress, unitId, {
    state: passed ? (stage === "hard" ? (missed.length ? "review_due" : "mastered") : "in_progress") : "needs_repair",
    currentStage: passed ? nextStage : stage,
    stageStates: { ...previous.stageStates, [stage]: passed ? "mastered" : "needs_repair", [nextStage]: passed ? "in_progress" : previous.stageStates[nextStage] } as Record<ProgramStage, StageState>,
    stageScores: { ...previous.stageScores, [stage]: score },
    missedQuestionIds: missed,
    reviewDue: stage === "hard" ? missed.length > 0 : previous.reviewDue,
  });
}

export function clearReview(progress: ProgramProgress, unitId: string): ProgramProgress {
  const previous = progress.units[unitId] ?? emptyUnitProgress(unitId);
  return updateUnitRecord(progress, unitId, {
    state: "mastered",
    currentStage: "review",
    stageStates: { ...previous.stageStates, review: "mastered" },
    missedQuestionIds: [],
    reviewDue: false,
  });
}

export function unitMasteryPercent(progress: UnitLearningProgress | undefined) {
  if (!progress) return 0;
  const stages: ProgramStage[] = ["learn", "easy", "medium", "hard", "review"];
  const complete = stages.filter((stage) => ["mastered", "skipped_by_placement"].includes(progress.stageStates[stage])).length;
  return Math.round(complete / stages.length * 100);
}

export function packetMasteryPercent(progress: ProgramProgress, unitIds: string[]) {
  if (!unitIds.length) return 0;
  return Math.round(unitIds.reduce((sum, id) => sum + unitMasteryPercent(progress.units[id]), 0) / unitIds.length);
}


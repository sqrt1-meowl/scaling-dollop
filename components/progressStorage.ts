"use client";

export type StudentProgress = {
  xp: number;
  practicesCompleted: number;
  completedScenarioIds: string[];
  lastPracticeDate: string;
};

const progressKey = "ideaspeak-progress";

export const emptyProgress: StudentProgress = {
  xp: 0,
  practicesCompleted: 0,
  completedScenarioIds: [],
  lastPracticeDate: ""
};

export function getProgress(): StudentProgress {
  if (typeof window === "undefined") {
    return emptyProgress;
  }

  const stored = window.localStorage.getItem(progressKey);

  if (!stored) {
    return emptyProgress;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<StudentProgress>;

    return {
      xp: Number(parsed.xp) || 0,
      practicesCompleted: Number(parsed.practicesCompleted) || 0,
      completedScenarioIds: Array.isArray(parsed.completedScenarioIds) ? parsed.completedScenarioIds : [],
      lastPracticeDate: typeof parsed.lastPracticeDate === "string" ? parsed.lastPracticeDate : ""
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: StudentProgress) {
  window.localStorage.setItem(progressKey, JSON.stringify(progress));
}

export function completeScenario(scenarioId: string) {
  const progress = getProgress();
  const completedScenarioIds = progress.completedScenarioIds.includes(scenarioId)
    ? progress.completedScenarioIds
    : [...progress.completedScenarioIds, scenarioId];

  const nextProgress: StudentProgress = {
    xp: progress.xp + 10,
    practicesCompleted: progress.practicesCompleted + 1,
    completedScenarioIds,
    lastPracticeDate: new Date().toISOString().slice(0, 10)
  };

  saveProgress(nextProgress);
  return nextProgress;
}

export function getSimpleStreak(progress: StudentProgress) {
  if (!progress.lastPracticeDate) {
    return 0;
  }

  return 1;
}

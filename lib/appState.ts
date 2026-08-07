import type { Question, TopicStatus } from "./curriculum";
import { allTopics, areaVolumeQuestions, seedQuestions } from "./curriculum";

export type Role = "student" | "admin";
export type ErrorKind = "Concept" | "Procedure" | "Careless" | "Time";
export interface Session { email: string; role: Role; name: string; }
export interface TopicProgress { topicId: string; easyCompleted: number; mediumCompleted: number; gateScore: number | null; status: TopicStatus; challengeCompleted: boolean; updatedAt: string; }
export interface ScoreRecord { id: string; date: string; score: number; }
export interface ErrorRecord { id: string; questionId: string; topicId: string; kind: ErrorKind | null; date: string; }
export interface WarmupAttempt { id: string; questionId: string; topicId: string; correct: boolean; seconds: number; date: string; }
export interface ChallengeLesson { topicId: string; title: string; questionText: string; sourceId: string; videoUrl: string; takeaway: string; notes: string; }

export interface AppData {
  progress: Record<string, TopicProgress>;
  scores: ScoreRecord[];
  errors: ErrorRecord[];
  warmups: WarmupAttempt[];
  questions: Question[];
  challenge: ChallengeLesson;
  questionAttempts: number;
}

const completed = new Set([
  "linear-equations-in-one-variable", "linear-functions", "linear-equations-in-two-variables",
  "equivalent-expressions", "nonlinear-equations-in-one-variable", "systems-of-one-linear-equation-and-one-nonlinear-equation",
  "ratios-rates-proportions-and-units", "percentages-and-growth-factor", "one-variable-data", "two-variable-data",
]);

export const makeSeedData = (): AppData => {
  const progress: Record<string, TopicProgress> = {};
  allTopics.forEach((topic, index) => {
    const isComplete = completed.has(topic.id);
    const isArea = topic.id === "area-and-volume";
    progress[topic.id] = {
      topicId: topic.id, easyCompleted: isComplete ? 6 : isArea ? 6 : 0, mediumCompleted: isComplete ? 6 : isArea ? 2 : 0,
      gateScore: isComplete ? 4 : null, status: isComplete ? "complete" : isArea ? "in_progress" : index % 5 === 3 ? "available" : "locked",
      challengeCompleted: isComplete, updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
    };
  });
  return {
    progress,
    scores: [
      { id: "score-1", date: "2026-05-20", score: 490 }, { id: "score-2", date: "2026-06-28", score: 570 }, { id: "score-3", date: "2026-08-02", score: 620 },
    ],
    errors: [
      { id: "err-1", questionId: "m1", topicId: "area-and-volume", kind: "Procedure", date: "2026-08-04" },
      { id: "err-2", questionId: "e4", topicId: "area-and-volume", kind: null, date: "2026-08-05" },
    ],
    warmups: [], questions: seedQuestions, questionAttempts: 284,
    challenge: {
      topicId: "area-and-volume", title: "Scale Factors and Area", sourceId: "AV-CH-01",
      questionText: areaVolumeQuestions.find((q) => q.difficulty === "hard")?.prompt ?? "",
      videoUrl: "https://www.youtube.com/embed/6v2L2UGZJAM",
      takeaway: "The formula itself is familiar. The hard part is recognizing that a side-length scale factor must be squared when comparing areas.",
      notes: "Pause before calculating: identify what scales linearly and what scales by area.",
    },
  };
};

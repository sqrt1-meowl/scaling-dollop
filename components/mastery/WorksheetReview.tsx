"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export type TrackableProblem = { id: string; stem: string };
export type MistakeRecord = {
  problemId: string;
  givenAnswer: string;
  missCount: number;
  firstMissedAt: string;
  lastMissedAt: string;
};

const normalizeAnswer = (value: string) => value
  .trim()
  .toLowerCase()
  .replaceAll("−", "-")
  .replaceAll("–", "-")
  .replace(/[\s,$]/g, "");

export function answersMatch(given: string, correct: string) {
  return normalizeAnswer(given) === normalizeAnswer(correct);
}

function mergeMistakes(current: MistakeRecord[], incoming: MistakeRecord[]) {
  const merged = new Map(current.map((mistake) => [mistake.problemId, mistake]));
  for (const mistake of incoming) {
    const existing = merged.get(mistake.problemId);
    if (!existing || mistake.missCount >= existing.missCount) merged.set(mistake.problemId, mistake);
  }
  return Array.from(merged.values()).sort((a, b) => b.lastMissedAt.localeCompare(a.lastMissedAt));
}

export function useWorksheetReview<T extends TrackableProblem>({
  worksheetId,
  problems,
  correctAnswers,
}: {
  worksheetId: string;
  problems: readonly T[];
  correctAnswers: Readonly<Record<string, string>>;
}) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [trackerError, setTrackerError] = useState("");
  const recordedThisRun = useRef(new Set<string>());
  const problem = problems[problemIndex];
  const answer = problem ? answers[problem.id] ?? "" : "";

  useEffect(() => {
    let active = true;
    fetch(`/api/mastery/mistakes?worksheetId=${encodeURIComponent(worksheetId)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { mistakes?: MistakeRecord[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "Mistake tracker unavailable");
        if (active) setMistakes((current) => mergeMistakes(current, payload.mistakes ?? []));
      })
      .catch((error: Error) => { if (active) setTrackerError(error.message); });
    return () => { active = false; };
  }, [worksheetId]);

  const setAnswer = (value: string) => {
    if (!problem) return;
    setAnswers((current) => ({ ...current, [problem.id]: value }));
  };

  const recordCurrentMistake = () => {
    if (!problem || !answer.trim() || recordedThisRun.current.has(problem.id)) return;
    const correctAnswer = correctAnswers[problem.id];
    if (!correctAnswer || answersMatch(answer, correctAnswer)) return;
    recordedThisRun.current.add(problem.id);
    const now = new Date().toISOString();
    setMistakes((current) => {
      const existing = current.find((mistake) => mistake.problemId === problem.id);
      const next: MistakeRecord = existing
        ? { ...existing, givenAnswer: answer, missCount: existing.missCount + 1, lastMissedAt: now }
        : { problemId: problem.id, givenAnswer: answer, missCount: 1, firstMissedAt: now, lastMissedAt: now };
      return mergeMistakes(current.filter((mistake) => mistake.problemId !== problem.id), [next]);
    });
    void fetch("/api/mastery/mistakes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ worksheetId, problemId: problem.id, givenAnswer: answer }),
    }).then(async (response) => {
      if (response.ok) return;
      const payload = await response.json() as { error?: string };
      throw new Error(payload.error || "Mistake tracker unavailable");
    }).catch((error: Error) => setTrackerError(error.message));
  };

  const advance = () => {
    if (!answer.trim()) return false;
    recordCurrentMistake();
    if (problemIndex === problems.length - 1) return true;
    setProblemIndex((value) => value + 1);
    return false;
  };

  const previous = () => setProblemIndex((value) => Math.max(0, value - 1));

  return { problemIndex, problem, answer, setAnswer, advance, previous, mistakes, trackerError };
}

export function MistakeBadge({ count, error }: { count: number; error?: string }) {
  return <div className={`worksheet-mistake-count ${error ? "error" : ""}`} title={error || "Unique questions missed in this worksheet"}>
    <AlertTriangle size={17}/><div><span>Mistake tracker</span><b>{count}</b></div>
  </div>;
}

export function MistakeReview({ mistakes, problems, correctAnswers }: {
  mistakes: MistakeRecord[];
  problems: readonly TrackableProblem[];
  correctAnswers: Readonly<Record<string, string>>;
}) {
  const problemById = new Map(problems.map((problem) => [problem.id, problem]));
  return <section className="worksheet-mistake-review">
    <div className="worksheet-mistake-review-title"><AlertTriangle size={17}/><div><p className="label">Mistake tracker</p><b>{mistakes.length} question{mistakes.length === 1 ? "" : "s"} to review</b></div></div>
    {mistakes.length === 0 ? <div className="worksheet-perfect-run"><CheckCircle2 size={18}/><span>No mistakes recorded on this worksheet.</span></div> : <div className="worksheet-mistake-list">{mistakes.map((mistake) => {
      const problem = problemById.get(mistake.problemId);
      return <article key={mistake.problemId}><div><b>{problem?.stem ?? mistake.problemId}</b><p>Answered: {mistake.givenAnswer} · Correct: {correctAnswers[mistake.problemId] ?? "—"}</p></div><span>{mistake.missCount}×</span></article>;
    })}</div>}
  </section>;
}

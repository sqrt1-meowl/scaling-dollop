"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppData, ChallengeLesson, ErrorKind, Role, ScoreRecord, Session, TopicProgress, WarmupAttempt } from "@/lib/appState";
import { makeSeedData } from "@/lib/appState";
import type { Question } from "@/lib/curriculum";

const DATA_KEY = "sat-math-drill-data-v1";
const SESSION_KEY = "sat-math-drill-session-v1";

interface AppContextValue {
  data: AppData;
  session: Session | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; role?: Role; message?: string };
  logout: () => void;
  updateProgress: (topicId: string, patch: Partial<TopicProgress>) => void;
  addError: (questionId: string, topicId: string) => void;
  tagError: (errorId: string, kind: ErrorKind) => void;
  addScore: (date: string, score: number) => void;
  recordWarmup: (attempt: WarmupAttempt) => void;
  updateQuestion: (question: Question) => void;
  updateChallenge: (challenge: ChallengeLesson) => void;
  resetTopic: (topicId: string) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(makeSeedData);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(DATA_KEY);
      const savedSession = window.localStorage.getItem(SESSION_KEY);
      if (savedData) setData(JSON.parse(savedData));
      if (savedSession) setSession(JSON.parse(savedSession));
    } catch { /* reset to safe seed state */ }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) window.localStorage.setItem(DATA_KEY, JSON.stringify(data)); }, [data, ready]);
  useEffect(() => {
    if (!ready) return;
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  }, [session, ready]);

  const value = useMemo<AppContextValue>(() => ({
    data, session, ready,
    login(email, password) {
      const normalized = email.trim().toLowerCase();
      if (password !== "demo123") return { ok: false, message: "Use the demo password: demo123" };
      if (normalized === "student@example.com") { setSession({ email: normalized, role: "student", name: "Maya" }); return { ok: true, role: "student" }; }
      if (normalized === "admin@example.com") { setSession({ email: normalized, role: "admin", name: "Ms. Rivera" }); return { ok: true, role: "admin" }; }
      return { ok: false, message: "Use one of the demo accounts shown below." };
    },
    logout: () => setSession(null),
    updateProgress(topicId, patch) { setData((current) => ({ ...current, progress: { ...current.progress, [topicId]: { ...current.progress[topicId], ...patch, updatedAt: new Date().toISOString() } } })); },
    addError(questionId, topicId) { setData((current) => ({ ...current, errors: [...current.errors, { id: `err-${Date.now()}`, questionId, topicId, kind: null, date: new Date().toISOString().slice(0, 10) }] })); },
    tagError(errorId, kind) { setData((current) => ({ ...current, errors: current.errors.map((error) => error.id === errorId ? { ...error, kind } : error) })); },
    addScore(date, score) { const record: ScoreRecord = { id: `score-${Date.now()}`, date, score }; setData((current) => ({ ...current, scores: [...current.scores, record].sort((a, b) => a.date.localeCompare(b.date)) })); },
    recordWarmup(attempt) { setData((current) => ({ ...current, warmups: [...current.warmups, attempt], questionAttempts: current.questionAttempts + 1 })); },
    updateQuestion(question) { setData((current) => ({ ...current, questions: current.questions.map((item) => item.id === question.id ? question : item) })); },
    updateChallenge(challenge) { setData((current) => ({ ...current, challenge })); },
    resetTopic(topicId) { setData((current) => ({ ...current, progress: { ...current.progress, [topicId]: { topicId, easyCompleted: 0, mediumCompleted: 0, gateScore: null, status: "available", challengeCompleted: false, updatedAt: new Date().toISOString() } } })); },
    resetDemo() { const seed = makeSeedData(); setData(seed); setSession(null); window.localStorage.removeItem(DATA_KEY); window.localStorage.removeItem(SESSION_KEY); },
  }), [data, session, ready]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { session, ready } = useApp();
  const router = useRouter();
  useEffect(() => { if (ready && session?.role !== role) router.replace("/"); }, [ready, role, router, session]);
  if (!ready || session?.role !== role) return <div className="min-h-screen grid place-items-center text-sm text-[#677386]">Preparing your workspace…</div>;
  return <>{children}</>;
}

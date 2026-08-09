"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppData, ChallengeLesson, DrillUnitProgress, ErrorKind, Role, ScoreRecord, Session, TopicProgress, WarmupAttempt } from "@/lib/appState";
import { calculateSkillProgress, makeNewStudentData, makeSeedData, migrateAppData } from "@/lib/appState";
import { allSkills, type DrillUnit, type FrameworkTarget, type Question } from "@/lib/curriculum";

const DATA_KEY = "sat-math-drill-data-v2";
const NEW_STUDENT_DATA_KEY = "sat-math-drill-data-new-student-v2";
const LEGACY_DATA_KEY = "sat-math-drill-data-v1";
const LEGACY_NEW_STUDENT_DATA_KEY = "sat-math-drill-data-new-student-v1";
const SESSION_KEY = "sat-math-drill-session-v1";
const NEW_STUDENT_EMAIL = "newstudent@example.com";

const dataKeyFor = (email?: string) => email === NEW_STUDENT_EMAIL ? NEW_STUDENT_DATA_KEY : DATA_KEY;
const legacyDataKeyFor = (email?: string) => email === NEW_STUDENT_EMAIL ? LEGACY_NEW_STUDENT_DATA_KEY : LEGACY_DATA_KEY;
const seedFor = (email?: string) => email === NEW_STUDENT_EMAIL ? makeNewStudentData() : makeSeedData();

interface AppContextValue {
  data: AppData;
  session: Session | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; role?: Role; message?: string };
  logout: () => void;
  updateProgress: (topicId: string, patch: Partial<TopicProgress>) => void;
  updateUnitProgress: (unitId: string, patch: Partial<DrillUnitProgress>) => void;
  addError: (questionId: string, topicId: string) => void;
  tagError: (errorId: string, kind: ErrorKind) => void;
  addScore: (date: string, score: number) => void;
  recordWarmup: (attempt: WarmupAttempt) => void;
  updateQuestion: (question: Question) => void;
  addQuestion: (question: Question) => void;
  updateDrillUnit: (unit: DrillUnit) => void;
  reorderDrillUnit: (unitId: string, direction: -1 | 1) => void;
  updateFrameworkTarget: (target: FrameworkTarget) => void;
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
      const savedSession = window.localStorage.getItem(SESSION_KEY);
      const parsedSession: Session | null = savedSession ? JSON.parse(savedSession) : null;
      const savedData = window.localStorage.getItem(dataKeyFor(parsedSession?.email)) ?? window.localStorage.getItem(legacyDataKeyFor(parsedSession?.email));
      setData(savedData ? migrateAppData(JSON.parse(savedData), parsedSession?.email === NEW_STUDENT_EMAIL) : seedFor(parsedSession?.email));
      if (parsedSession) setSession(parsedSession);
    } catch { /* reset to safe seed state */ }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) window.localStorage.setItem(dataKeyFor(session?.email), JSON.stringify(data)); }, [data, ready, session?.email]);
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
      if (normalized === "student@example.com" || normalized === NEW_STUDENT_EMAIL) {
        const nextSession: Session = { email: normalized, role: "student", name: normalized === NEW_STUDENT_EMAIL ? "Alex" : "Maya" };
        const saved = window.localStorage.getItem(dataKeyFor(normalized)) ?? window.localStorage.getItem(legacyDataKeyFor(normalized));
        setData(saved ? migrateAppData(JSON.parse(saved), normalized === NEW_STUDENT_EMAIL) : seedFor(normalized));
        setSession(nextSession);
        return { ok: true, role: "student" };
      }
      if (normalized === "admin@example.com") {
        const saved = window.localStorage.getItem(DATA_KEY) ?? window.localStorage.getItem(LEGACY_DATA_KEY);
        setData(saved ? migrateAppData(JSON.parse(saved)) : makeSeedData());
        setSession({ email: normalized, role: "admin", name: "Ms. Rivera" });
        return { ok: true, role: "admin" };
      }
      return { ok: false, message: "Use one of the demo accounts shown below." };
    },
    logout: () => setSession(null),
    updateProgress(topicId, patch) {
      setData((current) => {
        const nextRecord = { ...current.skillProgress[topicId], ...patch, skillId: topicId, topicId, updatedAt: new Date().toISOString() };
        const skillProgress = { ...current.skillProgress, [topicId]: nextRecord };
        const unitProgress = { ...current.unitProgress };
        if (nextRecord.status === "complete") {
          const nextSkill = allSkills[allSkills.findIndex((skill) => skill.id === topicId) + 1];
          if (nextSkill && skillProgress[nextSkill.id]?.status === "locked") {
            skillProgress[nextSkill.id] = { ...skillProgress[nextSkill.id], status: "available", updatedAt: new Date().toISOString() };
            const firstUnit = current.drillUnits.filter((unit) => unit.skillId === nextSkill.id && unit.isActive).sort((a, b) => a.order - b.order)[0];
            if (firstUnit && unitProgress[firstUnit.id]?.status === "locked") unitProgress[firstUnit.id] = { ...unitProgress[firstUnit.id], status: "available", stage: "examples", updatedAt: new Date().toISOString() };
          }
        }
        return { ...current, unitProgress, skillProgress, progress: skillProgress };
      });
    },
    updateUnitProgress(unitId, patch) {
      setData((current) => {
        const unit = current.drillUnits.find((item) => item.id === unitId);
        if (!unit) return current;
        const previous = current.unitProgress[unitId];
        const nextRecord = { ...previous, ...patch, updatedAt: new Date().toISOString() };
        const completedQuestion = nextRecord.easyCompleted > previous.easyCompleted || nextRecord.mediumCompleted > previous.mediumCompleted || nextRecord.hardCompleted > previous.hardCompleted;
        const nextUnitProgress = { ...current.unitProgress, [unitId]: nextRecord };
        if (nextUnitProgress[unitId].status === "complete") {
          const siblings = current.drillUnits.filter((item) => item.skillId === unit.skillId && item.isActive).sort((a, b) => a.order - b.order);
          const next = siblings[siblings.findIndex((item) => item.id === unitId) + 1];
          if (next && nextUnitProgress[next.id]?.status === "locked") nextUnitProgress[next.id] = { ...nextUnitProgress[next.id], status: "available", updatedAt: new Date().toISOString() };
        }
        const interim = { ...current, unitProgress: nextUnitProgress, questionAttempts: current.questionAttempts + (completedQuestion ? 1 : 0) };
        const aggregate = calculateSkillProgress(unit.skillId, interim);
        const skillProgress = { ...current.skillProgress, [unit.skillId]: aggregate };
        return { ...interim, skillProgress, progress: skillProgress };
      });
    },
    addError(questionId, topicId) { setData((current) => ({ ...current, errors: [...current.errors, { id: `err-${Date.now()}`, questionId, topicId, kind: null, date: new Date().toISOString().slice(0, 10) }] })); },
    tagError(errorId, kind) { setData((current) => ({ ...current, errors: current.errors.map((error) => error.id === errorId ? { ...error, kind } : error) })); },
    addScore(date, score) { const record: ScoreRecord = { id: `score-${Date.now()}`, date, score }; setData((current) => ({ ...current, scores: [...current.scores, record].sort((a, b) => a.date.localeCompare(b.date)) })); },
    recordWarmup(attempt) { setData((current) => ({ ...current, warmups: [...current.warmups, attempt], questionAttempts: current.questionAttempts + 1 })); },
    updateQuestion(question) { setData((current) => ({ ...current, questions: current.questions.map((item) => item.id === question.id ? question : item) })); },
    addQuestion(question) { setData((current) => ({ ...current, questions: [...current.questions, question] })); },
    updateDrillUnit(unit) { setData((current) => ({ ...current, drillUnits: current.drillUnits.map((item) => item.id === unit.id ? unit : item), unitProgress: { ...current.unitProgress, [unit.id]: { ...current.unitProgress[unit.id], easyTotal: unit.easyQuestionCount, mediumTotal: unit.mediumQuestionCount, hardTotal: unit.hardQuestionCount, easyCompleted: Math.min(current.unitProgress[unit.id].easyCompleted, unit.easyQuestionCount), mediumCompleted: Math.min(current.unitProgress[unit.id].mediumCompleted, unit.mediumQuestionCount), hardCompleted: Math.min(current.unitProgress[unit.id].hardCompleted, unit.hardQuestionCount), updatedAt: new Date().toISOString() } } })); },
    reorderDrillUnit(unitId, direction) {
      setData((current) => {
        const selected = current.drillUnits.find((item) => item.id === unitId); if (!selected) return current;
        const siblings = current.drillUnits.filter((item) => item.skillId === selected.skillId).sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((item) => item.id === unitId); const swap = siblings[index + direction]; if (!swap) return current;
        return { ...current, drillUnits: current.drillUnits.map((item) => item.id === selected.id ? { ...item, order: swap.order } : item.id === swap.id ? { ...item, order: selected.order } : item) };
      });
    },
    updateFrameworkTarget(target) { setData((current) => ({ ...current, frameworkTargets: current.frameworkTargets.map((item) => item.id === target.id ? target : item) })); },
    updateChallenge(challenge) { setData((current) => ({ ...current, challenge })); },
    resetTopic(topicId) {
      setData((current) => {
        const skill = allSkills.find((item) => item.id === topicId); if (!skill) return current;
        const units = { ...current.unitProgress };
        skill.drillUnits.forEach((item) => { units[item.id] = { drillUnitId: item.id, easyCompleted: 0, easyTotal: item.easyQuestionCount, mediumCompleted: 0, mediumTotal: item.mediumQuestionCount, hardCompleted: 0, hardTotal: item.hardQuestionCount, stage: "examples", status: "available", updatedAt: new Date().toISOString() }; });
        const record = { skillId: topicId, topicId, easyCompleted: 0, mediumCompleted: 0, gateScore: null, status: "available" as const, challengeCompleted: false, updatedAt: new Date().toISOString() };
        const skillProgress = { ...current.skillProgress, [topicId]: record };
        return { ...current, unitProgress: units, skillProgress, progress: skillProgress };
      });
    },
    resetDemo() { const seed = makeSeedData(); setData(seed); setSession(null); window.localStorage.removeItem(DATA_KEY); window.localStorage.removeItem(NEW_STUDENT_DATA_KEY); window.localStorage.removeItem(LEGACY_DATA_KEY); window.localStorage.removeItem(LEGACY_NEW_STUDENT_DATA_KEY); window.localStorage.removeItem(SESSION_KEY); },
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

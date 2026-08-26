"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { getProgramDomainForSkill, getProgramSkill } from "@/lib/programCurriculum";

interface HardPracticeRecord {
  bestScore: number;
  complete: boolean;
  updatedAt: string;
}

const normalize = (value: string) => value.trim().toLowerCase().replace(/[$,°\s]/g, "");
const storageKey = (email?: string) => `sat-math-packet-hard-v1:${email?.toLowerCase() || "guest"}`;

export function PacketHardPractice() {
  const params = useParams<{ skillId: string }>();
  const { session } = useApp();
  const skill = getProgramSkill(params.skillId);
  const domain = getProgramDomainForSkill(params.skillId);
  const questions = useMemo(() => skill?.units.flatMap((unit) => unit.questions.filter((question) => question.difficulty === "hard")) ?? [], [skill]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !skill) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey(session?.email)) || "{}") as Record<string, HardPracticeRecord>;
      setBestScore(saved[skill.id]?.bestScore ?? 0);
    } catch {
      setBestScore(0);
    }
  }, [session?.email, skill]);

  if (!skill || !domain) return <AppShell role="student"><p>Skill packet not found.</p></AppShell>;
  const current = questions[index];

  const checkAnswer = () => {
    if (!current || !answer.trim()) return;
    const isCorrect = normalize(answer) === normalize(current.correctAnswer);
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setCorrectCount((value) => value + 1);
  };

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1);
      setAnswer("");
      setChecked(false);
      setCorrect(false);
      return;
    }
    const score = Math.round(correctCount / questions.length * 100);
    const nextBest = Math.max(bestScore, score);
    setBestScore(nextBest);
    setFinished(true);
    if (typeof window !== "undefined") {
      let saved: Record<string, HardPracticeRecord> = {};
      try { saved = JSON.parse(window.localStorage.getItem(storageKey(session?.email)) || "{}"); } catch { saved = {}; }
      saved[skill.id] = { bestScore: nextBest, complete: score >= 75, updatedAt: new Date().toISOString() };
      window.localStorage.setItem(storageKey(session?.email), JSON.stringify(saved));
    }
  };

  const restart = () => {
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setCorrect(false);
    setCorrectCount(0);
    setFinished(false);
  };

  return (
    <AppShell role="student" title={`${skill.id} · Hard Practice`}>
      <div className="mx-auto max-w-[900px]">
        <Link href={`/packet/${skill.id.toLowerCase()}`} className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>{skill.id}: {skill.officialName}</Link>
        <header className="worksheet-player-header">
          <div><p className="label text-[#a1623c]">Packet finale</p><h2 className="academic-heading mt-2 text-4xl">Hard Practice</h2><p className="mt-3 text-sm text-[var(--muted)]">Mixed hard questions across {skill.officialName}. Target: 75%.</p></div>
          <div className="min-w-[130px] text-right"><p className="label text-[var(--muted)]">Best score</p><p className="mt-2 font-serif text-3xl">{bestScore}%</p></div>
        </header>

        {!questions.length ? (
          <article className="workbook-card mt-5 p-9 text-center"><h3 className="academic-heading text-3xl">Hard set coming soon</h3><p className="mt-3 text-sm text-[var(--muted)]">The finale is in place. Questions will appear here when this packet’s hard bank is authored.</p><Link className="btn-primary mt-6" href={`/packet/${skill.id.toLowerCase()}`}>Return to packet</Link></article>
        ) : finished ? (
          <article className="workbook-card mt-5 p-9 text-center"><Check className="mx-auto" size={32}/><h3 className="academic-heading mt-4 text-3xl">Hard practice complete</h3><p className="mt-3 text-sm">{correctCount} of {questions.length} correct · {Math.round(correctCount / questions.length * 100)}%</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button className="btn-secondary" onClick={restart}><RotateCcw size={14}/>Try again</button><Link className="btn-primary" href={`/packet/${skill.id.toLowerCase()}`}>Return to packet</Link></div></article>
        ) : current ? (
          <article className="worksheet-problem mt-5">
            <div className="worksheet-problem-meta"><div><span>{index + 1}</span><div><b>Hard Practice</b><p>{index + 1} of {questions.length} · {current.unitId}</p></div></div><span className="status-pill">hard</span></div>
            <div className="worksheet-prompt">{current.prompt}</div>
            {current.choices ? <div className="worksheet-choices">{current.choices.map((choice, choiceIndex) => <button key={choice} className={answer === choice ? "selected" : ""} disabled={checked} onClick={() => setAnswer(choice)}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</button>)}</div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} disabled={checked} onChange={(event) => setAnswer(event.target.value)}/></label>}
            {checked && <div className={`mx-6 mb-5 border-l-4 p-4 text-sm ${correct ? "border-[#4f7a66] bg-[#edf4ef]" : "border-[#a1623c] bg-[#fbf1eb]"}`}><b>{correct ? "Correct." : `Correct answer: ${current.correctAnswer}`}</b><p className="mt-2 leading-6">{current.solution}</p></div>}
            <footer className="worksheet-forward"><p>Mixed packet-level challenge · 75% target</p>{checked ? <button className="btn-primary" onClick={nextQuestion}>{index + 1 === questions.length ? "Finish practice" : "Next question"}<ArrowRight size={15}/></button> : <button className="btn-primary" disabled={!answer.trim()} onClick={checkAnswer}>Check answer</button>}</footer>
          </article>
        ) : null}
      </div>
    </AppShell>
  );
}

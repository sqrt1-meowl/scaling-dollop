"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { desmosDrills, desmosStorageKey, emptyDesmosProgress, type DesmosProgress } from "@/lib/desmos";

const normalize = (value: string) => value.trim().replace(/[(),\s]/g, "").toLowerCase();

export function DesmosLab() {
  const { session } = useApp();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [progress, setProgress] = useState<DesmosProgress>(emptyDesmosProgress);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(desmosStorageKey(session?.email));
    if (saved) setProgress({ ...emptyDesmosProgress(), ...JSON.parse(saved) });
  }, [session?.email]);

  const allAnswered = desmosDrills.every((drill) => drill.answers.every((_, index) => answers[drill.id]?.[index]?.trim()));
  const submit = () => {
    const score = desmosDrills.reduce((total, drill) => total + (drill.answers.every((answer, index) => normalize(answers[drill.id]?.[index] ?? "") === normalize(answer)) ? 1 : 0), 0);
    const next = { bestScore: Math.max(progress.bestScore, score), attempts: progress.attempts + 1, complete: progress.complete || score >= 4, updatedAt: new Date().toISOString() };
    setResult(score);
    setProgress(next);
    window.localStorage.setItem(desmosStorageKey(session?.email), JSON.stringify(next));
  };

  return (
    <AppShell role="student" title="Desmos Grind">
      <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>Dashboard</Link>
      <div className="desmos-sheet">
        <header className="desmos-sheet-header">
          <div><p className="label text-[#2f766d]">Calculator fluency</p><h2 className="academic-heading mt-3 text-4xl md:text-5xl">Desmos Grind A</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">Open Desmos, enter the expressions exactly, and record the requested values. Five direct reps. No reflection questions.</p></div>
          <a className="btn-primary shrink-0" href="https://www.desmos.com/calculator" target="_blank" rel="noreferrer">Open Desmos<ArrowUpRight size={15}/></a>
        </header>
        <div className="flex flex-wrap justify-between gap-3 border-b border-[var(--line)] px-6 py-4 text-xs"><span><b>Mastery:</b> 4 / 5</span><span><b>Best:</b> {progress.bestScore} / 5</span><span><b>Attempts:</b> {progress.attempts}</span></div>
        <div className="divide-y divide-[var(--line)]">
          {desmosDrills.map((drill, drillIndex) => (
            <section className="desmos-band" key={drill.id}>
              <div className="desmos-band-number">0{drillIndex + 1}</div>
              <div className="min-w-0"><p className="label text-[#2f766d]">{drill.skill}</p><h3 className="mt-2 text-lg font-extrabold">{drill.prompt}</h3><div className="mt-4 grid gap-2">{drill.enter.map((expression) => <code className="desmos-expression" key={expression}>{expression}</code>)}</div></div>
              <div className="grid content-end gap-3">{drill.labels.map((label, answerIndex) => <label className="text-xs font-bold" key={label}>{label}<input className="field mt-1" value={answers[drill.id]?.[answerIndex] ?? ""} disabled={result !== null} onChange={(event) => setAnswers((current) => { const values = [...(current[drill.id] ?? [])]; values[answerIndex] = event.target.value; return { ...current, [drill.id]: values }; })}/></label>)}</div>
            </section>
          ))}
        </div>
        <footer className="desmos-submit">
          {result === null ? <><p className="text-sm text-[var(--muted)]">Complete all five bands, then check the set.</p><button className="btn-primary" disabled={!allAnswered} onClick={submit}>Submit set</button></> : result >= 4 ? <><div><p className="font-extrabold text-[#315c47]">Desmos band cleared.</p><p className="mt-1 text-xs text-[var(--muted)]">{result} / 5 correct</p></div><Link href="/dashboard" className="btn-primary"><Check size={15}/>Return to dashboard</Link></> : <><div><p className="font-extrabold">Run it again.</p><p className="mt-1 text-xs text-[var(--muted)]">{result} / 5 correct. Clear 4 / 5.</p></div><button className="btn-primary" onClick={() => { setAnswers({}); setResult(null); }}><RotateCcw size={15}/>Retry</button></>}
        </footer>
      </div>
    </AppShell>
  );
}

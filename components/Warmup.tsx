"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock3, RotateCcw, Timer } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { getTopic, type Question } from "@/lib/curriculum";

export function Warmup() {
  const { data, recordWarmup } = useApp();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const completedIds = useMemo(() => Object.values(data.progress).filter((item) => item.status === "complete").map((item) => item.topicId), [data.progress]);
  const questions = useMemo(() => data.questions.filter((question) => completedIds.includes(question.topicId) && question.difficulty === "easy").slice(0, 5), [completedIds, data.questions]);
  const finished = index >= questions.length && questions.length > 0;
  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished, started, index]);
  useEffect(() => { if (seconds <= 0 && started && !finished) submit(true); }, [seconds, started, finished]);
  function submit(timedOut = false) {
    const question = questions[index]; if (!question) return;
    const correct = !timedOut && answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    recordWarmup({ id: `warm-${Date.now()}`, questionId: question.id, topicId: question.topicId, correct, seconds: 45 - Math.max(0, seconds), date: new Date().toISOString() });
    setResults((old) => [...old, correct]); setIndex((old) => old + 1); setSeconds(45); setAnswer("");
  }
  function restart() { setStarted(true); setIndex(0); setSeconds(45); setAnswer(""); setResults([]); }
  return <AppShell role="student" title="Warm-Up">
    {!started ? <div className="mx-auto max-w-3xl"><div className="border-b border-[#dfe3e7] pb-8"><p className="label text-[#416f9d]">Retrieval practice</p><h2 className="academic-heading mt-2 text-5xl">Timed Warm-Up</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-[#677386]">Five questions pulled only from topics you have already cleared. Missed questions are marked for future review.</p></div><div className="mt-8 grid gap-px border border-[#dfe3e7] bg-[#dfe3e7] sm:grid-cols-3">{[{ icon: Timer, label: "Questions", value: "5" }, { icon: Clock3, label: "Time", value: "45 seconds each" }, { icon: Check, label: "Source", value: "Completed topics" }].map(({ icon: Icon, label, value }) => <div className="bg-white p-5" key={label}><Icon size={17} className="text-[#677386]"/><p className="label mt-5 text-[#8a939f]">{label}</p><p className="mt-2 text-sm font-extrabold">{value}</p></div>)}</div><button className="btn-primary mt-8" onClick={() => setStarted(true)}>Start warm-up <ArrowRight size={16}/></button></div> : finished ? <div className="mx-auto max-w-2xl border-y border-[#dfe3e7] py-14 text-center"><p className="label text-[#677386]">Warm-up complete</p><div className="mt-4 font-serif text-7xl">{results.filter(Boolean).length} <span className="text-3xl text-[#8a939f]">/ {questions.length}</span></div><h2 className="academic-heading mt-5 text-3xl">Accuracy and time have been saved.</h2><p className="mt-4 text-sm text-[#677386]">Missed questions will return in a future review set.</p><div className="mt-8 flex justify-center gap-3"><button className="btn-secondary" onClick={restart}><RotateCcw size={15}/>Try another</button><Link className="btn-primary" href="/dashboard">Return to dashboard</Link></div></div> : <WarmupQuestion question={questions[index]} position={index + 1} seconds={seconds} answer={answer} setAnswer={setAnswer} submit={() => submit(false)}/>} 
  </AppShell>;
}

function WarmupQuestion({ question, position, seconds, answer, setAnswer, submit }: { question: Question; position: number; seconds: number; answer: string; setAnswer: (value: string) => void; submit: () => void }) {
  const topic = getTopic(question.topicId);
  return <div className="mx-auto max-w-3xl"><div className="mb-7 flex items-center justify-between border-b border-[#dfe3e7] pb-4"><div><p className="label text-[#677386]">Question {position} of 5</p><p className="mt-1 text-xs font-bold">{topic?.title}</p></div><div className={`flex items-center gap-2 border px-3 py-2 text-sm font-extrabold ${seconds <= 10 ? "border-[#d7bdb4] text-[#8b3d2c]" : "border-[#dfe3e7]"}`}><Clock3 size={16}/>{seconds}s</div></div><h2 className="academic-heading min-h-28 text-3xl leading-[1.4]">{question.prompt}</h2><div className="mt-8 space-y-3">{question.type === "multiple_choice" ? question.choices?.map((choice, index) => <button key={choice} onClick={() => setAnswer(choice)} className={`flex w-full items-center gap-4 border px-4 py-3.5 text-left text-sm ${answer === choice ? "border-[#17365f] bg-[#f2f5f8]" : "border-[#dfe3e7] bg-white"}`}><b>{String.fromCharCode(65 + index)}</b>{choice}</button>) : <input className="field max-w-xs" value={answer} onChange={(event) => setAnswer(event.target.value)}/>}</div><div className="mt-8 flex justify-end"><button disabled={!answer} className="btn-primary" onClick={submit}>Submit & continue <ArrowRight size={16}/></button></div></div>;
}

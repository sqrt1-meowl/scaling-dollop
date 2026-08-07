"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, RotateCcw, X } from "lucide-react";
import { BlockMath } from "react-katex";
import { RoleGuard, useApp } from "./AppProvider";
import { accentColor, getCategoryForTopic, getTopic, type Question } from "@/lib/curriculum";

type Stage = "concept" | "example" | "easy" | "easyDone" | "medium" | "gate" | "result" | "complete";

function QuestionView({ question, position, total, onComplete }: { question: Question; position: number; total: number; onComplete: (correct: boolean) => void }) {
  const { addError } = useApp();
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"idle" | "retry" | "correct" | "explain">("idle");
  useEffect(() => { setAnswer(""); setAttempts(0); setState("idle"); }, [question.id]);
  function check() {
    if (!answer) return;
    const correct = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    if (correct) { setState("correct"); return; }
    if (attempts === 0) { addError(question.id, question.topicId); setAttempts(1); setState("retry"); setAnswer(""); }
    else setState("explain");
  }
  const difficulty = question.difficulty === "gate" ? "Section gate" : question.difficulty;
  return <div className="mx-auto w-full max-w-[820px]">
    <div className="mb-8 flex items-center justify-between border-b border-[#dfe3e7] pb-4"><span className="label text-[#677386]">{difficulty} · {position} of {total}</span><div className="flex gap-1">{Array.from({ length: total }, (_, index) => <span key={index} className={`h-1.5 w-7 ${index < position ? "bg-[#17365f]" : "bg-[#dfe3e7]"}`}/>)}</div></div>
    <div className="min-h-[350px]"><h2 className="academic-heading max-w-[760px] text-[clamp(25px,4vw,36px)] leading-[1.35]">{question.prompt}</h2>{question.math && <BlockMath math={question.math}/>}<div className="mt-10 space-y-3">
      {question.type === "multiple_choice" ? question.choices?.map((choice, index) => <button type="button" key={choice} onClick={() => state !== "correct" && state !== "explain" && setAnswer(choice)} className={`flex w-full items-center gap-4 border px-4 py-3.5 text-left text-sm transition ${answer === choice ? "border-[#17365f] bg-[#f2f5f8]" : "border-[#dfe3e7] bg-white hover:border-[#9da8b5]"}`}><span className="grid size-7 shrink-0 place-items-center border border-[#b8c0c9] font-bold">{String.fromCharCode(65 + index)}</span>{choice}</button>) : <div className="max-w-xs"><label className="label text-[#677386]">Enter your answer<input value={answer} onChange={(e) => setAnswer(e.target.value)} className="field mt-2 text-lg" inputMode="decimal" disabled={state === "correct" || state === "explain"}/></label></div>}
    </div></div>
    {(state === "retry" || state === "correct" || state === "explain") && <div className={`mb-5 border-l-2 px-4 py-3 text-sm ${state === "correct" ? "border-[#4f7a66] bg-[#f3f7f4] text-[#315c47]" : "border-[#a1623c] bg-[#fbf6f2] text-[#76472b]"}`}>
      <div className="flex items-center gap-2 font-bold">{state === "correct" ? <><Check size={16}/>Correct.</> : state === "retry" ? <><RotateCcw size={15}/>Try again.</> : <><X size={15}/>Review the solution.</>}</div>{state === "explain" && <p className="mt-2 leading-6">{question.explanation}</p>}
    </div>}
    <div className="flex justify-end">{state === "correct" || state === "explain" ? <button className="btn-primary" onClick={() => onComplete(state === "correct")}>Next <ArrowRight size={16}/></button> : <button className="btn-primary" disabled={!answer} onClick={check}>Check Answer</button>}</div>
  </div>;
}

function GateView({ questions, onSubmit }: { questions: Question[]; onSubmit: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  return <div className="mx-auto max-w-[860px]"><div className="mb-8 border-b-2 border-[#10233f] pb-5"><p className="label text-[#677386]">Section gate</p><h2 className="academic-heading mt-2 text-4xl">Complete all four to clear this topic.</h2><p className="mt-3 text-sm text-[#677386]">Results are held until you submit the full section.</p></div><div className="space-y-10">{questions.map((question, qIndex) => <section key={question.id}><div className="mb-4 flex gap-4"><span className="font-serif text-2xl text-[#8a939f]">{qIndex + 1}</span><h3 className="text-lg font-bold leading-7">{question.prompt}</h3></div>{question.type === "multiple_choice" ? <div className="ml-10 grid gap-2 sm:grid-cols-2">{question.choices?.map((choice, index) => <label key={choice} className={`flex cursor-pointer items-center gap-3 border px-3 py-3 text-sm ${answers[question.id] === choice ? "border-[#17365f] bg-[#f2f5f8]" : "border-[#dfe3e7] bg-white"}`}><input type="radio" name={question.id} className="accent-[#17365f]" checked={answers[question.id] === choice} onChange={() => setAnswers((old) => ({ ...old, [question.id]: choice }))}/><b>{String.fromCharCode(65 + index)}</b>{choice}</label>)}</div> : <input className="field ml-10 max-w-xs" value={answers[question.id] ?? ""} onChange={(e) => setAnswers((old) => ({ ...old, [question.id]: e.target.value }))}/>}</section>)}</div><div className="mt-10 flex justify-end border-t border-[#dfe3e7] pt-6"><button className="btn-primary" disabled={Object.keys(answers).length < questions.length} onClick={() => onSubmit(questions.filter((q) => answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()).length)}>Submit section</button></div></div>;
}

export function DrillExperience() {
  const params = useParams<{ topic: string }>();
  const topic = getTopic(params.topic);
  const category = getCategoryForTopic(params.topic);
  const { data, updateProgress } = useApp();
  const progress = data.progress[params.topic];
  const easy = useMemo(() => data.questions.filter((q) => q.topicId === params.topic && q.difficulty === "easy").sort((a,b) => a.order-b.order), [data.questions, params.topic]);
  const medium = useMemo(() => data.questions.filter((q) => q.topicId === params.topic && q.difficulty === "medium").sort((a,b) => a.order-b.order), [data.questions, params.topic]);
  const trueGate = data.questions.filter((q) => q.topicId === params.topic && q.difficulty === "gate");
  const gate = trueGate.length ? trueGate : medium.slice(0, 4);
  const initialStage: Stage = progress?.status === "complete" ? "complete" : (progress?.mediumCompleted ?? 0) >= 6 ? "gate" : (progress?.easyCompleted ?? 0) >= 6 ? "medium" : (progress?.easyCompleted ?? 0) > 0 ? "easy" : "concept";
  const [stage, setStage] = useState<Stage>(initialStage);
  const [easyIndex, setEasyIndex] = useState(Math.min(progress?.easyCompleted ?? 0, Math.max(0, easy.length - 1)));
  const [mediumIndex, setMediumIndex] = useState(Math.min(progress?.mediumCompleted ?? 0, Math.max(0, medium.length - 1)));
  const [gateScore, setGateScore] = useState<number | null>(null);
  if (!topic || !category || !progress) return <RoleGuard role="student"><div className="p-10">Topic not found.</div></RoleGuard>;
  const topicId = topic.id;
  const color = accentColor[category.accent];
  function finishQuestion(kind: "easy" | "medium") {
    if (kind === "easy") { const next = easyIndex + 1; updateProgress(topicId, { easyCompleted: Math.max(progress.easyCompleted, next), status: "in_progress" }); if (next >= easy.length) setStage("easyDone"); else setEasyIndex(next); }
    else { const next = mediumIndex + 1; updateProgress(topicId, { mediumCompleted: Math.max(progress.mediumCompleted, next), status: "in_progress" }); if (next >= medium.length) setStage("gate"); else setMediumIndex(next); }
  }
  function submitGate(score: number) { setGateScore(score); updateProgress(topicId, { gateScore: score, status: score === 4 ? "complete" : "review" }); setStage("result"); }
  return <RoleGuard role="student"><main className="min-h-screen bg-[#fafaf8]"><header className="border-b border-[#dfe3e7] bg-white"><div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-5"><Link href={`/category/${category.id}`} className="flex items-center gap-2 text-xs font-bold text-[#677386]"><ArrowLeft size={14}/>Exit drill</Link><div className="text-right"><div className="label" style={{ color }}>{category.shortName}</div><div className="text-xs font-extrabold">{topic.code}</div></div></div></header>
    <div className="mx-auto max-w-[1120px] px-5 py-8 md:py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4"><div><p className="label text-[#677386]">{topic.code}</p><h1 className="academic-heading mt-1 text-3xl">{topic.title}</h1></div><div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#7c8693]">{[["Concept","concept"],["Example","example"],["Easy","easy"],["Medium","medium"],["Gate","gate"]].map(([label,key], index) => <span key={key} className={`border px-2 py-1.5 ${stage === key || (stage === "easyDone" && key === "easy") || (stage === "result" && key === "gate") ? "border-[#17365f] bg-[#17365f] text-white" : "border-[#dfe3e7] bg-white"}`}>{index + 1}. {label}</span>)}</div></div>
      {stage === "concept" && <div className="mx-auto max-w-[820px]"><p className="label" style={{ color }}>Concept reference</p><h2 className="academic-heading mt-2 text-4xl">{topic.title}</h2><div className="mt-8 grid gap-px border border-[#dfe3e7] bg-[#dfe3e7] sm:grid-cols-2">{topic.concept.map((item) => <div key={item.label} className="bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.08em] text-[#677386]">{item.label}</p><div className="mt-3 text-lg"><BlockMath math={item.formula}/></div></div>)}</div><div className="mt-7 flex justify-end"><button className="btn-primary" onClick={() => setStage("example")}>Worked example <ArrowRight size={16}/></button></div></div>}
      {stage === "example" && <div className="mx-auto max-w-[820px]"><p className="label" style={{ color }}>Worked example</p><h2 className="academic-heading mt-3 max-w-2xl text-3xl leading-[1.35]">{topic.workedExample.prompt}</h2><div className="hairline-grid mt-8 min-h-[300px] border border-[#dfe3e7] bg-white p-8"><div className="max-w-md space-y-3 bg-white/95 p-3">{topic.workedExample.steps.map((step, index) => <div key={step} className="flex gap-4"><span className="text-xs font-bold text-[#8a939f]">{index + 1}</span><div className="text-base">{step.includes("=") ? <BlockMath math={step}/> : step}</div></div>)}</div></div><div className="mt-7 flex justify-end"><button className="btn-primary" onClick={() => setStage("easy")}>Begin Easy questions <ArrowRight size={16}/></button></div></div>}
      {stage === "easy" && easy[easyIndex] && <QuestionView question={easy[easyIndex]} position={easyIndex + 1} total={easy.length} onComplete={() => finishQuestion("easy")}/>} 
      {stage === "easyDone" && <div className="mx-auto max-w-[680px] border-y border-[#dfe3e7] py-16 text-center"><p className="label text-[#4f7a66]">Easy complete</p><h2 className="academic-heading mt-3 text-4xl">Now apply the same concept in less direct SAT questions.</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#677386]">The mathematics is familiar. Read closely, identify what is being asked, and choose an efficient path.</p><button className="btn-primary mt-8" onClick={() => setStage("medium")}>Continue to Medium <ArrowRight size={16}/></button></div>}
      {stage === "medium" && medium[mediumIndex] && <QuestionView question={medium[mediumIndex]} position={mediumIndex + 1} total={medium.length} onComplete={() => finishQuestion("medium")}/>} 
      {stage === "gate" && <GateView questions={gate} onSubmit={submitGate}/>} 
      {stage === "result" && <div className="mx-auto max-w-[680px] border-y-2 border-[#10233f] py-14 text-center"><p className="label text-[#677386]">Section result</p><div className="mt-4 font-serif text-7xl">{gateScore} <span className="text-3xl text-[#8a939f]">/ 4</span></div><h2 className="academic-heading mt-5 text-4xl">{gateScore === 4 ? "Topic Cleared" : "Review Required"}</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#677386]">{gateScore === 4 ? "The Live Challenge is now unlocked. It is a separate lesson focused on difficult SAT application and strategy." : "Review the medium set, then return to the gate when you are ready. Your teacher can also help identify the missed step."}</p><div className="mt-8 flex flex-wrap justify-center gap-3">{gateScore === 4 ? <Link className="btn-primary" href={`/topic/${topic.id}/challenge`}>Open Live Challenge <ArrowRight size={16}/></Link> : <button className="btn-primary" onClick={() => { setMediumIndex(0); updateProgress(topic.id, { mediumCompleted: 0 }); setStage("medium"); }}>Return to review</button>}<Link className="btn-secondary" href={`/category/${category.id}`}>Category overview</Link></div></div>}
      {stage === "complete" && <div className="mx-auto max-w-[680px] border-y border-[#dfe3e7] py-14 text-center"><Check className="mx-auto text-[#4f7a66]"/><p className="label mt-4 text-[#4f7a66]">Topic cleared</p><h2 className="academic-heading mt-3 text-4xl">Review or continue to the Live Challenge.</h2><div className="mt-8 flex justify-center gap-3"><button className="btn-secondary" onClick={() => { setEasyIndex(0); setStage("concept"); }}>Review topic</button><Link className="btn-primary" href={`/topic/${topic.id}/challenge`}>Live Challenge <ArrowRight size={16}/></Link></div></div>}
    </div></main></RoleGuard>;
}

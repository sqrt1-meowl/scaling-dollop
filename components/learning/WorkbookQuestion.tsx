"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, PlayCircle, RotateCcw, X } from "lucide-react";
import { BlockMath } from "react-katex";
import { useApp } from "../AppProvider";
import type { Question } from "@/lib/curriculum";

export function WorkbookQuestion({ question, number, total, eyebrow, hard = false, onAdvance }: { question: Question; number: number; total: number; eyebrow: string; hard?: boolean; onAdvance: (firstTryCorrect: boolean) => void }) {
  const { addError } = useApp();
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"answering" | "retry" | "correct" | "solution">("answering");
  const [firstTryCorrect, setFirstTryCorrect] = useState(false);
  const [walkthrough, setWalkthrough] = useState(false);
  useEffect(() => { setAnswer(""); setAttempts(0); setState("answering"); setFirstTryCorrect(false); setWalkthrough(false); }, [question.id]);
  const submit = () => {
    if (!answer) return;
    const correct = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    if (correct) { setFirstTryCorrect(attempts === 0); setState("correct"); return; }
    if (attempts === 0) { addError(question.id, question.skillId); setAttempts(1); setAnswer(""); setState("retry"); }
    else setState("solution");
  };
  return <article className={`question-sheet ${hard ? "question-sheet-hard" : ""}`}>
    <header className="flex items-center justify-between border-b border-[var(--line)] pb-5"><div><p className="label text-[var(--muted)]">{eyebrow}</p><p className="mt-2 text-xs font-semibold text-[var(--muted)]">{number} / {total}</p></div><div className="flex gap-1.5">{Array.from({ length: total }, (_, index) => <span key={index} className={`h-1.5 w-8 ${index < number ? "bg-[var(--ink)]" : "bg-[#e3e0d8]"}`}/>)}</div></header>
    {hard && <p className="mt-6 border-l-2 border-[#9b6a39] pl-4 text-sm italic leading-6 text-[var(--muted)]">These questions combine or disguise skills you already know.</p>}
    <div className={`py-9 ${hard ? "min-h-[430px]" : "min-h-[350px]"}`}><p className="mb-5 font-serif text-2xl text-[#9b6a39]">Question {number}</p><h2 className="academic-heading max-w-[780px] text-[clamp(25px,3.4vw,37px)] leading-[1.38]">{question.prompt}</h2>{question.math && <BlockMath math={question.math}/>}<div className="mt-10 grid gap-3">{question.questionType === "multiple_choice" ? question.choices?.map((choice, index) => <button type="button" key={choice} disabled={["correct", "solution"].includes(state)} onClick={() => setAnswer(choice)} className={`answer-choice ${answer === choice ? "answer-choice-selected" : ""}`}><span>{String.fromCharCode(65 + index)}.</span><span>{choice}</span></button>) : <label className="max-w-sm text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">Your answer<input className="field mt-3 text-xl normal-case" value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={["correct", "solution"].includes(state)}/></label>}</div></div>
    {state !== "answering" && <div className={`mb-5 border-l-2 px-4 py-3 text-sm ${state === "correct" ? "border-[#4f7a66] bg-[#f3f7f4] text-[#315c47]" : "border-[#a1623c] bg-[#fbf6f2] text-[#76472b]"}`}><p className="flex items-center gap-2 font-bold">{state === "correct" ? <><Check size={16}/>Correct.</> : state === "retry" ? <><RotateCcw size={15}/>Not yet. Try once more.</> : <><X size={15}/>Incorrect. Review the concise solution.</>}</p>{state === "solution" && <p className="mt-2 leading-6">{question.explanation}</p>}</div>}
    {hard && (state === "correct" || state === "solution") && <div className="mb-5"><button className="inline-flex items-center gap-2 text-xs font-bold text-[#9b6a39]" onClick={() => setWalkthrough(!walkthrough)}><PlayCircle size={16}/>Watch Walkthrough</button>{walkthrough && <div className="mt-3 border border-dashed border-[#c9c2b5] bg-[#f7f4ed] p-5 text-sm text-[var(--muted)]">Teacher video placeholder · Connect a walkthrough URL in curriculum management.</div>}</div>}
    <footer className="flex justify-end border-t border-[var(--line)] pt-5">{state === "correct" || state === "solution" ? <button className="btn-primary" onClick={() => onAdvance(firstTryCorrect)}>Continue<ArrowRight size={16}/></button> : <button className="btn-primary" disabled={!answer} onClick={submit}>Submit answer</button>}</footer>
  </article>;
}

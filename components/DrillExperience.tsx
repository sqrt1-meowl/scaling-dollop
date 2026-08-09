"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Upload, Video, X } from "lucide-react";
import { BlockMath } from "react-katex";
import { RoleGuard, useApp } from "./AppProvider";
import { calculateSkillUnitPercent, type DrillStage } from "@/lib/appState";
import { accentColor, getCategoryForTopic, getSkill, type Question } from "@/lib/curriculum";

function QuestionView({ question, position, total, onComplete }: { question: Question; position: number; total: number; onComplete: () => void }) {
  const { addError } = useApp();
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"idle" | "retry" | "correct" | "explain">("idle");
  useEffect(() => { setAnswer(""); setAttempts(0); setState("idle"); }, [question.id]);
  const check = () => {
    if (!answer) return;
    const correct = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    if (correct) return setState("correct");
    if (attempts === 0) { addError(question.id, question.skillId); setAttempts(1); setState("retry"); setAnswer(""); }
    else setState("explain");
  };
  return <div className="mx-auto w-full max-w-[820px]">
    <div className="mb-8 flex items-center justify-between border-b border-[#dfe3e7] pb-4"><span className="label capitalize text-[#677386]">{question.difficulty} · {position} of {total}</span><div className="flex gap-1">{Array.from({ length: total }, (_, index) => <span key={index} className={`h-1.5 w-7 ${index < position ? "bg-[#17365f]" : "bg-[#dfe3e7]"}`}/>)}</div></div>
    <div className="min-h-[330px]"><p className="mb-3 text-xs font-bold text-[#677386]">Target: {question.frameworkTarget}</p><h2 className="academic-heading max-w-[760px] text-[clamp(25px,4vw,36px)] leading-[1.35]">{question.prompt}</h2>{question.math && <BlockMath math={question.math}/>}<div className="mt-9 space-y-3">
      {question.questionType === "multiple_choice" ? question.choices?.map((choice, index) => <button type="button" key={choice} onClick={() => !["correct", "explain"].includes(state) && setAnswer(choice)} className={`flex w-full items-center gap-4 border px-4 py-3.5 text-left text-sm ${answer === choice ? "border-[#17365f] bg-[#f2f5f8]" : "border-[#dfe3e7] bg-white hover:border-[#9da8b5]"}`}><span className="grid size-7 shrink-0 place-items-center border border-[#b8c0c9] font-bold">{String.fromCharCode(65 + index)}</span>{choice}</button>) : <label className="label block max-w-xs text-[#677386]">Enter your answer<input value={answer} onChange={(event) => setAnswer(event.target.value)} className="field mt-2 text-lg" disabled={["correct", "explain"].includes(state)}/></label>}
    </div></div>
    {state !== "idle" && <div className={`mb-5 border-l-2 px-4 py-3 text-sm ${state === "correct" ? "border-[#4f7a66] bg-[#f3f7f4] text-[#315c47]" : "border-[#a1623c] bg-[#fbf6f2] text-[#76472b]"}`}><div className="flex items-center gap-2 font-bold">{state === "correct" ? <><Check size={16}/>Correct.</> : state === "retry" ? <><RotateCcw size={15}/>Try again.</> : <><X size={15}/>Review the solution.</>}</div>{state === "explain" && <p className="mt-2 leading-6">{question.explanation}</p>}</div>}
    <div className="flex justify-end">{["correct", "explain"].includes(state) ? <button className="btn-primary" onClick={onComplete}>Next <ArrowRight size={16}/></button> : <button className="btn-primary" disabled={!answer} onClick={check}>Check Answer</button>}</div>
  </div>;
}

export function DrillExperience() {
  const params = useParams<{ topic: string }>();
  const skill = getSkill(params.topic);
  const category = getCategoryForTopic(params.topic);
  const { data } = useApp();
  if (!skill || !category) return <RoleGuard role="student"><div className="p-10">Skill not found.</div></RoleGuard>;
  const units = data.drillUnits.filter((item) => item.skillId === skill.id && item.isActive).sort((a, b) => a.order - b.order);
  const completeCount = units.filter((item) => data.unitProgress[item.id]?.status === "complete").length;
  const percent = calculateSkillUnitPercent(skill.id, data);
  const color = accentColor[category.accent];
  return <RoleGuard role="student"><main className="min-h-screen bg-[#fafaf8]"><header className="border-b border-[#dfe3e7] bg-white"><div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-5"><Link href={`/category/${category.id}`} className="flex items-center gap-2 text-xs font-bold text-[#677386]"><ArrowLeft size={14}/>{category.shortName}</Link><div className="label" style={{ color }}>{skill.code} · Official SAT skill</div></div></header>
    <div className="mx-auto max-w-[960px] px-5 py-10"><div className="mb-9 border-b border-[#dfe3e7] pb-7"><p className="label" style={{ color }}>{skill.code}</p><h1 className="academic-heading mt-2 text-4xl">{skill.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#677386]">Every drill unit is open. Choose any section and follow the same simple practice sequence.</p><div className="mt-5 flex items-center gap-4"><div className="progress-track max-w-sm flex-1" style={{ "--accent": color } as React.CSSProperties}><div className="progress-fill" style={{ width: `${percent}%` }}/></div><b className="text-xs">{percent}% · {completeCount} / {units.length} units</b></div>
      <section className="panel overflow-hidden">{units.map((unit) => { const state = data.unitProgress[unit.id]?.status ?? "available"; return <div key={unit.id} className="grid gap-4 border-b border-[#e4e7e9] p-5 last:border-0 sm:grid-cols-[64px_1fr_auto] sm:items-center"><div className="font-serif text-xl text-[#7d8794]">{unit.code}</div><div><h2 className="text-[15px] font-extrabold">{unit.name}</h2><p className="mt-1 text-xs leading-5 text-[#677386]">{unit.workedExampleCount} examples · {unit.easyQuestionCount} Easy · {unit.mediumQuestionCount} Medium · {unit.hardQuestionCount} Hard · video</p><p className={`mt-2 text-xs font-bold ${state === "complete" ? "text-[#4f7a66]" : "text-[#7d8794]"}`}>{state === "complete" && <Check className="mr-1 inline" size={13}/>} {state === "complete" ? "Complete" : state === "in_progress" ? "In Progress" : "Open"}</p></div><Link className="btn-secondary" href={`/topic/${skill.id}/unit/${unit.id}`}>{state === "complete" ? "Review" : state === "in_progress" ? "Continue" : "Open"}<ArrowRight size={14}/></Link></div>; })}</section>
    </div></div></main></RoleGuard>;
}

export function DrillUnitExperience() {
  const params = useParams<{ topic: string; unit: string }>();
  const skill = getSkill(params.topic);
  const category = getCategoryForTopic(params.topic);
  const { data, updateUnitProgress } = useApp();
  const unit = data.drillUnits.find((item) => item.id === params.unit && item.skillId === params.topic);
  const progress = data.unitProgress[params.unit];
  const easy = useMemo(() => data.questions.filter((question) => question.drillUnitId === params.unit && question.difficulty === "easy" && !question.isGate).sort((a, b) => a.order - b.order).slice(0, unit?.easyQuestionCount ?? 5), [data.questions, params.unit, unit?.easyQuestionCount]);
  const medium = useMemo(() => data.questions.filter((question) => question.drillUnitId === params.unit && question.difficulty === "medium" && !question.isGate).sort((a, b) => a.order - b.order).slice(0, unit?.mediumQuestionCount ?? 5), [data.questions, params.unit, unit?.mediumQuestionCount]);
  const hard = useMemo(() => data.questions.filter((question) => question.drillUnitId === params.unit && question.difficulty === "hard" && !question.isGate && question.id !== "g1-live-challenge").sort((a, b) => a.order - b.order).slice(0, unit?.hardQuestionCount ?? 3), [data.questions, params.unit, unit?.hardQuestionCount]);
  const [stage, setStage] = useState<DrillStage>(progress?.stage ?? "examples");
  const [easyIndex, setEasyIndex] = useState(0);
  const [mediumIndex, setMediumIndex] = useState(0);
  const [hardIndex, setHardIndex] = useState(0);
  const [videoSource, setVideoSource] = useState(unit?.videoUrl ?? "");
  useEffect(() => {
    if (!progress) return;
    setStage(progress.stage);
    setEasyIndex(Math.min(progress.easyCompleted, Math.max(0, easy.length - 1)));
    setMediumIndex(Math.min(progress.mediumCompleted, Math.max(0, medium.length - 1)));
    setHardIndex(Math.min(progress.hardCompleted, Math.max(0, hard.length - 1)));
  }, [easy.length, hard.length, medium.length, progress]);
  useEffect(() => () => { if (videoSource.startsWith("blob:")) URL.revokeObjectURL(videoSource); }, [videoSource]);
  if (!skill || !category || !unit || !progress) return <RoleGuard role="student"><div className="p-10">Drill unit not found.</div></RoleGuard>;
  const units = data.drillUnits.filter((item) => item.skillId === skill.id && item.isActive).sort((a, b) => a.order - b.order);
  const next = units[units.findIndex((item) => item.id === unit.id) + 1];
  const color = accentColor[category.accent];
  const finish = (kind: "easy" | "medium" | "hard") => {
    if (kind === "easy") { const count = easyIndex + 1; const done = count >= easy.length; updateUnitProgress(unit.id, { easyCompleted: Math.max(progress.easyCompleted, count), stage: done ? "medium" : "easy", status: "in_progress" }); if (done) setStage("medium"); else setEasyIndex(count); }
    if (kind === "medium") { const count = mediumIndex + 1; const done = count >= medium.length; updateUnitProgress(unit.id, { mediumCompleted: Math.max(progress.mediumCompleted, count), stage: done ? "hard" : "medium", status: "in_progress" }); if (done) setStage("hard"); else setMediumIndex(count); }
    if (kind === "hard") { const count = hardIndex + 1; const done = count >= hard.length; updateUnitProgress(unit.id, { hardCompleted: Math.max(progress.hardCompleted, count), stage: done ? "video" : "hard", status: "in_progress" }); if (done) setStage("video"); else setHardIndex(count); }
  };
  const stages: Array<[DrillStage, string]> = [["examples", "Examples"], ["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"], ["video", "Video"]];
  return <RoleGuard role="student"><main className="min-h-screen bg-[#fafaf8]"><header className="border-b border-[#dfe3e7] bg-white"><div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-5"><Link href={`/topic/${skill.id}`} className="flex items-center gap-2 text-xs font-bold text-[#677386]"><ArrowLeft size={14}/>Exit section</Link><div className="text-right"><div className="label" style={{ color }}>{skill.code} · {unit.code}</div><div className="text-xs font-extrabold">{unit.name}</div></div></div></header><div className="mx-auto max-w-[960px] px-5 py-9"><div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe3e7] pb-6"><div><p className="label" style={{ color }}>{unit.code} · Practice set</p><h1 className="academic-heading mt-2 text-3xl">{unit.name}</h1></div><div className="flex gap-1 text-[10px] font-bold uppercase tracking-[.06em]">{stages.map(([value, label], index) => <span key={value} className={`border px-2 py-1.5 ${stage === value || stage === "complete" && value === "video" ? "border-[#17365f] bg-[#17365f] text-white" : "border-[#dfe3e7] bg-white text-[#7c8693]"}`}>{index + 1}. {label}</span>)}</div></div>
    {stage === "examples" && <div className="mx-auto max-w-[820px]"><p className="label" style={{ color }}>Worked examples</p><h2 className="academic-heading mt-2 text-4xl">See the method before you practice.</h2><div className="mt-7 space-y-4">{Array.from({ length: unit.workedExampleCount }, (_, index) => { const target = unit.frameworkTargets[index % unit.frameworkTargets.length]; return <section className="border border-[#dfe3e7] bg-white p-6" key={index}><p className="label text-[#677386]">Example {index + 1}</p><h3 className="academic-heading mt-2 text-2xl">{unit.workedExample.prompt}</h3><p className="mt-2 text-xs text-[#677386]">Target: {target.description}</p><div className="mt-5 space-y-3">{unit.workedExample.steps.map((step, stepIndex) => <div key={step} className="flex gap-3 text-sm"><b className="text-[#8a939f]">{stepIndex + 1}</b><p>{step}</p></div>)}</div></section>; })}</div><div className="mt-7 flex justify-end"><button className="btn-primary" onClick={() => { updateUnitProgress(unit.id, { stage: "easy", status: "in_progress" }); setStage("easy"); }}>Begin Easy practice <ArrowRight size={16}/></button></div></div>}
    {stage === "easy" && easy[easyIndex] && <QuestionView question={easy[easyIndex]} position={easyIndex + 1} total={easy.length} onComplete={() => finish("easy")}/>}
    {stage === "medium" && medium[mediumIndex] && <QuestionView question={medium[mediumIndex]} position={mediumIndex + 1} total={medium.length} onComplete={() => finish("medium")}/>}
    {stage === "hard" && hard[hardIndex] && <QuestionView question={hard[hardIndex]} position={hardIndex + 1} total={hard.length} onComplete={() => finish("hard")}/>}
    {stage === "video" && <div className="mx-auto max-w-[760px] text-center"><Video className="mx-auto text-[#677386]"/><p className="label mt-4" style={{ color }}>Video lesson</p><h2 className="academic-heading mt-3 text-4xl">Add your walkthrough here.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#677386]">Upload a teacher video for this drill unit, or leave the placeholder ready until the lesson is recorded.</p>{videoSource ? <video className="mt-7 aspect-video w-full bg-black" src={videoSource} controls/> : <label className="mt-7 flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#b8c0c9] bg-white text-sm font-bold text-[#435064]"><Upload className="mb-3"/>Upload video<input className="sr-only" type="file" accept="video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setVideoSource(URL.createObjectURL(file)); }}/></label>}<button className="btn-primary mt-7" onClick={() => { updateUnitProgress(unit.id, { stage: "complete", status: "complete" }); setStage("complete"); }}>Complete unit <Check size={16}/></button></div>}
    {stage === "complete" && <div className="mx-auto max-w-[680px] border-y-2 border-[#10233f] py-14 text-center"><Check className="mx-auto text-[#4f7a66]"/><p className="label mt-4 text-[#4f7a66]">Unit complete</p><h2 className="academic-heading mt-3 text-4xl">{unit.code} is complete.</h2><p className="mt-4 text-sm text-[#677386]">Your progress has been saved. Every other unit remains open.</p><div className="mt-8 flex justify-center gap-3"><Link className="btn-secondary" href={`/topic/${skill.id}`}>Skill overview</Link>{next && <Link className="btn-primary" href={`/topic/${skill.id}/unit/${next.id}`}>Continue to {next.code}<ArrowRight size={16}/></Link>}</div></div>}
  </div></main></RoleGuard>;
}

export function SkillGateExperience() {
  const params = useParams<{ topic: string }>();
  return <RoleGuard role="student"><main className="grid min-h-screen place-items-center bg-[#fafaf8] p-6"><div className="panel max-w-lg p-8 text-center"><p className="label text-[#677386]">Simplified practice</p><h1 className="academic-heading mt-3 text-4xl">Skill gates are no longer required.</h1><p className="mt-3 text-sm leading-6 text-[#677386]">All drill units are open and each one now includes examples, Easy, Medium, Hard, and a video lesson space.</p><Link className="btn-primary mt-6" href={`/topic/${params.topic}`}>Open skill</Link></div></main></RoleGuard>;
}

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, Check, Lightbulb, RotateCcw, Video, VideoOff } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { mockAiPartner, type AiPartnerAction, type AiPartnerResponse } from "@/lib/aiPartner";
import { allProgramQuestions, getProgramDomainForSkill, getProgramSkill, getProgramUnit, type ProgramQuestion, type ProgramStage } from "@/lib/programCurriculum";
import { clearReview, loadProgramProgress, makeProgramProgress, recordStageResult, retryStage, saveProgramProgress, skipStageByPlacement, skipUnitByPlacement, updateUnitRecord, unitMasteryPercent, type ProgramProgress, type StageState } from "@/lib/programProgress";

const stageOrder: ProgramStage[] = ["learn", "easy", "medium", "hard", "review"];
const stageLabel: Record<ProgramStage, string> = { learn: "Learn", easy: "Easy Drill", medium: "Medium Practice", hard: "Hard Challenge", review: "Review" };
const normalize = (value: string) => value.trim().toLowerCase().replace(/[$,°\s]/g, "");

function answersMatch(given: string, expected: string) {
  if (normalize(given) === normalize(expected)) return true;
  const a = Number(normalize(given));
  const b = Number(normalize(expected));
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 0.0001;
}

function nextStage(stage: ProgramStage): ProgramStage {
  return stageOrder[Math.min(stageOrder.indexOf(stage) + 1, stageOrder.length - 1)];
}

export function UnitLearningFlow() {
  const params = useParams<{ skillId: string; unitId: string }>();
  const router = useRouter();
  const { session, addError } = useApp();
  const skill = getProgramSkill(params.skillId);
  const unit = getProgramUnit(params.unitId);
  const domain = getProgramDomainForSkill(params.skillId);
  const [progress, setProgress] = useState<ProgramProgress>(makeProgramProgress);
  const [stage, setStage] = useState<ProgramStage>("learn");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [visibleWork, setVisibleWork] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [usedHelp, setUsedHelp] = useState(false);
  const [transferCorrect, setTransferCorrect] = useState(false);
  const [previousHints, setPreviousHints] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState<AiPartnerResponse | null>(null);
  const [result, setResult] = useState<{ passed: boolean; score: number; required: number } | null>(null);

  useEffect(() => {
    const loaded = loadProgramProgress(session?.email);
    setProgress(loaded);
    const storedStage = unit ? loaded.units[unit.id]?.currentStage : "learn";
    setStage(storedStage ?? "learn");
  }, [session?.email, unit]);

  const record = unit ? progress.units[unit.id] : undefined;
  const questions = useMemo(() => {
    if (!unit) return [];
    if (stage === "review") return allProgramQuestions.filter((question) => record?.missedQuestionIds.includes(question.id));
    if (stage === "learn") return [];
    return unit.questions.filter((question) => question.difficulty === stage);
  }, [record?.missedQuestionIds, stage, unit]);
  const current = questions[questionIndex];

  if (!skill || !unit || !domain || unit.id.toLowerCase() !== params.unitId.toLowerCase() || skill.id.toLowerCase() !== params.skillId.toLowerCase()) {
    return <AppShell role="student"><p>Unit not found.</p></AppShell>;
  }

  const persist = (next: ProgramProgress) => {
    setProgress(next);
    saveProgramProgress(next, session?.email);
  };

  const resetQuestion = () => {
    setAnswer("");
    setVisibleWork("");
    setAttempted(false);
    setCorrect(null);
    setPreviousHints([]);
    setAiResponse(null);
  };

  const openStage = (target: ProgramStage) => {
    const next = updateUnitRecord(progress, unit.id, { state: "in_progress", currentStage: target, stageStates: { ...record?.stageStates, [target]: "in_progress" } as Record<ProgramStage, StageState> });
    persist(next);
    setStage(target);
    setQuestionIndex(0);
    setCorrectCount(0);
    setMissed([]);
    setResult(null);
    resetQuestion();
  };

  const beginEasy = () => {
    const learned = recordStageResult(progress, unit.id, "learn", 100, [], true);
    persist(learned);
    setStage("easy");
    setResult(null);
  };

  const submitAnswer = () => {
    if (!current || !answer.trim()) return;
    const isCorrect = answersMatch(answer, current.correctAnswer);
    setAttempted(true);
    setCorrect(isCorrect);
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      if (current.isTransferQuestion) setTransferCorrect(true);
    } else {
      setMissed((items) => items.includes(current.id) ? items : [...items, current.id]);
      addError(current.id, skill.id);
    }
  };

  const finishStage = () => {
    const total = questions.length;
    const score = total ? Math.round(correctCount / total * 100) : 0;
    const required = stage === "easy" ? 85 : stage === "medium" ? 80 : stage === "hard" ? 67 : 0;
    const transferRequired = stage === "hard" && usedHelp;
    const passed = stage === "review" ? true : score >= required && (!transferRequired || transferCorrect);
    const next = stage === "review"
      ? clearReview(progress, unit.id)
      : recordStageResult(updateUnitRecord(progress, unit.id, { usedHelp, transferComplete: transferCorrect }), unit.id, stage, score, missed, passed);
    persist(next);
    setResult({ passed, score, required });
  };

  const continueQuestion = () => {
    if (questionIndex + 1 >= questions.length) return finishStage();
    setQuestionIndex((value) => value + 1);
    resetQuestion();
  };

  const retryCurrentStage = () => {
    const next = retryStage(progress, unit.id, stage);
    persist(next);
    setQuestionIndex(0);
    setCorrectCount(0);
    setMissed([]);
    setUsedHelp(false);
    setTransferCorrect(false);
    setResult(null);
    resetQuestion();
  };

  const skipStage = () => {
    const skipped = skipStageByPlacement(progress, unit.id, stage);
    const target = nextStage(stage);
    persist(updateUnitRecord(skipped, unit.id, { currentStage: target }));
    setStage(target);
    setQuestionIndex(0);
    setResult(null);
    resetQuestion();
  };

  const askAi = async (action: AiPartnerAction) => {
    if (!current || !attempted || current.isTransferQuestion) return;
    setUsedHelp(true);
    const response = await mockAiPartner.respond({
      domain: domain.title,
      skillPacket: `${skill.id}: ${skill.officialName}`,
      unit: `${unit.id}: ${unit.title}`,
      difficulty: current.difficulty,
      question: current,
      studentAnswer: answer,
      visibleWork,
      previousHints,
    }, action);
    setAiResponse(response);
    if (action === "hint" || action === "explain_step") setPreviousHints((items) => [...items, response.message]);
  };

  const unitProgress = unitMasteryPercent(record);
  const stageQuestionsMissing = stage !== "learn" && stage !== "review" && questions.length === 0;

  return (
    <AppShell role="student" title={`${unit.id} · ${stageLabel[stage]}`}>
      <div className="mx-auto max-w-[940px]">
        <Link href={`/packet/${skill.id.toLowerCase()}`} className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>{skill.id}: {skill.officialName}</Link>
        <header className="worksheet-player-header">
          <div><p className="label text-[var(--muted)]">{domain.title} · {skill.id}</p><h2 className="academic-heading mt-2 text-3xl">{unit.id}: {unit.title}</h2><p className="mt-3 text-xs font-semibold text-[var(--muted)]">{record?.missedQuestionIds.length ?? 0} missed · {record?.reviewDue ? "Review due" : "Review clear"} · AI partner available</p></div>
          <div className="min-w-[150px]"><div className="mb-2 flex justify-between text-xs font-bold"><span>Unit mastery</span><span>{unitProgress}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${unitProgress}%` }}/></div></div>
        </header>

        <nav className="worksheet-band-map" aria-label="Unit stages">
          {stageOrder.map((item) => <div key={item} className={stage === item ? "active" : ["mastered", "skipped_by_placement"].includes(record?.stageStates[item] ?? "") ? "complete" : ""}><span>{stageOrder.indexOf(item) + 1}</span>{stageLabel[item]}</div>)}
        </nav>

        {stage === "learn" ? (
          <article className="workbook-card mt-4 p-6 md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6"><div><p className="label text-[var(--muted)]">Learn</p><h3 className="academic-heading mt-2 text-3xl">Worked patterns</h3></div><div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]">{unit.videoUrl ? <Video size={15}/> : <VideoOff size={15}/>} {unit.videoUrl ? "Video available" : "Video coming soon"}</div></div>
            {unit.workedExamples.length ? <div className="mt-6 grid gap-5">{unit.workedExamples.map((item) => <section className="border border-[var(--line)] bg-white p-5" key={item.id}><p className="label text-[#416f9d]">{item.title}</p><p className="mt-3 font-semibold">{item.prompt}</p><ol className="mt-4 space-y-2 text-sm leading-6">{item.steps.map((step, index) => <li key={step}><b>{index + 1}.</b> {step}</li>)}</ol><p className="mt-4 border-t border-[var(--line)] pt-3 text-sm"><b>Answer:</b> {item.answer}</p></section>)}</div> : <div className="mt-6 border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">Worked examples have not been authored for this unit yet.</div>}
            <div className="mt-7 flex flex-wrap justify-between gap-3"><button className="btn-secondary" onClick={() => { const next = skipUnitByPlacement(progress, unit.id); persist(next); router.push(`/packet/${skill.id.toLowerCase()}`); }}>Skip unit by placement</button><button className="btn-primary" disabled={!unit.questions.some((item) => item.difficulty === "easy")} onClick={beginEasy}>Start Easy Drill<ArrowRight size={15}/></button></div>
          </article>
        ) : stageQuestionsMissing ? (
          <article className="workbook-card mt-4 p-8 text-center"><h3 className="academic-heading text-3xl">Content coming soon</h3><p className="mt-3 text-sm text-[var(--muted)]">This unit is in the complete curriculum ladder, but this stage still needs authored questions.</p><div className="mt-6 flex justify-center gap-3"><button className="btn-secondary" onClick={skipStage}>Skip stage by placement</button><Link className="btn-primary" href={`/packet/${skill.id.toLowerCase()}`}>Back to packet</Link></div></article>
        ) : stage === "review" && questions.length === 0 ? (
          <article className="workbook-card mt-4 p-9 text-center"><Check className="mx-auto" size={30}/><h3 className="academic-heading mt-4 text-3xl">Review clear</h3><p className="mt-3 text-sm text-[var(--muted)]">There are no missed questions waiting for correction.</p><Link className="btn-primary mt-6" href={`/packet/${skill.id.toLowerCase()}`}>Return to packet</Link></article>
        ) : result ? (
          <article className="workbook-card mt-4 p-9 text-center">{result.passed ? <Check className="mx-auto" size={32}/> : <RotateCcw className="mx-auto" size={32}/>}<h3 className="academic-heading mt-4 text-3xl">{result.passed ? (stage === "review" ? "Review complete" : "Stage mastered") : "Needs repair"}</h3><p className="mt-3 text-sm">{result.score}% correct{stage !== "review" ? ` · target ${result.required}%` : ""}</p><div className="mt-7 flex flex-wrap justify-center gap-3">{!result.passed && <button className="btn-secondary" onClick={retryCurrentStage}>Retry this stage</button>}{result.passed && stage !== "review" && <button className="btn-primary" onClick={() => openStage(nextStage(stage))}>Continue to {stageLabel[nextStage(stage)]}<ArrowRight size={15}/></button>}{result.passed && stage === "review" && <Link className="btn-primary" href={`/packet/${skill.id.toLowerCase()}`}>Return to packet</Link>}</div></article>
        ) : current ? (
          <article className="worksheet-problem mt-4">
            <div className="worksheet-problem-meta"><div><span>{questionIndex + 1}</span><div><b>{stageLabel[stage]}</b><p>{questionIndex + 1} of {questions.length}{current.isTransferQuestion ? " · Independent transfer" : ""}</p></div></div><span className="status-pill">{current.difficulty}</span></div>
            <div className="worksheet-prompt">{current.prompt}</div>
            {current.choices ? <div className="worksheet-choices">{current.choices.map((choice, index) => <button key={choice} className={answer === choice ? "selected" : ""} disabled={attempted} onClick={() => setAnswer(choice)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} disabled={attempted} onChange={(event) => setAnswer(event.target.value)}/></label>}
            {stage === "hard" && <label className="mx-6 mb-5 block text-xs font-bold">Visible work or reasoning<textarea className="field mt-2 min-h-20" value={visibleWork} disabled={attempted} onChange={(event) => setVisibleWork(event.target.value)} placeholder="Write your setup or reasoning."/></label>}
            {attempted && <div className={`mx-6 mb-5 border-l-4 p-4 text-sm ${correct ? "border-[#4f7a66] bg-[#edf4ef]" : "border-[#a1623c] bg-[#fbf1eb]"}`}><b>{correct ? "Correct." : "Not yet."}</b><p className="mt-2 leading-6">{current.solution}</p></div>}
            {stage === "hard" && attempted && !current.isTransferQuestion && <section className="mx-6 mb-5 border border-[var(--line)] bg-[#f7f4ed] p-4"><div className="flex items-center gap-2"><Bot size={16}/><b className="text-sm">AI partner · mock mode</b></div><div className="mt-3 flex flex-wrap gap-2">{([["hint", "Give me a hint"], ["explain_step", "Explain this step"], ["similar_example", "Show a similar example"], ["check_reasoning", "Check my reasoning"], ["full_solution", "Show the full solution"]] as Array<[AiPartnerAction, string]>).map(([action, label]) => <button className="btn-secondary text-xs" key={action} onClick={() => askAi(action)}>{action === "hint" && <Lightbulb size={13}/>} {label}</button>)}</div>{aiResponse && <div className="mt-4 border-l-2 border-[#416f9d] pl-4 text-sm"><p><b>Likely issue:</b> {aiResponse.likelyMisconception}</p><p className="mt-2">{aiResponse.message}</p><p className="mt-2 font-semibold">{aiResponse.followUp}</p></div>}</section>}
            {current.isTransferQuestion && <div className="mx-6 mb-5 border border-[#d6b36a] bg-[#fff8e8] p-3 text-xs font-semibold">Solve this transfer question independently. Help is unavailable for this item.</div>}
            <footer className="worksheet-forward"><p>{stage === "easy" ? "Mastery target: 85%" : stage === "medium" ? "Mastery target: 80%" : stage === "hard" ? "Attempt before help. Transfer required after help." : "Correct every missed item."}</p>{!attempted ? <button className="btn-primary" disabled={!answer.trim()} onClick={submitAnswer}>Check answer</button> : <button className="btn-primary" onClick={continueQuestion}>{questionIndex + 1 === questions.length ? "Finish stage" : "Next question"}<ArrowRight size={15}/></button>}</footer>
            {stage !== "review" && <div className="border-t border-[var(--line)] p-3 text-right"><button className="text-xs font-bold text-[var(--muted)] underline" onClick={skipStage}>Skip this stage by placement</button></div>}
          </article>
        ) : null}
      </div>
    </AppShell>
  );
}


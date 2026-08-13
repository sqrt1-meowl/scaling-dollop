"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronRight, RotateCcw } from "lucide-react";
import { RoleGuard, useApp } from "../AppProvider";
import { WorkbookQuestion } from "./WorkbookQuestion";
import { accentColor, allSkills, getCategoryForTopic, getSkill, type Question } from "@/lib/curriculum";
import { calculateTopicLearningPercent, learningLocationLabel, type LearningSet, type TopicLearningStage } from "@/lib/appState";

const setOrder: LearningSet[] = ["A", "B", "C"];
const stageLabels: Array<[TopicLearningStage, string]> = [["review", "Review"], ["concept", "Concept"], ["example", "Example"], ["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"]];

function takeSet(questions: Question[], set: LearningSet, size = 5) {
  const start = setOrder.indexOf(set) * size;
  const picked = questions.slice(start, start + size);
  return picked.length === size ? picked : Array.from({ length: size }, (_, index) => questions[(start + index) % Math.max(1, questions.length)]).filter(Boolean);
}

function SetResult({ score, passed, onContinue, onRetry, hard }: { score: number; passed: boolean; onContinue: () => void; onRetry: () => void; hard?: boolean }) {
  return <section className="question-sheet text-center"><p className="label text-[var(--muted)]">{hard ? "Hard Challenge" : "Drill set complete"}</p><div className="mt-5 font-serif text-7xl">{score}<span className="text-3xl text-[#9aa2ad]"> / 5</span></div><h2 className="academic-heading mt-5 text-4xl">{passed ? hard ? "Topic Mastered" : "Set Cleared" : "Try Another Set"}</h2><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">{passed ? hard ? "You completed the full learning sequence." : "You reached the 4 / 5 mastery standard." : "Review your errors, then try the set again. A score of 4 / 5 clears it."}</p><div className="mt-8 flex justify-center">{passed ? <button className="btn-primary" onClick={onContinue}>{hard ? "Return to category" : "Continue"}<ArrowRight size={16}/></button> : <button className="btn-primary" onClick={onRetry}><RotateCcw size={15}/>Retry set</button>}</div></section>;
}

export function TopicLearningFlow() {
  const params = useParams<{ topic: string }>();
  const skill = getSkill(params.topic);
  const category = getCategoryForTopic(params.topic);
  const { data, updateLearningProgress } = useApp();
  const progress = data.learningProgress[params.topic];
  if (!skill || !category || !progress) return <RoleGuard role="student"><div className="p-10">Topic not found.</div></RoleGuard>;
  const color = accentColor[category.accent];
  const domainSkills = allSkills.filter((item) => item.domainId === category.id).sort((a, b) => a.order - b.order);
  const topicIndex = domainSkills.findIndex((item) => item.id === skill.id);
  const priorSkillIds = new Set(domainSkills.slice(0, topicIndex).map((item) => item.id));
  const reviewQuestions = data.questions.filter((question) => priorSkillIds.has(question.skillId) && !question.isGate && question.difficulty !== "hard").slice(0, 6);
  const topicQuestions = data.questions.filter((question) => question.skillId === skill.id && !question.isGate && question.id !== "g1-live-challenge");
  const easyQuestions = topicQuestions.filter((question) => question.difficulty === "easy");
  const mediumQuestions = topicQuestions.filter((question) => question.difficulty === "medium");
  const hardQuestions = topicQuestions.filter((question) => question.difficulty === "hard").slice(0, 5);
  const currentQuestions = progress.stage === "review" ? reviewQuestions : progress.stage === "easy" ? takeSet(easyQuestions, progress.currentSet) : progress.stage === "medium" ? takeSet(mediumQuestions, progress.currentSet) : hardQuestions;
  const isQuestionStage = progress.stage === "easy" || progress.stage === "medium" || progress.stage === "hard";
  const result = isQuestionStage && progress.currentQuestion >= currentQuestions.length ? progress.currentScore : null;
  const activeQuestion = currentQuestions[progress.currentQuestion];
  const completeQuestion = (correct: boolean) => {
    const nextScore = progress.currentScore + (correct ? 1 : 0);
    if (progress.currentQuestion + 1 < currentQuestions.length) { updateLearningProgress(skill.id, { currentQuestion: progress.currentQuestion + 1, currentScore: nextScore }); return; }
    if (progress.stage === "review") { updateLearningProgress(skill.id, { stage: "concept", currentQuestion: 0, currentScore: 0 }); return; }
    updateLearningProgress(skill.id, { currentQuestion: currentQuestions.length, currentScore: nextScore });
  };
  const advanceSet = () => {
    const key = `${progress.stage}-${progress.currentSet}`;
    const completedSets = progress.completedSets.includes(key) ? progress.completedSets : [...progress.completedSets, key];
    const scores = { ...progress.scores, [key]: result ?? progress.currentScore };
    if (progress.stage === "hard") { updateLearningProgress(skill.id, { stage: "mastered", mastered: true, completedSets, scores, currentQuestion: 0, currentScore: 0 }); window.location.href = `/category/${category.id}`; return; }
    const setIndex = setOrder.indexOf(progress.currentSet);
    if (setIndex < 2) updateLearningProgress(skill.id, { currentSet: setOrder[setIndex + 1], currentQuestion: 0, currentScore: 0, completedSets, scores });
    else updateLearningProgress(skill.id, { stage: progress.stage === "easy" ? "medium" : "hard", currentSet: "A", currentQuestion: 0, currentScore: 0, completedSets, scores });
  };
  const retry = () => updateLearningProgress(skill.id, { currentQuestion: 0, currentScore: 0 });
  const conceptPoints = skill.drillUnits.flatMap((unit) => unit.frameworkTargets).slice(0, 5).map((target) => target.description.replace(/^./, (letter) => letter.toUpperCase()));
  const example = skill.drillUnits[0].workedExample;
  const percent = calculateTopicLearningPercent(skill.id, data);
  return <RoleGuard role="student"><main className="min-h-screen bg-[var(--paper)]"><header className="border-b border-[var(--line)] bg-white"><div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-5"><Link href={`/category/${category.id}`} className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>{category.shortName}</Link><div className="text-right"><p className="label" style={{ color }}>{skill.code}</p><p className="mt-1 text-xs font-extrabold">{skill.title}</p></div></div></header>
    <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-8 lg:grid-cols-[220px_1fr] lg:py-12"><aside className="lg:sticky lg:top-8 lg:h-fit"><p className="label text-[var(--muted)]">Learning sequence</p><div className="mt-5 space-y-1">{stageLabels.filter(([stage]) => stage !== "review" || topicIndex > 0).map(([stage, label]) => { const active = progress.stage === stage || progress.stage === "mastered" && stage === "hard"; const complete = stage === "review" ? progress.stage !== "review" : stage === "concept" ? !["review", "concept"].includes(progress.stage) : stage === "example" ? !["review", "concept", "example"].includes(progress.stage) : stage === "easy" ? progress.completedSets.includes("easy-C") : stage === "medium" ? progress.completedSets.includes("medium-C") : progress.mastered; return <div key={stage} className={`flex items-center gap-3 border-l-2 px-3 py-2 text-xs font-bold ${active ? "border-[var(--ink)] bg-white text-[var(--ink)]" : "border-transparent text-[var(--muted)]"}`}>{complete ? <Check size={14} className="text-[#4f7a66]"/> : <span className="size-3 rounded-full border border-[#b7b1a6]"/>}<span>{label}</span>{active && <ChevronRight className="ml-auto" size={13}/>}</div>; })}</div><div className="mt-7"><div className="mb-2 flex justify-between text-[11px] font-bold"><span>{learningLocationLabel(progress)}</span><span>{percent}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%`, background: color }}/></div></div></aside>
      <div className="min-w-0">{result !== null ? <SetResult score={result} passed={result >= 4} hard={progress.stage === "hard"} onContinue={advanceSet} onRetry={retry}/> : progress.stage === "review" && activeQuestion ? <WorkbookQuestion question={activeQuestion} number={progress.currentQuestion + 1} total={currentQuestions.length} eyebrow="Cumulative Review" onAdvance={completeQuestion}/> : progress.stage === "concept" ? <section className="lesson-sheet"><p className="label" style={{ color }}>Concept</p><h1 className="academic-heading mt-4 text-4xl md:text-5xl">{skill.title}</h1><p className="mt-3 text-sm text-[var(--muted)]">The essential ideas for this topic.</p><ul className="mt-9 divide-y divide-[var(--line)] border-y border-[var(--line)]">{conceptPoints.map((point) => <li key={point} className="flex gap-4 py-4 text-[17px] leading-7"><span className="font-serif text-[#9b6a39]">—</span>{point}</li>)}</ul><div className="mt-8 flex justify-end"><button className="btn-primary" onClick={() => updateLearningProgress(skill.id, { stage: "example" })}>View example<ArrowRight size={16}/></button></div></section> : progress.stage === "example" ? <section className="lesson-sheet"><p className="label" style={{ color }}>Example</p><h1 className="academic-heading mt-4 text-3xl leading-[1.4]">{example.prompt}</h1><div className="mt-9 border-y border-[var(--line)] py-7">{example.steps.map((step, index) => <div className="grid grid-cols-[36px_1fr] gap-4 py-3" key={step}><span className="font-serif text-xl text-[#9b6a39]">{index + 1}</span><p className="text-[17px] leading-7">{step}</p></div>)}<div className="mt-4 grid grid-cols-[36px_1fr] gap-4 border-t-2 border-[var(--ink)] pt-5"><Check className="text-[#4f7a66]" size={18}/><p className="font-bold">Answer checked against the original relationship.</p></div></div><div className="mt-8 flex justify-end"><button className="btn-primary" onClick={() => updateLearningProgress(skill.id, { stage: "easy", currentSet: "A", currentQuestion: 0 })}>Begin Easy Drill A<ArrowRight size={16}/></button></div></section> : progress.stage === "mastered" ? <section className="lesson-sheet text-center"><Check className="mx-auto text-[#4f7a66]"/><p className="label mt-5 text-[#4f7a66]">Mastered</p><h1 className="academic-heading mt-4 text-5xl">{skill.title}</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[var(--muted)]">You cleared every drill set and the Hard Challenge.</p><Link href={`/category/${category.id}`} className="btn-primary mt-8">Return to category</Link></section> : activeQuestion ? <WorkbookQuestion question={activeQuestion} number={progress.currentQuestion + 1} total={currentQuestions.length} eyebrow={progress.stage === "hard" ? "Hard Challenge" : `${progress.stage} Drill ${progress.currentSet}`} hard={progress.stage === "hard"} onAdvance={completeQuestion}/> : <section className="lesson-sheet"><p>No questions are available for this stage yet.</p></section>}</div>
    </div></main></RoleGuard>;
}

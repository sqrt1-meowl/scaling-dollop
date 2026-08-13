"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { RoleGuard, useApp } from "../AppProvider";
import { WorkbookSet } from "./WorkbookSet";
import { allSkills, getCategoryForTopic, getSkill, type Question } from "@/lib/curriculum";
import { asDirectPracticeQuestion } from "@/lib/grindQuestions";
import { calculateTopicLearningPercent, learningLocationLabel, type LearningSet } from "@/lib/appState";

const setOrder: LearningSet[] = ["A", "B", "C"];
const masterySequence = ["easy-A", "easy-B", "easy-C", "medium-A", "medium-B", "medium-C", "hard-A"];

function takeSet(questions: Question[], set: LearningSet, size = 5) {
  const start = setOrder.indexOf(set) * size;
  const picked = questions.slice(start, start + size);
  return picked.length === size ? picked : Array.from({ length: size }, (_, index) => questions[(start + index) % Math.max(1, questions.length)]).filter(Boolean);
}

function PacketOverview({ skillId, onBegin }: { skillId: string; onBegin: () => void }) {
  const skill = getSkill(skillId)!;
  const category = getCategoryForTopic(skillId)!;
  const targets = skill.drillUnits.flatMap((unit) => unit.frameworkTargets).slice(0, 6).map((target) => target.description.replace(/^./, (letter) => letter.toUpperCase()));
  const example = skill.drillUnits[0].workedExample;

  return (
    <article className="packet-page">
      <header className="packet-masthead"><b>SAT Math Drill Program</b><b>{category.name}</b></header>
      <div className="packet-title-row"><h1>TOPIC {skill.code}: {skill.title}</h1><h2>OVERVIEW</h2></div>
      <p className="packet-subtitle">Read the short reference, study one example, then start the drill.</p>
      <div className="packet-overview-grid">
        <section className="packet-panel"><h3>Core math in this topic</h3><ul>{targets.map((target) => <li key={target}>{target}</li>)}</ul></section>
        <section className="packet-panel"><h3>Concept</h3><p>{`Use these relationships fluently across direct and applied ${skill.title.toLowerCase()} problems.`}</p><ul className="mt-3">{targets.slice(0, 4).map((target) => <li key={target}>{target}</li>)}</ul></section>
        <section className="packet-panel packet-worked-example"><h3>Worked Example</h3><p className="font-semibold">{example.prompt}</p><div className="mt-4 space-y-2">{example.steps.map((step, index) => <p key={step}><b>{index + 1}.</b> {step}</p>)}</div></section>
      </div>
      <div className="packet-submit-row"><p>One example. Then repetition.</p><button className="btn-primary" onClick={onBegin}>Start Easy Drill A<ArrowRight size={15}/></button></div>
    </article>
  );
}

export function TopicLearningFlow() {
  const params = useParams<{ topic: string }>();
  const skill = getSkill(params.topic);
  const category = getCategoryForTopic(params.topic);
  const { data, updateLearningProgress } = useApp();
  const progress = data.learningProgress[params.topic];
  if (!skill || !category || !progress) return <RoleGuard role="student"><div className="p-10">Topic not found.</div></RoleGuard>;

  const domainSkills = allSkills.filter((item) => item.domainId === category.id).sort((a, b) => a.order - b.order);
  const topicIndex = domainSkills.findIndex((item) => item.id === skill.id);
  const priorSkillIds = new Set(domainSkills.slice(0, topicIndex).map((item) => item.id));
  const reviewQuestions = data.questions.filter((question) => priorSkillIds.has(question.skillId) && !question.isGate && question.difficulty !== "hard").slice(0, 6).map((question, index) => asDirectPracticeQuestion(question, index));
  const topicQuestions = data.questions.filter((question) => question.skillId === skill.id && !question.isGate && question.id !== "g1-live-challenge").map((question, index) => asDirectPracticeQuestion(question, index));
  const easyQuestions = topicQuestions.filter((question) => question.difficulty === "easy");
  const mediumQuestions = topicQuestions.filter((question) => question.difficulty === "medium");
  const hardQuestions = topicQuestions.filter((question) => question.difficulty === "hard").slice(0, 5);
  const currentQuestions = progress.stage === "review" ? reviewQuestions : progress.stage === "easy" ? takeSet(easyQuestions, progress.currentSet) : progress.stage === "medium" ? takeSet(mediumQuestions, progress.currentSet) : progress.stage === "hard" ? hardQuestions : [];
  const isQuestionStage = ["review", "easy", "medium", "hard"].includes(progress.stage);
  const result = isQuestionStage && currentQuestions.length > 0 && progress.currentQuestion >= currentQuestions.length ? progress.currentScore : null;
  const percent = calculateTopicLearningPercent(skill.id, data);

  const submitSet = (score: number) => updateLearningProgress(skill.id, { currentQuestion: currentQuestions.length, currentScore: score });
  const retrySet = () => updateLearningProgress(skill.id, { currentQuestion: 0, currentScore: 0 });
  const advance = () => {
    if (progress.stage === "review") {
      updateLearningProgress(skill.id, { stage: "concept", currentQuestion: 0, currentScore: 0, scores: { ...progress.scores, review: result ?? progress.currentScore } });
      return;
    }
    const key = `${progress.stage}-${progress.currentSet}`;
    const completedSets = progress.completedSets.includes(key) ? progress.completedSets : [...progress.completedSets, key];
    const scores = { ...progress.scores, [key]: result ?? progress.currentScore };
    if (progress.stage === "hard") {
      updateLearningProgress(skill.id, { stage: "mastered", mastered: true, completedSets, scores, currentQuestion: 0, currentScore: 0 });
      window.location.href = `/category/${category.id}`;
      return;
    }
    const setIndex = setOrder.indexOf(progress.currentSet);
    if (setIndex < 2) updateLearningProgress(skill.id, { currentSet: setOrder[setIndex + 1], currentQuestion: 0, currentScore: 0, completedSets, scores });
    else updateLearningProgress(skill.id, { stage: progress.stage === "easy" ? "medium" : "hard", currentSet: "A", currentQuestion: 0, currentScore: 0, completedSets, scores });
  };

  const setTitle = progress.stage === "review" ? "CUMULATIVE REVIEW" : progress.stage === "hard" ? "HARD CHALLENGE" : `${progress.stage.toUpperCase()} DRILL ${progress.currentSet}`;
  const subtitle = progress.stage === "review" ? "Questions 1-6: direct practice from earlier topics. No notes or examples." : progress.stage === "easy" ? "Questions 1-5: direct use of one fact. Work independently." : progress.stage === "medium" ? "Questions 1-5: connect familiar facts. Keep the setup efficient." : "These questions combine or disguise skills you already know.";

  return (
    <RoleGuard role="student">
      <main className="packet-route min-h-screen">
        <div className="mx-auto max-w-[1120px] px-4 py-5 md:px-6 md:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <Link href={`/category/${category.id}`} className="flex items-center gap-2 text-xs font-bold text-[#666]"><ArrowLeft size={14}/>{category.shortName}</Link>
            <div className="flex items-center gap-3 text-xs"><b>{learningLocationLabel(progress)}</b><span>{percent}% complete</span></div>
          </div>
          <div className="packet-progress-map">
            <span className={progress.stage === "review" ? "active" : ""}>Review</span>
            <span className={["concept", "example"].includes(progress.stage) ? "active" : ""}>Overview</span>
            {masterySequence.map((item) => <span key={item} className={`${progress.completedSets.includes(item) || progress.mastered ? "complete" : ""} ${`${progress.stage}-${progress.currentSet}` === item ? "active" : ""}`}>{progress.completedSets.includes(item) || progress.mastered ? <Check size={12}/> : null}{item === "hard-A" ? "Hard" : item.replace("-", " ")}</span>)}
          </div>

          {progress.stage === "concept" || progress.stage === "example" ? <PacketOverview skillId={skill.id} onBegin={() => updateLearningProgress(skill.id, { stage: "easy", currentSet: "A", currentQuestion: 0, currentScore: 0 })}/> : progress.stage === "mastered" ? <article className="packet-page text-center"><header className="packet-masthead"><b>SAT Math Drill Program</b><b>{category.name}</b></header><div className="px-8 py-20"><Check className="mx-auto" size={34}/><h1 className="mt-5 text-4xl font-black uppercase">Topic Mastered</h1><p className="mt-3">{skill.code}: {skill.title}</p><Link href={`/category/${category.id}`} className="btn-primary mt-8">Return to category</Link></div></article> : currentQuestions.length ? <WorkbookSet key={`${progress.stage}-${progress.currentSet}-${progress.currentQuestion}`} questions={currentQuestions} domainName={category.name} topicCode={skill.code} topicTitle={skill.title} setTitle={setTitle} subtitle={subtitle} result={result} requiredScore={progress.stage === "review" ? 0 : 4} hard={progress.stage === "hard"} onSubmit={submitSet} onContinue={advance} onRetry={retrySet} continueLabel={progress.stage === "review" ? "Open topic overview" : progress.stage === "hard" ? "Finish topic" : "Next set"}/> : <article className="packet-page p-10">No questions are available for this set yet.</article>}
        </div>
      </main>
    </RoleGuard>
  );
}

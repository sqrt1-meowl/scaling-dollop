"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, allTopics, categories, getCategoryForTopic } from "@/lib/curriculum";

export function StudentDashboard() {
  const { data, session } = useApp();
  const currentTopic = allTopics.find((topic) => data.progress[topic.id]?.status === "in_progress")
    ?? allTopics.find((topic) => data.progress[topic.id]?.status === "available")
    ?? allTopics[0];
  const current = data.progress[currentTopic.id];
  const currentCategory = getCategoryForTopic(currentTopic.id)!;
  const currentColor = accentColor[currentCategory.accent];
  const drillCompleted = current.easyCompleted + current.mediumCompleted;
  const isNew = data.questionAttempts === 0;
  const scores = data.scores;
  const baseline = scores[0]?.score ?? 0;
  const latest = scores.at(-1)?.score ?? 0;
  return <AppShell role="student" title="Dashboard">
    <div className="mb-8"><p className="label text-[#677386]">Thursday, August 7</p><h2 className="academic-heading mt-2 text-4xl">{isNew ? `Welcome, ${session?.name}.` : `Welcome back, ${session?.name}.`}</h2><p className="mt-2 text-sm text-[#677386]">{isNew ? "Your workbook is ready. Begin with the first Algebra topic when you are ready." : "Continue where you left off. Your progress is measured by mastery, not speed."}</p></div>
    <section className="panel mb-9 grid overflow-hidden md:grid-cols-[1fr_230px]">
      <div className="p-6 md:p-7"><p className="label" style={{ color: currentColor }}>Current work</p><div className="mt-4 flex items-start gap-4"><div className="mt-1 grid size-11 shrink-0 place-items-center border border-[#d9dee4] bg-[#f4f6f8] font-serif text-lg" style={{ color: currentColor }}>{currentTopic.code}</div><div><p className="text-xs font-bold uppercase tracking-[.1em] text-[#677386]">{currentCategory.name}</p><h3 className="academic-heading mt-1 text-2xl">{currentTopic.title}</h3><p className="mt-2 text-sm text-[#677386]">{drillCompleted} of 12 drill questions complete</p></div></div><div className="mt-5 progress-track" style={{ "--accent": currentColor } as React.CSSProperties}><div className="progress-fill" style={{ width: `${(drillCompleted / 12) * 100}%` }}/></div></div>
      <div className="flex flex-col justify-between border-t border-[#dfe3e7] bg-[#f7f6f2] p-6 md:border-l md:border-t-0"><div><p className="label text-[#677386]">Next step</p><p className="mt-2 text-sm leading-6 text-[#435064]">{drillCompleted === 0 ? "Concept reference" : current.easyCompleted < 6 ? `Easy · Question ${current.easyCompleted + 1} of 6` : `Medium · Question ${Math.min(6, current.mediumCompleted + 1)} of 6`}</p></div><Link href={`/topic/${currentTopic.id}`} className="btn-primary mt-5">{drillCompleted === 0 ? "Begin Drill" : "Continue Drill"} <ArrowRight size={16}/></Link></div>
    </section>
    <div className="mb-4 flex items-end justify-between"><div><p className="label text-[#677386]">Curriculum</p><h3 className="academic-heading mt-1 text-2xl">SAT Math domains</h3></div><Link href="/progress" className="text-xs font-bold text-[#416f9d] hover:underline">View full progress</Link></div>
    <div className="grid gap-3 md:grid-cols-2">
      {categories.map((category) => { const done = category.topics.filter((topic) => data.progress[topic.id]?.status === "complete").length; const active = category.topics.find((topic) => ["in_progress", "review", "available"].includes(data.progress[topic.id]?.status)); const color = accentColor[category.accent]; return <Link href={`/category/${category.id}`} key={category.id} className="panel group p-5 hover:border-[#aeb6c0]" style={{ "--accent": color } as React.CSSProperties}><div className="flex justify-between gap-4"><div><p className="label" style={{ color }}>{category.name}</p><p className="mt-2 text-xs font-semibold text-[#677386]">{category.weight}% of SAT Math</p></div><span className="text-sm font-extrabold">{done} / {category.topics.length}</span></div><div className="mt-4 progress-track"><div className="progress-fill" style={{ width: `${(done / category.topics.length) * 100}%` }}/></div><div className="mt-4 flex items-center justify-between text-xs"><span className="text-[#677386]">Current: <b className="text-[#435064]">{active?.title ?? "Complete"}</b></span><ArrowRight size={14} className="text-[#9aa2ad] transition group-hover:translate-x-1"/></div></Link>; })}
    </div>
    <div className="mt-9 grid gap-4 lg:grid-cols-[1fr_300px]">
      <section className="panel"><div className="border-b border-[#e2e5e8] px-5 py-4"><p className="label text-[#677386]">Recent progress</p></div>{isNew ? <div className="px-5 py-10 text-center"><Circle size={18} className="mx-auto text-[#aeb5be]"/><p className="mt-3 text-sm font-bold">No activity yet</p><p className="mt-1 text-xs text-[#7b8592]">Your completed work will appear here.</p></div> : <div className="divide-y divide-[#e8eaec]">
        {[{ title: "Area and Volume", sub: "8/12 questions", done: false }, { title: "Two-variable data", sub: "Completed", done: true }, { title: "Nonlinear equations", sub: "Completed", done: true }, { title: "Lines, angles, and triangles", sub: "Not started", done: false }].map((row) => <div key={row.title} className="flex items-center gap-3 px-5 py-3.5">{row.done ? <CheckCircle2 size={16} className="text-[#4f7a66]"/> : <Circle size={16} className="text-[#aeb5be]"/>}<span className="flex-1 text-sm font-semibold">{row.title}</span><span className="text-xs text-[#677386]">{row.sub}</span></div>)}
      </div>}</section>
      <section className="panel p-5"><p className="label text-[#677386]">Latest SAT score</p>{scores.length ? <><div className="mt-6 grid grid-cols-2 gap-4"><div><div className="text-xs text-[#677386]">Baseline</div><div className="mt-1 text-3xl font-extrabold">{baseline}</div></div><div><div className="text-xs text-[#677386]">Latest</div><div className="mt-1 text-3xl font-extrabold">{latest}</div></div></div><div className="mt-5 flex items-center gap-2 border-t border-[#e2e5e8] pt-4 text-sm font-bold text-[#4f7a66]"><TrendingUp size={16}/>+{latest - baseline} points</div></> : <div className="mt-6 border-y border-[#e2e5e8] py-7 text-center"><div className="text-sm font-bold">No score recorded</div><p className="mt-1 text-xs text-[#7b8592]">Your teacher can add one later.</p></div>}<p className="mt-3 text-[10px] leading-4 text-[#8a939f]">Official Bluebook Practice Score · entered by your teacher</p></section>
    </div>
  </AppShell>;
}

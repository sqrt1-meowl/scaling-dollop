"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, allSkills, categories, getCategoryForTopic } from "@/lib/curriculum";
import { calculateSkillUnitPercent } from "@/lib/appState";

export function StudentDashboard() {
  const { data, session } = useApp();
  const currentSkill = allSkills.find((item) => ["in_progress", "review"].includes(data.progress[item.id]?.status)) ?? allSkills.find((item) => data.progress[item.id]?.status === "available") ?? allSkills[0];
  const category = getCategoryForTopic(currentSkill.id)!;
  const color = accentColor[category.accent];
  const units = data.drillUnits.filter((item) => item.skillId === currentSkill.id && item.isActive).sort((a, b) => a.order - b.order);
  const currentUnit = units.find((item) => data.unitProgress[item.id]?.status !== "complete");
  const unitProgress = currentUnit ? data.unitProgress[currentUnit.id] : undefined;
  const completedUnits = units.filter((item) => data.unitProgress[item.id]?.status === "complete").length;
  const percent = calculateSkillUnitPercent(currentSkill.id, data);
  const currentLabel = currentUnit ? `${currentUnit.code} — ${currentUnit.name}` : "Complete";
  const nextHref = currentUnit ? `/topic/${currentSkill.id}/unit/${currentUnit.id}` : `/topic/${currentSkill.id}`;
  const nextLabel = (() => {
    if (!currentUnit || !unitProgress) return "Choose another skill";
    if (unitProgress.stage === "examples") return `${currentUnit.code} worked examples`;
    if (unitProgress.easyCompleted < unitProgress.easyTotal) return `Easy · Question ${unitProgress.easyCompleted + 1} of ${unitProgress.easyTotal}`;
    if (unitProgress.mediumCompleted < unitProgress.mediumTotal) return `Medium · Question ${unitProgress.mediumCompleted + 1} of ${unitProgress.mediumTotal}`;
    if (unitProgress.hardCompleted < unitProgress.hardTotal) return `Hard · Question ${unitProgress.hardCompleted + 1} of ${unitProgress.hardTotal}`;
    return "Video lesson";
  })();
  const isNew = data.questionAttempts === 0;
  const scores = data.scores;
  const baseline = scores[0]?.score ?? 0;
  const latest = scores.at(-1)?.score ?? 0;

  return <AppShell role="student" title="Dashboard">
    <div className="mb-8"><p className="label text-[#677386]">SAT Math workbook</p><h2 className="academic-heading mt-2 text-4xl">{isNew ? `Welcome, ${session?.name}.` : `Welcome back, ${session?.name}.`}</h2><p className="mt-2 text-sm text-[#677386]">{isNew ? "Your workbook is ready. Begin with the first Algebra skill when you are ready." : "Continue where you left off. Your progress is measured by mastery, not speed."}</p></div>
    <section className="panel mb-9 grid overflow-hidden md:grid-cols-[1fr_230px]">
      <div className="p-6 md:p-7"><p className="label" style={{ color }}>Current skill</p><div className="mt-4 flex items-start gap-4"><div className="mt-1 grid size-11 shrink-0 place-items-center border border-[#d9dee4] bg-[#f4f6f8] font-serif text-lg" style={{ color }}>{currentSkill.code}</div><div><p className="text-xs font-bold uppercase tracking-[.1em] text-[#677386]">{category.name}</p><h3 className="academic-heading mt-1 text-2xl">{currentSkill.title}</h3><p className="mt-2 text-sm text-[#677386]">{percent}% complete · Current: {currentLabel}</p></div></div><div className="mt-5 progress-track" style={{ "--accent": color } as React.CSSProperties}><div className="progress-fill" style={{ width: `${percent}%` }}/></div></div>
      <div className="flex flex-col justify-between border-t border-[#dfe3e7] bg-[#f7f6f2] p-6 md:border-l md:border-t-0"><div><p className="label text-[#677386]">Next step</p><p className="mt-2 text-sm leading-6 text-[#435064]">{nextLabel}</p></div><Link href={nextHref} className="btn-primary mt-5">{currentUnit && unitProgress?.stage === "examples" ? "Begin section" : "Continue"}<ArrowRight size={16}/></Link></div>
    </section>
    <div className="mb-4 flex items-end justify-between"><div><p className="label text-[#677386]">Curriculum</p><h3 className="academic-heading mt-1 text-2xl">19 official SAT Math skills</h3></div><Link href="/progress" className="text-xs font-bold text-[#416f9d]">View full progress</Link></div>
    <div className="grid gap-3 md:grid-cols-2">{categories.map((domain) => { const done = domain.skills.filter((item) => data.progress[item.id]?.status === "complete").length; const active = domain.skills.find((item) => ["in_progress", "review", "available"].includes(data.progress[item.id]?.status)); const domainColor = accentColor[domain.accent]; return <Link href={`/category/${domain.id}`} key={domain.id} className="panel group p-5 hover:border-[#aeb6c0]" style={{ "--accent": domainColor } as React.CSSProperties}><div className="flex justify-between gap-4"><div><p className="label" style={{ color: domainColor }}>{domain.name}</p><p className="mt-2 text-xs font-semibold text-[#677386]">{domain.weight}% of SAT Math</p></div><span className="text-sm font-extrabold">{done} / {domain.skills.length}</span></div><div className="mt-4 progress-track"><div className="progress-fill" style={{ width: `${done / domain.skills.length * 100}%` }}/></div><div className="mt-4 flex items-center justify-between text-xs"><span className="text-[#677386]">Current: <b className="text-[#435064]">{active?.title ?? "Complete"}</b></span><ArrowRight size={14} className="text-[#9aa2ad] transition group-hover:translate-x-1"/></div></Link>; })}</div>
    <div className="mt-9 grid gap-4 lg:grid-cols-[1fr_300px]">
      <section className="panel"><div className="border-b border-[#e2e5e8] px-5 py-4"><p className="label text-[#677386]">Recent progress</p></div>{isNew ? <div className="px-5 py-10 text-center"><Circle size={18} className="mx-auto text-[#aeb5be]"/><p className="mt-3 text-sm font-bold">No activity yet</p><p className="mt-1 text-xs text-[#7b8592]">Your completed work will appear here.</p></div> : <div className="divide-y divide-[#e8eaec]"><div className="flex items-center gap-3 px-5 py-4"><Circle size={16} className="text-[#aeb5be]"/><span className="flex-1 text-sm font-semibold">{currentSkill.title}</span><span className="text-xs text-[#677386]">{completedUnits}/{units.length} units</span></div>{allSkills.filter((item) => data.progress[item.id]?.status === "complete").slice(-3).map((item) => <div key={item.id} className="flex items-center gap-3 px-5 py-4"><CheckCircle2 size={16} className="text-[#4f7a66]"/><span className="flex-1 text-sm font-semibold">{item.title}</span><span className="text-xs text-[#677386]">Skill cleared</span></div>)}</div>}</section>
      <section className="panel p-5"><p className="label text-[#677386]">Latest SAT score</p>{scores.length ? <><div className="mt-6 grid grid-cols-2 gap-4"><div><div className="text-xs text-[#677386]">Baseline</div><div className="mt-1 text-3xl font-extrabold">{baseline}</div></div><div><div className="text-xs text-[#677386]">Latest</div><div className="mt-1 text-3xl font-extrabold">{latest}</div></div></div><div className="mt-5 flex items-center gap-2 border-t border-[#e2e5e8] pt-4 text-sm font-bold text-[#4f7a66]"><TrendingUp size={16}/>+{latest - baseline} points</div></> : <div className="mt-6 border-y border-[#e2e5e8] py-7 text-center"><div className="text-sm font-bold">No score recorded</div></div>}<p className="mt-3 text-[10px] leading-4 text-[#8a939f]">Official Bluebook Practice Score · entered by your teacher</p></section>
    </div>
  </AppShell>;
}

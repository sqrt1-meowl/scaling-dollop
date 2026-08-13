"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, getCategory } from "@/lib/curriculum";
import { calculateCategoryLearningPercent, calculateTopicLearningPercent, learningLocationLabel } from "@/lib/appState";

export function CategoryOverview() {
  const params = useParams<{ category: string }>();
  const category = getCategory(params.category);
  const { data } = useApp();
  if (!category) return <AppShell role="student"><p>Category not found.</p></AppShell>;
  const color = accentColor[category.accent];
  const percent = calculateCategoryLearningPercent(category.id, data);
  return <AppShell role="student" title={category.name}>
    <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>Dashboard</Link>
    <div className="mb-10 flex flex-col justify-between gap-6 border-b-2 border-[var(--ink)] pb-7 sm:flex-row sm:items-end"><div><p className="label" style={{ color }}>{category.weight}% of SAT Math</p><h2 className="academic-heading mt-3 text-4xl md:text-5xl">{category.name}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Work through each topic at your own pace. Every topic follows the same mastery sequence.</p></div><div className="w-full max-w-[260px]"><div className="mb-2 flex justify-between text-xs font-bold"><span>Category progress</span><span>{percent}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%`, background: color }}/></div></div></div>
    <section className="workbook-card overflow-hidden">{category.skills.map((skill, index) => {
      const progress = data.learningProgress[skill.id];
      const topicPercent = calculateTopicLearningPercent(skill.id, data);
      const status = progress?.mastered ? "Mastered" : topicPercent > 0 || progress?.stage !== (index === 0 ? "concept" : "review") ? "In Progress" : "Not Started";
      return <div key={skill.id} className="grid gap-4 border-b border-[var(--line)] px-5 py-6 last:border-0 sm:grid-cols-[54px_1fr_auto] sm:items-center md:px-7">
        <div className="font-serif text-3xl text-[#9aa2ad]">{index + 1}</div>
        <div><div className="flex flex-wrap items-center gap-3"><h3 className="text-[16px] font-extrabold">{skill.title}</h3>{progress?.mastered && <Check size={15} className="text-[#4f7a66]"/>}</div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs"><span className={`font-bold ${progress?.mastered ? "text-[#4f7a66]" : "text-[var(--muted)]"}`}>{status}</span><span className="text-[var(--muted)]">{progress ? learningLocationLabel(progress) : "Concept"}</span><span className="text-[var(--muted)]">{topicPercent}%</span></div></div>
        <Link href={`/topic/${skill.id}`} className="btn-secondary">{progress?.mastered ? "Review" : topicPercent ? "Continue" : "Begin"}<ArrowRight size={14}/></Link>
      </div>;
    })}</section>
  </AppShell>;
}

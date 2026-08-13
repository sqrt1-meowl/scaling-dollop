"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, allSkills, categories } from "@/lib/curriculum";
import { calculateCategoryLearningPercent, calculateTopicLearningPercent, learningLocationLabel } from "@/lib/appState";

export function ProgressOverview() {
  const { data } = useApp();
  const mastered = allSkills.filter((skill) => data.learningProgress[skill.id]?.mastered).length;
  const overallPercent = Math.round(mastered / allSkills.length * 100);

  return (
    <AppShell role="student" title="My Progress">
      <div className="mb-10 max-w-2xl">
        <p className="label text-[var(--muted)]">Mastery record</p>
        <h2 className="academic-heading mt-3 text-4xl md:text-5xl">Your work, page by page.</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">A topic is mastered after all Easy and Medium sets plus the Hard Challenge are cleared.</p>
      </div>

      <section className="workbook-card mb-7 p-7">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><p className="label text-[var(--muted)]">Overall mastery</p><p className="mt-3 font-serif text-5xl">{mastered}<span className="text-2xl text-[#9aa2ad]"> / {allSkills.length}</span></p></div>
          <div className="w-full max-w-md">
            <div className="mb-2 flex justify-between text-xs font-bold"><span>Topics mastered</span><span>{overallPercent}%</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${overallPercent}%` }}/></div>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        {categories.map((category) => {
          const color = accentColor[category.accent];
          return (
            <section className="workbook-card overflow-hidden" key={category.id}>
              <header className="flex items-center justify-between border-b border-[var(--line)] bg-[#f7f4ed] px-6 py-5">
                <div><p className="label" style={{ color }}>Category</p><h3 className="academic-heading mt-2 text-2xl">{category.name}</h3></div>
                <b className="text-sm">{calculateCategoryLearningPercent(category.id, data)}%</b>
              </header>
              <div className="divide-y divide-[var(--line)]">
                {category.skills.map((skill) => {
                  const progress = data.learningProgress[skill.id];
                  const percent = calculateTopicLearningPercent(skill.id, data);
                  return (
                    <div className="grid gap-3 px-6 py-4 sm:grid-cols-[1fr_auto] sm:items-center" key={skill.id}>
                      <div className="flex items-center gap-3">
                        {progress?.mastered ? <Check size={15} className="text-[#4f7a66]"/> : <span className="size-3 rounded-full border border-[#b7b1a6]"/>}
                        <div><p className="text-sm font-bold">{skill.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{progress ? learningLocationLabel(progress) : "Concept"} · {percent}%</p></div>
                      </div>
                      <Link className="inline-flex items-center gap-2 text-xs font-bold" href={`/topic/${skill.id}`}>{progress?.mastered ? "Review" : "Continue"}<ArrowRight size={13}/></Link>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

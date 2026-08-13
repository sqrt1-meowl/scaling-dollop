"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, categories } from "@/lib/curriculum";
import { calculateCategoryLearningPercent, calculateTopicLearningPercent, learningLocationLabel } from "@/lib/appState";

export function StudentDashboard() {
  const { data, session } = useApp();

  return (
    <AppShell role="student" title="Dashboard">
      <div className="mb-10 max-w-2xl">
        <p className="label text-[var(--muted)]">SAT Math workbook</p>
        <h2 className="academic-heading mt-3 text-4xl md:text-5xl">Welcome back, {session?.name}.</h2>
        <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">Choose a category and continue from your last page.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {categories.map((category, index) => {
          const color = accentColor[category.accent];
          const current = category.skills.find((skill) => !data.learningProgress[skill.id]?.mastered) ?? category.skills.at(-1)!;
          const categoryPercent = calculateCategoryLearningPercent(category.id, data);
          const topicProgress = data.learningProgress[current.id];

          return (
            <section className="workbook-card relative overflow-hidden p-7 md:min-h-[282px] md:p-8" key={category.id} style={{ "--accent": color } as React.CSSProperties}>
              <div className="absolute right-7 top-6 font-serif text-5xl opacity-10">0{index + 1}</div>
              <p className="label" style={{ color }}>SAT Math category</p>
              <h3 className="academic-heading mt-4 max-w-md text-3xl leading-tight">{category.name}</h3>
              <div className="mt-9">
                <div className="mb-2 flex justify-between text-xs font-bold">
                  <span>{categoryPercent}% complete</span>
                  <span className="text-[var(--muted)]">{category.skills.length} topics</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${categoryPercent}%` }}/></div>
              </div>
              <div className="mt-6 flex items-end justify-between gap-5 border-t border-[var(--line)] pt-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">Current topic</p>
                  <p className="mt-1 text-sm font-extrabold">{current.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{topicProgress ? learningLocationLabel(topicProgress) : "Concept"} · {calculateTopicLearningPercent(current.id, data)}%</p>
                </div>
                <Link className="btn-primary shrink-0" href={`/topic/${current.id}`}>Continue<ArrowRight size={15}/></Link>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

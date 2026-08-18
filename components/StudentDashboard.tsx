"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { categoryIncludesStrand, masteryCategories } from "@/lib/masteryCategories";
import type { SpineLevelRow } from "@/lib/masteryDb";
import { masteryLevels, masterySkills, worksheetIdFor } from "@/lib/masterySpine";
import { desmosStorageKey, emptyDesmosProgress, type DesmosProgress } from "@/lib/desmos";

const skillNames = new Map(masterySkills.map((skill) => [skill.code, skill.name]));
const initialLevels: SpineLevelRow[] = masteryLevels.map((level, index) => ({
  id: level.id, code: level.code, name: level.name, strandCode: level.strandCode,
  skillCode: level.skillCode, skillName: skillNames.get(level.skillCode) ?? level.skillCode,
  sequenceIndex: level.sequenceIndex, tier: level.tier, timeStandardSeconds: level.timeStandardSeconds,
  accuracyThreshold: level.accuracyThreshold, videoUrl: level.videoUrl,
  state: index === 0 ? "current" : "locked",
}));

export function StudentDashboard() {
  const { session } = useApp();
  const [levels, setLevels] = useState<SpineLevelRow[]>(initialLevels);
  const [desmosProgress, setDesmosProgress] = useState<DesmosProgress>(emptyDesmosProgress);

  useEffect(() => {
    fetch("/api/mastery/spine", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ levels: SpineLevelRow[] }> : Promise.reject())
      .then((payload) => setLevels(payload.levels))
      .catch(() => undefined);
    const saved = window.localStorage.getItem(desmosStorageKey(session?.email));
    if (saved) setDesmosProgress({ ...emptyDesmosProgress(), ...JSON.parse(saved) });
  }, [session?.email]);

  const categoryRows = useMemo(() => masteryCategories.map((category) => {
    const categoryLevels = levels.filter((level) => categoryIncludesStrand(category, level.strandCode));
    const mastered = categoryLevels.filter((level) => level.state === "mastered").length;
    const active = categoryLevels.find((level) => level.state === "current");
    const next = active ?? categoryLevels.find((level) => level.state !== "mastered") ?? categoryLevels.at(-1)!;
    return { category, categoryLevels, mastered, active, next, percent: Math.round(mastered / categoryLevels.length * 100) };
  }), [levels]);

  return <AppShell role="student" title="Dashboard">
    <div className="mb-10 max-w-3xl">
      <p className="label text-[var(--muted)]">SAT Math workbook</p>
      <h2 className="academic-heading mt-3 text-4xl md:text-5xl">Welcome back, {session?.name}.</h2>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      {categoryRows.map(({ category, categoryLevels, mastered, active, next, percent }, index) => <section
        className={`workbook-card relative overflow-hidden p-7 md:min-h-[248px] md:p-8 ${category.id === "foundations-skills" ? "md:col-span-2" : ""}`}
        key={category.id}
        style={{ "--accent": category.color } as React.CSSProperties}
      >
        <div className="absolute right-7 top-6 font-serif text-5xl opacity-10">0{index + 1}</div>
        <p className="label" style={{ color: category.color }}>{category.id === "foundations-skills" ? "Core readiness" : "College Board domain"}</p>
        <h3 className="academic-heading mt-4 max-w-xl text-3xl leading-tight">{category.name}</h3>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-bold">
            <span>{percent}% complete</span>
            <span className="text-[var(--muted)]">{mastered} / {categoryLevels.length} levels</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }}/></div>
        </div>
        <div className="mt-6 flex flex-col items-start justify-between gap-5 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">{active ? "Current level" : "Start"}</p>
            <p className="mt-1 text-sm font-extrabold">{next.code} — {next.name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {active && <Link className="btn-primary" href={`/worksheet/${worksheetIdFor(active.code, 1)}`}>Continue<ArrowRight size={15}/></Link>}
            <Link className={active ? "btn-secondary" : "btn-primary"} href={`/category/${category.id}`}>View levels<ArrowRight size={15}/></Link>
          </div>
        </div>
      </section>)}
    </div>

    <section className="desmos-dashboard-band mt-5">
      <div className="grid size-12 place-items-center border border-[#77bdb3]/40 bg-[#77bdb3]/10 text-[#77bdb3]"><Calculator size={22}/></div>
      <div className="min-w-0 flex-1">
        <p className="label text-[#77bdb3]">Foundations & Skills</p>
        <h3 className="academic-heading mt-2 text-3xl text-white">Desmos Grind</h3>
      </div>
      <div className="min-w-[150px]">
        <div className="mb-2 flex justify-between text-xs font-bold text-white"><span>Best score</span><span>{desmosProgress.bestScore} / 5</span></div>
        <div className="h-1 bg-white/15"><div className="h-full bg-[#77bdb3]" style={{ width: `${desmosProgress.bestScore / 5 * 100}%` }}/></div>
      </div>
      <Link className="btn-primary shrink-0 border-[#77bdb3]! bg-[#77bdb3]! text-[#10233f]!" href="/desmos">{desmosProgress.complete ? "Practice again" : "Start grind"}<ArrowRight size={15}/></Link>
    </section>
  </AppShell>;
}

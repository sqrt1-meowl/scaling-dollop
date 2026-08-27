"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flame, LockKeyhole, MapPin } from "lucide-react";
import { AppShell } from "./AppShell";
import { categoryIncludesStrand, getMasteryCategory } from "@/lib/masteryCategories";
import type { SpineLevelRow } from "@/lib/masteryDb";
import { masteryLevels, masterySkills, worksheetIdFor } from "@/lib/masterySpine";

const previewLevelCodes = new Set(["A1a", "A1b"]);
const applyPreviewAccess = (levels: SpineLevelRow[]) => levels.map((level) => previewLevelCodes.has(level.code) && level.state === "locked" ? { ...level, state: "current" as const } : level);
const skillNames = new Map(masterySkills.map((skill) => [skill.code, skill.name]));
const initialLevels: SpineLevelRow[] = masteryLevels.map((level, index) => ({
  id: level.id, code: level.code, name: level.name, strandCode: level.strandCode,
  skillCode: level.skillCode, skillName: skillNames.get(level.skillCode) ?? level.skillCode,
  sequenceIndex: level.sequenceIndex, tier: level.tier, timeStandardSeconds: level.timeStandardSeconds,
  accuracyThreshold: level.accuracyThreshold, videoUrl: level.videoUrl,
  state: previewLevelCodes.has(level.code) || index === 0 ? "current" : "locked",
}));

function stateLabel(level: SpineLevelRow) {
  return level.state === "mastered" ? "Complete" : level.state === "current" ? (previewLevelCodes.has(level.code) ? "Started" : "Current") : "Not started";
}

export function CategoryOverview() {
  const params = useParams<{ category: string }>();
  const category = getMasteryCategory(params.category);
  const [levels, setLevels] = useState<SpineLevelRow[]>(initialLevels);

  useEffect(() => {
    fetch("/api/mastery/spine", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ levels: SpineLevelRow[] }> : Promise.reject())
      .then((payload) => setLevels(applyPreviewAccess(payload.levels)))
      .catch(() => undefined);
  }, []);

  const visible = useMemo(() => category ? levels.filter((level) => categoryIncludesStrand(category, level.strandCode)) : [], [category, levels]);
  const skillGroups = useMemo(() => masterySkills
    .filter((skill) => visible.some((level) => level.skillCode === skill.code))
    .map((skill) => ({ skill, levels: visible.filter((level) => level.skillCode === skill.code) })), [visible]);

  if (!category) return <AppShell role="student"><p>Category not found.</p></AppShell>;
  const mastered = visible.filter((level) => level.state === "mastered").length;
  const hardPracticeCount = skillGroups.length;
  const totalLevels = visible.length + hardPracticeCount;
  const percent = totalLevels ? Math.round(mastered / totalLevels * 100) : 0;

  return <AppShell role="student" title={category.name}>
    <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>Dashboard</Link>
    <div className="mb-9 flex flex-col justify-between gap-6 border-b-2 border-[var(--ink)] pb-7 sm:flex-row sm:items-end">
      <div>
        <p className="label" style={{ color: category.color }}>{category.id === "foundations-skills" ? "Core readiness" : "College Board domain"}</p>
        <h2 className="academic-heading mt-3 text-4xl md:text-5xl">{category.name}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{category.description}</p>
      </div>
      <div className="w-full max-w-[260px]">
        <div className="mb-2 flex justify-between text-xs font-bold"><span>Category progress</span><span>{mastered} / {totalLevels}</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%`, background: category.color }}/></div>
      </div>
    </div>

    <div className="grid gap-6">
      {skillGroups.map(({ skill, levels: skillLevels }) => {
        const skillMastered = skillLevels.filter((level) => level.state === "mastered").length;
        return <section className="workbook-card overflow-hidden" key={skill.code}>
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] bg-[#f7f4ed] px-5 py-5 md:px-7">
            <div><p className="label" style={{ color: category.color }}>{skill.code}</p><h3 className="academic-heading mt-2 text-2xl">{skill.name}</h3></div>
            <p className="text-xs font-bold text-[var(--muted)]">{skillMastered} / {skillLevels.length + 1} levels complete</p>
          </header>
          <div>{skillLevels.map((level) => {
            const Icon = level.state === "mastered" ? Check : level.state === "current" ? MapPin : LockKeyhole;
            return <div key={level.id} className={`category-level-row ${level.state}`}>
              <div className={`category-node ${level.state}`}><Icon size={15}/></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><b className="font-mono text-sm">{level.code}</b>{level.tier === "EXT" && <span className="status-pill">Extension</span>}</div>
                <p className="mt-1 text-sm leading-5">{level.name}</p>
              </div>
              <span className={`category-state ${level.state}`}>{stateLabel(level)}</span>
              {level.state === "current" && <Link className="btn-primary" href={`/worksheet/${worksheetIdFor(level.code, 1)}`}>Continue<ArrowRight size={14}/></Link>}
            </div>;
          })}
            <div className="category-level-row locked">
              <div className="category-node locked"><Flame size={15}/></div>
              <div className="min-w-0 flex-1"><b className="font-mono text-sm">{skill.code}H</b><p className="mt-1 text-sm leading-5">Hard question practice</p></div>
              <span className="category-state locked">Not started</span>
            </div>
          </div>
        </section>;
      })}
    </div>
  </AppShell>;
}

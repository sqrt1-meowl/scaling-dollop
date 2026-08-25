"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Circle } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { getProgramDomain } from "@/lib/programCurriculum";
import { loadProgramProgress, makeProgramProgress, packetMasteryPercent, type ProgramProgress } from "@/lib/programProgress";

const colors: Record<string, string> = { algebra: "#416f9d", "advanced-math": "#755e8f", "problem-solving-data-analysis": "#4f7a66", "geometry-trigonometry": "#a1623c", "optional-foundations": "#2f766d", "test-readiness": "#9b6a39" };

export function ProgramCategoryOverview() {
  const params = useParams<{ category: string }>();
  const { session } = useApp();
  const domain = getProgramDomain(params.category);
  const [progress, setProgress] = useState<ProgramProgress>(makeProgramProgress);

  useEffect(() => setProgress(loadProgramProgress(session?.email)), [session?.email]);

  const domainPercent = useMemo(() => domain ? packetMasteryPercent(progress, domain.skillPackets.flatMap((skill) => skill.units.map((unit) => unit.id))) : 0, [domain, progress]);
  if (!domain) return <AppShell role="student"><p>Category not found.</p></AppShell>;
  const accent = colors[domain.id];
  const statusLabel = domain.officialStatus === "official" ? "College Board domain" : domain.officialStatus === "optional_foundation" ? "Optional Foundation" : "Test Readiness";

  return (
    <AppShell role="student" title={domain.title}>
      <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>Dashboard</Link>
      <div className="mb-9 flex flex-col justify-between gap-6 border-b-2 border-[var(--ink)] pb-7 sm:flex-row sm:items-end">
        <div><p className="label" style={{ color: accent }}>{statusLabel}</p><h2 className="academic-heading mt-3 text-4xl md:text-5xl">{domain.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{domain.description}</p></div>
        <div className="w-full max-w-[260px]"><div className="mb-2 flex justify-between text-xs font-bold"><span>Domain progress</span><span>{domainPercent}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${domainPercent}%`, background: accent }}/></div></div>
      </div>

      <div className="grid gap-5">
        {domain.skillPackets.map((skill) => {
          const percent = packetMasteryPercent(progress, skill.units.map((unit) => unit.id));
          const reviewDue = skill.units.reduce((sum, unit) => sum + (progress.units[unit.id]?.missedQuestionIds.length ?? 0), 0);
          return (
            <section className="workbook-card p-6 md:p-7" key={skill.id}>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 gap-4">
                  <div className="grid size-10 shrink-0 place-items-center border border-[var(--line)] bg-white font-mono text-sm font-bold" style={{ color: accent }}>{skill.id}</div>
                  <div><p className="label text-[var(--muted)]">{domain.officialStatus === "official" ? "Official skill packet" : statusLabel}</p><h3 className="academic-heading mt-2 text-2xl">{skill.officialName}</h3><p className="mt-2 text-xs font-semibold text-[var(--muted)]">{skill.units.length} units · {reviewDue} missed questions due</p></div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right"><div className="flex items-center justify-end gap-2 text-xs font-bold">{percent === 100 ? <Check size={14}/> : <Circle size={12}/>} {percent}%</div><p className="mt-1 text-[10px] uppercase tracking-[.1em] text-[var(--muted)]">Packet mastery</p></div>
                  <Link className="btn-primary" href={`/packet/${skill.id.toLowerCase()}`}>Open packet<ArrowRight size={14}/></Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}


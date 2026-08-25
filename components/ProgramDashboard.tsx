"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { officialDomains, supportDomains } from "@/lib/programCurriculum";
import { loadProgramProgress, makeProgramProgress, packetMasteryPercent, type ProgramProgress } from "@/lib/programProgress";
import { desmosStorageKey, emptyDesmosProgress, type DesmosProgress } from "@/lib/desmos";

const colors: Record<string, string> = {
  algebra: "#416f9d",
  "advanced-math": "#755e8f",
  "problem-solving-data-analysis": "#4f7a66",
  "geometry-trigonometry": "#a1623c",
  "optional-foundations": "#2f766d",
  "test-readiness": "#9b6a39",
};

export function ProgramDashboard() {
  const { session } = useApp();
  const [progress, setProgress] = useState<ProgramProgress>(makeProgramProgress);
  const [desmosProgress, setDesmosProgress] = useState<DesmosProgress>(emptyDesmosProgress);

  useEffect(() => {
    setProgress(loadProgramProgress(session?.email));
    const saved = window.localStorage.getItem(desmosStorageKey(session?.email));
    if (saved) setDesmosProgress({ ...emptyDesmosProgress(), ...JSON.parse(saved) });
  }, [session?.email]);

  const rows = useMemo(() => officialDomains.map((domain) => {
    const unitIds = domain.skillPackets.flatMap((skill) => skill.units.map((unit) => unit.id));
    return { domain, percent: packetMasteryPercent(progress, unitIds) };
  }), [progress]);

  return (
    <AppShell role="student" title="Dashboard">
      <div className="mb-10 max-w-3xl">
        <p className="label text-[var(--muted)]">SAT Math workbook</p>
        <h2 className="academic-heading mt-3 text-4xl md:text-5xl">Welcome back, {session?.name}.</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rows.map(({ domain, percent }, index) => (
          <section className="workbook-card relative min-h-[220px] overflow-hidden p-7 md:p-8" key={domain.id} style={{ "--accent": colors[domain.id] } as React.CSSProperties}>
            <div className="absolute right-7 top-6 font-serif text-5xl opacity-10">0{index + 1}</div>
            <p className="label" style={{ color: colors[domain.id] }}>College Board domain</p>
            <h3 className="academic-heading mt-4 max-w-xl text-3xl leading-tight">{domain.title}</h3>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-bold"><span>{percent}% complete</span><span className="text-[var(--muted)]">{domain.skillPackets.length} skill packets</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }}/></div>
            </div>
            <div className="mt-6 flex justify-end border-t border-[var(--line)] pt-5">
              <Link className="btn-primary" href={`/category/${domain.id}`}>View skills<ArrowRight size={15}/></Link>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {supportDomains.map((domain) => {
          const unitIds = domain.skillPackets.flatMap((skill) => skill.units.map((unit) => unit.id));
          const percent = packetMasteryPercent(progress, unitIds);
          return (
            <section className="workbook-card p-7 md:p-8" key={domain.id} style={{ "--accent": colors[domain.id] } as React.CSSProperties}>
              <p className="label" style={{ color: colors[domain.id] }}>{domain.officialStatus === "optional_foundation" ? "Optional Foundation" : "Test Readiness"}</p>
              <h3 className="academic-heading mt-3 text-3xl">{domain.title}</h3>
              <div className="mt-6 flex items-center justify-between gap-5 border-t border-[var(--line)] pt-5">
                <span className="text-xs font-bold">{percent}% complete</span>
                <Link className="btn-secondary" href={`/category/${domain.id}`}>View skills<ArrowRight size={15}/></Link>
              </div>
            </section>
          );
        })}
      </div>

      <section className="desmos-dashboard-band mt-5">
        <div className="grid size-12 place-items-center border border-[#77bdb3]/40 bg-[#77bdb3]/10 text-[#77bdb3]"><Calculator size={22}/></div>
        <div className="min-w-0 flex-1"><p className="label text-[#77bdb3]">Calculator fluency</p><h3 className="academic-heading mt-2 text-3xl text-white">Desmos Grind</h3></div>
        <div className="min-w-[150px]"><div className="mb-2 flex justify-between text-xs font-bold text-white"><span>Best score</span><span>{desmosProgress.bestScore} / 5</span></div><div className="h-1 bg-white/15"><div className="h-full bg-[#77bdb3]" style={{ width: `${desmosProgress.bestScore / 5 * 100}%` }}/></div></div>
        <Link className="btn-primary shrink-0 border-[#77bdb3]! bg-[#77bdb3]! text-[#10233f]!" href="/desmos">{desmosProgress.complete ? "Practice again" : "Start grind"}<ArrowRight size={15}/></Link>
      </section>
    </AppShell>
  );
}


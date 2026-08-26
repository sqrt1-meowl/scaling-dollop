"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, Check, Circle, Flame, Video, VideoOff } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { getProgramDomainForSkill, getProgramSkill, type ProgramStage } from "@/lib/programCurriculum";
import { loadProgramProgress, makeProgramProgress, packetMasteryPercent, unitMasteryPercent, type ProgramProgress } from "@/lib/programProgress";

const stageNames: Array<[ProgramStage, string]> = [["learn", "Learn"], ["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"], ["review", "Review"]];

export function SkillPacketOverview() {
  const params = useParams<{ skillId: string }>();
  const { session } = useApp();
  const skill = getProgramSkill(params.skillId);
  const domain = getProgramDomainForSkill(params.skillId);
  const [progress, setProgress] = useState<ProgramProgress>(makeProgramProgress);
  useEffect(() => setProgress(loadProgramProgress(session?.email)), [session?.email]);

  const percent = useMemo(() => skill ? packetMasteryPercent(progress, skill.units.map((unit) => unit.id)) : 0, [progress, skill]);
  if (!skill || !domain) return <AppShell role="student"><p>Skill packet not found.</p></AppShell>;
  const nonOfficial = domain.officialStatus !== "official";
  const hardQuestionCount = skill.units.reduce((sum, unit) => sum + unit.questions.filter((question) => question.difficulty === "hard").length, 0);

  return (
    <AppShell role="student" title={`${skill.id} · ${skill.officialName}`}>
      <Link href={`/category/${domain.id}`} className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>{domain.title}</Link>
      <div className="mb-8 border-b-2 border-[var(--ink)] pb-7">
        <p className="label text-[var(--muted)]">{skill.id === "A1" ? "Unlocked preview" : nonOfficial ? (domain.officialStatus === "optional_foundation" ? "Optional Foundation" : "Test Readiness") : "Official skill packet"}</p>
        <h2 className="academic-heading mt-3 text-4xl">{skill.id}: {skill.officialName}</h2>
        <div className="mt-5 flex max-w-sm items-center gap-4"><div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${percent}%` }}/></div><b className="text-xs">{percent}% mastered</b></div>
      </div>

      <div className="space-y-5">
        {skill.units.map((unit) => {
          const record = progress.units[unit.id];
          const mastery = unitMasteryPercent(record);
          const missed = record?.missedQuestionIds.length ?? 0;
          return (
            <section className="workbook-card overflow-hidden" key={unit.id}>
              <div className="p-6 md:p-7">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div className="max-w-3xl"><p className="label text-[var(--muted)]">Unit {unit.displayOrder}</p><h3 className="academic-heading mt-2 text-2xl">{unit.id}: {unit.title}</h3><div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]"><span className="inline-flex items-center gap-1.5"><Bot size={13}/>AI partner available</span><span className="inline-flex items-center gap-1.5">{unit.videoUrl ? <Video size={13}/> : <VideoOff size={13}/>} {unit.videoUrl ? "Video available" : "Video coming soon"}</span><span>{missed} missed</span>{record?.reviewDue && <span className="font-bold text-[#9b6a39]">Review due</span>}</div></div>
                  <div className="flex shrink-0 items-center gap-4"><div className="text-right"><b className="text-sm">{mastery}%</b><p className="mt-1 text-[10px] uppercase tracking-[.1em] text-[var(--muted)]">{record?.state?.replaceAll("_", " ") ?? "not started"}</p></div><Link className="btn-primary" href={`/packet/${skill.id.toLowerCase()}/unit/${unit.id.toLowerCase()}`}>Open unit<ArrowRight size={14}/></Link></div>
                </div>
              </div>
              <div className="grid grid-cols-5 border-t border-[var(--line)] bg-[#f7f4ed]">
                {stageNames.map(([stage, label]) => {
                  const done = ["mastered", "skipped_by_placement"].includes(record?.stageStates[stage] ?? "");
                  return <div className="flex items-center justify-center gap-1 border-r border-[var(--line)] px-2 py-3 text-[10px] font-bold uppercase tracking-[.08em] last:border-r-0" key={stage}>{done ? <Check size={12}/> : <Circle size={10}/>} {label}</div>;
                })}
              </div>
            </section>
          );
        })}
        <section className="overflow-hidden border-2 border-[#a1623c] bg-[#fffaf5]">
          <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-center md:p-7">
            <div className="flex max-w-3xl gap-4"><div className="grid size-10 shrink-0 place-items-center border border-[#d8b49c] bg-white text-[#a1623c]"><Flame size={18}/></div><div><p className="label text-[#a1623c]">Packet finale</p><h3 className="academic-heading mt-2 text-2xl">{skill.id} Hard Practice</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">A mixed hard set covering the full skill packet. It always appears after the units.</p></div></div>
            <div className="flex shrink-0 items-center gap-4"><p className="text-right text-xs font-bold text-[var(--muted)]">{hardQuestionCount ? `${hardQuestionCount} questions` : "Bank coming soon"}</p><Link className="btn-primary" href={`/packet/${skill.id.toLowerCase()}/hard-practice`}>{hardQuestionCount ? "Start hard practice" : "View finale"}<ArrowRight size={14}/></Link></div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}


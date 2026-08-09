"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, getCategory, type TopicStatus } from "@/lib/curriculum";
import { calculateSkillUnitPercent } from "@/lib/appState";

const labels: Record<TopicStatus, string> = { complete: "Complete", in_progress: "In Progress", available: "Not Started", locked: "Locked", review: "Review Required" };

export function CategoryOverview() {
  const params = useParams<{ category: string }>();
  const category = getCategory(params.category);
  const { data } = useApp();
  if (!category) return <AppShell role="student"><p>Domain not found.</p></AppShell>;

  const color = accentColor[category.accent];
  const complete = category.skills.filter((item) => data.progress[item.id]?.status === "complete").length;

  return <AppShell role="student" title={category.name}>
    <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[#677386]"><ArrowLeft size={14}/>Dashboard</Link>
    <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#dfe3e7] pb-7 sm:flex-row sm:items-end">
      <div><p className="label" style={{ color }}>{category.weight}% of SAT Math</p><h2 className="academic-heading mt-2 text-4xl">{category.name}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#677386]">Official SAT skills stay uncluttered here. Open a skill to work through its focused drill units.</p></div>
      <div className="min-w-48"><div className="mb-2 flex justify-between text-xs"><span className="text-[#677386]">Skills cleared</span><b>{complete} / {category.skills.length}</b></div><div className="progress-track" style={{ "--accent": color } as React.CSSProperties}><div className="progress-fill" style={{ width: `${complete / category.skills.length * 100}%` }}/></div></div>
    </div>
    <section className="panel overflow-hidden">{category.skills.map((skill) => {
      const progress = data.progress[skill.id];
      const status = progress?.status === "locked" || !progress ? "available" : progress.status;
      const units = data.drillUnits.filter((item) => item.skillId === skill.id && item.isActive);
      const current = units.find((item) => ["available", "in_progress"].includes(data.unitProgress[item.id]?.status));
      const percent = calculateSkillUnitPercent(skill.id, data);
      const currentLabel = current ? `${current.code} — ${current.name}` : "Complete";
      return <div key={skill.id} className="grid gap-4 border-b border-[#e4e7e9] bg-white p-5 last:border-0 sm:grid-cols-[56px_1fr_auto] sm:items-center">
        <div className="font-serif text-2xl text-[#a0a7b0]">{skill.code}</div>
        <div><h3 className="text-[15px] font-extrabold text-[#10233f]">{skill.title}</h3><div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold" style={{ color: status === "complete" ? "#4f7a66" : color }}>{status === "complete" && <Check size={14}/>} {labels[status]}<span className="font-normal text-[#677386]">{percent}% · Current: {currentLabel}</span></div></div>
        <Link href={`/topic/${skill.id}`} className="btn-secondary">{status === "complete" ? "Review" : status === "available" ? "Begin" : "Continue"}<ArrowRight size={14}/></Link>
      </div>;
    })}</section>
    <p className="mt-5 text-xs leading-5 text-[#7b8592]">Every skill and drill unit is open for practice.</p>
  </AppShell>;
}

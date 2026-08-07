"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, getCategory, type TopicStatus } from "@/lib/curriculum";

const statusLabel: Record<TopicStatus, string> = { complete: "Complete", in_progress: "In Progress", available: "Not Started", locked: "Locked", review: "Review Required" };

export function CategoryOverview() {
  const params = useParams<{ category: string }>();
  const category = getCategory(params.category);
  const { data } = useApp();
  if (!category) return <AppShell role="student"><p>Category not found.</p></AppShell>;
  const color = accentColor[category.accent];
  const complete = category.topics.filter((topic) => data.progress[topic.id]?.status === "complete").length;
  return <AppShell role="student" title={category.name}>
    <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[#677386] hover:text-[#10233f]"><ArrowLeft size={14}/>Dashboard</Link>
    <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#dfe3e7] pb-7 sm:flex-row sm:items-end">
      <div><p className="label" style={{ color }}>{category.weight}% of SAT Math</p><h2 className="academic-heading mt-2 text-4xl">{category.name}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#677386]">Work through the sequence in order. Your teacher can unlock a topic when you need a different starting point.</p></div>
      <div className="min-w-48"><div className="mb-2 flex justify-between text-xs"><span className="text-[#677386]">Topics cleared</span><b>{complete} / {category.topics.length}</b></div><div className="progress-track" style={{ "--accent": color } as React.CSSProperties}><div className="progress-fill" style={{ width: `${(complete / category.topics.length) * 100}%` }}/></div></div>
    </div>
    <section className="panel overflow-hidden">
      {category.topics.map((topic, index) => { const progress = data.progress[topic.id]; const status = progress?.status ?? "locked"; const blocked = status === "locked"; return <div key={topic.id} className={`grid gap-4 border-b border-[#e4e7e9] p-5 last:border-0 sm:grid-cols-[56px_1fr_auto] sm:items-center ${blocked ? "bg-[#fbfbfa]" : "bg-white"}`}>
        <div className="font-serif text-2xl text-[#a0a7b0]">{String(index + 1).padStart(2, "0")}</div><div><div className="flex flex-wrap items-center gap-3"><h3 className={`text-[15px] font-extrabold ${blocked ? "text-[#7d8794]" : "text-[#10233f]"}`}>{topic.title}</h3>{topic.subtitle && <span className="text-xs text-[#8a939f]">{topic.subtitle}</span>}</div><div className="mt-2 flex items-center gap-2 text-xs font-bold" style={{ color: status === "complete" ? "#4f7a66" : blocked ? "#8a939f" : color }}>{status === "complete" && <Check size={14}/>} {blocked && <LockKeyhole size={13}/>} {statusLabel[status]}</div></div>
        {blocked ? <span className="text-xs text-[#9aa2ad]">Complete the prior topic</span> : <Link href={`/topic/${topic.id}`} className="btn-secondary">{status === "complete" ? "Review" : status === "in_progress" || status === "review" ? "Continue" : "Begin"}<ArrowRight size={14}/></Link>}
      </div>; })}
    </section>
    <p className="mt-5 text-xs leading-5 text-[#7b8592]">No pacing comparison is shown. Students advance when each topic is cleared.</p>
  </AppShell>;
}

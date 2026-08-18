"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Circle, LockKeyhole, MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import type { SpineLevelRow } from "@/lib/masteryDb";
import { worksheetIdFor } from "@/lib/masterySpine";

const tabs = [
  { id: "A", label: "Algebra", strands: ["A"] },
  { id: "M", label: "Advanced Math", strands: ["M"] },
  { id: "D", label: "Problem-Solving and Data Analysis", strands: ["D"] },
  { id: "G", label: "Geometry and Trigonometry", strands: ["G"] },
  { id: "FOUNDATIONS", label: "Foundations & Skills", strands: ["F", "S", "P", "X"] },
] as const;

function stateLabel(state: SpineLevelRow["state"]) {
  return state === "mastered" ? "Mastered" : state === "current" ? "Current" : "Locked";
}

export function SpineView({ initialLevels }: { initialLevels: SpineLevelRow[] }) {
  const [levels, setLevels] = useState(initialLevels);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("FOUNDATIONS");
  const [databaseState, setDatabaseState] = useState<"loading" | "connected" | "fallback">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/mastery/spine", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Spine request failed");
        return response.json() as Promise<{ levels: SpineLevelRow[] }>;
      })
      .then((payload) => { if (active) { setLevels(payload.levels); setDatabaseState("connected"); } })
      .catch(() => { if (active) setDatabaseState("fallback"); });
    return () => { active = false; };
  }, []);

  const tab = tabs.find((item) => item.id === activeTab)!;
  const visible = useMemo(() => levels.filter((level) => (tab.strands as readonly string[]).includes(level.strandCode)), [levels, tab.strands]);
  const mastered = levels.filter((level) => level.state === "mastered").length;
  const current = levels.find((level) => level.state === "current") ?? levels[0];

  return <AppShell role="student" title="My Spine">
    <section className="spine-hero">
      <div>
        <p className="label text-[#d6b36a]">One path · 210 levels</p>
        <h2 className="academic-heading mt-3 text-4xl text-white md:text-5xl">Your SAT Math spine.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">Every level has five focused worksheets. Clear accuracy and time together, then move one step forward.</p>
      </div>
      <div className="spine-score">
        <b>{mastered}</b><span>of 210 mastered</span>
        <div className="mt-4 h-1.5 overflow-hidden bg-white/15"><div className="h-full bg-[#d6b36a]" style={{ width: `${Math.round(mastered / 2.1)}%` }}/></div>
      </div>
    </section>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
      <p>Current: <b className="text-[var(--ink)]">{current.code} — {current.name}</b></p>
      <p aria-live="polite">{databaseState === "connected" ? "Progress synced" : databaseState === "loading" ? "Syncing progress…" : "Showing seeded preview"}</p>
    </div>

    <nav className="spine-tabs mt-8" aria-label="SAT Math domains">
      {tabs.map((item) => <button key={item.id} type="button" aria-pressed={activeTab === item.id} onClick={() => setActiveTab(item.id)} className={activeTab === item.id ? "active" : ""}>{item.label}</button>)}
    </nav>

    <div className="mt-6 grid gap-3">
      {visible.map((level, index) => {
        const previous = visible[index - 1];
        const startsSkill = !previous || previous.skillCode !== level.skillCode;
        const Icon = level.state === "mastered" ? Check : level.state === "current" ? MapPin : LockKeyhole;
        const content = <>
          <div className={`spine-node ${level.state}`}><Icon size={15}/></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <b className="font-mono text-sm">{level.code}</b>
              <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">#{level.sequenceIndex}</span>
              {level.tier === "EXT" && <span className="status-pill">Extension</span>}
            </div>
            <p className="mt-1 text-sm leading-5">{level.name}</p>
          </div>
          <span className={`spine-state ${level.state}`}>{stateLabel(level.state)}</span>
          {level.state === "current" && <ChevronRight size={17}/>} 
        </>;
        return <div key={level.id}>
          {startsSkill && <div className="spine-skill-heading"><Circle size={8} fill="currentColor"/><span>{level.skillCode}</span>{level.skillName}</div>}
          {level.state === "current"
            ? <Link className="spine-level current" href={`/worksheet/${worksheetIdFor(level.code, 1)}`}>{content}</Link>
            : <div className={`spine-level ${level.state}`}>{content}</div>}
        </div>;
      })}
    </div>
  </AppShell>;
}

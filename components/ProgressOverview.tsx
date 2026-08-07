"use client";

import { BarChart3, ClipboardCheck, Target } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "./AppShell";
import { useApp } from "./AppProvider";
import { accentColor, allTopics, categories } from "@/lib/curriculum";

export function ProgressOverview() {
  const { data } = useApp();
  const cleared = allTopics.filter((topic) => data.progress[topic.id]?.status === "complete").length;
  const chart = data.scores.map((record) => ({ ...record, label: new Date(`${record.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }));
  return <AppShell role="student" title="Progress">
    <div className="mb-8"><p className="label text-[#677386]">Progress overview</p><h2 className="academic-heading mt-2 text-4xl">Your work, clearly measured.</h2><p className="mt-2 text-sm text-[#677386]">Progress reflects completed practice and cleared topic gates.</p></div>
    <section className="panel mb-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-[#677386]">Overall</p>
          <div className="mt-2 text-4xl font-extrabold">{cleared} <span className="text-xl font-semibold text-[#8a939f]">/ {allTopics.length} topics cleared</span></div>
        </div>
        <div className="w-full max-w-md">
          <div className="progress-track" style={{ "--accent": "#17365f" } as React.CSSProperties}>
            <div className="progress-fill" style={{ width: `${(cleared / allTopics.length) * 100}%` }}/>
          </div>
        </div>
      </div>
    </section>
    <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <section className="panel">
        <div className="border-b border-[#e2e5e8] p-5"><p className="label text-[#677386]">Category progress</p></div>
        <div className="divide-y divide-[#e8eaec]">
          {categories.map((category) => {
            const count = category.topics.filter((topic) => data.progress[topic.id]?.status === "complete").length;
            const color = accentColor[category.accent];
            return <div className="p-5" key={category.id}>
              <div className="mb-3 flex justify-between gap-4 text-sm"><span className="font-bold">{category.name}</span><span className="text-[#677386]">{count}/{category.topics.length}</span></div>
              <div className="progress-track" style={{ "--accent": color } as React.CSSProperties}><div className="progress-fill" style={{ width: `${(count / category.topics.length) * 100}%` }}/></div>
            </div>;
          })}
        </div>
      </section>
      <section className="grid grid-cols-2 gap-3">
        {[{ label: "Questions completed", value: data.questionAttempts, icon: ClipboardCheck }, { label: "Easy accuracy", value: "93%", icon: Target }, { label: "Medium accuracy", value: "81%", icon: Target }, { label: "Gate accuracy", value: "76%", icon: BarChart3 }].map(({ label, value, icon: Icon }) => <div className="panel p-5" key={label}><Icon size={17} className="text-[#677386]"/><div className="mt-5 text-2xl font-extrabold">{value}</div><div className="mt-1 text-[11px] leading-4 text-[#677386]">{label}</div></div>)}
        <div className="panel col-span-2 p-5"><p className="label text-[#677386]">Common error type</p><div className="mt-3 text-2xl font-extrabold">Procedure</div><p className="mt-1 text-xs text-[#677386]">Assigned from your recent misses</p></div>
      </section>
    </div>
    <section className="panel mt-6 p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="label text-[#677386]">Official Bluebook Practice Score</p><h3 className="academic-heading mt-2 text-2xl">Score history</h3></div><p className="max-w-xs text-right text-[11px] leading-4 text-[#7c8693]">Recorded by your teacher. This is not a generated or predicted score.</p></div><div className="mt-6 h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}><CartesianGrid stroke="#e6e8ea" vertical={false}/><XAxis dataKey="label" tick={{ fontSize: 11, fill: "#677386" }} axisLine={{ stroke: "#cfd4da" }}/><YAxis domain={[400, 800]} tick={{ fontSize: 11, fill: "#677386" }} axisLine={false} tickLine={false}/><Tooltip/><Line type="monotone" dataKey="score" stroke="#17365f" strokeWidth={2} dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}/></LineChart></ResponsiveContainer></div></section>
  </AppShell>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { useApp } from "@/components/AppProvider";

const steps = ["Review", "Learn", "Practice", "Master"];

export default function HomePage() {
  const { login, session, ready } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && session) router.replace(session.role === "admin" ? "/admin" : "/dashboard");
  }, [ready, router, session]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) return setError(result.message ?? "Unable to sign in.");
    router.push(result.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center bg-[var(--ink)] text-white"><BookOpen size={18}/></div>
            <div><div className="text-[15px] font-extrabold tracking-tight">SAT Math Mastery</div><div className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">Digital workbook</div></div>
          </div>
          <div className="hidden text-xs font-medium text-[var(--muted)] sm:block">19 skills · 4 SAT domains</div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-70px)] max-w-[1120px] items-center gap-14 px-6 py-14 md:grid-cols-[1.08fr_.92fr]">
        <section className="max-w-[620px]">
          <p className="label mb-5 text-[#416f9d]">A focused SAT Math system</p>
          <h1 className="academic-heading max-w-[600px] text-[clamp(44px,6vw,70px)] leading-[1.02] text-[var(--ink)]">A workbook that remembers where you left off.</h1>
          <p className="mt-7 max-w-[570px] text-[17px] leading-7 text-[var(--muted)]">Move through every official skill with one clear sequence, short mastery sets, and explanations that appear when you need them.</p>
          <div className="mt-10 grid max-w-[590px] grid-cols-2 border border-[var(--line)] bg-white sm:grid-cols-4">
            {steps.map((step, index) => <div className="border-b border-r border-[var(--line)] p-4 last:border-r-0 sm:border-b-0" key={step}><span className="font-serif text-xl text-[#9b6a39]">0{index + 1}</span><p className="mt-2 text-xs font-extrabold">{step}</p></div>)}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]"><Check size={14} className="text-[#4f7a66]"/>Progress persists automatically after every question.</p>
        </section>

        <section className="panel p-7 shadow-[0_12px_40px_rgba(16,35,63,.07)] md:p-9">
          <p className="label text-[var(--muted)]">Student & teacher access</p>
          <h2 className="academic-heading mt-2 text-3xl">Open your workbook</h2>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label className="block text-sm font-bold">Email<input className="field mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email"/></label>
            <label className="block text-sm font-bold">Password<input className="field mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password"/></label>
            {error && <p className="border-l-2 border-[#a1623c] pl-3 text-sm text-[#8b3d2c]">{error}</p>}
            <button className="btn-primary w-full" type="submit">Sign in<ArrowRight size={16}/></button>
          </form>
          <div className="mt-7 border-t border-[var(--line)] pt-5">
            <p className="label mb-3 text-[#8a939f]">Demo accounts</p>
            <div className="space-y-2 text-xs text-[var(--muted)]">
              <button className="flex w-full justify-between border border-[var(--line)] bg-[#fafaf8] px-3 py-2 text-left" onClick={() => { setEmail("student@example.com"); setPassword("demo123"); }}><span><b>Student</b> · student@example.com</span><span>demo123</span></button>
              <button className="flex w-full justify-between border border-[#cfd9e4] bg-[#f2f5f8] px-3 py-2 text-left" onClick={() => { setEmail("newstudent@example.com"); setPassword("demo123"); }}><span><b>New student</b> · no progress</span><span>demo123</span></button>
              <button className="flex w-full justify-between border border-[var(--line)] bg-[#fafaf8] px-3 py-2 text-left" onClick={() => { setEmail("admin@example.com"); setPassword("demo123"); }}><span><b>Admin</b> · admin@example.com</span><span>demo123</span></button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

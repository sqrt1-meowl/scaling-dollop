"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, GraduationCap } from "lucide-react";
import { useApp } from "@/components/AppProvider";

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
    <main className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-[#dfe3e7] bg-white">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center bg-[#17365f] text-white"><BookOpen size={18}/></div><div><div className="text-[15px] font-extrabold tracking-tight">SAT Math Drill</div><div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#677386]">Self-paced mastery</div></div></div>
          <div className="text-xs font-medium text-[#677386]">19 skills · 4 SAT domains</div>
        </div>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-70px)] max-w-[1120px] items-center gap-16 px-6 py-14 md:grid-cols-[1.1fr_.9fr]">
        <section className="max-w-[610px]">
          <p className="label mb-5 text-[#416f9d]">Structured SAT Math Practice</p>
          <h1 className="academic-heading max-w-[580px] text-[clamp(42px,6vw,68px)] leading-[1.02] text-[#10233f]">Build fluency. Then learn to think through the hard ones.</h1>
          <p className="mt-7 max-w-[560px] text-[17px] leading-7 text-[#566273]">A focused program that separates independent Easy and Medium practice from teacher-led Hard question strategy.</p>
          <div className="mt-10 grid max-w-[570px] gap-px border border-[#dfe3e7] bg-[#dfe3e7] sm:grid-cols-2">
            <div className="bg-white p-5"><div className="mb-3 flex items-center gap-2 text-sm font-extrabold"><Check size={16} className="text-[#416f9d]"/> Drill</div><p className="text-sm leading-6 text-[#677386]">Focused drill units with a concept, worked example, configurable Easy and Medium practice, then one skill gate.</p></div>
            <div className="bg-white p-5"><div className="mb-3 flex items-center gap-2 text-sm font-extrabold"><GraduationCap size={17} className="text-[#a1623c]"/> Live Challenge</div><p className="text-sm leading-6 text-[#677386]">A separate hard-question lesson for recognition, strategy, traps, and reasoning.</p></div>
          </div>
        </section>
        <section className="panel p-7 shadow-[0_10px_35px_rgba(16,35,63,.06)] md:p-9">
          <p className="label text-[#677386]">Student & teacher access</p>
          <h2 className="academic-heading mt-2 text-3xl">Sign in to continue</h2>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label className="block text-sm font-bold">Email<input className="field mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"/></label>
            <label className="block text-sm font-bold">Password<input className="field mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"/></label>
            {error && <p className="border-l-2 border-[#a1623c] pl-3 text-sm text-[#8b3d2c]">{error}</p>}
            <button className="btn-primary w-full" type="submit">Sign in <ArrowRight size={16}/></button>
          </form>
          <div className="mt-7 border-t border-[#e3e6e9] pt-5">
            <p className="label mb-3 text-[#8a939f]">Demo accounts</p>
            <div className="space-y-2 text-xs text-[#566273]">
              <button className="flex w-full justify-between border border-[#e1e4e7] bg-[#fafaf8] px-3 py-2 text-left hover:border-[#aeb6c0]" onClick={() => { setEmail("student@example.com"); setPassword("demo123"); }}><span><b>Student</b> · student@example.com</span><span>demo123</span></button>
              <button className="flex w-full justify-between border border-[#cfd9e4] bg-[#f2f5f8] px-3 py-2 text-left hover:border-[#8da2b8]" onClick={() => { setEmail("newstudent@example.com"); setPassword("demo123"); }}><span><b>New student</b> · no progress</span><span>demo123</span></button>
              <button className="flex w-full justify-between border border-[#e1e4e7] bg-[#fafaf8] px-3 py-2 text-left hover:border-[#aeb6c0]" onClick={() => { setEmail("admin@example.com"); setPassword("demo123"); }}><span><b>Admin</b> · admin@example.com</span><span>demo123</span></button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

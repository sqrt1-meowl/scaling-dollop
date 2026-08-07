"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, ClipboardList, Flame, LayoutDashboard, LogOut, Settings2, Users, Video, Gauge, FileQuestion, UserRound } from "lucide-react";
import { RoleGuard, useApp } from "./AppProvider";

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/warmup", label: "Warm-Up", icon: Gauge },
  { href: "/category/algebra", label: "Drills", icon: BookOpen }, { href: "/progress", label: "Progress", icon: BarChart3 },
];
const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard }, { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/curriculum", label: "Curriculum", icon: ClipboardList }, { href: "/admin/questions", label: "Questions", icon: FileQuestion },
  { href: "/admin/challenges", label: "Live Challenges", icon: Video }, { href: "/admin/scores", label: "Scores", icon: BarChart3 },
];

export function AppShell({ role, children, title }: { role: "student" | "admin"; children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useApp();
  const nav = role === "admin" ? adminNav : studentNav;
  return (
    <RoleGuard role={role}>
      <div className="min-h-screen bg-[#fafaf8] md:grid md:grid-cols-[210px_1fr]">
        <aside className="border-b border-[#dfe3e7] bg-[#10233f] text-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
          <div className="flex h-[70px] items-center gap-3 border-b border-white/10 px-5"><div className="grid size-8 place-items-center border border-white/30"><BookOpen size={16}/></div><div><div className="text-sm font-extrabold">SAT Math Drill</div><div className="text-[9px] font-bold uppercase tracking-[.15em] text-white/55">{role === "admin" ? "Teacher desk" : "Student workbook"}</div></div></div>
          <nav className="mobile-scroll flex gap-1 px-3 py-3 md:flex-col md:py-5">
            {nav.map((item) => { const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)); const Icon = item.icon; return <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 border-l-2 px-3 py-2.5 text-[13px] font-semibold transition ${active ? "border-white bg-white/10 text-white" : "border-transparent text-white/65 hover:bg-white/5 hover:text-white"}`}><Icon size={16}/>{item.label}</Link>; })}
          </nav>
          <div className="hidden flex-1 md:block"/>
          <div className="hidden border-t border-white/10 p-3 md:block">
            <div className="mb-2 flex items-center gap-3 px-3 py-2"><UserRound size={16} className="text-white/60"/><div><div className="text-xs font-bold">{session?.name}</div><div className="text-[10px] text-white/45">{session?.email}</div></div></div>
            <button onClick={() => { logout(); router.push("/"); }} className="flex w-full items-center gap-3 px-3 py-2 text-xs font-semibold text-white/60 hover:text-white"><LogOut size={15}/>Sign out</button>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="flex h-[70px] items-center justify-between border-b border-[#dfe3e7] bg-white px-5 md:px-8"><h1 className="text-sm font-extrabold">{title ?? (role === "admin" ? "Teacher administration" : "Student workspace")}</h1><div className="flex items-center gap-2 text-xs text-[#677386]"><span className="size-2 rounded-full bg-[#4f7a66]"/>Local demo is saving</div></header>
          <main className="mx-auto max-w-[1180px] p-5 md:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}

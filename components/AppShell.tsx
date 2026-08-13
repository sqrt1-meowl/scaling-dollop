"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, ClipboardList, FileQuestion, LayoutDashboard, LogOut, Users, Video } from "lucide-react";
import { RoleGuard, useApp } from "./AppProvider";

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/progress", label: "My Progress", icon: BarChart3 },
];
const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/curriculum", label: "Curriculum", icon: ClipboardList },
  { href: "/admin/questions", label: "Questions", icon: FileQuestion },
  { href: "/admin/challenges", label: "Walkthroughs", icon: Video },
];

export function AppShell({ role, children, title }: { role: "student" | "admin"; children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useApp();
  const nav = role === "admin" ? adminNav : studentNav;
  return <RoleGuard role={role}>
    <div className="min-h-screen bg-[var(--paper)] md:grid md:grid-cols-[224px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[var(--ink)] text-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0">
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5"><div className="grid size-9 place-items-center border border-white/25"><BookOpen size={17}/></div><div><div className="font-serif text-[17px] font-bold">SAT Math Mastery</div><div className="text-[9px] font-bold uppercase tracking-[.18em] text-white/50">{role === "admin" ? "Tutor workspace" : "Digital workbook"}</div></div></div>
        <nav className="mobile-scroll flex gap-1 px-3 py-3 md:flex-col md:py-6">{nav.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); const Icon = item.icon; return <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 border-l-2 px-3 py-3 text-[13px] font-semibold ${active ? "border-[#d6b36a] bg-white/10 text-white" : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"}`}><Icon size={16}/>{item.label}</Link>; })}</nav>
        <div className="hidden flex-1 md:block"/>
        <div className="hidden border-t border-white/10 p-4 md:block"><div className="px-2 pb-3"><div className="text-xs font-bold">{session?.name}</div><div className="mt-1 text-[10px] text-white/45">{session?.email}</div></div><button onClick={() => { logout(); router.push("/"); }} className="flex w-full items-center gap-3 px-2 py-2 text-xs font-semibold text-white/55 hover:text-white"><LogOut size={15}/>Sign out</button></div>
      </aside>
      <div className="min-w-0"><header className="flex h-[76px] items-center justify-between border-b border-[var(--line)] bg-[rgba(255,255,255,.78)] px-5 backdrop-blur md:px-9"><h1 className="text-sm font-extrabold">{title ?? (role === "admin" ? "Tutor administration" : "Student workbook")}</h1><span className="font-serif text-sm italic text-[var(--muted)]">Mastery, one set at a time.</span></header><main className="mx-auto max-w-[1180px] p-5 md:p-9 lg:p-12">{children}</main></div>
    </div>
  </RoleGuard>;
}

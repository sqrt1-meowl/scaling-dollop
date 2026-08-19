"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  FileText,
  GraduationCap,
  LayoutGrid,
  Plus,
  Printer,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { allCourses, ayalaCourses, chaffeyCourses, Course, Subject, subjectColors } from "../lib/plannerData";

type Term = "Year-long" | "Semester 1" | "Semester 2" | "Summer";
type Status = "completed" | "current" | "planned";
type PlannerTab = "plan" | "catalog" | "college" | "profile";

type PlanItem = {
  id: string;
  catalogId?: string;
  name: string;
  code: string;
  subject: Subject;
  provider: "Ayala" | "Chaffey" | "Other college";
  grade: number;
  term: Term;
  status: Status;
  duration: "Semester" | "Year-long";
  ag?: string;
  prerequisite?: string;
  units?: number;
  college?: string;
  alternate?: boolean;
};

type GoalProfile = {
  currentGrade: string;
  graduationYear: string;
  direction: string;
  interests: string;
};

const grades = [9, 10, 11, 12];
const STORAGE_KEY = "ayala-four-year-plan-v1";

function fromCatalog(courseId: string, grade: number, status: Status = "planned", term?: Term): PlanItem {
  const course = allCourses.find((item) => item.id === courseId)!;
  return {
    id: `${courseId}-${grade}-${Math.random().toString(36).slice(2, 7)}`,
    catalogId: course.id,
    name: course.name,
    code: course.code,
    subject: course.subject,
    provider: course.provider,
    grade,
    term: term ?? (course.duration === "Year-long" ? "Year-long" : "Semester 1"),
    status,
    duration: course.duration,
    ag: course.ag,
    prerequisite: course.prerequisite,
    units: course.units,
    college: course.provider === "Chaffey" ? "Chaffey College" : undefined,
  };
}

const DEFAULT_PLAN: PlanItem[] = [
  fromCatalog("eng9h", 9, "completed"), fromCatalog("im2h", 9, "completed"), fromCatalog("bioh", 9, "completed"),
  fromCatalog("aphug", 9, "completed"), fromCatalog("span1", 9, "completed"), fromCatalog("pe9", 9, "completed"), fromCatalog("health", 9, "completed", "Semester 1"),
  fromCatalog("eng10h", 10, "current"), fromCatalog("im3h", 10, "current"), fromCatalog("chemh", 10, "current"),
  fromCatalog("worldcp", 10, "current"), fromCatalog("span2", 10, "current"), fromCatalog("pe1012", 10, "current"),
  fromCatalog("eng11ap", 11), fromCatalog("calcab", 11), fromCatalog("apbio", 11), fromCatalog("apush", 11),
  fromCatalog("span3", 11), fromCatalog("cse", 11),
  fromCatalog("eng12ap", 12), fromCatalog("calcbc", 12), fromCatalog("apes", 12), fromCatalog("gov", 12, "planned", "Semester 1"),
  fromCatalog("econ", 12, "planned", "Semester 2"), fromCatalog("art", 12), fromCatalog("apcsp", 12),
];

const statusMeta = {
  completed: { label: "Completed", dot: "bg-emerald-600", className: "bg-emerald-50 text-emerald-800" },
  current: { label: "Current", dot: "bg-amber-500", className: "bg-amber-50 text-amber-800" },
  planned: { label: "Planned", dot: "bg-slate-400", className: "bg-slate-100 text-slate-700" },
};

const subjectAbbrev: Record<Subject, string> = {
  English: "ENG", Math: "MATH", Science: "SCI", "History / Social Science": "HIST",
  "World Language": "LANG", PE: "PE", VPA: "VPA", Elective: "ELEC", "CTE / ROP": "CTE",
  "Dual Enrollment / College": "COLL",
};

function nextStatus(status: Status): Status {
  return status === "planned" ? "current" : status === "current" ? "completed" : "planned";
}

function uniquePlanItems(items: PlanItem[]) {
  return items.filter((item) => !item.alternate);
}

export default function AyalaPlanner() {
  const [tab, setTab] = useState<PlannerTab>("plan");
  const [items, setItems] = useState<PlanItem[]>(DEFAULT_PLAN);
  const [notes, setNotes] = useState<Record<number, string>>({ 9: "Completed Health in fall.", 10: "Ask about summer options.", 11: "", 12: "Consider Chaffey course in summer." });
  const [profile, setProfile] = useState<GoalProfile>({ currentGrade: "10", graduationYear: "2029", direction: "4-year university", interests: "Engineering, design, computer science" });
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerGrade, setDrawerGrade] = useState(9);
  const [drawerTerm, setDrawerTerm] = useState<Term>("Year-long");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [levelFilter, setLevelFilter] = useState("All levels");
  const [providerFilter, setProviderFilter] = useState("All providers");
  const [toast, setToast] = useState("");
  const [manual, setManual] = useState({ college: "", code: "", title: "", term: "Summer" as Term, units: "3", grade: "11", notes: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.profile) setProfile(parsed.profile);
      }
    } catch {
      // Keep the carefully seeded plan if local browser data is malformed.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, notes, profile }));
  }, [items, notes, profile, loaded]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allCourses.filter((course) => {
      const matchesQuery = !query || `${course.name} ${course.code} ${course.subject}`.toLowerCase().includes(query);
      const matchesSubject = subjectFilter === "All subjects" || course.subject === subjectFilter;
      const matchesLevel = levelFilter === "All levels" || course.level === levelFilter;
      const matchesProvider = providerFilter === "All providers" || course.provider === providerFilter;
      return matchesQuery && matchesSubject && matchesLevel && matchesProvider;
    });
  }, [search, subjectFilter, levelFilter, providerFilter]);

  const requirementData = useMemo(() => {
    const counted = uniquePlanItems(items);
    const credits = (predicate: (item: PlanItem) => boolean, completedOnly = false) => counted
      .filter((item) => predicate(item) && (!completedOnly || item.status === "completed"))
      .reduce((total, item) => total + (item.duration === "Year-long" ? 10 : 5), 0);
    const total = credits((item) => item.provider === "Ayala");
    const completedTotal = credits((item) => item.provider === "Ayala", true);
    const school = [
      ["English", credits((i) => i.subject === "English"), credits((i) => i.subject === "English", true), 40],
      ["Math", credits((i) => i.subject === "Math"), credits((i) => i.subject === "Math", true), 30],
      ["Science", credits((i) => i.subject === "Science"), credits((i) => i.subject === "Science", true), 20],
      ["Social Science", credits((i) => i.subject === "History / Social Science"), credits((i) => i.subject === "History / Social Science", true), 30],
      ["PE", credits((i) => i.subject === "PE"), credits((i) => i.subject === "PE", true), 20],
      ["Health", credits((i) => i.catalogId === "health" || i.name.toLowerCase() === "health"), credits((i) => i.catalogId === "health", true), 5],
      ["VPA / Language / CTE", credits((i) => ["VPA", "World Language", "CTE / ROP"].includes(i.subject)), credits((i) => ["VPA", "World Language", "CTE / ROP"].includes(i.subject), true), 10],
      ["Total credits", total, completedTotal, 225],
    ] as [string, number, number, number][];
    const agTargets: Record<string, number> = { A: 2, B: 4, C: 3, D: 2, E: 2, F: 1, G: 1 };
    const agLabels: Record<string, string> = { A: "History", B: "English", C: "Math", D: "Science", E: "Language", F: "VPA", G: "Elective" };
    const ag = Object.keys(agTargets).map((key) => {
      const planned = counted.filter((i) => i.ag === key).reduce((sum, i) => sum + (i.duration === "Year-long" ? 1 : .5), 0);
      const completed = counted.filter((i) => i.ag === key && i.status === "completed").reduce((sum, i) => sum + (i.duration === "Year-long" ? 1 : .5), 0);
      return { key, label: agLabels[key], planned, completed, target: agTargets[key] };
    });
    return { school, ag, total };
  }, [items]);

  const questions = useMemo(() => {
    const output: string[] = [];
    const prerequisiteCourse = items.find((item) => item.prerequisite && item.status !== "completed");
    if (prerequisiteCourse) output.push(`${prerequisiteCourse.name} has a prerequisite. Have you completed or confirmed it?`);
    if (items.some((item) => item.provider !== "Ayala")) output.push("You added a college course. Confirm whether it applies to the requirement you intend to use it for.");
    if (!items.some((item) => item.ag === "F" && !item.alternate)) output.push("You currently do not have a planned course in A–G category F.");
    const emptyGrade = grades.find((grade) => items.filter((item) => item.grade === grade && !item.alternate).length < 5);
    if (emptyGrade) output.push(`${emptyGrade}th grade has fewer than five primary courses planned. Is something still unresolved?`);
    if (!output.length) output.push("No automatic questions right now. Keep notes for anything you want to confirm with counseling.");
    return output;
  }, [items]);

  function saveNow() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, notes, profile }));
    setToast("Plan saved on this device");
  }

  function openExplorer(grade = 9, provider = "All providers") {
    setDrawerGrade(grade);
    setProviderFilter(provider);
    setSearch("");
    setDrawerOpen(true);
  }

  function addCourse(course: Course, grade = drawerGrade, term = drawerTerm) {
    const normalizedTerm = course.duration === "Year-long" && term !== "Summer" ? "Year-long" : term === "Year-long" ? "Semester 1" : term;
    setItems((current) => [...current, fromCatalog(course.id, grade, "planned", normalizedTerm)]);
    setToast(course.provider === "Chaffey" ? "College course added — applicability may require verification." : `${course.name} added to ${grade}th grade`);
  }

  function updateItem(id: string, patch: Partial<PlanItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    setToast("Course removed");
  }

  function addManualCollege() {
    if (!manual.college.trim() || !manual.code.trim() || !manual.title.trim()) {
      setToast("Add the college, course code, and title first");
      return;
    }
    const item: PlanItem = {
      id: `manual-${Date.now()}`,
      name: manual.title.trim(),
      code: manual.code.trim(),
      subject: "Dual Enrollment / College",
      provider: "Other college",
      college: manual.college.trim(),
      grade: Number(manual.grade),
      term: manual.term,
      status: "planned",
      duration: "Semester",
      units: Number(manual.units) || undefined,
    };
    setItems((current) => [...current, item]);
    setManual({ college: "", code: "", title: "", term: "Summer", units: "3", grade: manual.grade, notes: "" });
    setToast("College course added — school/college applicability may require verification.");
  }

  return (
    <div className="min-h-screen bg-[#f4f6f3] text-[#17231e]">
      <header className="no-print sticky top-0 z-30 border-b border-[#dfe5df] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-5 py-3 lg:px-7">
          <button onClick={() => setTab("plan")} className="flex items-center gap-3 text-left" aria-label="Open four-year plan">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#214f3d] text-white"><GraduationCap size={21} /></span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.17em] text-[#718077]">Ruben S. Ayala High School</span>
              <span className="block text-lg font-extrabold tracking-tight">Ayala 4-Year Planner</span>
            </span>
          </button>
          <nav className="order-3 flex w-full gap-1 rounded-xl bg-[#f3f5f2] p-1 md:order-none md:ml-5 md:w-auto" aria-label="Planner sections">
            {([
              ["plan", "4-Year Plan", LayoutGrid], ["catalog", "Course Catalog", BookOpen],
              ["college", "College Courses", Building2], ["profile", "My Goals", Sparkles],
            ] as const).map(([value, label, Icon]) => (
              <button key={value} onClick={() => setTab(value)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors md:flex-none ${tab === value ? "bg-white text-[#214f3d] shadow-sm" : "text-[#647168] hover:text-[#214f3d]"}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-[#6d796f] sm:flex"><Check size={14} className="text-emerald-600" />Saved locally</span>
            <button onClick={() => window.print()} className="grid h-9 w-9 place-items-center rounded-lg border border-[#dbe1dc] bg-white text-[#46554c] hover:bg-[#f6f8f6]" aria-label="Print four-year plan"><Printer size={17} /></button>
            <button onClick={saveNow} className="rounded-lg bg-[#214f3d] px-4 py-2 text-xs font-bold text-white hover:bg-[#173d2f]">Save plan</button>
          </div>
        </div>
      </header>

      {tab === "plan" && (
        <main className="mx-auto max-w-[1600px] px-4 py-5 lg:px-7">
          <section className="mb-4 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[#dce4dd] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(27,52,39,.04)]">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold text-[#52705f]"><CalendarDays size={15} /> CLASS OF {profile.graduationYear || "—"}</div>
              <h1 className="text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">Your high school, at a glance.</h1>
              <p className="mt-1 max-w-2xl text-sm text-[#66736a]">Build a plan across Ayala, summer, and college courses. Select a status to update progress.</p>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => { setProviderFilter("Chaffey"); setTab("college"); }} className="rounded-xl border border-[#cad7ce] bg-white px-4 py-2.5 text-sm font-bold text-[#2c5a46] hover:bg-[#f4f8f5]">+ College course</button>
              <button onClick={() => openExplorer(9)} className="flex items-center gap-2 rounded-xl bg-[#214f3d] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#173d2f]"><Plus size={17} />Add course</button>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_285px]">
            <section className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-4" aria-label="Four-year course plan">
              {grades.map((grade) => {
                const gradeItems = items.filter((item) => item.grade === grade);
                const uniqueCount = new Set(gradeItems.filter((i) => !i.alternate).map((i) => i.id)).size;
                return (
                  <article key={grade} className="flex min-h-[710px] flex-col rounded-2xl border border-[#dce3dd] bg-white shadow-[0_1px_3px_rgba(24,45,34,.05)]">
                    <div className="flex items-center justify-between border-b border-[#e8ece8] px-4 py-3.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7b877f]">Grade {grade}</p>
                        <h2 className="text-xl font-extrabold">{grade}th Grade</h2>
                      </div>
                      <span className="rounded-full bg-[#edf3ee] px-2.5 py-1 text-[11px] font-bold text-[#41604f]">{uniqueCount} courses</span>
                    </div>
                    <div className="flex-1 p-3">
                      {(["Semester 1", "Semester 2", "Summer"] as const).map((term) => {
                        const termItems = gradeItems.filter((item) => item.term === term || (item.term === "Year-long" && term !== "Summer"));
                        return (
                          <div key={term} className="mb-4 last:mb-1">
                            <div className="mb-2 flex items-center justify-between">
                              <h3 className={`text-[10px] font-extrabold uppercase tracking-[.14em] ${term === "Summer" ? "text-[#9a6b2d]" : "text-[#758178]"}`}>{term}</h3>
                              <span className="text-[10px] font-semibold text-[#9aa39d]">{termItems.length} {termItems.length === 1 ? "course" : "courses"}</span>
                            </div>
                            <div className="space-y-2">
                              {termItems.map((item) => <PlanCourseCard key={`${item.id}-${term}`} item={item} onUpdate={updateItem} onRemove={removeItem} />)}
                              {term !== "Semester 2" || !gradeItems.some((item) => item.term === "Year-long") ? (
                                <button onClick={() => { setDrawerTerm(term === "Summer" ? "Summer" : "Semester 1"); openExplorer(grade); }} className="no-print flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#cbd5ce] py-2.5 text-xs font-bold text-[#60776a] hover:border-[#6f9982] hover:bg-[#f5f8f6]"><Plus size={14} /> Add {term === "Summer" ? "summer course" : "course"}</button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-[#e8ece8] bg-[#fafbfa] p-3">
                      <label className="block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#7a867e]" htmlFor={`notes-${grade}`}>Planning notes</label>
                      <textarea id={`notes-${grade}`} value={notes[grade] || ""} onChange={(event) => setNotes((current) => ({ ...current, [grade]: event.target.value }))} placeholder="Summer school? Alternate? Ask counselor…" className="mt-1.5 min-h-14 w-full resize-none rounded-lg border border-[#dfe5df] bg-white p-2 text-xs leading-relaxed placeholder:text-[#a1aaa4]" />
                    </div>
                  </article>
                );
              })}
            </section>
            <RequirementPanel school={requirementData.school} ag={requirementData.ag} />
          </div>

          <QuestionsPanel questions={questions} />
        </main>
      )}

      {tab === "catalog" && (
        <CatalogPage courses={ayalaCourses} items={items} onAdd={addCourse} search={search} setSearch={setSearch} subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter} levelFilter={levelFilter} setLevelFilter={setLevelFilter} />
      )}

      {tab === "college" && (
        <CollegePage courses={chaffeyCourses} items={items} onAdd={addCourse} manual={manual} setManual={setManual} addManual={addManualCollege} />
      )}

      {tab === "profile" && <ProfilePage profile={profile} setProfile={setProfile} onBack={() => setTab("plan")} />}

      {drawerOpen && (
        <CourseDrawer courses={filteredCourses} grade={drawerGrade} setGrade={setDrawerGrade} term={drawerTerm} setTerm={setDrawerTerm} search={search} setSearch={setSearch} subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter} levelFilter={levelFilter} setLevelFilter={setLevelFilter} providerFilter={providerFilter} setProviderFilter={setProviderFilter} onAdd={addCourse} onClose={() => setDrawerOpen(false)} />
      )}

      {toast && <div role="status" className="no-print fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-xl bg-[#17231e] px-4 py-3 text-center text-sm font-semibold text-white shadow-xl">{toast}</div>}
    </div>
  );
}

function PlanCourseCard({ item, onUpdate, onRemove }: { item: PlanItem; onUpdate: (id: string, patch: Partial<PlanItem>) => void; onRemove: (id: string) => void }) {
  return (
    <div className={`group relative rounded-xl border p-2.5 shadow-[0_1px_2px_rgba(30,45,36,.04)] ${item.provider !== "Ayala" ? "border-[#b9cce3] bg-[#f6f9fd]" : item.alternate ? "border-dashed border-[#cbd1cc] bg-[#fafbfa]" : "border-[#dfe4df] bg-white"}`}>
      <div className="absolute inset-y-2 left-0 w-[3px] rounded-r-full" style={{ backgroundColor: subjectColors[item.subject] }} />
      <div className="ml-1.5 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[9px] font-extrabold uppercase tracking-[.11em]" style={{ color: subjectColors[item.subject] }}>{item.provider === "Ayala" ? subjectAbbrev[item.subject] : "COLLEGE"}</span>
            {item.ag && <span className="rounded bg-[#f0f2f0] px-1 py-0.5 text-[9px] font-bold text-[#657168]">A–G {item.ag}</span>}
            {item.alternate && <span className="rounded bg-[#f3eee3] px-1 py-0.5 text-[9px] font-bold text-[#8b672d]">ALT</span>}
          </div>
          <h4 className="mt-0.5 truncate text-[12px] font-extrabold leading-tight" title={item.name}>{item.name}</h4>
          <p className="mt-0.5 truncate text-[10px] text-[#7c877f]">{item.code} · {item.term === "Year-long" ? "Full year" : item.term}{item.units ? ` · ${item.units} units` : ""}</p>
        </div>
        <button onClick={() => onRemove(item.id)} className="no-print grid h-6 w-6 shrink-0 place-items-center rounded-md text-[#9aa39d] opacity-50 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" aria-label={`Remove ${item.name}`}><X size={13} /></button>
      </div>
      <div className="no-print mt-2 ml-1.5 flex items-center gap-1.5">
        <button onClick={() => onUpdate(item.id, { status: nextStatus(item.status) })} className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-extrabold ${statusMeta[item.status].className}`} title="Change status">
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta[item.status].dot}`} />{statusMeta[item.status].label}
        </button>
        <select value={item.grade} onChange={(event) => onUpdate(item.id, { grade: Number(event.target.value) })} className="h-6 rounded-md border border-[#dfe4df] bg-white px-1 text-[9px] font-bold text-[#556159]" aria-label={`Move ${item.name} to another grade`}>
          {grades.map((grade) => <option key={grade} value={grade}>{grade}th</option>)}
        </select>
        <select value={item.term} onChange={(event) => onUpdate(item.id, { term: event.target.value as Term })} className="h-6 max-w-[58px] rounded-md border border-[#dfe4df] bg-white px-1 text-[9px] font-bold text-[#556159]" aria-label={`Change term for ${item.name}`}>
          <option value="Year-long">Year</option><option value="Semester 1">S1</option><option value="Semester 2">S2</option><option value="Summer">Summer</option>
        </select>
        {["Elective", "VPA", "CTE / ROP"].includes(item.subject) && <button onClick={() => onUpdate(item.id, { alternate: !item.alternate })} className="grid h-6 w-6 place-items-center rounded-md border border-[#dfe4df] text-[#69756d] hover:bg-[#f5f7f5]" aria-label={item.alternate ? "Make primary course" : "Mark as alternate course"} title="Primary / alternate"><ArrowLeftRight size={11} /></button>}
      </div>
    </div>
  );
}

type AgRow = { key: string; label: string; planned: number; completed: number; target: number };
function RequirementPanel({ school, ag }: { school: [string, number, number, number][]; ag: AgRow[] }) {
  const rowIcon = (planned: number, completed: number, target: number) => completed >= target ? <CheckCircle2 size={15} className="text-emerald-600" /> : planned >= target ? <CircleDashed size={15} className="text-amber-600" /> : <AlertTriangle size={15} className="text-[#bd693d]" />;
  return (
    <aside className="h-fit rounded-2xl border border-[#dce3dd] bg-white shadow-[0_1px_3px_rgba(24,45,34,.05)] xl:sticky xl:top-24">
      <div className="border-b border-[#e8ece8] px-4 py-3.5">
        <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#315f49]" /><h2 className="font-extrabold">Requirements check</h2></div>
        <p className="mt-1 text-[11px] leading-relaxed text-[#78837b]">Your current plan appears to cover the items marked in progress.</p>
      </div>
      <div className="p-4">
        <h3 className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#748178]">Ayala / CVUSD planning estimate</h3>
        <div className="mt-2 space-y-2.5">
          {school.map(([label, planned, completed, target]) => (
            <div key={label}>
              <div className="flex items-center gap-2 text-xs"><span>{rowIcon(planned, completed, target)}</span><span className="flex-1 font-semibold">{label}</span><span className="font-bold text-[#6b776f]">{planned}/{target}</span></div>
              <div className="mt-1 ml-6 h-1.5 overflow-hidden rounded-full bg-[#edf0ed]"><div className={`h-full rounded-full ${planned >= target ? "bg-[#3f8065]" : "bg-[#c58550]"}`} style={{ width: `${Math.min(100, (planned / target) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="my-4 border-t border-[#e8ece8]" />
        <h3 className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#748178]">UC / CSU A–G</h3>
        <div className="mt-2 space-y-2">
          {ag.map((row) => (
            <div key={row.key} className="flex items-center gap-2 text-xs">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-[#eff3f0] text-[10px] font-extrabold text-[#315f49]">{row.key}</span>
              <span className="flex-1 font-semibold">{row.label}</span>
              <span>{rowIcon(row.planned, row.completed, row.target)}</span>
              <span className="w-8 text-right text-[10px] font-bold text-[#78837b]">{row.planned}/{row.target}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-[#f3f6f3] p-3 text-[10px] leading-relaxed text-[#68746c]">
          <strong className="text-[#3f4d44]">Planning aid only.</strong> Please verify your final plan, credits, course placement, and college applicability with your counselor.
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[9px] font-bold text-[#7d8880]"><span>✅ Completed</span><span>◐ Planned</span><span>⚠ Unresolved</span></div>
      </div>
    </aside>
  );
}

function QuestionsPanel({ questions }: { questions: string[] }) {
  return (
    <section className="mt-5 rounded-2xl border border-[#dce3dd] bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f1eee5] text-[#87662f]"><Sparkles size={18} /></span>
        <div className="flex-1">
          <h2 className="font-extrabold">Questions to Check</h2>
          <p className="mt-0.5 text-xs text-[#748078]">Automatic prompts based on your current plan—use these to prepare for counseling.</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {questions.map((question) => <div key={question} className="flex items-start gap-2 rounded-xl border border-[#e4e8e4] bg-[#fafbfa] p-3 text-xs leading-relaxed"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-[#b66c42]" />{question}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogPage({ courses, items, onAdd, search, setSearch, subjectFilter, setSubjectFilter, levelFilter, setLevelFilter }: { courses: Course[]; items: PlanItem[]; onAdd: (course: Course, grade: number, term: Term) => void; search: string; setSearch: (value: string) => void; subjectFilter: string; setSubjectFilter: (value: string) => void; levelFilter: string; setLevelFilter: (value: string) => void }) {
  const filtered = courses.filter((course) => (!search || `${course.name} ${course.code}`.toLowerCase().includes(search.toLowerCase())) && (subjectFilter === "All subjects" || course.subject === subjectFilter) && (levelFilter === "All levels" || course.level === levelFilter));
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#52705f]">Official 2026–27 materials</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight">Ayala Course Catalog</h1><p className="mt-1 text-sm text-[#68756c]">Search current registration offerings. Availability and placement are not guaranteed.</p></div><a href="https://ayala.chino.k12.ca.us/courseofferings" target="_blank" rel="noreferrer" className="rounded-xl border border-[#cfd8d1] bg-white px-4 py-2 text-xs font-bold text-[#315f49]">View official materials ↗</a></div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#dce3dd] bg-white p-4 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 font-extrabold"><Settings2 size={17} />Filters</div>
          <label className="mt-4 block text-[10px] font-bold uppercase tracking-wide text-[#748078]">Search</label><SearchBox value={search} onChange={setSearch} placeholder="Course or code" />
          <label className="mt-4 block text-[10px] font-bold uppercase tracking-wide text-[#748078]">Subject</label><FilterSelect value={subjectFilter} onChange={setSubjectFilter} options={["All subjects", ...Array.from(new Set(courses.map((c) => c.subject)))]} />
          <label className="mt-4 block text-[10px] font-bold uppercase tracking-wide text-[#748078]">Level</label><FilterSelect value={levelFilter} onChange={setLevelFilter} options={["All levels", "CP", "Honors", "AP", "Standard"]} />
          <button onClick={() => { setSearch(""); setSubjectFilter("All subjects"); setLevelFilter("All levels"); }} className="mt-4 w-full rounded-lg bg-[#f1f4f1] py-2 text-xs font-bold text-[#536159]">Clear filters</button>
        </aside>
        <section>
          <div className="mb-3 flex items-center justify-between text-xs text-[#718077]"><span><strong className="text-[#33453a]">{filtered.length}</strong> courses</span><span>{items.length} items in your plan</span></div>
          <div className="grid gap-3 xl:grid-cols-2">{filtered.map((course) => <CourseResultCard key={course.id} course={course} onAdd={onAdd} />)}</div>
        </section>
      </div>
    </main>
  );
}

function CollegePage({ courses, items, onAdd, manual, setManual, addManual }: { courses: Course[]; items: PlanItem[]; onAdd: (course: Course, grade: number, term: Term) => void; manual: { college: string; code: string; title: string; term: Term; units: string; grade: string; notes: string }; setManual: React.Dispatch<React.SetStateAction<typeof manual>>; addManual: () => void }) {
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-7">
      <section className="rounded-2xl border border-[#cdd9e6] bg-[#f7faff] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#28598b] text-white"><Building2 size={22} /></span><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#5d7693]">Official CVUSD partner pathway</p><h1 className="text-2xl font-extrabold">Chaffey College Dual Enrollment</h1><p className="mt-1 max-w-2xl text-sm text-[#64748a]">Ayala is listed as an eligible High School Partnership school. Sections, prerequisites, and space can change.</p></div></div><a href="https://www.chaffey.edu/dual-enrollment/de-hs-partnership.php" target="_blank" rel="noreferrer" className="rounded-xl border border-[#bbcadb] bg-white px-4 py-2 text-xs font-bold text-[#315d87]">Check current Chaffey options ↗</a></div>
        <div className="mt-5 rounded-xl border border-[#d9e3ee] bg-white p-3 text-xs leading-relaxed text-[#5f6f80]"><strong className="text-[#374b60]">Before you rely on a course:</strong> college enrollment does not automatically establish Ayala graduation, prerequisite, or A–G equivalency. Confirm the intended use with Ayala Counseling and Chaffey.</div>
      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <section><div className="mb-3 flex items-end justify-between"><div><h2 className="text-xl font-extrabold">Current example courses</h2><p className="text-xs text-[#718077]">Seeded from Chaffey’s Summer 2026 HSP list.</p></div><span className="text-xs font-bold text-[#57708c]">{items.filter((i) => i.provider !== "Ayala").length} in plan</span></div><div className="grid gap-3 xl:grid-cols-2">{courses.map((course) => <CourseResultCard key={course.id} course={course} onAdd={onAdd} />)}</div></section>
        <aside className="h-fit rounded-2xl border border-[#dce3dd] bg-white p-5 lg:sticky lg:top-24"><div className="flex items-center gap-2"><FileText size={18} className="text-[#315f49]" /><h2 className="font-extrabold">Add another college course</h2></div><p className="mt-1 text-xs text-[#758178]">For Chaffey HSPFlex or another community college.</p>
          <div className="mt-4 grid gap-3"><TextField label="College" value={manual.college} onChange={(value) => setManual((m) => ({ ...m, college: value }))} placeholder="Mt. SAC" /><div className="grid grid-cols-2 gap-2"><TextField label="Course code" value={manual.code} onChange={(value) => setManual((m) => ({ ...m, code: value }))} placeholder="PSYC 1A" /><TextField label="Units" value={manual.units} onChange={(value) => setManual((m) => ({ ...m, units: value }))} placeholder="3" /></div><TextField label="Course title" value={manual.title} onChange={(value) => setManual((m) => ({ ...m, title: value }))} placeholder="Intro to Psychology" /><div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold uppercase tracking-wide text-[#718077]">Grade</label><FilterSelect value={manual.grade} onChange={(value) => setManual((m) => ({ ...m, grade: value }))} options={grades.map(String)} /></div><div><label className="text-[10px] font-bold uppercase tracking-wide text-[#718077]">Term</label><FilterSelect value={manual.term} onChange={(value) => setManual((m) => ({ ...m, term: value as Term }))} options={["Semester 1", "Semester 2", "Summer"]} /></div></div><TextField label="Notes" value={manual.notes} onChange={(value) => setManual((m) => ({ ...m, notes: value }))} placeholder="Ask about transferability" /><button onClick={addManual} className="mt-1 rounded-xl bg-[#214f3d] py-3 text-sm font-bold text-white">Add college course</button></div>
        </aside>
      </div>
    </main>
  );
}

function ProfilePage({ profile, setProfile, onBack }: { profile: GoalProfile; setProfile: React.Dispatch<React.SetStateAction<GoalProfile>>; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10"><div className="grid overflow-hidden rounded-3xl border border-[#dce3dd] bg-white shadow-sm md:grid-cols-[.8fr_1.2fr]"><div className="bg-[#214f3d] p-8 text-white"><Sparkles size={28} /><h1 className="mt-5 text-3xl font-extrabold tracking-tight">A little context, not a verdict.</h1><p className="mt-3 text-sm leading-relaxed text-[#d5e3db]">These details organize the planner. They do not choose courses or make eligibility decisions for you.</p><div className="mt-8 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed text-[#e4ede8]">Your plan stays in this browser. No account or school-system connection is used.</div></div><div className="p-8"><h2 className="text-xl font-extrabold">Student planning profile</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><div><label className="text-xs font-bold text-[#536159]">Current grade</label><FilterSelect value={profile.currentGrade} onChange={(value) => setProfile((p) => ({ ...p, currentGrade: value }))} options={["8", "9", "10", "11", "12"]} /></div><TextField label="Expected graduation year" value={profile.graduationYear} onChange={(value) => setProfile((p) => ({ ...p, graduationYear: value }))} placeholder="2029" /><div className="sm:col-span-2"><label className="text-xs font-bold text-[#536159]">Post-high-school direction</label><FilterSelect value={profile.direction} onChange={(value) => setProfile((p) => ({ ...p, direction: value }))} options={["4-year university", "community college", "career / CTE", "undecided"]} /></div><div className="sm:col-span-2"><label className="text-xs font-bold text-[#536159]">Optional interests</label><textarea value={profile.interests} onChange={(e) => setProfile((p) => ({ ...p, interests: e.target.value }))} className="mt-1.5 min-h-24 w-full rounded-xl border border-[#dce3dd] p-3 text-sm" placeholder="Engineering, health sciences, arts…" /></div></div><button onClick={onBack} className="mt-6 rounded-xl bg-[#214f3d] px-5 py-3 text-sm font-bold text-white">Return to my plan</button></div></div></main>
  );
}

function CourseDrawer(props: { courses: Course[]; grade: number; setGrade: (value: number) => void; term: Term; setTerm: (value: Term) => void; search: string; setSearch: (value: string) => void; subjectFilter: string; setSubjectFilter: (value: string) => void; levelFilter: string; setLevelFilter: (value: string) => void; providerFilter: string; setProviderFilter: (value: string) => void; onAdd: (course: Course, grade: number, term: Term) => void; onClose: () => void }) {
  return <div className="no-print fixed inset-0 z-40 flex justify-end bg-[#0d1e16]/35" role="dialog" aria-modal="true" aria-label="Add a course"><button className="absolute inset-0" onClick={props.onClose} aria-label="Close course explorer" /><section className="relative z-10 flex h-full w-full max-w-[580px] flex-col bg-[#f7f9f7] shadow-2xl"><header className="border-b border-[#dce3dd] bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#52705f]">Course Explorer</p><h2 className="text-2xl font-extrabold">Add to your plan</h2></div><button onClick={props.onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce3dd] text-[#66736b]" aria-label="Close"><X size={18} /></button></div><div className="mt-4"><SearchBox value={props.search} onChange={props.setSearch} placeholder="Search name, code, or subject" /></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"><FilterSelect value={String(props.grade)} onChange={(v) => props.setGrade(Number(v))} options={grades.map(String)} /><FilterSelect value={props.term} onChange={(v) => props.setTerm(v as Term)} options={["Year-long", "Semester 1", "Semester 2", "Summer"]} /><FilterSelect value={props.providerFilter} onChange={props.setProviderFilter} options={["All providers", "Ayala", "Chaffey"]} /><FilterSelect value={props.levelFilter} onChange={props.setLevelFilter} options={["All levels", "CP", "Honors", "AP", "College", "Standard"]} /></div><div className="mt-2"><FilterSelect value={props.subjectFilter} onChange={props.setSubjectFilter} options={["All subjects", ...Array.from(new Set(allCourses.map((c) => c.subject)))]} /></div></header><div className="flex-1 overflow-y-auto p-4"><p className="mb-3 text-xs font-semibold text-[#718077]">{props.courses.length} matching courses</p><div className="space-y-3">{props.courses.map((course) => <CourseResultCard key={course.id} course={course} onAdd={props.onAdd} fixedGrade={props.grade} fixedTerm={props.term} />)}</div></div></section></div>;
}

function CourseResultCard({ course, onAdd, fixedGrade, fixedTerm }: { course: Course; onAdd: (course: Course, grade: number, term: Term) => void; fixedGrade?: number; fixedTerm?: Term }) {
  const [grade, setGrade] = useState(fixedGrade ?? course.gradeLevels[0] ?? 9);
  const [term, setTerm] = useState<Term>(fixedTerm ?? (course.duration === "Year-long" ? "Year-long" : "Semester 1"));
  useEffect(() => { if (fixedGrade) setGrade(fixedGrade); }, [fixedGrade]);
  useEffect(() => { if (fixedTerm) setTerm(fixedTerm); }, [fixedTerm]);
  return <article className="rounded-2xl border border-[#dce3dd] bg-white p-4 shadow-[0_1px_2px_rgba(25,45,35,.04)]"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold text-white" style={{ backgroundColor: subjectColors[course.subject] }}>{course.provider === "Chaffey" ? "CC" : subjectAbbrev[course.subject].slice(0, 3)}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><h3 className="font-extrabold leading-tight">{course.name}</h3>{course.level !== "Standard" && <span className="rounded-md bg-[#edf1ee] px-1.5 py-0.5 text-[9px] font-extrabold text-[#506057]">{course.level}</span>}</div><p className="mt-1 text-[11px] font-semibold text-[#6f7c73]">{course.code} · {course.subject} · {course.duration}{course.ag ? ` · A–G ${course.ag}` : ""}</p>{course.prerequisite && <p className="mt-2 text-[11px] leading-relaxed text-[#7a6852]"><strong>Prerequisite:</strong> {course.prerequisite}</p>}<div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#7c877f]"><ShieldCheck size={12} className={course.verification === "Confirm with Ayala Counseling" ? "text-amber-600" : "text-emerald-600"} />{course.verification}</div></div></div><div className="mt-3 flex items-center gap-2 border-t border-[#edf0ed] pt-3"><select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="h-9 rounded-lg border border-[#dce3dd] bg-white px-2 text-xs font-bold"><option value={9}>9th</option><option value={10}>10th</option><option value={11}>11th</option><option value={12}>12th</option></select><select value={term} onChange={(e) => setTerm(e.target.value as Term)} className="h-9 min-w-0 flex-1 rounded-lg border border-[#dce3dd] bg-white px-2 text-xs font-bold"><option value="Year-long">Year-long</option><option value="Semester 1">Semester 1</option><option value="Semester 2">Semester 2</option><option value="Summer">Summer</option></select><button onClick={() => onAdd(course, grade, term)} className={`h-9 rounded-lg px-3 text-xs font-extrabold text-white ${course.provider === "Chaffey" ? "bg-[#28598b]" : "bg-[#214f3d]"}`}>Add</button></div></article>;
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <div className="relative mt-1.5"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#839087]" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-xl border border-[#dce3dd] bg-white pl-9 pr-3 text-sm placeholder:text-[#9da7a0]" /></div>; }
function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <div className="relative mt-1.5"><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-[#dce3dd] bg-white px-3 pr-8 text-xs font-bold text-[#4f5f55]">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7c8980]" /></div>; }
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label><span className="text-[10px] font-bold uppercase tracking-wide text-[#718077]">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 h-10 w-full rounded-xl border border-[#dce3dd] bg-white px-3 text-sm placeholder:text-[#a1aaa4]" /></label>; }

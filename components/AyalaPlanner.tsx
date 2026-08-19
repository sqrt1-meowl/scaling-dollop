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
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
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
      <header className="no-print sticky top-0 z-30 border-b border-[#d7ddd8] bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-5 py-2.5 lg:px-7">
          <button onClick={() => setTab("plan")} className="flex items-center gap-3 text-left" aria-label="Open four-year plan">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#214f3d] text-[11px] font-black tracking-tight text-white">A4</span>
            <span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#718077]">Ayala High School</span>
              <span className="block text-base font-bold tracking-tight">4-Year Planner</span>
            </span>
          </button>
          <nav className="order-3 flex w-full gap-5 border-t border-[#edf0ed] pt-2 md:order-none md:ml-6 md:w-auto md:border-0 md:pt-0" aria-label="Planner sections">
            {([
              ["plan", "Plan"], ["catalog", "Catalog"],
              ["college", "College courses"], ["profile", "Student info"],
            ] as const).map(([value, label]) => (
              <button key={value} onClick={() => setTab(value)} className={`flex-1 border-b-2 px-0.5 py-2 text-xs font-semibold md:flex-none ${tab === value ? "border-[#214f3d] text-[#214f3d]" : "border-transparent text-[#68746c] hover:text-[#214f3d]"}`}>
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-[11px] text-[#7a867e] sm:block">Saved on this device</span>
            <button onClick={() => window.print()} className="grid h-8 w-8 place-items-center rounded-md border border-[#dbe1dc] bg-white text-[#46554c] hover:bg-[#f6f8f6]" aria-label="Print four-year plan"><Printer size={15} /></button>
            <button onClick={saveNow} className="rounded-md bg-[#214f3d] px-3 py-2 text-xs font-semibold text-white hover:bg-[#173d2f]">Save</button>
          </div>
        </div>
      </header>

      {tab === "plan" && (
        <main className="mx-auto max-w-4xl px-5 py-8">
          <section>
            <h1 className="text-xl font-bold tracking-tight">Four-year plan</h1>
            <p className="mt-1 text-xs text-[#6d796f]">Choose a grade to view its schedule.</p>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4" aria-label="Choose a grade">
            {grades.map((grade) => {
              const count = items.filter((item) => item.grade === grade && !item.alternate).length;
              const active = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => { setSelectedGrade(active ? null : grade); setShowRequirements(false); setShowQuestions(false); }}
                  aria-expanded={active}
                  className={`min-h-24 border p-4 text-left transition-colors ${active ? "border-[#214f3d] bg-[#214f3d] text-white" : "border-[#d8ded9] bg-white hover:border-[#789182]"}`}
                >
                  <span className="block text-lg font-bold">{grade}th grade</span>
                  <span className={`mt-1 block text-[11px] ${active ? "text-white/70" : "text-[#78837b]"}`}>{count} courses</span>
                </button>
              );
            })}
          </section>

          {selectedGrade !== null && (
            <div className="mt-5">
              <GradeSchedule grade={selectedGrade} items={items} notes={notes[selectedGrade] || ""} onNotesChange={(value) => setNotes((current) => ({ ...current, [selectedGrade]: value }))} onOpenExplorer={openExplorer} onUpdate={updateItem} onRemove={removeItem} />

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button onClick={() => setShowRequirements((value) => !value)} aria-expanded={showRequirements} className="flex items-center justify-between border border-[#d8ded9] bg-white px-4 py-3 text-left text-sm font-semibold hover:border-[#789182]"><span>Requirements</span><span className="text-xs font-normal text-[#718077]">{showRequirements ? "Hide" : "View"}</span></button>
                <button onClick={() => setShowQuestions((value) => !value)} aria-expanded={showQuestions} className="flex items-center justify-between border border-[#d8ded9] bg-white px-4 py-3 text-left text-sm font-semibold hover:border-[#789182]"><span>Counselor review</span><span className="text-xs font-normal text-[#718077]">{showQuestions ? "Hide" : "View"}</span></button>
              </div>
              {showRequirements && <div className="mt-2"><RequirementPanel school={requirementData.school} ag={requirementData.ag} /></div>}
              {showQuestions && <QuestionsPanel questions={questions} />}
            </div>
          )}
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

function GradeSchedule({ grade, items, notes, onNotesChange, onOpenExplorer, onUpdate, onRemove }: { grade: number; items: PlanItem[]; notes: string; onNotesChange: (value: string) => void; onOpenExplorer: (grade: number) => void; onUpdate: (id: string, patch: Partial<PlanItem>) => void; onRemove: (id: string) => void }) {
  const gradeItems = items.filter((item) => item.grade === grade);
  return (
    <section className="border border-[#d8ded9] bg-white" aria-label={`${grade}th grade schedule`}>
      <div className="flex items-center justify-between border-b border-[#e5e9e5] px-4 py-3">
        <h2 className="text-base font-bold">{grade}th grade schedule</h2>
        <button onClick={() => onOpenExplorer(grade)} className="no-print flex items-center gap-1 text-xs font-semibold text-[#214f3d]"><Plus size={13} />Add course</button>
      </div>
      <div className="grid gap-5 p-4 sm:grid-cols-2">
        {(["Year-long", "Semester 1", "Semester 2", "Summer"] as const).map((term) => {
          const termItems = gradeItems.filter((item) => item.term === term);
          if (!termItems.length && term !== "Summer") return null;
          return (
            <div key={term}>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#758178]">{term}</h3>
              <div className="space-y-1.5">
                {termItems.map((item) => <PlanCourseCard key={`${item.id}-${term}`} item={item} onUpdate={onUpdate} onRemove={onRemove} />)}
                {!termItems.length && <p className="text-[11px] text-[#929c95]">No courses</p>}
              </div>
            </div>
          );
        })}
      </div>
      <details className="border-t border-[#e8ece8] bg-[#fafbfa]">
        <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-[#59675e]">Notes</summary>
        <div className="px-4 pb-4">
          <textarea value={notes} onChange={(event) => onNotesChange(event.target.value)} placeholder="Summer, alternate, counselor question…" className="min-h-16 w-full resize-none border border-[#dfe5df] bg-white p-2 text-xs leading-relaxed placeholder:text-[#a1aaa4]" />
        </div>
      </details>
    </section>
  );
}

function PlanCourseCard({ item, onUpdate, onRemove }: { item: PlanItem; onUpdate: (id: string, patch: Partial<PlanItem>) => void; onRemove: (id: string) => void }) {
  return (
    <div className={`group relative rounded-md border px-2 py-2 ${item.provider !== "Ayala" ? "border-[#b9cce3] bg-[#f7f9fc]" : item.alternate ? "border-dashed border-[#cbd1cc] bg-[#fafbfa]" : "border-[#dfe4df] bg-white"}`}>
      <div className="absolute inset-y-1.5 left-0 w-0.5" style={{ backgroundColor: subjectColors[item.subject] }} />
      <div className="ml-1 flex items-start gap-1.5">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[11px] font-bold leading-tight" title={item.name}>{item.name}</h4>
          <p className="mt-0.5 truncate text-[9px] text-[#7c877f]">{item.code} · {item.provider !== "Ayala" ? (item.college || item.provider) : subjectAbbrev[item.subject]}{item.ag ? ` · A–G ${item.ag}` : ""}{item.alternate ? " · Alternate" : ""}</p>
        </div>
        <button onClick={() => onRemove(item.id)} className="no-print grid h-5 w-5 shrink-0 place-items-center text-[#9aa39d] opacity-50 hover:text-red-600 group-hover:opacity-100" aria-label={`Remove ${item.name}`}><X size={11} /></button>
      </div>
      <div className="no-print mt-1.5 ml-1 flex items-center gap-1">
        <button onClick={() => onUpdate(item.id, { status: nextStatus(item.status) })} className="flex min-w-0 flex-1 items-center gap-1 px-0.5 py-0.5 text-left text-[9px] font-semibold text-[#66736b]" title="Change status">
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta[item.status].dot}`} />{statusMeta[item.status].label}
        </button>
        <select value={item.grade} onChange={(event) => onUpdate(item.id, { grade: Number(event.target.value) })} className="h-5 border-0 bg-transparent px-0.5 text-[9px] font-semibold text-[#647168]" aria-label={`Move ${item.name} to another grade`}>
          {grades.map((grade) => <option key={grade} value={grade}>{grade}th</option>)}
        </select>
        <select value={item.term} onChange={(event) => onUpdate(item.id, { term: event.target.value as Term })} className="h-5 max-w-[58px] border-0 bg-transparent px-0.5 text-[9px] font-semibold text-[#647168]" aria-label={`Change term for ${item.name}`}>
          <option value="Year-long">Year</option><option value="Semester 1">S1</option><option value="Semester 2">S2</option><option value="Summer">Summer</option>
        </select>
        {["Elective", "VPA", "CTE / ROP"].includes(item.subject) && <button onClick={() => onUpdate(item.id, { alternate: !item.alternate })} className="grid h-5 w-5 place-items-center text-[#7b867f] hover:text-[#214f3d]" aria-label={item.alternate ? "Make primary course" : "Mark as alternate course"} title="Primary / alternate"><ArrowLeftRight size={10} /></button>}
      </div>
    </div>
  );
}

type AgRow = { key: string; label: string; planned: number; completed: number; target: number };
function RequirementPanel({ school, ag }: { school: [string, number, number, number][]; ag: AgRow[] }) {
  const rowIcon = (planned: number, completed: number, target: number) => completed >= target ? <CheckCircle2 size={15} className="text-emerald-600" /> : planned >= target ? <CircleDashed size={15} className="text-amber-600" /> : <AlertTriangle size={15} className="text-[#bd693d]" />;
  return (
    <aside className="h-fit rounded-lg border border-[#d8ded9] bg-white xl:sticky xl:top-20">
      <div className="border-b border-[#e8ece8] px-3 py-2.5">
        <h2 className="text-sm font-bold">Requirements</h2>
        <p className="mt-0.5 text-[10px] text-[#78837b]">Based on courses currently in the plan.</p>
      </div>
      <div className="p-3">
        <h3 className="text-[9px] font-bold uppercase tracking-[.12em] text-[#748178]">Graduation planning</h3>
        <div className="mt-2 space-y-2">
          {school.map(([label, planned, completed, target]) => (
            <div key={label}>
              <div className="flex items-center gap-2 text-[11px]"><span>{rowIcon(planned, completed, target)}</span><span className="flex-1 font-medium">{label}</span><span className="font-semibold tabular-nums text-[#6b776f]">{planned}/{target}</span></div>
            </div>
          ))}
        </div>
        <div className="my-4 border-t border-[#e8ece8]" />
        <h3 className="text-[9px] font-bold uppercase tracking-[.12em] text-[#748178]">UC / CSU A–G</h3>
        <div className="mt-2 space-y-2">
          {ag.map((row) => (
            <div key={row.key} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-[10px] font-bold text-[#315f49]">{row.key}</span>
              <span className="flex-1 font-medium">{row.label}</span>
              <span>{rowIcon(row.planned, row.completed, row.target)}</span>
              <span className="w-8 text-right text-[10px] font-bold text-[#78837b]">{row.planned}/{row.target}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-[#e8ece8] pt-3 text-[9px] leading-relaxed text-[#68746c]">Planning estimate only. Verify credits, placement, and college applicability with your counselor.</p>
      </div>
    </aside>
  );
}

function QuestionsPanel({ questions }: { questions: string[] }) {
  return (
    <section className="mt-4 rounded-lg border border-[#d8ded9] bg-white p-4">
      <div>
          <h2 className="text-sm font-bold">Review with your counselor</h2>
          <div className="mt-2 grid gap-x-6 gap-y-1.5 md:grid-cols-2">
            {questions.map((question) => <div key={question} className="flex items-start gap-2 text-[11px] leading-relaxed text-[#56635b]"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b66c42]" />{question}</div>)}
          </div>
      </div>
    </section>
  );
}

function CatalogPage({ courses, items, onAdd, search, setSearch, subjectFilter, setSubjectFilter, levelFilter, setLevelFilter }: { courses: Course[]; items: PlanItem[]; onAdd: (course: Course, grade: number, term: Term) => void; search: string; setSearch: (value: string) => void; subjectFilter: string; setSubjectFilter: (value: string) => void; levelFilter: string; setLevelFilter: (value: string) => void }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = courses.filter((course) => (!search || `${course.name} ${course.code}`.toLowerCase().includes(search.toLowerCase())) && (subjectFilter === "All subjects" || course.subject === subjectFilter) && (levelFilter === "All levels" || course.level === levelFilter));
  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-xl font-bold tracking-tight">Ayala course catalog</h1><p className="mt-0.5 text-xs text-[#68756c]">2026–27 registration offerings. Placement and availability may change.</p></div><a href="https://ayala.chino.k12.ca.us/courseofferings" target="_blank" rel="noreferrer" className="border-b border-[#315f49] pb-0.5 text-xs font-semibold text-[#315f49]">Official materials ↗</a></div>
      <div className="mt-5 flex items-end gap-2">
        <div className="min-w-0 flex-1"><SearchBox value={search} onChange={setSearch} placeholder="Search courses" /></div>
        <button onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen} className="h-10 border border-[#dce3dd] bg-white px-4 text-xs font-semibold text-[#536159]">{filtersOpen ? "Hide filters" : "Filters"}</button>
      </div>
      {filtersOpen && <div className="mt-2 grid gap-2 border border-[#dce3dd] bg-white p-3 sm:grid-cols-[1fr_1fr_auto]"><FilterSelect value={subjectFilter} onChange={setSubjectFilter} options={["All subjects", ...Array.from(new Set(courses.map((c) => c.subject)))]} /><FilterSelect value={levelFilter} onChange={setLevelFilter} options={["All levels", "CP", "Honors", "AP", "Standard"]} /><button onClick={() => { setSearch(""); setSubjectFilter("All subjects"); setLevelFilter("All levels"); }} className="h-10 px-3 text-left text-xs font-semibold text-[#536159]">Clear</button></div>}
      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-[#718077]"><span><strong className="text-[#33453a]">{filtered.length}</strong> courses</span><span>{items.length} in your plan</span></div>
        <div className="space-y-2">{filtered.map((course) => <CourseResultCard key={course.id} course={course} onAdd={onAdd} />)}</div>
      </section>
    </main>
  );
}

function CollegePage({ courses, items, onAdd, manual, setManual, addManual }: { courses: Course[]; items: PlanItem[]; onAdd: (course: Course, grade: number, term: Term) => void; manual: { college: string; code: string; title: string; term: Term; units: string; grade: string; notes: string }; setManual: React.Dispatch<React.SetStateAction<typeof manual>>; addManual: () => void }) {
  const [section, setSection] = useState<"browse" | "manual" | null>(null);
  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <section className="border-b border-[#cdd9e6] pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-xl font-bold">Chaffey dual enrollment</h1><p className="mt-0.5 max-w-2xl text-xs text-[#64748a]">Ayala is a Chaffey High School Partnership school. Sections and prerequisites may change.</p></div><a href="https://www.chaffey.edu/dual-enrollment/de-hs-partnership.php" target="_blank" rel="noreferrer" className="border-b border-[#315d87] pb-0.5 text-xs font-semibold text-[#315d87]">Current Chaffey options ↗</a></div>
      </section>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button onClick={() => setSection(section === "browse" ? null : "browse")} className={`min-h-20 border p-4 text-left ${section === "browse" ? "border-[#214f3d] bg-[#214f3d] text-white" : "border-[#d8ded9] bg-white"}`}><span className="block text-sm font-bold">Browse Chaffey courses</span><span className={`mt-1 block text-xs ${section === "browse" ? "text-white/70" : "text-[#718077]"}`}>{courses.length} examples</span></button>
        <button onClick={() => setSection(section === "manual" ? null : "manual")} className={`min-h-20 border p-4 text-left ${section === "manual" ? "border-[#214f3d] bg-[#214f3d] text-white" : "border-[#d8ded9] bg-white"}`}><span className="block text-sm font-bold">Add another college course</span><span className={`mt-1 block text-xs ${section === "manual" ? "text-white/70" : "text-[#718077]"}`}>{items.filter((i) => i.provider !== "Ayala").length} in plan</span></button>
      </div>
      {section === "browse" && <section className="mt-4"><div className="space-y-2">{courses.map((course) => <CourseResultCard key={course.id} course={course} onAdd={onAdd} />)}</div></section>}
      {section === "manual" && <section className="mt-4 border border-[#dce3dd] bg-white p-4"><h2 className="text-sm font-bold">Course information</h2><div className="mt-4 grid gap-3"><TextField label="College" value={manual.college} onChange={(value) => setManual((m) => ({ ...m, college: value }))} placeholder="Mt. SAC" /><div className="grid grid-cols-2 gap-2"><TextField label="Course code" value={manual.code} onChange={(value) => setManual((m) => ({ ...m, code: value }))} placeholder="PSYC 1A" /><TextField label="Units" value={manual.units} onChange={(value) => setManual((m) => ({ ...m, units: value }))} placeholder="3" /></div><TextField label="Course title" value={manual.title} onChange={(value) => setManual((m) => ({ ...m, title: value }))} placeholder="Intro to Psychology" /><div className="grid grid-cols-2 gap-2"><div><label className="text-[10px] font-bold uppercase tracking-wide text-[#718077]">Grade</label><FilterSelect value={manual.grade} onChange={(value) => setManual((m) => ({ ...m, grade: value }))} options={grades.map(String)} /></div><div><label className="text-[10px] font-bold uppercase tracking-wide text-[#718077]">Term</label><FilterSelect value={manual.term} onChange={(value) => setManual((m) => ({ ...m, term: value as Term }))} options={["Semester 1", "Semester 2", "Summer"]} /></div></div><TextField label="Notes" value={manual.notes} onChange={(value) => setManual((m) => ({ ...m, notes: value }))} placeholder="Ask about transferability" /><button onClick={addManual} className="mt-1 bg-[#214f3d] py-3 text-sm font-bold text-white">Add college course</button></div><p className="mt-4 text-[10px] leading-relaxed text-[#718077]">Confirm graduation, prerequisite, and A–G use with Ayala Counseling and the college.</p></section>}
    </main>
  );
}

function ProfilePage({ profile, setProfile, onBack }: { profile: GoalProfile; setProfile: React.Dispatch<React.SetStateAction<GoalProfile>>; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-8"><div className="border border-[#dce3dd] bg-white p-5"><h1 className="text-xl font-bold">Student information</h1><p className="mt-1 text-xs text-[#6d796f]">Saved on this device.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label className="text-xs font-semibold text-[#536159]">Current grade</label><FilterSelect value={profile.currentGrade} onChange={(value) => setProfile((p) => ({ ...p, currentGrade: value }))} options={["8", "9", "10", "11", "12"]} /></div><TextField label="Expected graduation year" value={profile.graduationYear} onChange={(value) => setProfile((p) => ({ ...p, graduationYear: value }))} placeholder="2029" /></div><details className="mt-5 border-t border-[#e5e9e5] pt-4"><summary className="cursor-pointer text-sm font-semibold">Optional planning preferences</summary><div className="mt-4 grid gap-4"><div><label className="text-xs font-semibold text-[#536159]">Post-high-school direction</label><FilterSelect value={profile.direction} onChange={(value) => setProfile((p) => ({ ...p, direction: value }))} options={["4-year university", "community college", "career / CTE", "undecided"]} /></div><div><label className="text-xs font-semibold text-[#536159]">Interests</label><textarea value={profile.interests} onChange={(e) => setProfile((p) => ({ ...p, interests: e.target.value }))} className="mt-1.5 min-h-20 w-full border border-[#dce3dd] p-2.5 text-sm" placeholder="Engineering, health sciences, arts…" /></div></div></details><button onClick={onBack} className="mt-5 bg-[#214f3d] px-4 py-2 text-xs font-semibold text-white">Back to plan</button></div></main>
  );
}

function CourseDrawer(props: { courses: Course[]; grade: number; setGrade: (value: number) => void; term: Term; setTerm: (value: Term) => void; search: string; setSearch: (value: string) => void; subjectFilter: string; setSubjectFilter: (value: string) => void; levelFilter: string; setLevelFilter: (value: string) => void; providerFilter: string; setProviderFilter: (value: string) => void; onAdd: (course: Course, grade: number, term: Term) => void; onClose: () => void }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return <div className="no-print fixed inset-0 z-40 flex justify-end bg-[#0d1e16]/30" role="dialog" aria-modal="true" aria-label="Add a course"><button className="absolute inset-0" onClick={props.onClose} aria-label="Close course explorer" /><section className="relative z-10 flex h-full w-full max-w-[540px] flex-col bg-[#f7f9f7] shadow-2xl"><header className="border-b border-[#dce3dd] bg-white p-4"><div className="flex items-start justify-between"><h2 className="text-lg font-bold">Add course</h2><button onClick={props.onClose} className="grid h-8 w-8 place-items-center text-[#66736b]" aria-label="Close"><X size={17} /></button></div><div className="mt-3 flex items-end gap-2"><div className="min-w-0 flex-1"><SearchBox value={props.search} onChange={props.setSearch} placeholder="Search courses" /></div><button onClick={() => setFiltersOpen((value) => !value)} className="h-10 border border-[#dce3dd] px-3 text-xs font-semibold">{filtersOpen ? "Hide" : "Filters"}</button></div>{filtersOpen && <div className="mt-2 grid grid-cols-2 gap-2"><FilterSelect value={String(props.grade)} onChange={(v) => props.setGrade(Number(v))} options={grades.map(String)} /><FilterSelect value={props.term} onChange={(v) => props.setTerm(v as Term)} options={["Year-long", "Semester 1", "Semester 2", "Summer"]} /><FilterSelect value={props.providerFilter} onChange={props.setProviderFilter} options={["All providers", "Ayala", "Chaffey"]} /><FilterSelect value={props.levelFilter} onChange={props.setLevelFilter} options={["All levels", "CP", "Honors", "AP", "College", "Standard"]} /><div className="col-span-2"><FilterSelect value={props.subjectFilter} onChange={props.setSubjectFilter} options={["All subjects", ...Array.from(new Set(allCourses.map((c) => c.subject)))]} /></div></div>}</header><div className="flex-1 overflow-y-auto p-3"><p className="mb-2 text-[11px] text-[#718077]">{props.courses.length} courses</p><div className="space-y-2">{props.courses.map((course) => <CourseResultCard key={course.id} course={course} onAdd={props.onAdd} fixedGrade={props.grade} fixedTerm={props.term} />)}</div></div></section></div>;
}

function CourseResultCard({ course, onAdd, fixedGrade, fixedTerm }: { course: Course; onAdd: (course: Course, grade: number, term: Term) => void; fixedGrade?: number; fixedTerm?: Term }) {
  const [grade, setGrade] = useState(fixedGrade ?? course.gradeLevels[0] ?? 9);
  const [term, setTerm] = useState<Term>(fixedTerm ?? (course.duration === "Year-long" ? "Year-long" : "Semester 1"));
  useEffect(() => { if (fixedGrade) setGrade(fixedGrade); }, [fixedGrade]);
  useEffect(() => { if (fixedTerm) setTerm(fixedTerm); }, [fixedTerm]);
  return <details className="group border border-[#dce3dd] bg-white"><summary className="flex cursor-pointer list-none items-center gap-2.5 p-3"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: subjectColors[course.subject] }} /><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold leading-tight">{course.name}</h3><p className="mt-1 truncate text-[10px] text-[#6f7c73]">{course.code} · {course.subject}{course.level !== "Standard" ? ` · ${course.level}` : ""}</p></div><span className="text-[10px] font-semibold text-[#718077] group-open:hidden">View</span><span className="hidden text-[10px] font-semibold text-[#718077] group-open:inline">Hide</span></summary><div className="border-t border-[#edf0ed] px-3 pb-3 pt-2">{course.prerequisite && <p className="text-[10px] leading-relaxed text-[#7a6852]"><strong>Prerequisite:</strong> {course.prerequisite}</p>}<p className="mt-1 text-[9px] text-[#7c877f]">{course.duration}{course.ag ? ` · A–G ${course.ag}` : ""} · {course.verification}</p><div className="mt-2 flex items-center gap-1.5"><select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="h-8 border border-[#dce3dd] bg-white px-2 text-[11px] font-semibold"><option value={9}>9th</option><option value={10}>10th</option><option value={11}>11th</option><option value={12}>12th</option></select><select value={term} onChange={(e) => setTerm(e.target.value as Term)} className="h-8 min-w-0 flex-1 border border-[#dce3dd] bg-white px-2 text-[11px] font-semibold"><option value="Year-long">Year-long</option><option value="Semester 1">Semester 1</option><option value="Semester 2">Semester 2</option><option value="Summer">Summer</option></select><button onClick={() => onAdd(course, grade, term)} className={`h-8 px-3 text-[11px] font-semibold text-white ${course.provider === "Chaffey" ? "bg-[#28598b]" : "bg-[#214f3d]"}`}>Add</button></div></div></details>;
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <div className="relative mt-1.5"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#839087]" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-xl border border-[#dce3dd] bg-white pl-9 pr-3 text-sm placeholder:text-[#9da7a0]" /></div>; }
function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <div className="relative mt-1.5"><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-[#dce3dd] bg-white px-3 pr-8 text-xs font-bold text-[#4f5f55]">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7c8980]" /></div>; }
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label><span className="text-[10px] font-bold uppercase tracking-wide text-[#718077]">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 h-10 w-full rounded-xl border border-[#dce3dd] bg-white px-3 text-sm placeholder:text-[#a1aaa4]" /></label>; }

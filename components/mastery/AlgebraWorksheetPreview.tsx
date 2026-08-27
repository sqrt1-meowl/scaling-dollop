"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Band = "FLUENCY" | "APPLIED" | "SAT";
type PreviewProblem = { id: string; band: Band; stem: string; choices?: string[]; answerFormat: "MC" | "SPR" };
type PreviewContent = { examplePrompt: string; exampleWork: string; problems: PreviewProblem[] };

const content: Record<string, PreviewContent> = {
  A1a: {
    examplePrompt: "Solve 4x + 7 = 31.",
    exampleWork: "Subtract 7 from both sides to get 4x = 24. Divide both sides by 4, so x = 6.",
    problems: [
      { id: "a1a-1", band: "FLUENCY", stem: "Solve 3x + 5 = 20.", choices: ["3", "5", "8", "15"], answerFormat: "MC" },
      { id: "a1a-2", band: "FLUENCY", stem: "Solve 7x − 9 = 26.", choices: ["3", "5", "7", "17"], answerFormat: "MC" },
      { id: "a1a-3", band: "FLUENCY", stem: "Solve 4x + 12 = 36.", choices: ["4", "6", "8", "12"], answerFormat: "MC" },
      { id: "a1a-4", band: "APPLIED", stem: "A service charges a $4 fee plus $8 per ticket. The total is $44. How many tickets were purchased?", choices: ["4", "5", "6", "8"], answerFormat: "MC" },
      { id: "a1a-5", band: "APPLIED", stem: "Five identical notebooks and a $3 pen cost $28 total. What is the cost of one notebook?", choices: ["$4", "$5", "$6", "$7"], answerFormat: "MC" },
      { id: "a1a-6", band: "SAT", stem: "If 5x + 18 = 3x + 42, what is the value of x?", choices: ["8", "10", "12", "30"], answerFormat: "MC" },
      { id: "a1a-7", band: "SAT", stem: "If 0.4x + 7 = 19, enter the value of x.", answerFormat: "SPR" },
    ],
  },
  A1b: {
    examplePrompt: "Solve 3(2x − 1) = 21.",
    exampleWork: "Distribute to get 6x − 3 = 21. Add 3, then divide by 6, so x = 4.",
    problems: [
      { id: "a1b-1", band: "FLUENCY", stem: "Solve 2(x + 5) = 24.", choices: ["5", "7", "12", "19"], answerFormat: "MC" },
      { id: "a1b-2", band: "FLUENCY", stem: "Solve 4(2x − 3) = 20.", choices: ["2", "4", "7", "8"], answerFormat: "MC" },
      { id: "a1b-3", band: "FLUENCY", stem: "Solve 5(x − 2) + 3 = 28.", choices: ["3", "5", "7", "9"], answerFormat: "MC" },
      { id: "a1b-4", band: "APPLIED", stem: "Three identical boxes each contain x books and 2 magazines. There are 30 items total. What is x?", choices: ["6", "8", "10", "12"], answerFormat: "MC" },
      { id: "a1b-5", band: "APPLIED", stem: "A rectangle has length x + 3 and width x. Its perimeter is 30. What is x?", choices: ["5", "6", "7", "9"], answerFormat: "MC" },
      { id: "a1b-6", band: "SAT", stem: "If 3(2x + 5) − 4 = 35, what is x?", choices: ["2", "3", "4", "6"], answerFormat: "MC" },
      { id: "a1b-7", band: "SAT", stem: "If 0.5(4x − 6) + 8 = 21, enter the value of x.", answerFormat: "SPR" },
    ],
  },
};

const bandCopy: Record<Band, { number: string; title: string; note: string }> = {
  FLUENCY: { number: "01", title: "Fluency", note: "Build clean, automatic moves." },
  APPLIED: { number: "02", title: "Applied", note: "Use the same move inside a short situation." },
  SAT: { number: "03", title: "SAT", note: "Finish with full-format test questions." },
};

const formatElapsed = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function AlgebraWorksheetPreview({ worksheetId, levelCode, levelName }: { worksheetId: string; levelCode: "A1a" | "A1b"; levelName: string }) {
  const lesson = content[levelCode];
  const [attempt, setAttempt] = useState<{ id: string; startedAt: string } | null>(null);
  const [timerError, setTimerError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [problemIndex, setProblemIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [complete, setComplete] = useState(false);
  const problem = lesson.problems[problemIndex];
  const band = problem?.band ?? "SAT";
  const bandProblems = useMemo(() => lesson.problems.filter((item) => item.band === band), [band, lesson.problems]);
  const bandPosition = problem ? bandProblems.findIndex((item) => item.id === problem.id) + 1 : bandProblems.length;

  useEffect(() => {
    let active = true;
    fetch("/api/mastery/attempts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ worksheetId }) })
      .then(async (response) => { const payload = await response.json() as { attempt?: { id: string; startedAt: string }; error?: string }; if (!response.ok || !payload.attempt) throw new Error(payload.error || "Timer unavailable"); if (active) setAttempt(payload.attempt); })
      .catch((error: Error) => { if (active) setTimerError(error.message); });
    return () => { active = false; };
  }, [worksheetId]);

  useEffect(() => {
    if (!attempt) return;
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [attempt]);

  const continueForward = () => {
    if (!answer.trim()) return;
    if (problemIndex === lesson.problems.length - 1) { setComplete(true); return; }
    setProblemIndex((value) => value + 1);
    setAnswer("");
  };

  return <AppShell role="student" title={`${levelCode} · Page 01`}>
    <div className="worksheet-player">
      <header className="worksheet-player-header">
        <div><Link href="/category/algebra" className="label text-[var(--muted)] hover:text-[var(--ink)]">← Algebra</Link><h2 className="academic-heading mt-3 text-3xl md:text-4xl">{levelName}</h2><p className="mt-2 text-sm text-[var(--muted)]">{levelCode} · Practice worksheet 1 of 5</p></div>
        <div className={`worksheet-timer ${timerError ? "error" : ""}`} aria-live="polite">{attempt ? <Clock3 size={17}/> : <LoaderCircle className={!timerError ? "animate-spin" : ""} size={17}/>}<div><span>{timerError ? "Timer unavailable" : "Elapsed"}</span><b>{attempt ? formatElapsed(elapsed) : "--:--"}</b></div></div>
      </header>

      <section className="worked-example-box"><div className="worked-example-label">Worked example</div><div><p className="font-semibold">{lesson.examplePrompt}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{lesson.exampleWork}</p></div></section>
      <div className="worksheet-band-map" aria-label="Worksheet bands">{(Object.keys(bandCopy) as Band[]).map((item) => { const bandIndex = (Object.keys(bandCopy) as Band[]).indexOf(item); const currentBandIndex = (Object.keys(bandCopy) as Band[]).indexOf(band); return <div key={item} className={complete || bandIndex < currentBandIndex ? "complete" : item === band ? "active" : ""}><span>{bandCopy[item].number}</span>{bandCopy[item].title}</div>; })}</div>

      {complete ? <section className="worksheet-complete"><div className="grid size-12 place-items-center rounded-full bg-[#e8f1eb] text-[#2f6a49]"><Check size={23}/></div><p className="label mt-5 text-[#2f6a49]">Preview complete</p><h3 className="academic-heading mt-2 text-3xl">All three bands cleared.</h3><Link href="/category/algebra" className="btn-primary mt-7">Return to Algebra<ArrowRight size={15}/></Link></section> : <section className={`worksheet-problem band-${band.toLowerCase()}`}>
        <div className="worksheet-problem-meta"><div><span>{bandCopy[band].number}</span><div><b>{bandCopy[band].title}</b><p>{bandCopy[band].note}</p></div></div><p>{bandPosition} of {bandProblems.length}</p></div>
        <div className="worksheet-prompt">{problem.stem}</div>
        {problem.answerFormat === "MC" ? <div className="worksheet-choices">{problem.choices?.map((choice, index) => <button key={choice} type="button" onClick={() => setAnswer(choice)} className={answer === choice ? "selected" : ""}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="decimal" placeholder="Enter your answer"/></label>}
        <footer className="worksheet-forward"><p>Answers move forward only. There is no back button inside a band.</p><button type="button" className="btn-primary" disabled={!answer.trim()} onClick={continueForward}>{problemIndex === lesson.problems.length - 1 ? "Finish preview" : "Next problem"}<ArrowRight size={15}/></button></footer>
      </section>}
    </div>
  </AppShell>;
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Band = "EASY" | "MEDIUM";
type PreviewProblem = { id: string; band: Band; stem: string; choices?: string[]; answerFormat: "MC" | "SPR" };
type PreviewContent = { examplePrompt: string; exampleWork: string; problems: PreviewProblem[] };

const content: Record<string, PreviewContent> = {
  A1a: {
    examplePrompt: "Solve 4x + 7 = 31.",
    exampleWork: "Subtract 7 from both sides to get 4x = 24. Divide both sides by 4, so x = 6.",
    problems: [
      { id: "a1a-e1", band: "EASY", stem: "What value of x satisfies 3x + 5 = 20?", choices: ["3", "5", "8", "15"], answerFormat: "MC" },
      { id: "a1a-e2", band: "EASY", stem: "What value of x satisfies 7x − 9 = 26?", choices: ["3", "5", "7", "17"], answerFormat: "MC" },
      { id: "a1a-e3", band: "EASY", stem: "What value of x satisfies 4x + 12 = 36?", choices: ["4", "6", "8", "12"], answerFormat: "MC" },
      { id: "a1a-e4", band: "EASY", stem: "What value of x satisfies 6x − 7 = 29?", choices: ["4", "6", "8", "22"], answerFormat: "MC" },
      { id: "a1a-e5", band: "EASY", stem: "What value of x satisfies 18 − 5x = −7?", choices: ["−5", "3", "5", "7"], answerFormat: "MC" },
      { id: "a1a-m1", band: "MEDIUM", stem: "If 13x − 29 = 62, what is the value of x?", choices: ["5", "7", "9", "11"], answerFormat: "MC" },
      { id: "a1a-m2", band: "MEDIUM", stem: "What value of x satisfies −8x + 5 = 53?", choices: ["−8", "−6", "6", "8"], answerFormat: "MC" },
      { id: "a1a-m3", band: "MEDIUM", stem: "What value of x satisfies 17 − 6x = −25?", choices: ["−7", "−4", "4", "7"], answerFormat: "MC" },
      { id: "a1a-m4", band: "MEDIUM", stem: "If 9x + 28 = −35, what is the value of x?", choices: ["−9", "−7", "7", "9"], answerFormat: "MC" },
      { id: "a1a-m5", band: "MEDIUM", stem: "What value of x satisfies 14x − 9 = 103?", answerFormat: "SPR" },
    ],
  },
  A1b: {
    examplePrompt: "Solve 3(2x − 1) = 21.",
    exampleWork: "Distribute to get 6x − 3 = 21. Add 3, then divide by 6, so x = 4.",
    problems: [
      { id: "a1b-e1", band: "EASY", stem: "What value of x satisfies 2(x + 5) = 24?", choices: ["5", "7", "12", "19"], answerFormat: "MC" },
      { id: "a1b-e2", band: "EASY", stem: "What value of x satisfies 4(2x − 3) = 20?", choices: ["2", "4", "7", "8"], answerFormat: "MC" },
      { id: "a1b-e3", band: "EASY", stem: "What value of x satisfies 5(x − 2) + 3 = 28?", choices: ["3", "5", "7", "9"], answerFormat: "MC" },
      { id: "a1b-e4", band: "EASY", stem: "If 3(x + 4) = 2x + 17, what is the value of x?", choices: ["3", "5", "7", "12"], answerFormat: "MC" },
      { id: "a1b-e5", band: "EASY", stem: "What value of x satisfies −2(x − 6) = 18?", choices: ["−9", "−3", "3", "9"], answerFormat: "MC" },
      { id: "a1b-m1", band: "MEDIUM", stem: "If 3(2x + 5) − 4 = 35, what is the value of x?", choices: ["2", "3", "4", "6"], answerFormat: "MC" },
      { id: "a1b-m2", band: "MEDIUM", stem: "What value of x satisfies 4(3x − 2) = 5x + 27?", choices: ["3", "5", "7", "9"], answerFormat: "MC" },
      { id: "a1b-m3", band: "MEDIUM", stem: "What value of x satisfies 5 − 2(3x − 4) = 25?", choices: ["−4", "−2", "2", "4"], answerFormat: "MC" },
      { id: "a1b-m4", band: "MEDIUM", stem: "A rectangle has length x + 3 and width x. Its perimeter is 30. What is the value of x?", choices: ["5", "6", "7", "9"], answerFormat: "MC" },
      { id: "a1b-m5", band: "MEDIUM", stem: "If 2(3x − 5) + 4(x + 1) = 44, what is the value of x?", answerFormat: "SPR" },
    ],
  },
};

const bandCopy: Record<Band, { number: string; title: string; note: string }> = {
  EASY: { number: "02", title: "Easy", note: "Direct SAT-style practice." },
  MEDIUM: { number: "03", title: "Medium", note: "One more layer of reasoning or setup." },
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
  const band = problem?.band ?? "MEDIUM";
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
      <div className="worksheet-band-map" aria-label="Worksheet progression"><div className="complete"><span>01</span>Example</div>{(Object.keys(bandCopy) as Band[]).map((item) => { const bandIndex = (Object.keys(bandCopy) as Band[]).indexOf(item); const currentBandIndex = (Object.keys(bandCopy) as Band[]).indexOf(band); return <div key={item} className={complete || bandIndex < currentBandIndex ? "complete" : item === band ? "active" : ""}><span>{bandCopy[item].number}</span>{bandCopy[item].title}</div>; })}</div>

      {complete ? <section className="worksheet-complete"><div className="grid size-12 place-items-center rounded-full bg-[#e8f1eb] text-[#2f6a49]"><Check size={23}/></div><p className="label mt-5 text-[#2f6a49]">Preview complete</p><h3 className="academic-heading mt-2 text-3xl">Example, Easy, and Medium complete.</h3><Link href="/category/algebra" className="btn-primary mt-7">Return to Algebra<ArrowRight size={15}/></Link></section> : <section className={`worksheet-problem band-${band.toLowerCase()}`}>
        <div className="worksheet-problem-meta"><div><span>{bandCopy[band].number}</span><div><b>{bandCopy[band].title}</b><p>{bandCopy[band].note}</p></div></div><p>{bandPosition} of {bandProblems.length}</p></div>
        <div className="worksheet-prompt">{problem.stem}</div>
        {problem.answerFormat === "MC" ? <div className="worksheet-choices">{problem.choices?.map((choice, index) => <button key={choice} type="button" onClick={() => setAnswer(choice)} className={answer === choice ? "selected" : ""}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="decimal" placeholder="Enter your answer"/></label>}
        <footer className="worksheet-forward"><p>Answers move forward only. There is no back button inside a band.</p><button type="button" className="btn-primary" disabled={!answer.trim()} onClick={continueForward}>{problemIndex === lesson.problems.length - 1 ? "Finish preview" : "Next problem"}<ArrowRight size={15}/></button></footer>
      </section>}
    </div>
  </AppShell>;
}

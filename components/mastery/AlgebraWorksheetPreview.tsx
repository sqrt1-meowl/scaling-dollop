"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Band = "EASY" | "MEDIUM";
type PreviewProblem = { id: string; band: Band; stem: string; choices?: string[]; answerFormat: "MC" | "SPR" };
type PreviewContent = { examplePrompt: string; exampleWork: string; problems: PreviewProblem[] };

const content: Record<"A1U1" | "A1U2", PreviewContent> = {
  A1U1: {
    examplePrompt: "Solve 3(2x − 1) + 4 = 5x + 9.",
    exampleWork: "Distribute and combine to get 6x + 1 = 5x + 9. Subtract 5x, then subtract 1, so x = 8.",
    problems: [
      { id: "a1u1-e1", band: "EASY", stem: "What value of x satisfies 3x + 5 = 20?", choices: ["3", "5", "8", "15"], answerFormat: "MC" },
      { id: "a1u1-e2", band: "EASY", stem: "What value of x satisfies 2(x + 5) = 24?", choices: ["5", "7", "12", "19"], answerFormat: "MC" },
      { id: "a1u1-e3", band: "EASY", stem: "What value of x satisfies 7x − 9 = 26?", choices: ["3", "5", "7", "17"], answerFormat: "MC" },
      { id: "a1u1-e4", band: "EASY", stem: "If 3(x + 4) = 2x + 17, what is the value of x?", choices: ["3", "5", "7", "12"], answerFormat: "MC" },
      { id: "a1u1-e5", band: "EASY", stem: "What value of x satisfies −2(x − 6) = 18?", choices: ["−9", "−3", "3", "9"], answerFormat: "MC" },
      { id: "a1u1-m1", band: "MEDIUM", stem: "If 3(2x + 5) − 4 = 35, what is the value of x?", choices: ["2", "3", "4", "6"], answerFormat: "MC" },
      { id: "a1u1-m2", band: "MEDIUM", stem: "What value of x satisfies 4(3x − 2) = 5x + 27?", choices: ["3", "5", "7", "9"], answerFormat: "MC" },
      { id: "a1u1-m3", band: "MEDIUM", stem: "What value of x satisfies 0.6x + 4.2 = 10.2?", choices: ["6", "8", "10", "12"], answerFormat: "MC" },
      { id: "a1u1-m4", band: "MEDIUM", stem: "What value of x satisfies x/3 + 5 = 11?", choices: ["2", "6", "16", "18"], answerFormat: "MC" },
      { id: "a1u1-m5", band: "MEDIUM", stem: "If 2(3x − 5) + 4(x + 1) = 44, what is the value of x?", answerFormat: "SPR" },
    ],
  },
  A1U2: {
    examplePrompt: "A service charges a $4 fee plus $8 per ticket. The total is $44. How many tickets were purchased?",
    exampleWork: "Let t be the number of tickets. Write 4 + 8t = 44. Subtract 4 and divide by 8, so t = 5.",
    problems: [
      { id: "a1u2-e1", band: "EASY", stem: "A gym charges $15 to join and $9 per class. A member pays $60. How many classes did the member take?", choices: ["3", "5", "7", "9"], answerFormat: "MC" },
      { id: "a1u2-e2", band: "EASY", stem: "Maya has 6 more books than Liam. Together they have 30 books. How many books does Liam have?", choices: ["9", "12", "15", "18"], answerFormat: "MC" },
      { id: "a1u2-e3", band: "EASY", stem: "The formula d = rt gives distance d at rate r for time t. Which expression gives t?", choices: ["d/r", "r/d", "dr", "d − r"], answerFormat: "MC" },
      { id: "a1u2-e4", band: "EASY", stem: "A phone plan costs $25 plus $4 per gigabyte. The bill is $49. How many gigabytes were used?", choices: ["4", "6", "8", "12"], answerFormat: "MC" },
      { id: "a1u2-e5", band: "EASY", stem: "A rectangle has length x + 3 and width x. Its perimeter is 30. What is x?", choices: ["5", "6", "7", "9"], answerFormat: "MC" },
      { id: "a1u2-m1", band: "MEDIUM", stem: "A taxi fare is $3.50 plus $2.25 per mile. The total fare is $17. What distance was traveled?", choices: ["5", "6", "7", "8"], answerFormat: "MC" },
      { id: "a1u2-m2", band: "MEDIUM", stem: "One number is three times another. Their difference is 28. What is the smaller number?", choices: ["7", "12", "14", "21"], answerFormat: "MC" },
      { id: "a1u2-m3", band: "MEDIUM", stem: "The formula A = (b₁ + b₂)h/2 gives trapezoid area. Which expression gives h?", choices: ["2A/(b₁ + b₂)", "A/(2b₁ + 2b₂)", "2A − b₁ − b₂", "A(b₁ + b₂)/2"], answerFormat: "MC" },
      { id: "a1u2-m4", band: "MEDIUM", stem: "A theater sold adult tickets for $14 and student tickets for $9. If 12 more student tickets than adult tickets were sold for $318, how many adult tickets were sold?", choices: ["6", "8", "9", "12"], answerFormat: "MC" },
      { id: "a1u2-m5", band: "MEDIUM", stem: "The formula P = 2L + 2W gives perimeter. If P = 54 and L = 16, what is W?", answerFormat: "SPR" },
    ],
  },
};

const bandCopy: Record<Band, { number: string; title: string; note: string }> = {
  EASY: { number: "02", title: "Easy", note: "Direct SAT-style practice." },
  MEDIUM: { number: "03", title: "Medium", note: "One more layer of reasoning or setup." },
};

const formatElapsed = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function AlgebraWorksheetPreview({ worksheetId, levelCode, levelName }: { worksheetId: string; levelCode: "A1U1" | "A1U2"; levelName: string }) {
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

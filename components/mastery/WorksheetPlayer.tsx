"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

type Band = "FLUENCY" | "APPLIED" | "SAT";
type PreviewProblem = {
  id: string;
  band: Band;
  stem: string;
  choices?: string[];
  answerFormat: "MC" | "SPR";
};

const previewProblems: PreviewProblem[] = [
  { id: "preview-f1a-1", band: "FLUENCY", stem: "−7 + 12 =", choices: ["−19", "−5", "5", "19"], answerFormat: "MC" },
  { id: "preview-f1a-2", band: "FLUENCY", stem: "9 − 14 =", choices: ["−23", "−5", "5", "23"], answerFormat: "MC" },
  { id: "preview-f1a-3", band: "FLUENCY", stem: "−11 − (−4) =", choices: ["−15", "−7", "7", "15"], answerFormat: "MC" },
  { id: "preview-f1a-4", band: "APPLIED", stem: "The temperature was −3°F at sunrise and rose 11°F by noon. What was the temperature at noon?", choices: ["−14°F", "−8°F", "8°F", "14°F"], answerFormat: "MC" },
  { id: "preview-f1a-5", band: "APPLIED", stem: "A submarine is 18 meters below sea level. It rises 7 meters. Which integer represents its new elevation?", choices: ["−25", "−11", "11", "25"], answerFormat: "MC" },
  { id: "preview-f1a-6", band: "SAT", stem: "A bank account balance changes from −$24 to $15 after a deposit. What was the amount of the deposit?", choices: ["$9", "$24", "$39", "$49"], answerFormat: "MC" },
  { id: "preview-f1a-7", band: "SAT", stem: "At 6 a.m., a temperature was −8°C. By 2 p.m., it had increased by 17°C. Enter the temperature at 2 p.m.", answerFormat: "SPR" },
];

const bandCopy: Record<Band, { number: string; title: string; note: string }> = {
  FLUENCY: { number: "01", title: "Fluency", note: "Build clean, automatic moves." },
  APPLIED: { number: "02", title: "Applied", note: "Use the same move inside a short situation." },
  SAT: { number: "03", title: "SAT", note: "Finish with full-format test questions." },
};

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function WorksheetPlayer({ worksheetId, levelCode, levelName }: { worksheetId: string; levelCode: string; levelName: string }) {
  const [attempt, setAttempt] = useState<{ id: string; startedAt: string } | null>(null);
  const [timerError, setTimerError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [problemIndex, setProblemIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [complete, setComplete] = useState(false);
  const problem = previewProblems[problemIndex];
  const band = problem?.band ?? "SAT";
  const bandProblems = useMemo(() => previewProblems.filter((item) => item.band === band), [band]);
  const bandPosition = problem ? bandProblems.findIndex((item) => item.id === problem.id) + 1 : bandProblems.length;

  useEffect(() => {
    let active = true;
    fetch("/api/mastery/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ worksheetId }),
    }).then(async (response) => {
      const payload = await response.json() as { attempt?: { id: string; startedAt: string }; error?: string };
      if (!response.ok || !payload.attempt) throw new Error(payload.error || "Timer unavailable");
      if (active) setAttempt(payload.attempt);
    }).catch((error: Error) => { if (active) setTimerError(error.message); });
    return () => { active = false; };
  }, [worksheetId]);

  useEffect(() => {
    if (!attempt) return;
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [attempt]);

  function continueForward() {
    if (!answer.trim()) return;
    if (problemIndex === previewProblems.length - 1) {
      setComplete(true);
      return;
    }
    setProblemIndex((current) => current + 1);
    setAnswer("");
  }

  return <AppShell role="student" title={`${levelCode} · Page 01`}>
    <div className="worksheet-player">
      <header className="worksheet-player-header">
        <div>
          <Link href="/spine" className="label text-[var(--muted)] hover:text-[var(--ink)]">← My Spine</Link>
          <h2 className="academic-heading mt-3 text-3xl md:text-4xl">{levelName}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{levelCode} · Practice worksheet 1 of 5</p>
        </div>
        <div className={`worksheet-timer ${timerError ? "error" : ""}`} aria-live="polite">
          {attempt ? <Clock3 size={17}/> : <LoaderCircle className={!timerError ? "animate-spin" : ""} size={17}/>} 
          <div><span>{timerError ? "Timer unavailable" : "Elapsed"}</span><b>{attempt ? formatElapsed(elapsed) : "--:--"}</b></div>
        </div>
      </header>

      <section className="worked-example-box">
        <div className="worked-example-label">Worked example</div>
        <div>
          <p className="font-semibold">Find −6 + 14.</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Start at −6. Adding 14 moves 14 units to the right: 6 units reach zero, and 8 remain. So <b className="text-[var(--ink)]">−6 + 14 = 8</b>.</p>
        </div>
      </section>

      <div className="worksheet-band-map" aria-label="Worksheet bands">
        {(Object.keys(bandCopy) as Band[]).map((item) => {
          const bandIndex = (Object.keys(bandCopy) as Band[]).indexOf(item);
          const currentBandIndex = (Object.keys(bandCopy) as Band[]).indexOf(band);
          return <div key={item} className={complete || bandIndex < currentBandIndex ? "complete" : item === band ? "active" : ""}><span>{bandCopy[item].number}</span>{bandCopy[item].title}</div>;
        })}
      </div>

      {complete ? <section className="worksheet-complete">
        <div className="grid size-12 place-items-center rounded-full bg-[#e8f1eb] text-[#2f6a49]"><Check size={23}/></div>
        <p className="label mt-5 text-[#2f6a49]">Player preview complete</p>
        <h3 className="academic-heading mt-2 text-3xl">All three bands cleared.</h3>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">This phase verifies the page flow and refresh-safe timer. Scoring, corrections, and mastery promotion are intentionally reserved for the next build stage.</p>
        <Link href="/spine" className="btn-primary mt-7">Return to My Spine<ArrowRight size={15}/></Link>
      </section> : <section className={`worksheet-problem band-${band.toLowerCase()}`}>
        <div className="worksheet-problem-meta">
          <div><span>{bandCopy[band].number}</span><div><b>{bandCopy[band].title}</b><p>{bandCopy[band].note}</p></div></div>
          <p>{bandPosition} of {bandProblems.length}</p>
        </div>
        <div className="worksheet-prompt">{problem.stem}</div>
        {problem.answerFormat === "MC" ? <div className="worksheet-choices">
          {problem.choices?.map((choice, index) => <button key={choice} type="button" onClick={() => setAnswer(choice)} className={answer === choice ? "selected" : ""}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}
        </div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="decimal" placeholder="Enter your answer"/></label>}
        <footer className="worksheet-forward">
          <p>Answers move forward only. There is no back button inside a band.</p>
          <button type="button" className="btn-primary" disabled={!answer.trim()} onClick={continueForward}>{problemIndex === previewProblems.length - 1 ? "Finish preview" : "Next problem"}<ArrowRight size={15}/></button>
        </footer>
      </section>}
    </div>
  </AppShell>;
}

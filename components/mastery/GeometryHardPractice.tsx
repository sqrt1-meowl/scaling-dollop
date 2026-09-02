"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GeometryFigure, type GeometryFigureType } from "./GeometryFigure";
import { GeometryHardFigure, type GeometryHardFigureType } from "./GeometryHardFigure";
import { MistakeBadge, MistakeReview, useWorksheetReview } from "./WorksheetReview";

export type GeometryHardCode = "G1H" | "G2H" | "G3H" | "G4H";

type HardProblem = {
  id: string;
  stem: string;
  choices?: string[];
  answerFormat: "MC" | "SPR";
  figure?: GeometryFigureType;
  hardFigure?: GeometryHardFigureType;
};

export const geometryHardSets: Record<GeometryHardCode, { title: string; problems: HardProblem[] }> = {
  G1H: {
    title: "Area and volume — Hard Practice",
    problems: [
      { id: "g1h-1", stem: "A rectangular region is 18 units by 12 units. A 7-by-5 rectangle is removed from one corner. What is the area of the remaining region?", choices: ["146", "169", "181", "216"], answerFormat: "MC", figure: "composite-region" },
      { id: "g1h-2", stem: "The area of a second square is 225% of the area of a square with side length 6. What is the side length of the second square?", choices: ["7.5", "9", "13.5", "18"], answerFormat: "MC", hardFigure: "scale-square-225" },
      { id: "g1h-3", stem: "Cylinder A has radius 3 and height 10. Cylinder B has radius 6 and height 5. The volume of cylinder B is how many times the volume of cylinder A?", answerFormat: "SPR" },
    ],
  },
  G2H: {
    title: "Lines, angles, and triangles — Hard Practice",
    problems: [
      { id: "g2h-1", stem: "Triangle ABC is isosceles with AB = AC. The exterior angle at B is 124°. What is the measure of angle A?", choices: ["56°", "62°", "68°", "124°"], answerFormat: "MC", hardFigure: "isosceles-exterior" },
      { id: "g2h-2", stem: "Parallel lines are cut by a transversal. A pair of alternate interior angles measure (5x − 12)° and (3x + 24)°. What is x?", choices: ["12", "18", "24", "36"], answerFormat: "MC", figure: "parallel-lines" },
      { id: "g2h-3", stem: "Two triangles are similar. Sides x + 4 and 18 correspond, and sides 10 and 15 correspond. What is x?", answerFormat: "SPR", hardFigure: "similar-algebra" },
    ],
  },
  G3H: {
    title: "Right triangles and trigonometry — Hard Practice",
    problems: [
      { id: "g3h-1", stem: "A rectangle has width x, length x + 7, and diagonal 17. What is the width of the rectangle?", choices: ["6", "8", "10", "15"], answerFormat: "MC", hardFigure: "rectangle-diagonal" },
      { id: "g3h-2", stem: "From a point 45 feet from the base of a tower, the angle of elevation to the top is 38°. Which expression gives the tower's height h?", choices: ["45 sin 38°", "45 cos 38°", "45 tan 38°", "45/tan 38°"], answerFormat: "MC", hardFigure: "tower-trig" },
      { id: "g3h-3", stem: "The hypotenuse of a 30°-60°-90° triangle is 20. A similar triangle has scale factor 1.5. What is the length of the longer leg of the larger triangle divided by √3?", answerFormat: "SPR" },
    ],
  },
  G4H: {
    title: "Circles — Hard Practice",
    problems: [
      { id: "g4h-1", stem: "What is the radius of the circle x² + y² − 8x + 6y − 11 = 0?", choices: ["4", "5", "6", "9"], answerFormat: "MC", hardFigure: "circle-equation" },
      { id: "g4h-2", stem: "Point P is 13 units from the center of a circle with radius 5. A tangent segment is drawn from P to the circle. What is the length of the tangent segment?", choices: ["8", "12", "13", "18"], answerFormat: "MC", figure: "circle-tangent" },
      { id: "g4h-3", stem: "A sector of a circle has radius 18 and central angle 80°. What is the sector's area divided by π?", answerFormat: "SPR" },
    ],
  },
};

export const geometryHardCorrectAnswers: Record<string, string> = {
  "g1h-1": "181", "g1h-2": "9", "g1h-3": "2",
  "g2h-1": "68°", "g2h-2": "18", "g2h-3": "8",
  "g3h-1": "8", "g3h-2": "45 tan 38°", "g3h-3": "15",
  "g4h-1": "6", "g4h-2": "12", "g4h-3": "72",
};

const hardSets = geometryHardSets;
const correctAnswers = geometryHardCorrectAnswers;

const formatElapsed = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function GeometryHardPractice({ worksheetId, hardCode }: { worksheetId: string; hardCode: GeometryHardCode }) {
  const set = hardSets[hardCode];
  const [attempt, setAttempt] = useState<{ id: string; startedAt: string } | null>(null);
  const [timerError, setTimerError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const review = useWorksheetReview({ worksheetId, problems: set.problems, correctAnswers });
  const { problemIndex, problem, answer, setAnswer, advance, previous, mistakes, trackerError } = review;

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
    if (advance()) setComplete(true);
  };

  return <AppShell role="student" title={`${hardCode} · Hard Practice`}>
    <div className="worksheet-player">
      <header className="worksheet-player-header">
        <div><Link href="/category/geometry-trigonometry" className="label text-[var(--muted)] hover:text-[var(--ink)]">← Geometry &amp; Trigonometry</Link><h2 className="academic-heading mt-3 text-3xl md:text-4xl">{set.title}</h2><p className="mt-2 text-sm text-[var(--muted)]">{hardCode} · 3-question skill review</p></div>
        <div className="worksheet-header-tools">
          <MistakeBadge count={mistakes.length} error={trackerError}/>
          <div className={`worksheet-timer ${timerError ? "error" : ""}`} aria-live="polite">{attempt ? <Clock3 size={17}/> : <LoaderCircle className={!timerError ? "animate-spin" : ""} size={17}/>}<div><span>{timerError ? "Timer unavailable" : "Elapsed"}</span><b>{attempt ? formatElapsed(elapsed) : "--:--"}</b></div></div>
        </div>
      </header>

      <div className="worksheet-band-map hard-only" aria-label="Hard Practice"><div className="active"><span>01</span>Hard</div></div>
      {complete ? <section className="worksheet-complete"><div className="grid size-12 place-items-center rounded-full bg-[#e8f1eb] text-[#2f6a49]"><Check size={23}/></div><p className="label mt-5 text-[#2f6a49]">Hard Practice complete</p><h3 className="academic-heading mt-2 text-3xl">Three hard questions complete.</h3><MistakeReview mistakes={mistakes} problems={set.problems} correctAnswers={correctAnswers}/><Link href="/category/geometry-trigonometry" className="btn-primary mt-7">Return to Geometry &amp; Trigonometry<ArrowRight size={15}/></Link></section> : <section className="worksheet-problem band-hard">
        <div className="worksheet-problem-meta"><div><span>04</span><div><b>Hard</b><p>Mixed reasoning across the full skill.</p></div></div><p>{problemIndex + 1} of {set.problems.length}</p></div>
        <div className={`worksheet-question-body ${problem.figure || problem.hardFigure ? "has-figure" : ""}`}><div className="worksheet-prompt">{problem.stem}</div>{problem.figure && <GeometryFigure type={problem.figure}/>} {problem.hardFigure && <GeometryHardFigure type={problem.hardFigure}/>}</div>
        {problem.answerFormat === "MC" ? <div className="worksheet-choices">{problem.choices?.map((choice, index) => <button key={choice} type="button" onClick={() => setAnswer(choice)} className={answer === choice ? "selected" : ""}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="decimal" placeholder="Enter your answer"/></label>}
        <footer className="worksheet-forward"><p>Use Previous and Next to move through this set.</p><div className="worksheet-actions"><button type="button" className="btn-secondary" disabled={problemIndex === 0} onClick={previous}><ArrowLeft size={15}/>Previous</button><button type="button" className="btn-primary" disabled={!answer.trim()} onClick={continueForward}>{problemIndex === set.problems.length - 1 ? "Finish Hard Practice" : "Next problem"}<ArrowRight size={15}/></button></div></footer>
      </section>}
    </div>
  </AppShell>;
}

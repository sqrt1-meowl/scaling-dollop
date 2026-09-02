"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GeometryFigure, type GeometryFigureType } from "./GeometryFigure";
import { MistakeBadge, MistakeReview, useWorksheetReview } from "./WorksheetReview";

export type GeometryLevelCode =
  | "G1U1" | "G1U2" | "G1U3"
  | "G2U1" | "G2U2" | "G2U3"
  | "G3U1" | "G3U2"
  | "G4U1" | "G4U2";

type Band = "EASY" | "MEDIUM";
type PreviewProblem = {
  id: string;
  band: Band;
  stem: string;
  choices?: string[];
  answerFormat: "MC" | "SPR";
  figure?: GeometryFigureType;
};
type PreviewContent = {
  examplePrompt: string;
  exampleWork: string;
  problems: PreviewProblem[];
};

const content: Record<GeometryLevelCode, PreviewContent> = {
  G1U1: {
    examplePrompt: "A rectangle is 12 units long and 7 units wide. What are its perimeter and area?",
    exampleWork: "Use P = 2l + 2w to get 2(12) + 2(7) = 38 units. Use A = lw to get 12(7) = 84 square units.",
    problems: [
      { id: "g1u1-e1", band: "EASY", stem: "A triangle has base 14 and height 9. What is its area?", choices: ["23", "63", "126", "252"], answerFormat: "MC", figure: "triangle-area" },
      { id: "g1u1-e2", band: "EASY", stem: "A circle has radius 6. What is its area?", choices: ["6π", "12π", "36π", "72π"], answerFormat: "MC" },
      { id: "g1u1-m1", band: "MEDIUM", stem: "A 10-by-8 rectangle has a 3-by-2 rectangle removed from one corner. What is the area of the remaining region?", choices: ["68", "72", "74", "76"], answerFormat: "MC" },
      { id: "g1u1-m2", band: "MEDIUM", stem: "A square has the same area as a rectangle with length 18 and width 8. What is the side length of the square?", answerFormat: "SPR" },
    ],
  },
  G1U2: {
    examplePrompt: "A cylinder has radius 3 and height 8. What is its volume?",
    exampleWork: "Use V = πr²h. Substitute r = 3 and h = 8: V = π(3²)(8) = 72π cubic units.",
    problems: [
      { id: "g1u2-e1", band: "EASY", stem: "A rectangular prism is 5 units by 4 units by 9 units. What is its volume?", choices: ["18", "90", "160", "180"], answerFormat: "MC", figure: "prism" },
      { id: "g1u2-e2", band: "EASY", stem: "A cube has edge length 4. What is its volume?", choices: ["16", "48", "64", "96"], answerFormat: "MC" },
      { id: "g1u2-m1", band: "MEDIUM", stem: "An open-top cube-shaped box has side length 5. What is its total surface area?", choices: ["100", "125", "150", "175"], answerFormat: "MC" },
      { id: "g1u2-m2", band: "MEDIUM", stem: "A cylinder has diameter 10 and volume 300π. What is its height?", answerFormat: "SPR" },
    ],
  },
  G1U3: {
    examplePrompt: "Every length of a square is multiplied by 3. By what factor does its area change?",
    exampleWork: "Area is two-dimensional, so square the linear scale factor: 3² = 9. The new area is 9 times the original area.",
    problems: [
      { id: "g1u3-e1", band: "EASY", stem: "A rectangle has area 96 and width 8. What is its length?", choices: ["10", "12", "16", "24"], answerFormat: "MC" },
      { id: "g1u3-e2", band: "EASY", stem: "A model uses a scale of 1 inch to 6 feet. A wall is 4 inches long in the model. How long is the actual wall?", choices: ["10 feet", "18 feet", "24 feet", "30 feet"], answerFormat: "MC" },
      { id: "g1u3-m1", band: "MEDIUM", stem: "Corresponding lengths of two similar figures are in the ratio 2:5. What is the ratio of their areas?", choices: ["2:5", "4:10", "4:25", "8:125"], answerFormat: "MC", figure: "similar-squares" },
      { id: "g1u3-m2", band: "MEDIUM", stem: "A solid is enlarged so every length is doubled. If its original volume is 35, what is its new volume?", answerFormat: "SPR" },
    ],
  },
  G2U1: {
    examplePrompt: "Two parallel lines are cut by a transversal. One acute angle measures 68°. What is the measure of each obtuse angle?",
    exampleWork: "An acute angle and an adjacent obtuse angle form a linear pair. Subtract from 180°: 180° − 68° = 112°.",
    problems: [
      { id: "g2u1-e1", band: "EASY", stem: "Two lines intersect. One angle measures 47°. What is the measure of its vertical angle?", choices: ["43°", "47°", "133°", "180°"], answerFormat: "MC", figure: "vertical-angles" },
      { id: "g2u1-e2", band: "EASY", stem: "Two adjacent angles form a straight line. One angle is 125°. What is the other angle?", choices: ["45°", "55°", "65°", "125°"], answerFormat: "MC" },
      { id: "g2u1-m1", band: "MEDIUM", stem: "Parallel lines are cut by a transversal. Alternate interior angles measure (3x + 7)° and (5x − 21)°. What is x?", choices: ["7", "14", "21", "28"], answerFormat: "MC" },
      { id: "g2u1-m2", band: "MEDIUM", stem: "A linear pair has measures (4x + 8)° and (2x + 16)°. What is x?", answerFormat: "SPR" },
    ],
  },
  G2U2: {
    examplePrompt: "Two angles of a triangle measure 48° and 67°. What is the third angle?",
    exampleWork: "Triangle angles sum to 180°. Subtract: 180° − 48° − 67° = 65°.",
    problems: [
      { id: "g2u2-e1", band: "EASY", stem: "An isosceles triangle has a vertex angle of 40°. What is the measure of each base angle?", choices: ["40°", "60°", "70°", "140°"], answerFormat: "MC", figure: "isosceles" },
      { id: "g2u2-e2", band: "EASY", stem: "Triangle ABC is congruent to triangle DEF, with A corresponding to D. If angle A is 72°, what is angle D?", choices: ["18°", "36°", "72°", "108°"], answerFormat: "MC" },
      { id: "g2u2-m1", band: "MEDIUM", stem: "An exterior angle of a triangle is 132°. One remote interior angle is 57°. What is the other remote interior angle?", choices: ["57°", "65°", "75°", "123°"], answerFormat: "MC" },
      { id: "g2u2-m2", band: "MEDIUM", stem: "The interior angles of a triangle are x°, 2x°, and 3x°. What is x?", answerFormat: "SPR" },
    ],
  },
  G2U3: {
    examplePrompt: "Two similar triangles have corresponding sides 6 and 15. If another side of the smaller triangle is 8, what is the matching side of the larger triangle?",
    exampleWork: "The scale factor from smaller to larger is 15/6 = 2.5. Multiply 8 by 2.5 to get 20.",
    problems: [
      { id: "g2u3-e1", band: "EASY", stem: "Similar triangles have corresponding side lengths 4 and 10. What is the scale factor from the first triangle to the second?", choices: ["0.4", "2", "2.5", "6"], answerFormat: "MC" },
      { id: "g2u3-e2", band: "EASY", stem: "A side of length 9 in one triangle corresponds to a side of length 15 in a similar triangle. A side of length 12 corresponds to what length?", choices: ["16", "18", "20", "24"], answerFormat: "MC", figure: "similar-triangles" },
      { id: "g2u3-m1", band: "MEDIUM", stem: "A 6-foot person casts an 8-foot shadow. At the same time, a tree casts a 36-foot shadow. How tall is the tree?", choices: ["24 feet", "27 feet", "30 feet", "48 feet"], answerFormat: "MC" },
      { id: "g2u3-m2", band: "MEDIUM", stem: "In similar triangles, sides x + 3 and 18 correspond, while sides 10 and 15 correspond. What is x?", answerFormat: "SPR" },
    ],
  },
  G3U1: {
    examplePrompt: "A right triangle has legs 6 and 8. What is the length of its hypotenuse?",
    exampleWork: "Use a² + b² = c²: 6² + 8² = 36 + 64 = 100, so c = 10.",
    problems: [
      { id: "g3u1-e1", band: "EASY", stem: "A right triangle has legs 5 and 12. What is its hypotenuse?", choices: ["7", "13", "17", "25"], answerFormat: "MC", figure: "right-triangle" },
      { id: "g3u1-e2", band: "EASY", stem: "What is the distance between (1, 2) and (7, 10) in the coordinate plane?", choices: ["8", "10", "12", "14"], answerFormat: "MC" },
      { id: "g3u1-m1", band: "MEDIUM", stem: "A square has diagonal length 12√2. What is the side length of the square?", choices: ["6", "12", "12√2", "24"], answerFormat: "MC" },
      { id: "g3u1-m2", band: "MEDIUM", stem: "The shorter leg of a 30°-60°-90° triangle is 7. What is the hypotenuse?", answerFormat: "SPR" },
    ],
  },
  G3U2: {
    examplePrompt: "In a right triangle, an angle θ has opposite side 9 and adjacent side 12. What is tan θ?",
    exampleWork: "Tangent is opposite divided by adjacent, so tan θ = 9/12 = 3/4.",
    problems: [
      { id: "g3u2-e1", band: "EASY", stem: "In a right triangle, the side opposite θ is 5 and the hypotenuse is 13. What is sin θ?", choices: ["5/13", "12/13", "5/12", "13/5"], answerFormat: "MC", figure: "trig-triangle" },
      { id: "g3u2-e2", band: "EASY", stem: "Angles A and B are complementary. If sin A = 0.6, which value equals cos B?", choices: ["0.4", "0.6", "0.8", "1.0"], answerFormat: "MC" },
      { id: "g3u2-m1", band: "MEDIUM", stem: "A ramp rises 4 feet over a horizontal run of 10 feet. Which expression gives the angle θ the ramp makes with the ground?", choices: ["tan⁻¹(4/10)", "tan⁻¹(10/4)", "sin⁻¹(10/4)", "cos⁻¹(4/10)"], answerFormat: "MC" },
      { id: "g3u2-m2", band: "MEDIUM", stem: "An angle measures 5π/6 radians. What is its measure in degrees?", answerFormat: "SPR" },
    ],
  },
  G4U1: {
    examplePrompt: "A central angle intercepts one-fourth of a circle. What is the angle measure and what fraction of the circle's area is its sector?",
    exampleWork: "One-fourth of 360° is 90°. A sector has the same fraction of the circle's area as its central angle has of 360°, so the fraction is 1/4.",
    problems: [
      { id: "g4u1-e1", band: "EASY", stem: "A radius is drawn to a point of tangency. What is the angle between the radius and the tangent line?", choices: ["45°", "60°", "90°", "180°"], answerFormat: "MC", figure: "circle-tangent" },
      { id: "g4u1-e2", band: "EASY", stem: "A circle has radius 10. What is the length of an arc with central angle 72°?", choices: ["2π", "4π", "5π", "20π"], answerFormat: "MC" },
      { id: "g4u1-m1", band: "MEDIUM", stem: "An inscribed angle intercepts an arc measuring 134°. What is the measure of the inscribed angle?", choices: ["33.5°", "67°", "134°", "268°"], answerFormat: "MC" },
      { id: "g4u1-m2", band: "MEDIUM", stem: "A sector of a circle with radius 12 has a central angle of 60°. What is the sector's area divided by π?", answerFormat: "SPR" },
    ],
  },
  G4U2: {
    examplePrompt: "What are the center and radius of (x − 4)² + (y + 2)² = 25?",
    exampleWork: "Compare with (x − h)² + (y − k)² = r². The center is (4, −2), and the radius is √25 = 5.",
    problems: [
      { id: "g4u2-e1", band: "EASY", stem: "What is the radius of the circle x² + y² = 49?", choices: ["7", "14", "24.5", "49"], answerFormat: "MC" },
      { id: "g4u2-e2", band: "EASY", stem: "Which point lies on the circle (x − 2)² + (y − 3)² = 16?", choices: ["(2, 3)", "(6, 3)", "(6, 7)", "(0, 0)"], answerFormat: "MC", figure: "coordinate-circle" },
      { id: "g4u2-m1", band: "MEDIUM", stem: "What is the center of x² + y² − 6x + 8y = 0?", choices: ["(−3, 4)", "(3, −4)", "(6, −8)", "(−6, 8)"], answerFormat: "MC" },
      { id: "g4u2-m2", band: "MEDIUM", stem: "The circle (x − 1)² + (y + 2)² = k passes through (4, 2). What is k?", answerFormat: "SPR" },
    ],
  },
};

const bandCopy: Record<Band, { number: string; title: string; note: string }> = {
  EASY: { number: "02", title: "Easy", note: "Direct SAT-style practice." },
  MEDIUM: { number: "03", title: "Medium", note: "One more layer of reasoning or setup." },
};

const correctAnswers: Record<string, string> = {
  "g1u1-e1": "63", "g1u1-e2": "36π", "g1u1-m1": "74", "g1u1-m2": "12",
  "g1u2-e1": "180", "g1u2-e2": "64", "g1u2-m1": "125", "g1u2-m2": "12",
  "g1u3-e1": "12", "g1u3-e2": "24 feet", "g1u3-m1": "4:25", "g1u3-m2": "280",
  "g2u1-e1": "47°", "g2u1-e2": "55°", "g2u1-m1": "14", "g2u1-m2": "26",
  "g2u2-e1": "70°", "g2u2-e2": "72°", "g2u2-m1": "75°", "g2u2-m2": "30",
  "g2u3-e1": "2.5", "g2u3-e2": "20", "g2u3-m1": "27 feet", "g2u3-m2": "9",
  "g3u1-e1": "13", "g3u1-e2": "10", "g3u1-m1": "12", "g3u1-m2": "14",
  "g3u2-e1": "5/13", "g3u2-e2": "0.6", "g3u2-m1": "tan⁻¹(4/10)", "g3u2-m2": "150",
  "g4u1-e1": "90°", "g4u1-e2": "4π", "g4u1-m1": "67°", "g4u1-m2": "24",
  "g4u2-e1": "7", "g4u2-e2": "(6, 3)", "g4u2-m1": "(3, −4)", "g4u2-m2": "25",
};

const formatElapsed = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function GeometryWorksheetPreview({ worksheetId, levelCode, levelName }: { worksheetId: string; levelCode: GeometryLevelCode; levelName: string }) {
  const lesson = content[levelCode];
  const [attempt, setAttempt] = useState<{ id: string; startedAt: string } | null>(null);
  const [timerError, setTimerError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const review = useWorksheetReview({ worksheetId, problems: lesson.problems, correctAnswers });
  const { problemIndex, problem, answer, setAnswer, advance, previous, mistakes, trackerError } = review;
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
    if (advance()) setComplete(true);
  };

  return <AppShell role="student" title={`${levelCode} · Page 01`}>
    <div className="worksheet-player">
      <header className="worksheet-player-header">
        <div><Link href="/category/geometry-trigonometry" className="label text-[var(--muted)] hover:text-[var(--ink)]">← Geometry &amp; Trigonometry</Link><h2 className="academic-heading mt-3 text-3xl md:text-4xl">{levelName}</h2><p className="mt-2 text-sm text-[var(--muted)]">{levelCode} · Practice worksheet 1 of 5</p></div>
        <div className="worksheet-header-tools">
          <MistakeBadge count={mistakes.length} error={trackerError}/>
          <div className={`worksheet-timer ${timerError ? "error" : ""}`} aria-live="polite">{attempt ? <Clock3 size={17}/> : <LoaderCircle className={!timerError ? "animate-spin" : ""} size={17}/>}<div><span>{timerError ? "Timer unavailable" : "Elapsed"}</span><b>{attempt ? formatElapsed(elapsed) : "--:--"}</b></div></div>
        </div>
      </header>

      <section className="worked-example-box"><div className="worked-example-label">Worked example</div><div><p className="font-semibold">{lesson.examplePrompt}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{lesson.exampleWork}</p></div></section>
      <div className="worksheet-band-map" aria-label="Worksheet progression"><div className="complete"><span>01</span>Example</div>{(Object.keys(bandCopy) as Band[]).map((item) => { const bandIndex = (Object.keys(bandCopy) as Band[]).indexOf(item); const currentBandIndex = (Object.keys(bandCopy) as Band[]).indexOf(band); return <div key={item} className={complete || bandIndex < currentBandIndex ? "complete" : item === band ? "active" : ""}><span>{bandCopy[item].number}</span>{bandCopy[item].title}</div>; })}</div>

      {complete ? <section className="worksheet-complete"><div className="grid size-12 place-items-center rounded-full bg-[#e8f1eb] text-[#2f6a49]"><Check size={23}/></div><p className="label mt-5 text-[#2f6a49]">Worksheet complete</p><h3 className="academic-heading mt-2 text-3xl">Example, Easy, and Medium complete.</h3><MistakeReview mistakes={mistakes} problems={lesson.problems} correctAnswers={correctAnswers}/><Link href="/category/geometry-trigonometry" className="btn-primary mt-7">Return to Geometry &amp; Trigonometry<ArrowRight size={15}/></Link></section> : <section className={`worksheet-problem band-${band.toLowerCase()}`}>
        <div className="worksheet-problem-meta"><div><span>{bandCopy[band].number}</span><div><b>{bandCopy[band].title}</b><p>{bandCopy[band].note}</p></div></div><p>{bandPosition} of {bandProblems.length}</p></div>
        <div className={`worksheet-question-body ${problem.figure ? "has-figure" : ""}`}><div className="worksheet-prompt">{problem.stem}</div>{problem.figure && <GeometryFigure type={problem.figure}/>}</div>
        {problem.answerFormat === "MC" ? <div className="worksheet-choices">{problem.choices?.map((choice, index) => <button key={choice} type="button" onClick={() => setAnswer(choice)} className={answer === choice ? "selected" : ""}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div> : <label className="worksheet-spr"><span>Student-produced response</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="decimal" placeholder="Enter your answer"/></label>}
        <footer className="worksheet-forward"><p>Use Previous and Next to move through this worksheet.</p><div className="worksheet-actions"><button type="button" className="btn-secondary" disabled={problemIndex === 0} onClick={previous}><ArrowLeft size={15}/>Previous</button><button type="button" className="btn-primary" disabled={!answer.trim()} onClick={continueForward}>{problemIndex === lesson.problems.length - 1 ? "Finish worksheet" : "Next problem"}<ArrowRight size={15}/></button></div></footer>
      </section>}
    </div>
  </AppShell>;
}

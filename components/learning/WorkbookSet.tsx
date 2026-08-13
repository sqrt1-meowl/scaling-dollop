"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useApp } from "../AppProvider";
import type { Question } from "@/lib/curriculum";

const normalize = (value: string) => value.trim().toLowerCase().replace(/[$,°\s]/g, "");

function numericValue(value: string) {
  const normalized = normalize(value).replace("π", "pi");
  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(normalized)) {
    const [top, bottom] = normalized.split("/").map(Number);
    return bottom ? top / bottom : Number.NaN;
  }
  return /^-?\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
}

function answersMatch(given: string, expected: string) {
  if (normalize(given) === normalize(expected)) return true;
  const givenNumber = numericValue(given);
  const expectedNumber = numericValue(expected);
  return Number.isFinite(givenNumber) && Number.isFinite(expectedNumber) && Math.abs(givenNumber - expectedNumber) < 0.0001;
}

export function WorkbookSet({
  questions,
  domainName,
  topicCode,
  topicTitle,
  setTitle,
  subtitle,
  result,
  requiredScore = 4,
  hard = false,
  onSubmit,
  onContinue,
  onRetry,
  continueLabel = "Continue",
}: {
  questions: Question[];
  domainName: string;
  topicCode: string;
  topicTitle: string;
  setTitle: string;
  subtitle: string;
  result: number | null;
  requiredScore?: number;
  hard?: boolean;
  onSubmit: (score: number) => void;
  onContinue: () => void;
  onRetry: () => void;
  continueLabel?: string;
}) {
  const { session, addError } = useApp();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const allAnswered = questions.length > 0 && questions.every((question) => Boolean(answers[question.id]?.trim()));
  const passed = result !== null && result >= requiredScore;
  const questionIds = useMemo(() => questions.map((question) => question.id).join("|"), [questions]);

  const submit = () => {
    if (!allAnswered) return;
    let score = 0;
    for (const question of questions) {
      if (answersMatch(answers[question.id], question.correctAnswer)) score += 1;
      else addError(question.id, question.skillId);
    }
    onSubmit(score);
  };

  return (
    <article className="packet-page" data-question-set={questionIds}>
      <header className="packet-masthead"><b>SAT Math Drill Program</b><b>{domainName}</b></header>
      <div className="packet-title-row">
        <h1>TOPIC {topicCode}: {topicTitle}</h1>
        <h2>{setTitle}</h2>
      </div>
      <p className="packet-subtitle">{subtitle}</p>
      <div className="packet-meta"><span>Name: <b>{session?.name}</b></span><span>Complete every problem before submitting.</span><span>Correct: <b>{result ?? "___"}</b> /{questions.length}</span></div>

      <div className="packet-question-list">
        {questions.map((question, index) => (
          <section className={`packet-question ${hard ? "packet-question-hard" : ""}`} key={question.id}>
            <div className="packet-question-prompt"><b>{index + 1}.</b><p>{question.prompt}</p></div>
            {question.math && <p className="packet-math">{question.math}</p>}
            {question.questionType === "multiple_choice" && question.choices ? (
              <div className="packet-choices">
                {question.choices.map((option, optionIndex) => (
                  <label key={option} className="packet-choice">
                    <input type="radio" name={question.id} value={option} checked={answers[question.id] === option} disabled={result !== null} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))}/>
                    <span>{String.fromCharCode(65 + optionIndex)}.</span><span>{option}</span>
                  </label>
                ))}
              </div>
            ) : <div className="packet-workspace"/>}
            <label className="packet-answer"><b>Answer:</b><input aria-label={`Answer to question ${index + 1}`} value={answers[question.id] ?? ""} disabled={result !== null || question.questionType === "multiple_choice"} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}/></label>
          </section>
        ))}
      </div>

      <footer className="packet-submit-row">
        {result === null ? <><p>{requiredScore ? `Mastery standard: ${requiredScore} / ${questions.length}` : "Cumulative review"}</p><button className="btn-primary" disabled={!allAnswered} onClick={submit}>Submit set</button></> : passed ? <><div><b>{requiredScore ? "Set cleared." : "Review complete."}</b><p>{result} of {questions.length} correct.</p></div><button className="btn-primary" onClick={onContinue}>{continueLabel}<ArrowRight size={15}/></button></> : <><div><b>Try another set.</b><p>{result} of {questions.length} correct. Grind it again and clear {requiredScore}.</p></div><button className="btn-primary" onClick={onRetry}><RotateCcw size={15}/>Retry set</button></>}
      </footer>
    </article>
  );
}

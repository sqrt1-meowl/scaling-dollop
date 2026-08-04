"use client";

import { useState } from "react";
import { CompletionScreen, ExerciseStep, PrimaryButton, SecondaryButton, UsefulPhrases, colors } from "@/components/IdeaSpeakUI";
import { MultipleChoice } from "@/components/MultipleChoice";
import { completeScenario } from "@/components/progressStorage";
import type { Scenario } from "@/lib/ideaSpeakData";

export function PracticeLesson({
  backHref,
  categorySlug,
  scenario
}: {
  backHref: string;
  categorySlug: string;
  scenario: Scenario;
}) {
  const [step, setStep] = useState(1);
  const [meaningAnswered, setMeaningAnswered] = useState(false);
  const [repeatDone, setRepeatDone] = useState(false);
  const [responseAnswered, setResponseAnswered] = useState(false);
  const [studentResponse, setStudentResponse] = useState("");
  const [finished, setFinished] = useState(false);

  if (finished) {
    return <CompletionScreen backHref={backHref} />;
  }

  if (step === 1) {
    return (
      <ExerciseStep step={1} title="Listen / Read">
        <p style={{ background: colors.sky, borderRadius: 16, color: colors.text, fontSize: 18, lineHeight: 1.55, margin: 0, padding: 16 }}>
          {scenario.situation}
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {scenario.conversation.map((line) => (
            <p key={line} style={{ background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 16, fontSize: 18, lineHeight: 1.5, margin: 0, padding: 14 }}>
              {line}
            </p>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <SecondaryButton>Play Audio</SecondaryButton>
          <PrimaryButton onClick={() => setStep(2)}>Next</PrimaryButton>
        </div>
      </ExerciseStep>
    );
  }

  if (step === 2) {
    return (
      <ExerciseStep step={2} title="Check Meaning">
        <MultipleChoice onAnswer={() => setMeaningAnswered(true)} question={scenario.checkMeaning} />
        <PrimaryButton disabled={!meaningAnswered} onClick={() => setStep(3)}>
          Next
        </PrimaryButton>
      </ExerciseStep>
    );
  }

  if (step === 3) {
    return (
      <ExerciseStep step={3} title="Repeat">
        <div style={{ background: colors.sky, borderRadius: 18, padding: 18 }}>
          <p style={{ color: colors.muted, fontWeight: 900, margin: "0 0 8px" }}>Say this sentence:</p>
          <p style={{ color: colors.blueDark, fontSize: "clamp(1.6rem, 5vw, 2.5rem)", fontWeight: 900, lineHeight: 1.15, margin: 0 }}>
            {scenario.usefulSentence}
          </p>
        </div>
        <UsefulPhrases phrases={scenario.usefulPhrases} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <PrimaryButton onClick={() => setRepeatDone(true)}>I said it out loud</PrimaryButton>
          {repeatDone ? <SecondaryButton onClick={() => setStep(4)}>Next</SecondaryButton> : null}
        </div>
        {repeatDone ? <p style={{ color: colors.success, fontWeight: 900, margin: 0 }}>Nice job.</p> : null}
      </ExerciseStep>
    );
  }

  if (step === 4) {
    return (
      <ExerciseStep step={4} title="Choose the Best Response">
        <MultipleChoice onAnswer={() => setResponseAnswered(true)} question={scenario.bestResponse} />
        <PrimaryButton disabled={!responseAnswered} onClick={() => setStep(5)}>
          Next
        </PrimaryButton>
      </ExerciseStep>
    );
  }

  return (
    <ExerciseStep step={5} title="Your Turn">
      <label style={{ color: colors.text, display: "grid", fontSize: 18, fontWeight: 900, gap: 10 }}>
        <span style={{ color: colors.blueDark, fontSize: 22 }}>What would you say?</span>
        <span style={{ color: colors.muted, fontWeight: 800 }}>{scenario.yourTurnPrompt}</span>
        <textarea
          onChange={(event) => setStudentResponse(event.target.value)}
          placeholder="Type what you would say..."
          style={{
            border: `2px solid ${colors.border}`,
            borderRadius: 16,
            color: colors.text,
            font: "inherit",
            minHeight: 140,
            padding: 14,
            resize: "vertical"
          }}
          value={studentResponse}
        />
      </label>
      <PrimaryButton
        disabled={studentResponse.trim().length === 0}
        onClick={() => {
          completeScenario(`${categorySlug}-${scenario.slug}`);
          setFinished(true);
        }}
      >
        Finish Practice
      </PrimaryButton>
    </ExerciseStep>
  );
}

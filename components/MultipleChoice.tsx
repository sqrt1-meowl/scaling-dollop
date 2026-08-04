"use client";

import { useState } from "react";
import { colors } from "@/components/IdeaSpeakUI";
import type { Question } from "@/lib/ideaSpeakData";

export function MultipleChoice({ onAnswer, question }: { onAnswer?: (isCorrect: boolean) => void; question: Question }) {
  const [selected, setSelected] = useState("");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h3 style={{ color: colors.text, fontSize: 22, lineHeight: 1.25, margin: 0 }}>{question.prompt}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {question.choices.map((choice) => {
          const isSelected = selected === choice;
          const isCorrect = choice === question.answer;

          return (
            <button
              key={choice}
              onClick={() => {
                setSelected(choice);
                onAnswer?.(isCorrect);
              }}
              style={{
                background: isSelected ? (isCorrect ? colors.blueLight : "#fee2e2") : colors.white,
                border: `2px solid ${isSelected ? (isCorrect ? colors.blue : "#fca5a5") : colors.border}`,
                borderRadius: 16,
                color: colors.text,
                cursor: "pointer",
                font: "inherit",
                fontWeight: 800,
                lineHeight: 1.35,
                padding: "14px 16px",
                textAlign: "left"
              }}
              type="button"
            >
              {choice}
            </button>
          );
        })}
      </div>
      {selected ? (
        <p style={{ color: selected === question.answer ? colors.success : colors.danger, fontWeight: 900, margin: 0 }}>
          {selected === question.answer ? "Correct." : "Try again."}
        </p>
      ) : null}
    </div>
  );
}

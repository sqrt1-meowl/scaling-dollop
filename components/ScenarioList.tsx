"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, colors, gridStyle } from "@/components/IdeaSpeakUI";
import { emptyProgress, getProgress, type StudentProgress } from "@/components/progressStorage";
import type { Scenario } from "@/lib/ideaSpeakData";

export function ScenarioCard({ basePath, scenario }: { basePath: string; scenario: Scenario }) {
  const [progress, setProgress] = useState<StudentProgress>(emptyProgress);
  const scenarioId = `${basePath.split("/").pop()}-${scenario.slug}`;
  const isCompleted = progress.completedScenarioIds.includes(scenarioId);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <Link href={`${basePath}/${scenario.slug}`} style={{ textDecoration: "none" }}>
      <Card style={{ color: colors.text, display: "grid", gap: 12, minHeight: 220 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span
            style={{
              background: colors.blueLight,
              borderRadius: 999,
              color: colors.blueDark,
              fontSize: 14,
              fontWeight: 900,
              padding: "7px 11px"
            }}
          >
            Speaking + Listening
          </span>
          {isCompleted ? (
            <span
              style={{
                background: "#ccfbf1",
                borderRadius: 999,
                color: colors.success,
                fontSize: 14,
                fontWeight: 900,
                padding: "7px 11px"
              }}
            >
              Completed
            </span>
          ) : null}
        </div>
        <h2 style={{ color: colors.blueDark, fontSize: 25, lineHeight: 1.12, margin: 0 }}>{scenario.title}</h2>
        <p style={{ color: colors.muted, fontSize: 17, lineHeight: 1.45, margin: 0 }}>{scenario.description}</p>
        <span
          style={{
            background: colors.blue,
            borderRadius: 14,
            color: colors.white,
            fontWeight: 900,
            justifySelf: "start",
            marginTop: "auto",
            padding: "12px 18px"
          }}
        >
          Practice
        </span>
      </Card>
    </Link>
  );
}

export function ScenarioList({ basePath, scenarios }: { basePath: string; scenarios: Scenario[] }) {
  return (
    <section style={gridStyle}>
      {scenarios.map((scenario) => (
        <ScenarioCard basePath={basePath} key={scenario.slug} scenario={scenario} />
      ))}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { StatCard, gridStyle } from "@/components/IdeaSpeakUI";
import { emptyProgress, getProgress, getSimpleStreak, type StudentProgress } from "@/components/progressStorage";

export function ProgressStats() {
  const [progress, setProgress] = useState<StudentProgress>(emptyProgress);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <section style={gridStyle}>
      <StatCard label="XP" value={progress.xp} />
      <StatCard label="Practices Completed" value={progress.practicesCompleted} />
      <StatCard label="Streak" value={getSimpleStreak(progress)} />
    </section>
  );
}

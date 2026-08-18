import type { Metadata } from "next";
import { SpineView } from "@/components/mastery/SpineView";
import { masteryLevels, masterySkills } from "@/lib/masterySpine";

export const metadata: Metadata = {
  title: "My Spine",
  description: "Your fixed 210-level SAT Math mastery path.",
};

const skillNames = new Map(masterySkills.map((skill) => [skill.code, skill.name]));

export default function SpinePage() {
  const levels = masteryLevels.map((level, index) => ({
    id: level.id,
    code: level.code,
    name: level.name,
    strandCode: level.strandCode,
    skillCode: level.skillCode,
    skillName: skillNames.get(level.skillCode) ?? level.skillCode,
    sequenceIndex: level.sequenceIndex,
    tier: level.tier,
    timeStandardSeconds: level.timeStandardSeconds,
    accuracyThreshold: level.accuracyThreshold,
    videoUrl: level.videoUrl,
    state: index === 0 ? "current" as const : "locked" as const,
  }));
  return <SpineView initialLevels={levels}/>;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorksheetPlayer } from "@/components/mastery/WorksheetPlayer";
import { AlgebraWorksheetPreview } from "@/components/mastery/AlgebraWorksheetPreview";
import { masteryLevels, worksheetIdFor } from "@/lib/masterySpine";

const previewLevelCodes = new Set(["F1a", "A1a", "A1b"]);

export const metadata: Metadata = {
  title: "Worksheet Player",
  description: "A focused SAT Math mastery worksheet with fluency, applied, and SAT bands.",
};

export default async function WorksheetPage({ params }: PageProps<"/worksheet/[worksheetId]">) {
  const { worksheetId } = await params;
  const previewLevel = masteryLevels.find((level) => previewLevelCodes.has(level.code) && worksheetIdFor(level.code, 1) === worksheetId);
  if (!previewLevel) notFound();
  if (previewLevel.code !== "F1a") return <AlgebraWorksheetPreview worksheetId={worksheetId} levelCode={previewLevel.code as "A1a" | "A1b"} levelName={previewLevel.name}/>;
  return <WorksheetPlayer worksheetId={worksheetId} levelCode={previewLevel.code} levelName={previewLevel.name}/>;
}

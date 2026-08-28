import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorksheetPlayer } from "@/components/mastery/WorksheetPlayer";
import { AlgebraWorksheetPreview } from "@/components/mastery/AlgebraWorksheetPreview";
import { studentSubskills as masteryLevels, studentWorksheetIdFor as worksheetIdFor } from "@/lib/studentCurriculum";

const previewLevelCodes = new Set(["F1U1", "A1U1"]);

export const metadata: Metadata = {
  title: "Worksheet Player",
  description: "A focused SAT Math worksheet with a worked example, Easy practice, and Medium practice.",
};

export default async function WorksheetPage({ params }: PageProps<"/worksheet/[worksheetId]">) {
  const { worksheetId } = await params;
  const previewLevel = masteryLevels.find((level) => previewLevelCodes.has(level.code) && worksheetIdFor(level.code, 1) === worksheetId);
  if (!previewLevel) notFound();
  if (previewLevel.code !== "F1U1") return <AlgebraWorksheetPreview worksheetId={worksheetId} levelCode="A1U1" levelName={previewLevel.name}/>;
  return <WorksheetPlayer worksheetId={worksheetId} levelCode={previewLevel.code} levelName={previewLevel.name}/>;
}

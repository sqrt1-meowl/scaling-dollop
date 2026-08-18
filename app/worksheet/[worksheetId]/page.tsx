import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorksheetPlayer } from "@/components/mastery/WorksheetPlayer";
import { masteryLevels, worksheetIdFor } from "@/lib/masterySpine";

const previewLevel = masteryLevels[0];
const previewWorksheetId = worksheetIdFor(previewLevel.code, 1);

export const metadata: Metadata = {
  title: "Worksheet Player",
  description: "A focused SAT Math mastery worksheet with fluency, applied, and SAT bands.",
};

export default async function WorksheetPage({ params }: PageProps<"/worksheet/[worksheetId]">) {
  const { worksheetId } = await params;
  if (worksheetId !== previewWorksheetId) notFound();
  return <WorksheetPlayer worksheetId={worksheetId} levelCode={previewLevel.code} levelName={previewLevel.name}/>;
}

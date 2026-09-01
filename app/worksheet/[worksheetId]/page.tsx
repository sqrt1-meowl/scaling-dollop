import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlgebraWorksheetPreview } from "@/components/mastery/AlgebraWorksheetPreview";
import { GeometryHardPractice, type GeometryHardCode } from "@/components/mastery/GeometryHardPractice";
import { GeometryWorksheetPreview, type GeometryLevelCode } from "@/components/mastery/GeometryWorksheetPreview";
import { studentSubskills as masteryLevels, studentWorksheetIdFor as worksheetIdFor } from "@/lib/studentCurriculum";

const algebraLevelCodes = new Set(["A1U1", "A1U2"]);
const geometryLevelCodes = new Set<GeometryLevelCode>([
  "G1U1", "G1U2", "G1U3",
  "G2U1", "G2U2", "G2U3",
  "G3U1", "G3U2",
  "G4U1", "G4U2",
]);
const previewLevelCodes = new Set([...algebraLevelCodes, ...geometryLevelCodes]);

const hardPracticesByWorksheetId: Record<string, GeometryHardCode> = {
  "ws-g1u3-05": "G1H",
  "ws-g2u3-05": "G2H",
  "ws-g3u2-05": "G3H",
  "ws-g4u2-05": "G4H",
};

export const metadata: Metadata = {
  title: "Worksheet Player",
  description: "A focused SAT Math worksheet with a worked example, Easy practice, and Medium practice.",
};

export default async function WorksheetPage({ params }: PageProps<"/worksheet/[worksheetId]">) {
  const { worksheetId } = await params;
  const hardCode = hardPracticesByWorksheetId[worksheetId];
  if (hardCode) return <GeometryHardPractice worksheetId={worksheetId} hardCode={hardCode}/>;
  const previewLevel = masteryLevels.find((level) => previewLevelCodes.has(level.code) && worksheetIdFor(level.code, 1) === worksheetId);
  if (!previewLevel) notFound();
  if (geometryLevelCodes.has(previewLevel.code as GeometryLevelCode)) {
    return <GeometryWorksheetPreview worksheetId={worksheetId} levelCode={previewLevel.code as GeometryLevelCode} levelName={previewLevel.name}/>;
  }
  return <AlgebraWorksheetPreview worksheetId={worksheetId} levelCode={previewLevel.code as "A1U1" | "A1U2"} levelName={previewLevel.name}/>;
}

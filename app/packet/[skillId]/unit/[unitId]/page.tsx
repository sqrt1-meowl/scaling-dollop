import { UnitLearningFlow } from "@/components/UnitLearningFlow";
import { allProgramSkills } from "@/lib/programCurriculum";

export function generateStaticParams() {
  return allProgramSkills.flatMap((skill) => skill.units.map((unit) => ({ skillId: skill.id.toLowerCase(), unitId: unit.id.toLowerCase() })));
}

export default function UnitPage() {
  return <UnitLearningFlow/>;
}


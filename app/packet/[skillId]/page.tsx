import { SkillPacketOverview } from "@/components/SkillPacketOverview";
import { allProgramSkills } from "@/lib/programCurriculum";

export function generateStaticParams() {
  return allProgramSkills.map((skill) => ({ skillId: skill.id.toLowerCase() }));
}

export default function SkillPacketPage() {
  return <SkillPacketOverview/>;
}


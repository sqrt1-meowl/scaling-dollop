import { PacketHardPractice } from "@/components/PacketHardPractice";
import { allProgramSkills } from "@/lib/programCurriculum";

export function generateStaticParams() {
  return allProgramSkills.map((skill) => ({ skillId: skill.id.toLowerCase() }));
}

export default function PacketHardPracticePage() {
  return <PacketHardPractice/>;
}

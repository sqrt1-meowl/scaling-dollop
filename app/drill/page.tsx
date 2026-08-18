import { Dumbbell } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function DrillPage() {
  return (
    <AppShell role="student" title="Drill">
      <section className="mx-auto max-w-[760px] border border-[var(--line)] bg-[#fffdf8] px-6 py-16 text-center md:px-12 md:py-24">
        <div className="mx-auto grid size-12 place-items-center border border-[#c8d1db] bg-white text-[var(--navy)]">
          <Dumbbell size={20} />
        </div>
        <p className="label mt-6 text-[#416f9d]">Independent practice</p>
        <h2 className="academic-heading mt-3 text-4xl">Drill</h2>
        <p className="mx-auto mt-4 max-w-[500px] text-sm leading-6 text-[var(--muted)]">
          Category and difficulty practice sets will live here. This section is ready for questions when you add them.
        </p>
      </section>
    </AppShell>
  );
}

import Link from "next/link";
import { Card, PageHeader, PageShell, TopNav, colors } from "@/components/IdeaSpeakUI";
import { ProgressStats } from "@/components/ProgressStats";

export default function StudentDashboardPage() {
  return (
    <PageShell>
      <TopNav />
      <PageHeader title="Welcome back" text="What do you want to practice today?" />

      <Card style={{ display: "grid", gap: 18, marginBottom: 24 }}>
        <h2 style={{ color: colors.blueDark, fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1, margin: 0 }}>Speaking & Listening</h2>
        <p style={{ color: colors.muted, fontSize: 20, lineHeight: 1.5, margin: 0 }}>
          Practice real conversations for school, friends, teachers, and daily life.
        </p>
        <Link
          href="/student/speaking-listening"
          style={{
            background: colors.blue,
            borderRadius: 16,
            color: colors.white,
            fontWeight: 900,
            justifySelf: "start",
            padding: "15px 20px",
            textDecoration: "none"
          }}
        >
          Start
        </Link>
      </Card>

      <ProgressStats />
    </PageShell>
  );
}

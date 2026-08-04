import { ButtonLink, Card, PageShell, colors } from "@/components/IdeaSpeakUI";

export default function HomePage() {
  return (
    <PageShell>
      <Card
        style={{
          alignItems: "center",
          display: "grid",
          gap: 28,
          margin: "42px auto",
          maxWidth: 860,
          padding: "clamp(28px, 6vw, 70px)",
          textAlign: "center"
        }}
      >
        <div>
          <h1 style={{ fontSize: "clamp(3.2rem, 8vw, 6rem)", letterSpacing: 0, lineHeight: 1, margin: "0 0 16px" }}>IdeaSpeak</h1>
          <p style={{ color: colors.blueDark, fontSize: "clamp(1.25rem, 3vw, 1.8rem)", fontWeight: 900, margin: "0 0 18px" }}>
            Practice real English for school and life.
          </p>
          <p style={{ color: colors.muted, fontSize: 18, lineHeight: 1.7, margin: "0 auto", maxWidth: 640 }}>
            Short speaking and listening practice for immigrant students.
          </p>
        </div>
        <ButtonLink href="/student">Start Practice</ButtonLink>
      </Card>
    </PageShell>
  );
}

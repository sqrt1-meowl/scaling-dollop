import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ScenarioCategory } from "@/lib/ideaSpeakData";

export const colors = {
  blue: "#2563eb",
  blueDark: "#1e3a8a",
  blueLight: "#dbeafe",
  sky: "#eff6ff",
  white: "#ffffff",
  text: "#172554",
  muted: "#64748b",
  border: "#bfdbfe",
  success: "#0f766e",
  danger: "#b91c1c"
};

export const cardStyle: CSSProperties = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 22,
  boxShadow: "0 18px 42px rgba(37, 99, 235, 0.1)",
  padding: 24
};

export const gridStyle: CSSProperties = {
  display: "grid",
  gap: 18,
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
};

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 55%, #eef7ff 100%)",
        color: colors.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        minHeight: "100vh",
        padding: "28px 18px"
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 1040 }}>{children}</div>
    </main>
  );
}

export function TopNav() {
  return (
    <nav style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "space-between", marginBottom: 30 }}>
      <Link href="/" style={{ color: colors.blueDark, fontSize: 24, fontWeight: 900, textDecoration: "none" }}>
        IdeaSpeak
      </Link>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <PillLink href="/student">Dashboard</PillLink>
        <PillLink href="/student/speaking-listening">Speaking & Listening</PillLink>
      </div>
    </nav>
  );
}

export function PillLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      href={href}
      style={{
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 999,
        color: colors.blueDark,
        fontWeight: 900,
        padding: "10px 16px",
        textDecoration: "none"
      }}
    >
      {children}
    </Link>
  );
}

export function ButtonLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      href={href}
      style={{
        background: colors.blue,
        borderRadius: 16,
        color: colors.white,
        display: "inline-flex",
        fontWeight: 900,
        justifyContent: "center",
        minHeight: 52,
        padding: "15px 22px",
        textDecoration: "none"
      }}
    >
      {children}
    </Link>
  );
}

export function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} style={{ color: colors.blueDark, display: "inline-flex", fontWeight: 900, marginBottom: 18, textDecoration: "none" }}>
      Back
    </Link>
  );
}

export function PageHeader({ title, text }: { title: string; text?: string }) {
  return (
    <header style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)", letterSpacing: 0, lineHeight: 1, margin: "0 0 12px" }}>{title}</h1>
      {text ? <p style={{ color: colors.muted, fontSize: 20, lineHeight: 1.55, margin: 0, maxWidth: 760 }}>{text}</p> : null}
    </header>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ ...cardStyle, ...style }}>{children}</section>;
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card style={{ minHeight: 110 }}>
      <p style={{ color: colors.muted, fontSize: 16, fontWeight: 900, margin: "0 0 10px" }}>{label}</p>
      <strong style={{ color: colors.blueDark, display: "block", fontSize: 34, lineHeight: 1 }}>{value}</strong>
    </Card>
  );
}

export function CategoryCard({ category }: { category: ScenarioCategory }) {
  return (
    <Link href={`/student/speaking-listening/${category.slug}`} style={{ textDecoration: "none" }}>
      <Card style={{ color: colors.text, display: "grid", gap: 12, minHeight: 205 }}>
        <h2 style={{ color: colors.blueDark, fontSize: 28, lineHeight: 1.12, margin: 0 }}>{category.title}</h2>
        <p style={{ color: colors.muted, fontSize: 17, lineHeight: 1.5, margin: 0 }}>{category.description}</p>
        <span style={{ color: colors.blue, fontWeight: 900, marginTop: "auto" }}>Choose</span>
      </Card>
    </Link>
  );
}

export function ExerciseStep({ children, step, title }: { children: ReactNode; step: number; title: string }) {
  return (
    <Card style={{ display: "grid", gap: 18, margin: "0 auto", maxWidth: 760 }}>
      <p style={{ color: colors.blue, fontSize: 15, fontWeight: 900, letterSpacing: 0, margin: 0 }}>Step {step} of 5</p>
      <h2 style={{ color: colors.blueDark, fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1, margin: 0 }}>{title}</h2>
      {children}
    </Card>
  );
}

export function UsefulPhrases({ phrases }: { phrases: string[] }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {phrases.map((phrase) => (
        <p
          key={phrase}
          style={{
            background: colors.sky,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            fontSize: 18,
            fontWeight: 800,
            lineHeight: 1.35,
            margin: 0,
            padding: 14
          }}
        >
          {phrase}
        </p>
      ))}
    </div>
  );
}

export function PrimaryButton({ children, disabled, onClick }: { children: ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: disabled ? "#93c5fd" : colors.blue,
        border: 0,
        borderRadius: 16,
        color: colors.white,
        cursor: disabled ? "not-allowed" : "pointer",
        font: "inherit",
        fontWeight: 900,
        minHeight: 54,
        padding: "15px 22px"
      }}
      type="button"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: colors.blueLight,
        border: 0,
        borderRadius: 16,
        color: colors.blueDark,
        cursor: "pointer",
        font: "inherit",
        fontWeight: 900,
        minHeight: 50,
        padding: "13px 18px"
      }}
      type="button"
    >
      {children}
    </button>
  );
}

export function CompletionScreen({ backHref }: { backHref: string }) {
  return (
    <Card style={{ display: "grid", gap: 18, margin: "0 auto", maxWidth: 700, textAlign: "center" }}>
      <p style={{ color: colors.success, fontSize: 18, fontWeight: 900, margin: 0 }}>Practice complete</p>
      <h1 style={{ color: colors.blueDark, fontSize: "clamp(2.8rem, 8vw, 5rem)", lineHeight: 1, margin: 0 }}>+10 XP</h1>
      <p style={{ color: colors.muted, fontSize: 18, lineHeight: 1.5, margin: 0 }}>Nice work. You practiced English you can use tomorrow.</p>
      <ButtonLink href={backHref}>Back to scenarios</ButtonLink>
    </Card>
  );
}

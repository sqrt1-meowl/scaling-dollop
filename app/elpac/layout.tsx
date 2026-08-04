import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ELPAC Practice",
  description:
    "Interactive ELPAC reading, listening, speaking, and writing practice for students.",
};

export default function ElpacLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

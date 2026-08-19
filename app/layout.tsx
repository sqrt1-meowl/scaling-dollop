import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayala 4-Year Planner",
  description: "Plan Ayala High School and community-college courses across grades 9–12."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

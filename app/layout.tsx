import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Practice Hub",
  description: "Simple ELPAC-aligned reading, listening, speaking, and writing practice for students."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

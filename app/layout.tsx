import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IdeaSpeak",
  description: "Short speaking and listening practice for immigrant students."
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

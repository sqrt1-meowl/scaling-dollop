import type { Metadata } from "next";
import { headers } from "next/headers";
import "katex/dist/katex.min.css";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const image = new URL("/og.png", base).toString();
  return {
    metadataBase: base,
    title: { default: "SAT Math Drill", template: "%s | SAT Math Drill" },
    description: "A quiet, mastery-based SAT Math practice program for students and teachers.",
    openGraph: { title: "SAT Math Drill", description: "Fluency first. Strategy for the hard ones.", type: "website", images: [{ url: image, width: 1733, height: 907, alt: "SAT Math Drill" }] },
    twitter: { card: "summary_large_image", title: "SAT Math Drill", description: "Fluency first. Strategy for the hard ones.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>;
}

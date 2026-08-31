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
    title: { default: "SAT Math Mastery", template: "%s | SAT Math Mastery" },
    description: "A focused, worksheet-first SAT Math mastery program organized into 62 precise curriculum units.",
    openGraph: { title: "SAT Math Mastery", description: "Daily SAT Math practice across a focused, diagnostic-gated curriculum.", type: "website", images: [{ url: image, width: 1536, height: 1024, alt: "SAT Math Mastery digital workbook" }] },
    twitter: { card: "summary_large_image", title: "SAT Math Mastery", description: "Daily SAT Math practice across a focused, diagnostic-gated curriculum.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>;
}

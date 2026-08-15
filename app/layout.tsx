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
    title: { default: "The Practice Hub", template: "%s | The Practice Hub" },
    description: "Simple ELPAC-aligned reading, listening, speaking, and writing practice for students.",
    openGraph: { title: "The Practice Hub", description: "Clear ELPAC-aligned practice for students.", type: "website", images: [{ url: image, width: 1536, height: 1024, alt: "The Practice Hub ELPAC-aligned practice" }] },
    twitter: { card: "summary_large_image", title: "The Practice Hub", description: "Clear ELPAC-aligned practice for students.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>;
}

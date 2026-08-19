import type { Metadata } from "next";
import { headers } from "next/headers";
import AyalaPlanner from "../components/AyalaPlanner";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const rawHost = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const host = /^[-.:a-zA-Z0-9]+$/.test(rawHost) ? rawHost : "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const title = "Ayala 4-Year Planner";
  const description = "Plan high school and college courses in one place.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function HomePage() {
  return <AyalaPlanner />;
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  geometryHardCorrectAnswers,
  geometryHardSets,
  type GeometryHardCode,
} from "@/components/mastery/GeometryHardPractice";
import { MistakeReview, type MistakeRecord } from "@/components/mastery/WorksheetReview";

const hardPracticesByWorksheetId: Record<string, GeometryHardCode> = {
  "ws-g1u3-05": "G1H",
  "ws-g2u3-05": "G2H",
  "ws-g3u2-05": "G3H",
  "ws-g4u2-05": "G4H",
};

export default function HardMistakeReviewPage() {
  const { worksheetId } = useParams<{ worksheetId: string }>();
  const hardCode = hardPracticesByWorksheetId[worksheetId];
  const set = hardCode ? geometryHardSets[hardCode] : null;
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!set) return;
    let active = true;
    fetch(`/api/mastery/mistakes?worksheetId=${encodeURIComponent(worksheetId)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { mistakes?: MistakeRecord[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "Mistakes could not be loaded.");
        if (active) setMistakes(payload.mistakes ?? []);
      })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [set, worksheetId]);

  if (!set) return <AppShell role="student" title="Review mistakes"><p>This Hard Practice review is not available.</p></AppShell>;

  return <AppShell role="student" title={`${hardCode} · Review mistakes`}>
    <div className="worksheet-player">
      <Link href="/category/geometry-trigonometry" className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowLeft size={14}/>Geometry &amp; Trigonometry</Link>
      <header className="border-b-2 border-[var(--ink)] pb-7">
        <p className="label text-[var(--geometry)]">{hardCode} · Hard Practice</p>
        <h2 className="academic-heading mt-3 text-4xl">Review mistakes</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{set.title.replace(" — Hard Practice", "")}</p>
      </header>

      {loading ? <div className="mt-7 flex items-center gap-3 border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]"><LoaderCircle className="animate-spin" size={18}/>Loading your mistakes…</div>
        : error ? <div className="mt-7 border border-[#d7bdb4] bg-[#fff6f3] p-5 text-sm text-[#8b3d2c]">{error}</div>
        : <MistakeReview mistakes={mistakes} problems={set.problems} correctAnswers={geometryHardCorrectAnswers}/>}

      <div className="mt-7 flex flex-wrap gap-3">
        <Link className="btn-primary" href={`/worksheet/${worksheetId}`}>Open Hard Practice<ArrowRight size={15}/></Link>
        <Link className="btn-secondary" href="/category/geometry-trigonometry">Return to category</Link>
      </div>
    </div>
  </AppShell>;
}

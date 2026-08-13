import { redirect } from "next/navigation";
export default async function LegacyChallengePage({ params }: { params: Promise<{ topic: string }> }) { const { topic } = await params; redirect(`/topic/${topic}`); }

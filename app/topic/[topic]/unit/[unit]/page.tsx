import { redirect } from "next/navigation";
export default async function LegacyUnitPage({ params }: { params: Promise<{ topic: string }> }) { const { topic } = await params; redirect(`/topic/${topic}`); }

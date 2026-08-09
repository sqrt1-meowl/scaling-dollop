"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Lightbulb, LockKeyhole, Play, TriangleAlert } from "lucide-react";
import { RoleGuard, useApp } from "./AppProvider";
import { getCategoryForTopic, getTopic } from "@/lib/curriculum";

export function LiveChallenge() {
  const params = useParams<{ topic: string }>();
  const topic = getTopic(params.topic);
  const category = getCategoryForTopic(params.topic);
  const { data, updateProgress } = useApp();
  const progress = data.progress[params.topic];
  if (!topic || !category || !progress) return <RoleGuard role="student"><div>Topic not found.</div></RoleGuard>;
  const unlocked = true;
  const challenge = data.challenge;
  return <RoleGuard role="student"><main className="min-h-screen bg-[#f8f6f1]"><header className="border-b border-[#d7d2ca] bg-[#10233f] text-white"><div className="mx-auto flex h-[70px] max-w-[1120px] items-center justify-between px-5"><Link href={`/topic/${topic.id}`} className="flex items-center gap-2 text-xs font-bold text-white/70"><ArrowLeft size={14}/>Back to skill</Link><div className="label text-[#e7c4ae]">Live Challenge</div></div></header>
    {!unlocked ? <div className="mx-auto grid min-h-[calc(100vh-70px)] max-w-xl place-items-center px-5 text-center"><div><LockKeyhole className="mx-auto text-[#a1623c]"/><p className="label mt-5 text-[#a1623c]">Challenge locked</p><h1 className="academic-heading mt-3 text-4xl">Clear the skill gate first.</h1><p className="mt-4 text-sm leading-6 text-[#677386]">The Live Challenge opens after a passing gate score. It is the capstone strategy lesson, not another drill.</p><Link className="btn-primary mt-7" href={`/topic/${topic.id}`}>Return to skill</Link></div></div> : <div className="mx-auto max-w-[1000px] px-5 py-12 md:py-16">
      <div className="max-w-3xl"><p className="label text-[#a1623c]">Hard SAT application</p><h1 className="academic-heading mt-3 text-5xl md:text-6xl">{topic.id === "area-and-volume" ? challenge.title : topic.title}</h1><p className="mt-4 text-sm text-[#677386]">{category.name} · {topic.code}</p></div>
      <section className="mt-12 border-y border-[#d7d2ca] py-10"><div className="grid gap-8 md:grid-cols-[1fr_230px]"><div><p className="label text-[#677386]">The question</p><h2 className="academic-heading mt-4 text-3xl leading-[1.4]">{topic.id === "area-and-volume" ? challenge.questionText : `A difficult SAT application combines ${topic.title.toLowerCase()} with an unfamiliar representation. Which relationship reveals the most efficient solution?`}</h2></div><div className="border-l-2 border-[#a1623c] bg-white/70 p-5"><TriangleAlert size={19} className="text-[#a1623c]"/><p className="mt-3 text-xs font-bold">Before you calculate</p><p className="mt-2 text-sm leading-6 text-[#677386]">Name what changes, what stays fixed, and which quantity the question actually asks for.</p></div></div></section>
      <section className="mt-14"><div className="mb-5 flex items-end justify-between"><div><p className="label text-[#a1623c]">Watch the walkthrough</p><h2 className="academic-heading mt-2 text-3xl">Teacher strategy lesson</h2></div><span className="text-xs text-[#677386]">Source {challenge.sourceId}</span></div><div className="aspect-video overflow-hidden bg-[#0d1b2d]">{challenge.videoUrl.includes("youtube.com/embed") || challenge.videoUrl.includes("player.vimeo.com") ? <iframe className="h-full w-full" src={challenge.videoUrl} title="Teacher challenge walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : challenge.videoUrl ? <video controls className="h-full w-full"><source src={challenge.videoUrl}/></video> : <div className="grid h-full place-items-center text-white"><div className="text-center"><Play className="mx-auto mb-3"/>Walkthrough video ready for teacher upload</div></div>}</div></section>
      <section className="mt-12 grid gap-5 border border-[#d7d2ca] bg-white p-7 md:grid-cols-[180px_1fr] md:p-9"><div><Lightbulb className="text-[#a1623c]"/><p className="label mt-4 text-[#a1623c]">Key idea</p></div><div><p className="academic-heading text-2xl leading-[1.5]">{challenge.takeaway}</p>{challenge.notes && <p className="mt-4 text-sm leading-6 text-[#677386]">{challenge.notes}</p>}</div></section>
      <div className="mt-8 flex flex-wrap justify-between gap-3"><Link className="btn-secondary" href={`/topic/${topic.id}`}>Back to skill</Link><button className="btn-primary" onClick={() => updateProgress(topic.id, { challengeCompleted: true, status: "complete" })}>{progress.challengeCompleted ? <><Check size={16}/>Challenge complete</> : "Complete skill"}</button></div>
    </div>}
  </main></RoleGuard>;
}

import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  getMistakes, getSpineForStudent, isKnownWorksheetId, recordMistake, startOrResumeAttempt, studentIdFromHeaders,
} from "@/lib/masteryDb";

interface Fetcher { fetch(request: Request): Promise<Response>; }
interface Env { DB: D1Database; ASSETS: Fetcher; IMAGES: { input(stream: ReadableStream): { transform(options: Record<string, unknown>): { output(options: { format: string; quality: number }): Promise<{ response(): Response }> } } }; }
interface ExecutionContext { waitUntil(promise: Promise<unknown>): void; passThroughOnException(): void; }

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/mastery/spine" && request.method === "GET") {
      try {
        const levels = await getSpineForStudent(env.DB, studentIdFromHeaders(request.headers));
        return Response.json({ levels });
      } catch (error) {
        console.error("Unable to load mastery spine", error);
        return Response.json({ error: "The mastery spine is temporarily unavailable." }, { status: 500 });
      }
    }
    if (url.pathname === "/api/mastery/attempts" && request.method === "POST") {
      try {
        const body = await request.json() as { worksheetId?: string };
        if (!body.worksheetId || !isKnownWorksheetId(body.worksheetId)) {
          return Response.json({ error: "Unknown worksheet." }, { status: 400 });
        }
        const attempt = await startOrResumeAttempt(env.DB, studentIdFromHeaders(request.headers), body.worksheetId);
        if (!attempt) return Response.json({ error: "Unknown worksheet." }, { status: 404 });
        const startedAt = attempt.startedAt.includes("T") ? attempt.startedAt : `${attempt.startedAt.replace(" ", "T")}Z`;
        return Response.json({ attempt: { ...attempt, startedAt } });
      } catch (error) {
        console.error("Unable to start mastery attempt", error);
        return Response.json({ error: "The worksheet timer could not start." }, { status: 500 });
      }
    }
    if (url.pathname === "/api/mastery/mistakes" && request.method === "GET") {
      try {
        const worksheetId = url.searchParams.get("worksheetId") || "";
        if (!isKnownWorksheetId(worksheetId)) return Response.json({ error: "Unknown worksheet." }, { status: 400 });
        const mistakes = await getMistakes(env.DB, studentIdFromHeaders(request.headers), worksheetId);
        return Response.json({ mistakes });
      } catch (error) {
        console.error("Unable to load worksheet mistakes", error);
        return Response.json({ error: "The mistake tracker is temporarily unavailable." }, { status: 500 });
      }
    }
    if (url.pathname === "/api/mastery/mistakes" && request.method === "POST") {
      try {
        const body = await request.json() as { worksheetId?: string; problemId?: string; givenAnswer?: string };
        if (!body.worksheetId || !isKnownWorksheetId(body.worksheetId)) {
          return Response.json({ error: "Unknown worksheet." }, { status: 400 });
        }
        const problemId = body.problemId?.trim() || "";
        const givenAnswer = body.givenAnswer?.trim() || "";
        if (!problemId || problemId.length > 100 || !givenAnswer || givenAnswer.length > 200) {
          return Response.json({ error: "A valid problem and answer are required." }, { status: 400 });
        }
        const mistake = await recordMistake(env.DB, studentIdFromHeaders(request.headers), body.worksheetId, problemId, givenAnswer);
        return Response.json({ mistake });
      } catch (error) {
        console.error("Unable to record worksheet mistake", error);
        return Response.json({ error: "The mistake could not be saved." }, { status: 500 });
      }
    }
    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }
    return handler.fetch(request, env, ctx);
  },
};

export default worker;

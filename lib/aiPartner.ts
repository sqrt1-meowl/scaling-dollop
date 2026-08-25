import type { ProgramQuestion } from "./programCurriculum";

export type AiPartnerAction = "hint" | "explain_step" | "similar_example" | "check_reasoning" | "full_solution";

export interface AiPartnerContext {
  domain: string;
  skillPacket: string;
  unit: string;
  difficulty: ProgramQuestion["difficulty"];
  question: ProgramQuestion;
  studentAnswer: string;
  visibleWork?: string;
  previousHints: string[];
}

export interface AiPartnerResponse {
  mode: "mock";
  likelyMisconception: string;
  message: string;
  followUp: string;
}

export interface AiPartnerService {
  respond(context: AiPartnerContext, action: AiPartnerAction): Promise<AiPartnerResponse>;
}

function misconception(context: AiPartnerContext) {
  if (!context.studentAnswer.trim()) return "The setup has not been committed to an equation yet.";
  if (context.visibleWork?.trim()) return "The setup may be reasonable, but one operation or sign needs checking.";
  return "The answer suggests the governing relationship or requested quantity may have been misidentified.";
}

export const mockAiPartner: AiPartnerService = {
  async respond(context, action) {
    const hintIndex = Math.min(context.previousHints.length, context.question.hints.length - 1);
    const messages: Record<AiPartnerAction, string> = {
      hint: context.question.hints[hintIndex] ?? "Name the unknown and connect it to the given quantities.",
      explain_step: context.question.hints[Math.min(hintIndex + 1, context.question.hints.length - 1)] ?? "Keep the same operation balanced on both sides.",
      similar_example: `Try the same structure with simpler values: write one ${context.question.tags[0] ?? "equation"}, isolate the unknown, and verify by substitution.`,
      check_reasoning: context.visibleWork?.trim() ? "Check whether every operation was applied to both sides and whether the final value satisfies the original statement." : "Write your first equation or reasoning step so it can be checked.",
      full_solution: context.question.solution,
    };
    return {
      mode: "mock",
      likelyMisconception: misconception(context),
      message: messages[action],
      followUp: action === "full_solution"
        ? "Now solve the transfer question independently without opening help."
        : "What should your next line or equation be?",
    };
  },
};


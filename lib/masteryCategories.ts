import type { MasteryStrandCode } from "./masterySpine.ts";

export type MasteryCategoryId = "algebra" | "advanced-math" | "problem-solving-data-analysis" | "geometry-trigonometry" | "foundations-skills";

export interface MasteryCategory {
  id: MasteryCategoryId;
  name: string;
  shortName: string;
  strands: readonly MasteryStrandCode[];
  color: string;
  description: string;
}

export const masteryCategories: readonly MasteryCategory[] = [
  { id: "algebra", name: "Algebra", shortName: "Algebra", strands: ["A"], color: "#416f9d", description: "Linear equations, linear functions, systems, and inequalities." },
  { id: "advanced-math", name: "Advanced Math", shortName: "Advanced Math", strands: ["M"], color: "#755e8f", description: "Equivalent expressions, nonlinear equations, and nonlinear functions." },
  { id: "problem-solving-data-analysis", name: "Problem-Solving and Data Analysis", shortName: "Problem-Solving & Data Analysis", strands: ["D"], color: "#4f7a66", description: "Ratios, percentages, data, probability, inference, and statistical claims." },
  { id: "geometry-trigonometry", name: "Geometry and Trigonometry", shortName: "Geometry & Trigonometry", strands: ["G"], color: "#a1623c", description: "Lines and triangles, area and volume, right-triangle trigonometry, and circles." },
  { id: "foundations-skills", name: "Foundations & Skills", shortName: "Foundations & Skills", strands: ["F", "X", "C"], color: "#2f766d", description: "Optional diagnostic remediation, cross-cutting SAT skills, and integration practice." },
] as const;

export const getMasteryCategory = (id: string) => masteryCategories.find((category) => category.id === id);
export const categoryIncludesStrand = (category: MasteryCategory, strandCode: string) => (category.strands as readonly string[]).includes(strandCode);

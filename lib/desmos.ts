export interface DesmosProgress {
  bestScore: number;
  attempts: number;
  complete: boolean;
  updatedAt: string;
}

export interface DesmosDrill {
  id: string;
  skill: string;
  prompt: string;
  enter: string[];
  labels: string[];
  answers: string[];
}

export const desmosDrills: DesmosDrill[] = [
  { id: "intersection", skill: "Graphs & intersections", prompt: "Graph both lines and record their intersection.", enter: ["y = 2x + 3", "y = -x + 9"], labels: ["x-coordinate", "y-coordinate"], answers: ["2", "7"] },
  { id: "zeros", skill: "Zeros & solutions", prompt: "Graph the quadratic and record its two x-intercepts from least to greatest.", enter: ["y = x^2 - 7x + 12"], labels: ["First zero", "Second zero"], answers: ["3", "4"] },
  { id: "regression", skill: "Tables & regression", prompt: "Enter the table, run a linear regression, and record m and b.", enter: ["x₁: 1, 2, 3, 4, 5", "y₁: 3, 5, 7, 9, 11", "y₁ ~ mx₁ + b"], labels: ["m", "b"], answers: ["2", "1"] },
  { id: "vertex", skill: "Key graph features", prompt: "Graph the function and record the vertex.", enter: ["y = (x - 4)^2 - 9"], labels: ["Vertex x", "Vertex y"], answers: ["4", "-9"] },
  { id: "system", skill: "Nonlinear systems", prompt: "Graph the circle and line. Record the positive x-coordinate of an intersection.", enter: ["x^2 + y^2 = 25", "y = 3"], labels: ["Positive x-coordinate"], answers: ["4"] },
];

export const emptyDesmosProgress = (): DesmosProgress => ({ bestScore: 0, attempts: 0, complete: false, updatedAt: new Date(0).toISOString() });
export const desmosStorageKey = (email?: string) => `sat-math-desmos-progress-v1:${email ?? "guest"}`;

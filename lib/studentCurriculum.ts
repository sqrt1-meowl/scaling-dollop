import type { MasteryLevel, MasterySkill, MasteryStrand, MasteryStrandCode, WorksheetType } from "./masterySpine.ts";

type LevelSeed = readonly [code: string, name: string, tier?: "CORE" | "EXT"];
type SkillSeed = readonly [strand: MasteryStrandCode, code: string, name: string, levels: readonly LevelSeed[]];

export const studentStrands: readonly MasteryStrand[] = [
  { code: "F", name: "Foundations (diagnostic only)", sortOrder: 1 },
  { code: "X", name: "Cross-cutting skills", sortOrder: 2 },
  { code: "A", name: "Algebra", sortOrder: 3 },
  { code: "M", name: "Advanced Math", sortOrder: 4 },
  { code: "D", name: "Problem-Solving and Data Analysis", sortOrder: 5 },
  { code: "G", name: "Geometry and Trigonometry", sortOrder: 6 },
  { code: "C", name: "Integration and test readiness", sortOrder: 7 },
] as const;

const groups: readonly SkillSeed[] = [
  ["F", "F1", "Foundational number and expression fluency", [
    ["F1U1", "Signed numbers, fractions, decimals, percents, and order of operations", "EXT"],
    ["F1U2", "Combining like terms, distribution, substitution, and exponent rules", "EXT"],
  ]],
  ["F", "F2", "Foundational equations, graphs, and measurement", [
    ["F2U1", "One- and two-step equations, proportions, and formula rearrangement", "EXT"],
    ["F2U2", "Coordinate plane, tables, graph reading, rate of change, and function notation", "EXT"],
    ["F2U3", "Geometry formulas, measurement, and unit conversion", "EXT"],
  ]],
  ["X", "X", "Cross-cutting skills", [
    ["X1", "Word-problem translation: sentence → expression, equation, or inequality"],
    ["X2", "Student-produced response mechanics and entry rules"],
    ["X3", "Desmos method selection: intersections, roots, systems, regions, regressions, and tables"],
  ]],
  ["A", "A1", "Linear equations in one variable", [
    ["A1U1", "Multi-step equations: integer, fractional, and decimal coefficients; variables on both sides; parentheses"],
    ["A1U2", "Contexts → one equation; solving a formula for a variable of interest"],
    ["A1U3", "One, zero, or infinitely many solutions; the constant that forces it"],
  ]],
  ["A", "A2", "Linear relationships — equations, functions, and graphs", [
    ["A2U1", "Slope, intercepts, and linear forms; converting between them"],
    ["A2U2", "Build a line from points, a table, a graph, or a scenario in y = and f(x) = notation [Desmos]"],
    ["A2U3", "Interpret slope and intercepts with units; average rate of change; evaluate and solve f(x) = k"],
    ["A2U4", "Parallel and perpendicular lines; missing coordinates; parameter problems"],
  ]],
  ["A", "A3", "Systems of two linear equations", [
    ["A3U1", "Substitution, elimination, and graphical intersection [Desmos]"],
    ["A3U2", "Contextual systems: cost and quantity, mixture and rate"],
    ["A3U3", "Zero or infinitely many solutions; the coefficient that forces it"],
  ]],
  ["A", "A4", "Linear inequalities", [
    ["A4U1", "One-variable and compound inequalities, including the sign flip"],
    ["A4U2", "Two-variable inequalities and systems: graphing, shaded regions, and testing points [Desmos]"],
    ["A4U3", "Constraint contexts, feasible regions, maximum, and minimum"],
  ]],
  ["M", "M1", "Equivalent expressions", [
    ["M1U1", "Exponent rules including zero, negative, and fractional exponents; radicals ↔ rational exponents"],
    ["M1U2", "Polynomial multiplication; GCF; factoring trinomials including grouping"],
    ["M1U3", "Difference of squares, perfect square trinomials, and completing the square as a rewriting move"],
    ["M1U4", "Rational expressions; polynomial division and remainders", "EXT"],
  ]],
  ["M", "M2", "Nonlinear equations", [
    ["M2U1", "Quadratics: factoring, zero product, quadratic formula, discriminant, and real solutions [Desmos]"],
    ["M2U2", "Radical and rational equations; checking for extraneous roots"],
    ["M2U3", "Absolute value equations and exponential equations with a common base"],
    ["M2U4", "Nonlinear systems: linear–quadratic and quadratic–quadratic; restrictions and parameters [Desmos]"],
  ]],
  ["M", "M3", "Nonlinear functions", [
    ["M3U1", "Quadratic forms: vertex, standard, and factored; choosing the useful form [Desmos]"],
    ["M3U2", "Exponential growth and decay; parameters in context; changed time intervals"],
    ["M3U3", "Transformations: f(x) + k, f(x + k), af(x), and −f(x)"],
    ["M3U4", "Nonlinear graph reading; polynomial zeros, multiplicity, and end behavior", "EXT"],
    ["M3U5", "Absolute-value, rational, and radical functions; domain, asymptotes, and composite functions"],
  ]],
  ["D", "P1", "Rates, ratios, proportion, and units", [
    ["P1U1", "Ratios, unit rates, proportions, and constants of proportionality"],
    ["P1U2", "Single- and multi-step unit conversion; derived and compound units"],
    ["P1U3", "Scale drawings, similar-figure ratios, and multi-stage proportional contexts"],
  ]],
  ["D", "P2", "Percentages", [
    ["P2U1", "The multiplier method: part, whole, percent, change, and reverse percent"],
    ["P2U2", "Discount, tax, tip, commission, successive changes, and percent from a display"],
  ]],
  ["D", "P3", "One-variable data", [
    ["P3U1", "Read frequency tables, bar graphs, histograms, dot plots, and box plots"],
    ["P3U2", "Mean, median, mode, and range from a display or with a changed value"],
    ["P3U3", "Compare standard deviation and shape; skew, outliers, and choosing a trustworthy measure"],
  ]],
  ["D", "P4", "Two-variable data", [
    ["P4U1", "Scatterplots and lines of best fit: association, prediction, slope, and intercept [Desmos]"],
    ["P4U2", "Model choice: linear, quadratic, or exponential; residuals as actual minus predicted"],
  ]],
  ["D", "P5", "Probability", [
    ["P5U1", "Probability from counts and frequency tables; complements and compound events"],
    ["P5U2", "Two-way tables: joint, marginal, conditional, and restricted sample spaces"],
  ]],
  ["D", "P6", "Inference and statistical claims", [
    ["P6U1", "Population, sample, parameter, statistic; random sampling vs. random assignment"],
    ["P6U2", "Margin of error: plausible values, interpretation, and sample-size effects"],
    ["P6U3", "Generalization, association vs. causation, bias, and study limitations"],
  ]],
  ["G", "G1", "Area and volume", [
    ["G1U1", "Perimeter and area, including circles, composite regions, and shaded regions"],
    ["G1U2", "Volume and surface area using the SAT reference sheet"],
    ["G1U3", "Missing dimensions; scale factors; area and volume change; units and modeling"],
  ]],
  ["G", "G2", "Lines, angles, and triangles", [
    ["G2U1", "Vertical angles, linear pairs, parallel lines, and transversals"],
    ["G2U2", "Triangle and polygon angles; isosceles, equilateral, and congruent figures"],
    ["G2U3", "Similar triangles and polygons; proportional sides, scale factors, and indirect measurement"],
  ]],
  ["G", "G3", "Right triangles and trigonometry", [
    ["G3U1", "Pythagorean theorem, triples, coordinate distance, and special right triangles"],
    ["G3U2", "SOH-CAH-TOA; complementary trig; radians ↔ degrees; diagrams and contexts"],
  ]],
  ["G", "G4", "Circles", [
    ["G4U1", "Central angles, arcs, sectors, tangent-radius perpendicularity, and inscribed angles", "EXT"],
    ["G4U2", "Equation of a circle; center and radius by completing the square; missing constants"],
  ]],
  ["C", "C", "Integration and test readiness", [
    ["C1", "Mixed-domain sets, easy → hard, unlocked progressively"],
    ["C2", "Timing and pacing for adaptive module routing"],
    ["C3", "Error repair loop and adaptive full-length practice"],
  ]],
] as const;

export const studentSkills: readonly MasterySkill[] = groups.map(([strandCode, code, name], index) => ({
  code, name, strandCode, sortOrder: index + 1,
}));

export const studentSubskills: readonly MasteryLevel[] = groups.flatMap(([strandCode, skillCode, , levels]) =>
  levels.map(([code, name, tier = "CORE"]) => ({ code, name, tier, strandCode, skillCode })),
).map((level, index) => ({
  ...level, id: `unit-${level.code.toLowerCase()}`, sequenceIndex: index + 1,
  timeStandardSeconds: null, accuracyThreshold: 90, videoUrl: "",
}));

export const studentWorksheetTypeFor = (index: number): WorksheetType => index <= 3 ? "PRACTICE" : index === 4 ? "MIXED" : "MASTERY_CHECK";
export const studentWorksheetIdFor = (levelCode: string, index: number) => `ws-${levelCode.toLowerCase()}-${String(index).padStart(2, "0")}`;
export const studentUnitHasWorksheets = (level: Pick<MasteryLevel, "strandCode">) => level.strandCode !== "F";

export const studentSubskillCounts = { total: 62, skills: 21, F: 5, X: 3, A: 13, M: 13, D: 15, G: 10, C: 3, EXT: 8 } as const;

export function validateStudentSubskills() {
  const errors: string[] = [];
  if (studentSubskills.length !== studentSubskillCounts.total) errors.push(`Expected ${studentSubskillCounts.total} units; found ${studentSubskills.length}.`);
  if (studentSkills.length !== studentSubskillCounts.skills) errors.push(`Expected ${studentSubskillCounts.skills} skill groups; found ${studentSkills.length}.`);
  for (const strand of studentStrands) {
    const actual = studentSubskills.filter((level) => level.strandCode === strand.code).length;
    const expected = studentSubskillCounts[strand.code as keyof typeof studentSubskillCounts];
    if (actual !== expected) errors.push(`${strand.code} should have ${expected} units; found ${actual}.`);
  }
  const extensionCount = studentSubskills.filter((level) => level.tier === "EXT").length;
  if (extensionCount !== studentSubskillCounts.EXT) errors.push(`Expected ${studentSubskillCounts.EXT} optional/lower-priority units; found ${extensionCount}.`);
  if (new Set(studentSubskills.map((level) => level.code.toLowerCase())).size !== studentSubskills.length) errors.push("Unit codes must be unique (case-insensitive).");
  if (studentSubskills.filter((level) => level.strandCode === "F").some(studentUnitHasWorksheets)) errors.push("Diagnostic Foundations units must not generate worksheet sets.");
  return errors;
}

const errors = validateStudentSubskills();
if (errors.length) throw new Error(`Invalid student curriculum:\n${errors.join("\n")}`);

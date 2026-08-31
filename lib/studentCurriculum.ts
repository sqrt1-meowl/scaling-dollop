import type { MasteryLevel, MasterySkill, MasteryStrand, MasteryStrandCode, WorksheetType } from "./masterySpine.ts";

type LevelSeed = readonly [code: string, name: string, tier?: "CORE" | "EXT"];
type SkillSeed = readonly [strand: MasteryStrandCode, code: string, name: string, levels: readonly LevelSeed[]];

export const studentStrands: readonly MasteryStrand[] = [
  { code: "F", name: "Foundations", sortOrder: 1 },
  { code: "A", name: "Algebra", sortOrder: 2 },
  { code: "M", name: "Advanced Math", sortOrder: 3 },
  { code: "D", name: "Problem-Solving & Data Analysis", sortOrder: 4 },
  { code: "G", name: "Geometry & Trigonometry", sortOrder: 5 },
] as const;

const groups: readonly SkillSeed[] = [
  ["F", "F1", "Number fluency", [
    ["F1a", "Signed numbers: + and −"], ["F1b", "Signed numbers: × and ÷"],
    ["F1c", "Fractions: add/subtract, unlike denominators"], ["F1d", "Fractions: multiply/divide, complex fractions"],
    ["F1e", "Fraction ↔ decimal ↔ percent"], ["F1f", "Order of operations with negatives and fractions"],
    ["F1R", "Interleaved review"],
  ]],
  ["F", "F2", "Expressions", [
    ["F2a", "Combining like terms"], ["F2b", "Distributing (including negative distribution)"],
    ["F2c", "Exponent rules: product, quotient, power"], ["F2d", "Zero and negative exponents"],
    ["F2e", "Evaluating by substitution"], ["F2f", "Words → expressions: the basic vocabulary"],
    ["F2R", "Interleaved review"],
  ]],
  ["F", "F3", "Equation moves", [
    ["F3a", "One-step"], ["F3b", "Two-step"], ["F3c", "Variables on both sides"],
    ["F3d", "Clearing fractions"], ["F3e", "Parentheses"], ["F3f", "Literal equations"],
    ["F3R", "Interleaved review"],
  ]],
  ["F", "F4", "Coordinate & graph reading", [
    ["F4a", "Plotting points, quadrants"], ["F4b", "Reading values off a graph"],
    ["F4c", "Bar graphs, line graphs, frequency tables"], ["F4d", "Matching tables to graphs"],
    ["F4e", "Axis scale and units"], ["F4R", "Interleaved review"],
  ]],
  ["A", "A1", "Linear equations in one variable", [
    ["A1a", "Integer coefficients"], ["A1b", "Distribute then solve"],
    ["A1c", "Variables on both sides"], ["A1d", "Fractional & decimal coefficients"],
    ["A1e", "Word problem → one equation, single quantity"],
    ["A1f", "Word problem → one equation, two related quantities"],
    ["A1g", "No solution vs infinitely many"], ["A1h", "Find the constant that forces no/infinite solutions"],
    ["A1i", "Solve a formula for a variable of interest"], ["A1R", "Interleaved review"],
  ]],
  ["A", "A2", "Linear equations in two variables", [
    ["A2a", "Slope from two points"], ["A2b", "Slope-intercept: read m and b"],
    ["A2c", "Standard form ax + by = c: rearranging and intercepts"], ["A2d", "Point-slope form"],
    ["A2e", "Equation from two points"], ["A2f", "Equation from a table of values"],
    ["A2g", "x- and y-intercepts"], ["A2h", "Parallel and perpendicular"],
    ["A2i", "Interpret slope in context, with units"], ["A2j", "Interpret intercepts in context"],
    ["A2R", "Interleaved review"],
  ]],
  ["A", "A3", "Linear functions", [
    ["A3a", "Function notation: evaluate f(x)"], ["A3b", "Solve f(x) = k"],
    ["A3c", "Build a linear model from a scenario"], ["A3d", "Interpret rate of change in context"],
    ["A3e", "Read function values from graphs and tables"], ["A3f", "Shifts and transformations", "EXT"],
    ["A3R", "Interleaved review"],
  ]],
  ["A", "A4", "Systems of two linear equations", [
    ["A4a", "Substitution"], ["A4b", "Elimination"], ["A4c", "Graphical / intersection"],
    ["A4d", "No solution vs infinite solutions"], ["A4e", "Find the coefficient forcing no/infinite solutions"],
    ["A4f", "System word problems: cost & quantity"], ["A4g", "System word problems: mixture & rate"],
    ["A4R", "Interleaved review"],
  ]],
  ["A", "A5", "Linear inequalities", [
    ["A5a", "One variable, including flipping the sign"], ["A5b", "Compound inequalities", "EXT"],
    ["A5c", "Graphing an inequality in two variables"], ["A5d", "Systems of inequalities: shaded region"],
    ["A5e", "Is this point a solution?"], ["A5f", "Constraint word problems (\"at most,\" \"at least\")"],
    ["A5R", "Interleaved review"],
  ]],
  ["M", "M1", "Equivalent expressions", [
    ["M1a", "Exponent rules including fractional exponents"], ["M1b", "Radicals ↔ rational exponents"],
    ["M1c", "Polynomial multiplication"], ["M1d", "Factoring out the GCF"],
    ["M1e", "Factoring trinomials, a = 1"], ["M1f", "Factoring trinomials, a ≠ 1"],
    ["M1g", "Difference of squares"], ["M1h", "Perfect square trinomials", "EXT"],
    ["M1i", "Rational expressions: simplify, multiply, divide"], ["M1j", "Rational expressions: add & subtract", "EXT"],
    ["M1k", "Polynomial division and remainders", "EXT"], ["M1R", "Interleaved review"],
  ]],
  ["M", "M2", "Nonlinear equations & systems", [
    ["M2a", "Quadratics by factoring"], ["M2b", "Zero product property and roots"],
    ["M2c", "Quadratic formula"], ["M2d", "Discriminant: how many solutions"],
    ["M2e", "Completing the square", "EXT"], ["M2f", "Radical equations & extraneous solutions"],
    ["M2g", "Rational equations", "EXT"], ["M2h", "Absolute value equations"],
    ["M2i", "Exponential equations with a common base"], ["M2j", "Linear–quadratic systems"],
    ["M2R", "Interleaved review"],
  ]],
  ["M", "M3", "Nonlinear functions", [
    ["M3a", "Parabolas: vertex form"], ["M3b", "Parabolas: standard form, axis of symmetry"],
    ["M3c", "Parabolas: factored form and x-intercepts"], ["M3d", "Choosing the right form for what's asked"],
    ["M3e", "Exponential growth vs decay"], ["M3f", "Interpreting exponential parameters in context"],
    ["M3g", "Compound growth with periods (quarterly, monthly)"],
    ["M3h", "Transformations: f(x)+k, f(x+k), af(x), −f(x)"],
    ["M3i", "Graph reading for nonlinear functions"], ["M3j", "Where a function is undefined", "EXT"],
    ["M3k", "Polynomial zeros and end behavior", "EXT"], ["M3l", "Composite functions f(g(x))", "EXT"],
    ["M3R", "Interleaved review"],
  ]],
  ["D", "D1", "Ratios, rates, proportional relationships, units", [
    ["D1a", "Proportions"], ["D1b", "Unit rate"], ["D1c", "Unit conversion, single and multi-step"],
    ["D1d", "Density and other derived units"], ["D1e", "Average rate of change from a graph"],
    ["D1f", "Scale drawings, maps, similar-figure ratios", "EXT"], ["D1R", "Interleaved review"],
  ]],
  ["D", "D2", "Percentages", [
    ["D2a", "Percent of a number"], ["D2b", "Increase and decrease"],
    ["D2c", "Reverse percent (find the original)"], ["D2d", "Successive percent changes", "EXT"],
    ["D2e", "In context: discount, tax, tip, commission"], ["D2f", "Percent from a table or graph"],
    ["D2R", "Interleaved review"],
  ]],
  ["D", "D3", "One-variable data", [
    ["D3a", "Mean, median, mode"], ["D3b", "Mean and median from a frequency table or dot plot"],
    ["D3c", "Range and standard deviation — compare, never compute"], ["D3d", "Effect of adding or changing a value"],
    ["D3e", "Histograms, dot plots, and box plots"], ["D3f", "Comparing two distributions"],
    ["D3g", "Outliers and skew: which measure to trust", "EXT"], ["D3R", "Interleaved review"],
  ]],
  ["D", "D4", "Two-variable data", [
    ["D4a", "Reading a scatterplot"], ["D4b", "Line of best fit: predicting"],
    ["D4c", "Interpreting slope & intercept of the fit line"], ["D4d", "Choosing the model: linear vs exponential"],
    ["D4e", "Residuals: actual vs predicted", "EXT"], ["D4R", "Interleaved review"],
  ]],
  ["D", "D5", "Probability", [
    ["D5a", "Probability from counts"], ["D5b", "Reading a two-way table"],
    ["D5c", "Probability from a two-way table"], ["D5d", "Conditional probability (\"given that…\")"],
    ["D5e", "Complements and \"not\"", "EXT"], ["D5R", "Interleaved review"],
  ]],
  ["D", "D6", "Inference and margin of error", [
    ["D6a", "Plausible population values from a sample + given margin of error"],
    ["D6b", "Interpreting margin of error in a sentence"], ["D6c", "How sample size changes margin of error", "EXT"],
  ]],
  ["D", "D7", "Evaluating statistical claims", [
    ["D7a", "Random sampling → who you can generalize to"], ["D7b", "Random assignment → when you can say \"caused\""],
    ["D7c", "Which conclusion is supported?"], ["D7d", "Spotting bias in study design", "EXT"],
    ["D-R", "Combined review for D6 + D7"],
  ]],
  ["G", "G1", "Lines, angles, triangles", [
    ["G1a", "Vertical angles & linear pairs"], ["G1b", "Parallel lines & transversals"],
    ["G1c", "Triangle angle sum & exterior angle"], ["G1d", "Isosceles & equilateral"],
    ["G1e", "Similar triangles: setting up the ratio"], ["G1f", "Congruence"],
    ["G1g", "Polygon interior & exterior angles", "EXT"], ["G1R", "Interleaved review"],
  ]],
  ["G", "G2", "Right triangles and trigonometry", [
    ["G2a", "Pythagorean theorem"], ["G2b", "Pythagorean triples", "EXT"],
    ["G2c", "45-45-90 and 30-60-90 (both on the reference sheet)"], ["G2d", "SOH-CAH-TOA: find a side"],
    ["G2e", "SOH-CAH-TOA: find an angle", "EXT"], ["G2f", "sin x = cos(90 − x)", "EXT"],
    ["G2g", "Trig in diagrams and word problems", "EXT"], ["G2R", "Interleaved review"],
  ]],
  ["G", "G3", "Area and volume", [
    ["G3a", "Area: triangle, rectangle, parallelogram, trapezoid"], ["G3b", "Circumference and area of a circle"],
    ["G3c", "Volume of prisms and cylinders"], ["G3d", "Cones, pyramids, spheres (reference sheet)"],
    ["G3e", "Surface area", "EXT"], ["G3f", "Composite and shaded regions", "EXT"],
    ["G3g", "Scaling: effect on area and volume", "EXT"], ["G3R", "Interleaved review"],
  ]],
  ["G", "G4", "Circles", [
    ["G4f", "Equation of a circle"], ["G4a", "Central angles and arc measure", "EXT"],
    ["G4b", "Arc length", "EXT"], ["G4c", "Sector area", "EXT"],
    ["G4d", "Inscribed angles", "EXT"], ["G4e", "Radians ↔ degrees", "EXT"],
    ["G4g", "Completing the square for center & radius", "EXT"],
    ["G4h", "Tangent lines and the perpendicular radius", "EXT"], ["G4R", "Interleaved review", "EXT"],
  ]],
] as const;

export const studentSkills: readonly MasterySkill[] = groups.map(([strandCode, code, name], index) => ({
  code, name, strandCode, sortOrder: index + 1,
}));

export const studentSubskills: readonly MasteryLevel[] = groups.flatMap(([strandCode, skillCode, , levels]) =>
  levels.map(([code, name, tier = "CORE"]) => ({ code, name, tier, strandCode, skillCode })),
).map((level, index) => ({
  ...level, id: `subskill-${level.code.toLowerCase()}`, sequenceIndex: index + 1,
  timeStandardSeconds: null, accuracyThreshold: 90, videoUrl: "",
}));

export const studentWorksheetTypeFor = (index: number): WorksheetType => index <= 3 ? "PRACTICE" : index === 4 ? "MIXED" : "MASTERY_CHECK";
export const studentWorksheetIdFor = (levelCode: string, index: number) => `ws-${levelCode.toLowerCase()}-${String(index).padStart(2, "0")}`;

export const studentSubskillCounts = { total: 181, skills: 23, F: 27, A: 43, M: 36, D: 42, G: 33, EXT: 33 } as const;

export function validateStudentSubskills() {
  const errors: string[] = [];
  if (studentSubskills.length !== studentSubskillCounts.total) errors.push(`Expected ${studentSubskillCounts.total} subskills; found ${studentSubskills.length}.`);
  if (studentSkills.length !== studentSubskillCounts.skills) errors.push(`Expected ${studentSubskillCounts.skills} skill groups; found ${studentSkills.length}.`);
  for (const strand of studentStrands) {
    const actual = studentSubskills.filter((level) => level.strandCode === strand.code).length;
    const expected = studentSubskillCounts[strand.code as keyof typeof studentSubskillCounts];
    if (actual !== expected) errors.push(`${strand.code} should have ${expected} subskills; found ${actual}.`);
  }
  const extensionCount = studentSubskills.filter((level) => level.tier === "EXT").length;
  if (extensionCount !== studentSubskillCounts.EXT) errors.push(`Expected ${studentSubskillCounts.EXT} extension levels; found ${extensionCount}.`);
  if (new Set(studentSubskills.map((level) => level.code.toLowerCase())).size !== studentSubskills.length) errors.push("Subskill codes must be unique (case-insensitive).");
  return errors;
}

const errors = validateStudentSubskills();
if (errors.length) throw new Error(`Invalid student subskills:\n${errors.join("\n")}`);

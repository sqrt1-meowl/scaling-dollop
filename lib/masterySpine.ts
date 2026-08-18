export type MasteryStrandCode = "F" | "A" | "M" | "D" | "G" | "S" | "P" | "X";
export type MasteryTier = "CORE" | "EXT";
export type WorksheetType = "PRACTICE" | "MIXED" | "MASTERY_CHECK";

export interface MasteryStrand {
  code: MasteryStrandCode;
  name: string;
  sortOrder: number;
}

export interface MasterySkill {
  code: string;
  name: string;
  strandCode: MasteryStrandCode;
  sortOrder: number;
}

export interface MasteryLevel {
  id: string;
  code: string;
  name: string;
  strandCode: MasteryStrandCode;
  skillCode: string;
  sequenceIndex: number;
  tier: MasteryTier;
  timeStandardSeconds: number | null;
  accuracyThreshold: number;
  videoUrl: string;
}

type LevelTuple = readonly [code: string, name: string, tier?: "EXT"];
type SkillGroup = readonly [strand: MasteryStrandCode, code: string, name: string, levels: readonly LevelTuple[]];

export const masteryStrands: readonly MasteryStrand[] = [
  { code: "F", name: "Foundations", sortOrder: 1 },
  { code: "A", name: "Algebra", sortOrder: 2 },
  { code: "S", name: "Strategy", sortOrder: 3 },
  { code: "P", name: "Grid-in / student-produced response", sortOrder: 4 },
  { code: "M", name: "Advanced Math", sortOrder: 5 },
  { code: "D", name: "Problem-Solving & Data Analysis", sortOrder: 6 },
  { code: "G", name: "Geometry & Trigonometry", sortOrder: 7 },
  { code: "X", name: "Desmos technique", sortOrder: 8 },
] as const;

const groups: readonly SkillGroup[] = [
  ["F", "F1", "Number fluency", [
    ["F1a", "Signed numbers: addition & subtraction"], ["F1b", "Signed numbers: multiplication & division"],
    ["F1c", "Fractions: add/subtract, unlike denominators"], ["F1d", "Fractions: multiply/divide, complex fractions"],
    ["F1e", "Fraction to decimal to percent"], ["F1f", "Order of operations with negatives and fractions"],
    ["F1R", "Interleaved review: number fluency"],
  ]],
  ["F", "F2", "Expressions", [
    ["F2a", "Combining like terms"], ["F2b", "Distributing, including negative distribution"],
    ["F2c", "Exponent rules: product, quotient, power"], ["F2d", "Zero and negative exponents"],
    ["F2e", "Evaluating by substitution"], ["F2f", "Words to expressions: the basic vocabulary"],
    ["F2R", "Interleaved review: expressions"],
  ]],
  ["F", "F3", "Equation moves", [
    ["F3a", "One-step equations"], ["F3b", "Two-step equations"], ["F3c", "Variables on both sides"],
    ["F3d", "Clearing fractions from equations"], ["F3e", "Equations with parentheses"],
    ["F3f", "Literal equations: solve for the letter"], ["F3R", "Interleaved review: equation moves"],
  ]],
  ["F", "F4", "Coordinate & graph reading", [
    ["F4a", "Plotting points, quadrants"], ["F4b", "Reading values off a graph"],
    ["F4c", "Bar graphs, line graphs, frequency tables"], ["F4d", "Matching tables to graphs"],
    ["F4e", "Axis scale and units"], ["F4R", "Interleaved review: graph reading"],
  ]],
  ["A", "A1", "Linear equations in one variable", [
    ["A1a", "Integer coefficients"], ["A1b", "Distribute then solve"], ["A1c", "Variables on both sides"],
    ["A1d", "Fractional & decimal coefficients"], ["A1e", "Word problem to one equation: single quantity"],
    ["A1f", "Word problem to one equation: two related quantities"], ["A1g", "No solution vs infinitely many"],
    ["A1h", "Find the constant that forces no/infinite solutions"], ["A1i", "Solve a formula for a variable of interest"],
    ["A1R", "Interleaved review: one-variable linear"],
  ]],
  ["A", "A2", "Linear equations in two variables", [
    ["A2a", "Slope from two points"], ["A2b", "Slope-intercept form: read m and b"],
    ["A2c", "Standard form ax+by=c: rearranging and intercepts"], ["A2d", "Point-slope form"],
    ["A2e", "Equation from two points"], ["A2f", "Equation from a table of values"], ["A2g", "x- and y-intercepts"],
    ["A2h", "Parallel and perpendicular lines"], ["A2i", "Interpret slope in context, with units"],
    ["A2j", "Interpret intercepts in context"], ["A2R", "Interleaved review: two-variable linear"],
  ]],
  ["X", "X", "Desmos technique", [["X1", "Desmos: graphing one equation, reading the intersection"]]],
  ["A", "A3", "Linear functions", [
    ["A3a", "Function notation: evaluate f(x)"], ["A3b", "Solve f(x) = k"],
    ["A3c", "Build a linear model from a scenario"], ["A3d", "Interpret rate of change in context"],
    ["A3e", "Read function values from graphs and tables"], ["A3f", "Shifts and transformations of linear functions", "EXT"],
    ["A3R", "Interleaved review: linear functions"],
  ]],
  ["X", "X", "Desmos technique", [["X4", "Desmos: tables for function values"]]],
  ["A", "A4", "Systems of two linear equations", [
    ["A4a", "Substitution"], ["A4b", "Elimination"], ["A4c", "Graphical solution / intersection"],
    ["A4d", "No solution vs infinite solutions"], ["A4e", "Find the coefficient forcing no/infinite solutions"],
    ["A4f", "System word problems: cost & quantity"], ["A4g", "System word problems: mixture & rate"],
    ["A4R", "Interleaved review: systems"],
  ]],
  ["X", "X", "Desmos technique", [["X2", "Desmos: solving systems by graphing"]]],
  ["A", "A5", "Linear inequalities", [
    ["A5a", "One variable, including flipping the sign"], ["A5b", "Compound inequalities", "EXT"],
    ["A5c", "Graphing an inequality in two variables"], ["A5d", "Systems of inequalities: the shaded region"],
    ["A5e", "Is this point a solution?"], ["A5f", "Constraint word problems: at most, at least"],
    ["A5R", "Interleaved review: inequalities"],
  ]],
  ["X", "X", "Desmos technique", [["X5", "Desmos: graphing inequalities and shaded regions"]]],
  ["S", "S1", "Decoding the question", [
    ["S1a", "Find the ask: what value does it actually want?"], ["S1b", "Label every number with its unit"],
    ["S1c", "Translating one sentence into an equation"], ["S1d", "Multi-sentence setups: building the model in pieces"],
    ["S1R", "Interleaved review: decoding"],
  ]],
  ["S", "S2", "Answer-choice techniques", [
    ["S2a", "Backsolving: plugging in the answers"], ["S2b", "When backsolving beats algebra, and when it doesn't"],
    ["S2c", "Plugging in numbers for variables"], ["S2d", "Plugging in on 'which expression is equivalent'"],
    ["S2e", "Elimination and ballparking"], ["S2R", "Interleaved review: answer-choice techniques"],
  ]],
  ["S", "S3", "Pacing and triage", [
    ["S3a", "The 95-second budget"], ["S3b", "Skip-and-return: recognizing a time sink"],
    ["S3c", "Module 1 is the routing test"], ["S3R", "Interleaved review: pacing"],
  ]],
  ["X", "X", "Desmos technique", [["X8", "Desmos: when NOT to use it"]]],
  ["P", "P1", "Grid-in / student-produced response", [
    ["P1", "SPR entry rules: 5 characters positive, 6 with a negative, no symbols"],
    ["P2", "Fractions vs decimals: when each is safe"], ["P3", "Repeating decimals: fill the field (.3333 not .33)"],
    ["P4", "Mixed numbers to improper fraction or decimal"],
    ["P5", "No answer choices: what changes when backsolving is unavailable"], ["P6", "Grid-in mixed set under time"],
  ]],
  ["M", "M1", "Equivalent expressions", [
    ["M1a", "Exponent rules including fractional exponents"], ["M1b", "Radicals and rational exponents"],
    ["M1c", "Polynomial multiplication"], ["M1d", "Factoring out the GCF"], ["M1e", "Factoring trinomials, a = 1"],
    ["M1f", "Factoring trinomials, a != 1"], ["M1g", "Difference of squares"],
    ["M1h", "Perfect square trinomials", "EXT"], ["M1i", "Rational expressions: simplify, multiply, divide"],
    ["M1j", "Rational expressions: add & subtract", "EXT"], ["M1k", "Polynomial division and remainders", "EXT"],
    ["M1R", "Interleaved review: equivalent expressions"],
  ]],
  ["M", "M2", "Nonlinear equations & systems", [
    ["M2a", "Quadratics by factoring"], ["M2b", "Zero product property and roots"], ["M2c", "Quadratic formula"],
    ["M2d", "Discriminant: how many solutions"], ["M2e", "Completing the square", "EXT"],
    ["M2f", "Radical equations & extraneous solutions"], ["M2g", "Rational equations", "EXT"],
    ["M2h", "Absolute value equations"], ["M2i", "Exponential equations with a common base"],
    ["M2j", "Linear-quadratic systems"], ["M2R", "Interleaved review: nonlinear equations"],
  ]],
  ["M", "M3", "Nonlinear functions", [
    ["M3a", "Parabolas: vertex form"], ["M3b", "Parabolas: standard form, axis of symmetry"],
    ["M3c", "Parabolas: factored form and x-intercepts"], ["M3d", "Choosing the right form for what's asked"],
    ["M3e", "Exponential growth vs decay"], ["M3f", "Interpreting exponential parameters in context"],
    ["M3g", "Compound growth with periods: quarterly, monthly"], ["M3h", "Transformations: f(x)+k, f(x+k), af(x), -f(x)"],
    ["M3i", "Graph reading for nonlinear functions"], ["M3j", "Where a function is undefined", "EXT"],
    ["M3k", "Polynomial zeros and end behavior", "EXT"], ["M3l", "Composite functions f(g(x))", "EXT"],
    ["M3R", "Interleaved review: nonlinear functions"],
  ]],
  ["X", "X", "Desmos technique", [["X3", "Desmos: roots and vertex of a parabola"], ["X6", "Desmos: sliders, what each coefficient does", "EXT"]]],
  ["D", "D1", "Ratios, rates, proportional relationships, units", [
    ["D1a", "Proportions"], ["D1b", "Unit rate"], ["D1c", "Unit conversion, single and multi-step"],
    ["D1d", "Density and other derived units"], ["D1e", "Average rate of change from a graph"],
    ["D1f", "Scale drawings, maps, similar-figure ratios", "EXT"], ["D1R", "Interleaved review: ratios and rates"],
  ]],
  ["D", "D2", "Percentages", [
    ["D2a", "Percent of a number"], ["D2b", "Percent increase and decrease"], ["D2c", "Reverse percent: find the original"],
    ["D2d", "Successive percent changes", "EXT"], ["D2e", "Percent in context: discount, tax, tip, commission"],
    ["D2f", "Percent from a table or graph"], ["D2R", "Interleaved review: percentages"],
  ]],
  ["D", "D3", "One-variable data", [
    ["D3a", "Mean, median, mode"], ["D3b", "Mean and median from a frequency table or dot plot"],
    ["D3c", "Range and standard deviation: compare, never compute"], ["D3d", "Effect of adding or changing a value"],
    ["D3e", "Histograms, dot plots, and box plots"], ["D3f", "Comparing two distributions"],
    ["D3g", "Outliers and skew: which measure to trust", "EXT"], ["D3R", "Interleaved review: one-variable data"],
  ]],
  ["D", "D4", "Two-variable data", [
    ["D4a", "Reading a scatterplot"], ["D4b", "Line of best fit: predicting"],
    ["D4c", "Interpreting slope & intercept of the fit line"], ["D4d", "Choosing the model: linear vs exponential"],
    ["D4e", "Residuals: actual vs predicted", "EXT"], ["D4R", "Interleaved review: two-variable data"],
  ]],
  ["X", "X", "Desmos technique", [["X7", "Desmos: regression on scatterplot data", "EXT"]]],
  ["D", "D5", "Probability and conditional probability", [
    ["D5a", "Probability from counts"], ["D5b", "Reading a two-way table"], ["D5c", "Probability from a two-way table"],
    ["D5d", "Conditional probability: 'given that'"], ["D5e", "Complements and 'not'", "EXT"],
    ["D5R", "Interleaved review: probability"],
  ]],
  ["D", "D6", "Inference and margin of error", [
    ["D6a", "Plausible population values from a sample and given margin of error"],
    ["D6b", "Interpreting margin of error in a sentence"], ["D6c", "How sample size changes margin of error", "EXT"],
  ]],
  ["D", "D7", "Evaluating statistical claims", [
    ["D7a", "Random sampling: who you can generalize to"], ["D7b", "Random assignment: when you can say 'caused'"],
    ["D7c", "Which conclusion is supported?"], ["D7d", "Spotting bias in study design", "EXT"],
    ["D-R", "Interleaved review: inference and claims"],
  ]],
  ["G", "G1", "Lines, angles, triangles", [
    ["G1a", "Vertical angles & linear pairs"], ["G1b", "Parallel lines & transversals"],
    ["G1c", "Triangle angle sum & exterior angle"], ["G1d", "Isosceles & equilateral triangles"],
    ["G1e", "Similar triangles: setting up the ratio"], ["G1f", "Congruence"],
    ["G1g", "Polygon interior & exterior angles", "EXT"], ["G1R", "Interleaved review: lines, angles, triangles"],
  ]],
  ["G", "G3", "Area and volume", [
    ["G3a", "Area: triangle, rectangle, parallelogram, trapezoid"], ["G3b", "Circumference and area of a circle"],
    ["G3c", "Volume of prisms and cylinders"], ["G3d", "Cones, pyramids, spheres: using the reference sheet"],
    ["G3e", "Surface area", "EXT"], ["G3f", "Composite and shaded regions", "EXT"],
    ["G3g", "Scaling: effect on area and volume", "EXT"], ["G3R", "Interleaved review: area and volume"],
  ]],
  ["G", "G2", "Right triangles and trigonometry", [
    ["G2a", "Pythagorean theorem"], ["G2b", "Pythagorean triples", "EXT"],
    ["G2c", "Special right triangles: 45-45-90 and 30-60-90"], ["G2d", "SOH-CAH-TOA: find a side"],
    ["G2e", "SOH-CAH-TOA: find an angle", "EXT"], ["G2f", "sin x = cos(90 - x)", "EXT"],
    ["G2g", "Trig in diagrams and word problems", "EXT"], ["G2R", "Interleaved review: right triangle trig"],
  ]],
  ["G", "G4", "Circles", [
    ["G4f", "Equation of a circle"], ["G4a", "Central angles and arc measure", "EXT"],
    ["G4b", "Arc length", "EXT"], ["G4c", "Sector area", "EXT"], ["G4d", "Inscribed angles", "EXT"],
    ["G4e", "Radians and degrees", "EXT"], ["G4g", "Completing the square to find center & radius", "EXT"],
    ["G4h", "Tangent lines and the perpendicular radius", "EXT"], ["G4R", "Interleaved review: circles", "EXT"],
  ]],
] as const;

const uniqueSkills = new Map<string, MasterySkill>();
let skillOrder = 0;
for (const [strandCode, code, name] of groups) {
  if (!uniqueSkills.has(code)) uniqueSkills.set(code, { code, name, strandCode, sortOrder: ++skillOrder });
}
export const masterySkills: readonly MasterySkill[] = [...uniqueSkills.values()];

export const masteryLevels: readonly MasteryLevel[] = groups.flatMap(([strandCode, skillCode, , levels]) =>
  levels.map(([code, name, tier]) => ({ code, name, strandCode, skillCode, tier: (tier ?? "CORE") as MasteryTier })),
).map((level, index) => ({
  ...level,
  id: `level-${level.code.toLowerCase()}`,
  sequenceIndex: index + 1,
  timeStandardSeconds: null,
  accuracyThreshold: 90,
  videoUrl: "",
}));

export const worksheetTypeFor = (index: number): WorksheetType => index <= 3 ? "PRACTICE" : index === 4 ? "MIXED" : "MASTERY_CHECK";
export const worksheetIdFor = (levelCode: string, index: number) => `ws-${levelCode.toLowerCase()}-${String(index).padStart(2, "0")}`;

export const masterySpineStats = {
  levels: masteryLevels.length,
  core: masteryLevels.filter((level) => level.tier === "CORE").length,
  ext: masteryLevels.filter((level) => level.tier === "EXT").length,
  strands: Object.fromEntries(masteryStrands.map((strand) => [strand.code, masteryLevels.filter((level) => level.strandCode === strand.code).length])),
} as const;

export function validateMasterySpine() {
  const errors: string[] = [];
  if (masteryLevels.length !== 210) errors.push(`Expected 210 levels; found ${masteryLevels.length}.`);
  if (masterySpineStats.core !== 175 || masterySpineStats.ext !== 35) errors.push(`Expected 175 CORE / 35 EXT; found ${masterySpineStats.core} CORE / ${masterySpineStats.ext} EXT.`);
  const expectedStrands: Record<MasteryStrandCode, number> = { F: 27, A: 43, S: 15, P: 6, M: 36, D: 42, G: 33, X: 8 };
  for (const [strand, expected] of Object.entries(expectedStrands)) {
    const actual = masterySpineStats.strands[strand] ?? 0;
    if (actual !== expected) errors.push(`${strand} should have ${expected} levels; found ${actual}.`);
  }
  const codes = new Set(masteryLevels.map((level) => level.code));
  if (codes.size !== masteryLevels.length) errors.push("Level codes must be unique.");
  masteryLevels.forEach((level, index) => { if (level.sequenceIndex !== index + 1) errors.push(`Sequence mismatch at ${level.code}.`); });
  return errors;
}

const validationErrors = validateMasterySpine();
if (validationErrors.length) throw new Error(`Invalid mastery spine:\n${validationErrors.join("\n")}`);

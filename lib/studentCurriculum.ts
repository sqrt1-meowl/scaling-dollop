import type { MasteryLevel, MasterySkill, MasteryStrand, MasteryStrandCode, WorksheetType } from "./masterySpine.ts";

type LevelSeed = readonly [code: string, name: string];
type SkillSeed = readonly [strand: MasteryStrandCode, code: string, name: string, levels: readonly LevelSeed[]];

export const studentStrands: readonly MasteryStrand[] = [
  { code: "F", name: "Foundations & Test Readiness", sortOrder: 1 },
  { code: "A", name: "Algebra", sortOrder: 2 },
  { code: "M", name: "Advanced Math", sortOrder: 3 },
  { code: "D", name: "Problem-Solving & Data Analysis", sortOrder: 4 },
  { code: "G", name: "Geometry & Trigonometry", sortOrder: 5 },
] as const;

const groups: readonly SkillSeed[] = [
  ["F", "F1", "Number and Expression Fluency", [
    ["F1U1", "Signed numbers, fractions, decimals, percentages, and order of operations"],
    ["F1U2", "Combining like terms, distribution, substitution, and exponent rules"],
  ]],
  ["F", "F2", "Algebra, Graph, and Measurement Readiness", [
    ["F2U1", "Basic equations, proportions, formula rearrangement, and verbal translation"],
    ["F2U2", "Coordinates, tables, graphs, rate of change, and function notation"],
    ["F2U3", "Geometry formulas, measurement, and unit conversion"],
  ]],
  ["A", "A1", "Linear Equations in One Variable", [
    ["A1U1", "Solving multi-step equations, including variables on both sides, fractions, and decimals"],
    ["A1U2", "Rearranging formulas and constructing equations from contexts"],
    ["A1U3", "One, zero, or infinitely many solutions; identities and parameter problems"],
  ]],
  ["A", "A2", "Linear Equations in Two Variables", [
    ["A2U1", "Slope, intercepts, and forms of linear equations"],
    ["A2U2", "Constructing and interpreting lines from points, tables, graphs, and contexts"],
    ["A2U3", "Parallel and perpendicular lines, missing coordinates, and parameter problems"],
  ]],
  ["A", "A3", "Linear Functions", [
    ["A3U1", "Evaluating functions and connecting equations, tables, and graphs"],
    ["A3U2", "Constructing, interpreting, and comparing linear functions"],
    ["A3U3", "Function translations, intervals, constraints, and contextual models"],
  ]],
  ["A", "A4", "Systems of Two Linear Equations in Two Variables", [
    ["A4U1", "Solving by substitution, elimination, and graphing"],
    ["A4U2", "One, zero, or infinitely many solutions"],
    ["A4U3", "Constructing and interpreting contextual systems; parameter problems"],
  ]],
  ["A", "A5", "Linear Inequalities in One or Two Variables", [
    ["A5U1", "Solving and writing one-variable inequalities"],
    ["A5U2", "Graphing two-variable inequalities and systems"],
    ["A5U3", "Feasible regions, contextual constraints, and minimum/maximum problems"],
  ]],
  ["M", "M1", "Equivalent Expressions", [
    ["M1U1", "Exponent, radical, and polynomial operations"],
    ["M1U2", "Factoring trinomials, special products, and grouping"],
    ["M1U3", "Completing the square, rational expressions, and strategic equivalent forms"],
  ]],
  ["M", "M2", "Nonlinear Equations in One Variable and Systems in Two Variables", [
    ["M2U1", "Quadratic equations, solution methods, discriminants, and number of real solutions"],
    ["M2U2", "Absolute-value, radical, rational, and polynomial equations"],
    ["M2U3", "Nonlinear systems, intersections, restrictions, extraneous solutions, and parameters"],
  ]],
  ["M", "M3", "Nonlinear Functions", [
    ["M3U1", "Quadratic and polynomial functions, forms, zeros, vertices, and models"],
    ["M3U2", "Exponential functions, growth, decay, and changed time intervals"],
    ["M3U3", "Rational, radical, and absolute-value functions; transformations, comparisons, and parameters"],
  ]],
  ["D", "P1", "Ratios, Rates, Proportional Relationships, and Units", [
    ["P1U1", "Ratios, unit rates, proportions, and constants of proportionality"],
    ["P1U2", "Unit conversions and compound rates, including speed, density, and price"],
    ["P1U3", "Scale models and multi-stage proportional contexts"],
  ]],
  ["D", "P2", "Percentages", [
    ["P2U1", "Finding the part, whole, or percent; percent increase, decrease, and reverse percent"],
    ["P2U2", "Percent multipliers, sequential changes, discounts, tax, tips, and applied percent problems"],
  ]],
  ["D", "P3", "One-Variable Data—Distributions and Measures of Center and Spread", [
    ["P3U1", "Frequency tables, bar graphs, histograms, dot plots, and box plots"],
    ["P3U2", "Mean, median, mode, range, and missing or incomplete data"],
    ["P3U3", "Standard deviation, comparing distributions, and effects of changing data values"],
  ]],
  ["D", "P4", "Two-Variable Data—Models and Scatterplots", [
    ["P4U1", "Reading scatterplots and identifying positive, negative, or no association"],
    ["P4U2", "Lines of best fit, slope/intercept interpretation, and predictions"],
    ["P4U3", "Linear, quadratic, and exponential models and model comparisons"],
  ]],
  ["D", "P5", "Probability and Conditional Probability", [
    ["P5U1", "Basic probability, frequency tables, complements, and compound events"],
    ["P5U2", "Two-way tables, conditional probability, group comparisons, and restricted sample spaces"],
  ]],
  ["D", "P6", "Inference from Sample Statistics and Margin of Error", [
    ["P6U1", "Populations, samples, parameters, statistics, and representative sampling"],
    ["P6U2", "Population estimates, margin of error, sample size, and defensible conclusions"],
  ]],
  ["D", "P7", "Evaluating Statistical Claims—Observational Studies and Experiments", [
    ["P7U1", "Observational studies, experiments, random sampling, and random assignment"],
    ["P7U2", "Generalization, association, causation, sampling bias, and study limitations"],
  ]],
  ["G", "G1", "Area and Volume", [
    ["G1U1", "Perimeter, area, circles, and composite figures"],
    ["G1U2", "Surface area and volume of prisms, cylinders, pyramids, cones, and spheres"],
    ["G1U3", "Missing dimensions, scale factors, units, and geometric modeling"],
  ]],
  ["G", "G2", "Lines, Angles, and Triangles", [
    ["G2U1", "Vertical angles, linear pairs, parallel lines, and transversals"],
    ["G2U2", "Triangle angles, isosceles/equilateral triangles, and congruence"],
    ["G2U3", "Similar triangles and polygons, proportional sides, scale factors, and indirect measurement"],
  ]],
  ["G", "G3", "Right Triangles and Trigonometry", [
    ["G3U1", "Pythagorean theorem, coordinate distance, and special right triangles"],
    ["G3U2", "Sine, cosine, tangent, and finding missing sides or angles"],
    ["G3U3", "Complementary-angle relationships and multi-step applications"],
  ]],
  ["G", "G4", "Circles", [
    ["G4U1", "Radius, diameter, circumference, area, central angles, arcs, radians, and the unit circle"],
    ["G4U2", "Tangent-radius relationships"],
    ["G4U3", "Circle equations, center and radius, completing the square, and missing constants"],
  ]],
  ["F", "C1", "Integration and Test Readiness", [
    ["C1U1", "Mixed-domain practice progressing from easy to hard"],
    ["C1U2", "Desmos method selection, timing, and answer-entry strategy"],
    ["C1U3", "Error repair, adaptive practice tests, and final review"],
  ]],
] as const;

export const studentSkills: readonly MasterySkill[] = groups.map(([strandCode, code, name], index) => ({
  code, name, strandCode, sortOrder: index + 1,
}));

export const studentSubskills: readonly MasteryLevel[] = groups.flatMap(([strandCode, skillCode, , levels]) =>
  levels.map(([code, name]) => ({ code, name, strandCode, skillCode })),
).map((level, index) => ({
  ...level,
  id: `subskill-${level.code.toLowerCase()}`,
  sequenceIndex: index + 1,
  tier: "CORE",
  timeStandardSeconds: null,
  accuracyThreshold: 90,
  videoUrl: "",
}));

export const studentWorksheetTypeFor = (index: number): WorksheetType => index <= 3 ? "PRACTICE" : index === 4 ? "MIXED" : "MASTERY_CHECK";
export const studentWorksheetIdFor = (levelCode: string, index: number) => `ws-${levelCode.toLowerCase()}-${String(index).padStart(2, "0")}`;

export const studentSubskillCounts = { total: 61, skills: 22, F: 8, A: 15, M: 9, D: 17, G: 12 } as const;

export function validateStudentSubskills() {
  const errors: string[] = [];
  if (studentSubskills.length !== studentSubskillCounts.total) errors.push(`Expected 61 subskills; found ${studentSubskills.length}.`);
  if (studentSkills.length !== studentSubskillCounts.skills) errors.push(`Expected 22 skill groups; found ${studentSkills.length}.`);
  for (const strand of studentStrands) {
    const actual = studentSubskills.filter((level) => level.strandCode === strand.code).length;
    const expected = studentSubskillCounts[strand.code as keyof typeof studentSubskillCounts];
    if (actual !== expected) errors.push(`${strand.code} should have ${expected} subskills; found ${actual}.`);
  }
  if (new Set(studentSubskills.map((level) => level.code)).size !== studentSubskills.length) errors.push("Subskill codes must be unique.");
  return errors;
}

const errors = validateStudentSubskills();
if (errors.length) throw new Error(`Invalid student subskills:\n${errors.join("\n")}`);

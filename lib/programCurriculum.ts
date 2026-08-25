import { seedQuestions as legacyQuestions } from "./curriculum";

export type ProgramDomainStatus = "official" | "optional_foundation" | "test_readiness";
export type ProgramStage = "learn" | "easy" | "medium" | "hard" | "review";
export type ProgramMasteryState = "not_started" | "in_progress" | "mastered" | "review_due" | "skipped_by_placement" | "needs_repair";
export type ProgramQuestionType = "multiple_choice" | "student_response";
export type ProgramSourceType = "original" | "legacy_mapped";

export interface ProgramQuestion {
  id: string;
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  questionType: ProgramQuestionType;
  solution: string;
  hints: string[];
  domainId: string;
  skillId: string;
  unitId: string;
  tags: string[];
  sourceType: ProgramSourceType;
  isTransferQuestion: boolean;
}

export interface WorkedExample {
  id: string;
  title: string;
  prompt: string;
  steps: string[];
  answer: string;
}

export interface ProgramUnit {
  id: string;
  title: string;
  displayOrder: number;
  prerequisites: string[];
  stageProgress: Record<ProgramStage, number>;
  workedExamples: WorkedExample[];
  videoUrl?: string;
  questions: ProgramQuestion[];
  masteryState: ProgramMasteryState;
  reviewState: "clear" | "due";
}

export interface SkillPacket {
  id: string;
  officialName: string;
  domainId: string;
  displayOrder: number;
  units: ProgramUnit[];
  overallProgress: number;
}

export interface ProgramDomain {
  id: string;
  title: string;
  officialStatus: ProgramDomainStatus;
  displayOrder: number;
  description: string;
  skillPackets: SkillPacket[];
}

const emptyStages = (): Record<ProgramStage, number> => ({ learn: 0, easy: 0, medium: 0, hard: 0, review: 0 });

const example = (id: string, title: string, prompt: string, steps: string[], answer: string): WorkedExample => ({ id, title, prompt, steps, answer });

const question = (
  id: string,
  difficulty: ProgramQuestion["difficulty"],
  prompt: string,
  choices: string[] | undefined,
  correctAnswer: string,
  solution: string,
  tags: string[],
  isTransferQuestion = false,
): ProgramQuestion => ({
  id,
  difficulty,
  prompt,
  choices,
  correctAnswer,
  questionType: choices ? "multiple_choice" : "student_response",
  solution,
  hints: [
    `Identify the ${tags[0] ?? "main relationship"} before calculating.`,
    "Write one equation that connects the known and unknown quantities.",
    solution.split(".")[0] + ".",
  ],
  domainId: "algebra",
  skillId: "A1",
  unitId: "A1U1",
  tags,
  sourceType: "original",
  isTransferQuestion,
});

const a1u1Examples: WorkedExample[] = [
  example("A1U1-E1", "Variables on both sides", "Solve 5x + 7 = 2x + 25.", ["Subtract 2x from both sides: 3x + 7 = 25.", "Subtract 7: 3x = 18.", "Divide by 3: x = 6."], "x = 6"),
  example("A1U1-E2", "Equation with fractions", "Solve x/3 + 5 = 11.", ["Subtract 5: x/3 = 6.", "Multiply both sides by 3: x = 18."], "x = 18"),
  example("A1U1-E3", "Distribute first", "Solve 3(2x - 1) = 21.", ["Distribute: 6x - 3 = 21.", "Add 3: 6x = 24.", "Divide by 6: x = 4."], "x = 4"),
];

const a1u1Questions: ProgramQuestion[] = [
  question("A1U1-QE1", "easy", "Solve 4x + 9 = 29.", ["4", "5", "7", "10"], "5", "Subtract 9 to get 4x = 20, then divide by 4. x = 5.", ["linear equation"]),
  question("A1U1-QE2", "easy", "Solve 7x - 8 = 34.", ["4", "5", "6", "7"], "6", "Add 8 to get 7x = 42, then divide by 7. x = 6.", ["linear equation"]),
  question("A1U1-QE3", "easy", "Solve 3(x + 4) = 27.", ["5", "7", "9", "13"], "5", "Divide by 3 to get x + 4 = 9, then subtract 4. x = 5.", ["distribution"]),
  question("A1U1-QE4", "easy", "Solve 8x + 2 = 5x + 20.", ["4", "6", "7", "9"], "6", "Subtract 5x and 2 to get 3x = 18. x = 6.", ["variables on both sides"]),
  question("A1U1-QE5", "easy", "Solve x/4 + 3 = 8.", ["5", "11", "20", "32"], "20", "Subtract 3 to get x/4 = 5, then multiply by 4. x = 20.", ["fraction equation"]),
  question("A1U1-QE6", "easy", "Solve 0.5x + 4 = 10.", ["3", "7", "12", "20"], "12", "Subtract 4 to get 0.5x = 6, then divide by 0.5. x = 12.", ["decimal equation"]),
  question("A1U1-QE7", "easy", "Solve 2(3x - 5) = 26.", ["4", "6", "8", "13"], "6", "Divide by 2 to get 3x - 5 = 13. Add 5 and divide by 3. x = 6.", ["distribution"]),
  question("A1U1-QM1", "medium", "The perimeter of a rectangle is 48. Its length is 3 more than twice its width. What is the width?", ["5", "7", "8", "11"], "7", "Let the width be w. Then 2((2w + 3) + w) = 48, so 6w + 6 = 48 and w = 7.", ["equation model"]),
  question("A1U1-QM2", "medium", "Solve (2x - 3)/5 = (x + 4)/3.", ["7", "19", "29", "31"], "29", "Cross-multiply: 3(2x - 3) = 5(x + 4). Then 6x - 9 = 5x + 20, so x = 29.", ["fraction equation"]),
  question("A1U1-QM3", "medium", "A taxi charges $4 plus $2.50 per mile. The total was $29. How many miles were traveled?", ["8", "9", "10", "12"], "10", "Use 4 + 2.5m = 29. Then 2.5m = 25, so m = 10.", ["context equation"]),
  question("A1U1-QM4", "medium", "Solve 0.3(x - 10) + 6 = 12.", ["20", "25", "30", "40"], "30", "Subtract 6, divide by 0.3, then add 10: x - 10 = 20, so x = 30.", ["decimal equation"]),
  question("A1U1-QM5", "medium", "For what value of x is 4 - 2(3x - 1) equal to 18?", ["-4", "-2", "2", "4"], "-2", "Simplify to 6 - 6x = 18. Then -6x = 12, so x = -2.", ["distribution"]),
  question("A1U1-QM6", "medium", "Three consecutive integers have a sum of 72. What is the greatest integer?", ["23", "24", "25", "26"], "25", "Let the integers be n, n + 1, and n + 2. Then 3n + 3 = 72, so n = 23 and the greatest is 25.", ["equation model"]),
  question("A1U1-QH1", "hard", "A number x is increased by 40%, then 9 is subtracted. The result is 33. What is x?", ["24", "30", "42", "60"], "30", "Model the change as 1.4x - 9 = 33. Then 1.4x = 42, so x = 30.", ["percent equation"]),
  question("A1U1-QH2", "hard", "For what value of k does 3(kx - 4) = 18x + 9 have solution x = -1?", ["-3", "-1", "1", "7"], "-1", "Substitute x = -1: 3(-k - 4) = -9. Divide by 3: -k - 4 = -3, so k = -1.", ["parameter equation"]),
  question("A1U1-QH3", "hard", "A tank is 3/5 full. After 24 liters are added, it is 9/10 full. What is the tank's capacity?", ["60", "80", "96", "120"], "80", "The added 24 liters equals 9/10 - 3/5 = 3/10 of capacity. Thus 24 = 0.3C and C = 80.", ["fraction equation"]),
  question("A1U1-QT1", "hard", "A container is 7/12 full. After 20 liters are added, it is 5/6 full. What is its capacity?", ["60", "72", "80", "96"], "80", "The added amount is 5/6 - 7/12 = 1/4 of capacity. Thus 20 = C/4 and C = 80.", ["transfer equation"], true),
];

function remapLegacyQuestion(unitId: string, skillId: string, domainId: string, legacyUnitIds: string[]): ProgramQuestion[] {
  return legacyQuestions
    .filter((item) => legacyUnitIds.includes(item.drillUnitId) && item.sourceType === "original" && item.status === "active" && !item.isGate)
    .map((item) => ({
      id: `legacy-${item.id}`,
      prompt: item.prompt,
      choices: item.choices,
      correctAnswer: item.correctAnswer,
      difficulty: item.difficulty,
      questionType: item.choices ? "multiple_choice" : "student_response",
      solution: item.explanation,
      hints: ["Identify the relevant measurement relationship.", "Write the formula before substituting values.", item.explanation.split(".")[0] + "."],
      domainId,
      skillId,
      unitId,
      tags: ["confident legacy mapping", item.frameworkTarget],
      sourceType: "legacy_mapped",
      isTransferQuestion: item.difficulty === "hard",
    }));
}

const unit = (id: string, title: string, displayOrder: number, options: Partial<ProgramUnit> = {}): ProgramUnit => ({
  id,
  title,
  displayOrder,
  prerequisites: [],
  stageProgress: emptyStages(),
  workedExamples: [],
  questions: [],
  masteryState: "not_started",
  reviewState: "clear",
  ...options,
});

const packet = (id: string, officialName: string, domainId: string, displayOrder: number, units: ProgramUnit[]): SkillPacket => ({ id, officialName, domainId, displayOrder, units, overallProgress: 0 });
const domain = (id: string, title: string, officialStatus: ProgramDomainStatus, displayOrder: number, description: string, skillPackets: SkillPacket[]): ProgramDomain => ({ id, title, officialStatus, displayOrder, description, skillPackets });

const U = (id: string, title: string, order: number, prerequisites: string[] = []) => unit(id, title, order, { prerequisites });

export const programDomains: ProgramDomain[] = [
  domain("optional-foundations", "Optional Foundations", "optional_foundation", 0, "Optional readiness work for students who need prerequisite repair.", [
    packet("F1", "Number and Expression Fluency", "optional-foundations", 1, [
      U("F1U1", "Signed numbers, fractions, decimals, percentages, and order of operations", 1),
      U("F1U2", "Combining like terms, distribution, substitution, and exponent rules", 2, ["F1U1"]),
    ]),
    packet("F2", "Algebra, Graph, and Measurement Readiness", "optional-foundations", 2, [
      U("F2U1", "Basic equations, proportions, formula rearrangement, and verbal translation", 1, ["F1U2"]),
      U("F2U2", "Coordinates, tables, graphs, rate of change, and function notation", 2, ["F2U1"]),
      U("F2U3", "Geometry formulas, measurement, and unit conversion", 3, ["F2U1"]),
    ]),
  ]),
  domain("algebra", "Algebra", "official", 1, "Linear equations, functions, systems, and inequalities.", [
    packet("A1", "Linear Equations in One Variable", "algebra", 1, [
      unit("A1U1", "Solving multi-step equations, including variables on both sides, fractions, and decimals", 1, { workedExamples: a1u1Examples, questions: a1u1Questions }),
      U("A1U2", "Rearranging formulas and constructing equations from contexts", 2, ["A1U1"]),
      U("A1U3", "One, zero, or infinitely many solutions; identities and parameter problems", 3, ["A1U1"]),
    ]),
    packet("A2", "Linear Equations in Two Variables", "algebra", 2, [U("A2U1", "Slope, intercepts, and forms of linear equations", 1), U("A2U2", "Constructing and interpreting lines from points, tables, graphs, and contexts", 2, ["A2U1"]), U("A2U3", "Parallel and perpendicular lines, missing coordinates, and parameter problems", 3, ["A2U1"])]),
    packet("A3", "Linear Functions", "algebra", 3, [U("A3U1", "Evaluating functions and connecting equations, tables, and graphs", 1), U("A3U2", "Constructing, interpreting, and comparing linear functions", 2, ["A3U1"]), U("A3U3", "Function translations, intervals, constraints, and contextual models", 3, ["A3U1"])]),
    packet("A4", "Systems of Two Linear Equations in Two Variables", "algebra", 4, [U("A4U1", "Solving by substitution, elimination, and graphing", 1), U("A4U2", "One, zero, or infinitely many solutions", 2, ["A4U1"]), U("A4U3", "Constructing and interpreting contextual systems; parameter problems", 3, ["A4U1"])]),
    packet("A5", "Linear Inequalities in One or Two Variables", "algebra", 5, [U("A5U1", "Solving and writing one-variable inequalities", 1), U("A5U2", "Graphing two-variable inequalities and systems", 2, ["A5U1"]), U("A5U3", "Feasible regions, contextual constraints, and minimum/maximum problems", 3, ["A5U2"])]),
  ]),
  domain("advanced-math", "Advanced Math", "official", 2, "Equivalent expressions, nonlinear equations, and nonlinear functions.", [
    packet("M1", "Equivalent Expressions", "advanced-math", 1, [U("M1U1", "Exponent, radical, and polynomial operations", 1), U("M1U2", "Factoring trinomials, special products, and grouping", 2, ["M1U1"]), U("M1U3", "Completing the square, rational expressions, and strategic equivalent forms", 3, ["M1U2"])]),
    packet("M2", "Nonlinear Equations in One Variable and Systems in Two Variables", "advanced-math", 2, [U("M2U1", "Quadratic equations, solution methods, discriminants, and number of real solutions", 1), U("M2U2", "Absolute-value, radical, rational, and polynomial equations", 2, ["M2U1"]), U("M2U3", "Nonlinear systems, intersections, restrictions, extraneous solutions, and parameters", 3, ["M2U1"])]),
    packet("M3", "Nonlinear Functions", "advanced-math", 3, [U("M3U1", "Quadratic and polynomial functions, forms, zeros, vertices, and models", 1), U("M3U2", "Exponential functions, growth, decay, and changed time intervals", 2), U("M3U3", "Rational, radical, and absolute-value functions; transformations, comparisons, and parameters", 3, ["M3U1"])]),
  ]),
  domain("problem-solving-data-analysis", "Problem-Solving and Data Analysis", "official", 3, "Rates, percentages, data, probability, inference, and statistical claims.", [
    packet("P1", "Ratios, Rates, Proportional Relationships, and Units", "problem-solving-data-analysis", 1, [U("P1U1", "Ratios, unit rates, proportions, and constants of proportionality", 1), U("P1U2", "Unit conversions and compound rates, including speed, density, and price", 2, ["P1U1"]), U("P1U3", "Scale models and multi-stage proportional contexts", 3, ["P1U1"])]),
    packet("P2", "Percentages", "problem-solving-data-analysis", 2, [U("P2U1", "Finding the part, whole, or percent; percent increase, decrease, and reverse percent", 1), U("P2U2", "Percent multipliers, sequential changes, discounts, tax, tips, and applied percent problems", 2, ["P2U1"])]),
    packet("P3", "One-Variable Data—Distributions and Measures of Center and Spread", "problem-solving-data-analysis", 3, [U("P3U1", "Frequency tables, bar graphs, histograms, dot plots, and box plots", 1), U("P3U2", "Mean, median, mode, range, and missing or incomplete data", 2), U("P3U3", "Standard deviation, comparing distributions, and effects of changing data values", 3, ["P3U2"])]),
    packet("P4", "Two-Variable Data—Models and Scatterplots", "problem-solving-data-analysis", 4, [U("P4U1", "Reading scatterplots and identifying positive, negative, or no association", 1), U("P4U2", "Lines of best fit, slope/intercept interpretation, and predictions", 2, ["P4U1"]), U("P4U3", "Linear, quadratic, and exponential models and model comparisons", 3, ["P4U2"])]),
    packet("P5", "Probability and Conditional Probability", "problem-solving-data-analysis", 5, [U("P5U1", "Basic probability, frequency tables, complements, and compound events", 1), U("P5U2", "Two-way tables, conditional probability, group comparisons, and restricted sample spaces", 2, ["P5U1"])]),
    packet("P6", "Inference from Sample Statistics and Margin of Error", "problem-solving-data-analysis", 6, [U("P6U1", "Populations, samples, parameters, statistics, and representative sampling", 1), U("P6U2", "Population estimates, margin of error, sample size, and defensible conclusions", 2, ["P6U1"])]),
    packet("P7", "Evaluating Statistical Claims—Observational Studies and Experiments", "problem-solving-data-analysis", 7, [U("P7U1", "Observational studies, experiments, random sampling, and random assignment", 1), U("P7U2", "Generalization, association, causation, sampling bias, and study limitations", 2, ["P7U1"])]),
  ]),
  domain("geometry-trigonometry", "Geometry and Trigonometry", "official", 4, "Area, volume, lines, triangles, trigonometry, and circles.", [
    packet("G1", "Area and Volume", "geometry-trigonometry", 1, [
      unit("G1U1", "Perimeter, area, circles, and composite figures", 1, { questions: remapLegacyQuestion("G1U1", "G1", "geometry-trigonometry", ["g1a"]) }),
      unit("G1U2", "Surface area and volume of prisms, cylinders, pyramids, cones, and spheres", 2, { prerequisites: ["G1U1"], questions: remapLegacyQuestion("G1U2", "G1", "geometry-trigonometry", ["g1b", "g1c"]) }),
      unit("G1U3", "Missing dimensions, scale factors, units, and geometric modeling", 3, { prerequisites: ["G1U1", "G1U2"], questions: remapLegacyQuestion("G1U3", "G1", "geometry-trigonometry", ["g1d", "g1e"]) }),
    ]),
    packet("G2", "Lines, Angles, and Triangles", "geometry-trigonometry", 2, [U("G2U1", "Vertical angles, linear pairs, parallel lines, and transversals", 1), U("G2U2", "Triangle angles, isosceles/equilateral triangles, and congruence", 2, ["G2U1"]), U("G2U3", "Similar triangles and polygons, proportional sides, scale factors, and indirect measurement", 3, ["G2U2"])]),
    packet("G3", "Right Triangles and Trigonometry", "geometry-trigonometry", 3, [U("G3U1", "Pythagorean theorem, coordinate distance, and special right triangles", 1), U("G3U2", "Sine, cosine, tangent, and finding missing sides or angles", 2, ["G3U1"]), U("G3U3", "Complementary-angle relationships and multi-step applications", 3, ["G3U2"])]),
    packet("G4", "Circles", "geometry-trigonometry", 4, [U("G4U1", "Radius, diameter, circumference, area, central angles, arcs, radians, and the unit circle", 1), U("G4U2", "Tangent-radius relationships", 2, ["G4U1"]), U("G4U3", "Circle equations, center and radius, completing the square, and missing constants", 3, ["G4U1"])]),
  ]),
  domain("test-readiness", "Test Readiness", "test_readiness", 5, "Program-specific integration, timing, strategy, and error repair.", [
    packet("C1", "Integration and Test Readiness", "test-readiness", 1, [U("C1U1", "Mixed-domain practice progressing from easy to hard", 1), U("C1U2", "Desmos method selection, timing, and answer-entry strategy", 2), U("C1U3", "Error repair, adaptive practice tests, and final review", 3, ["C1U1", "C1U2"])]),
  ]),
];

export const officialDomains = programDomains.filter((item) => item.officialStatus === "official");
export const supportDomains = programDomains.filter((item) => item.officialStatus !== "official");
export const allProgramSkills = programDomains.flatMap((item) => item.skillPackets);
export const allProgramUnits = allProgramSkills.flatMap((item) => item.units);
export const allProgramQuestions = allProgramUnits.flatMap((item) => item.questions);
export const confidentlyMappedLegacyQuestionIds = allProgramQuestions.filter((item) => item.sourceType === "legacy_mapped").map((item) => item.id.replace(/^legacy-/, ""));
export const legacyQuestionsNeedingReview = legacyQuestions.filter((item) => !confidentlyMappedLegacyQuestionIds.includes(item.id)).map((item) => item.id);

export const getProgramDomain = (id: string) => programDomains.find((item) => item.id === (id === "foundations-skills" ? "optional-foundations" : id));
export const getProgramSkill = (id: string) => allProgramSkills.find((item) => item.id.toLowerCase() === id.toLowerCase());
export const getProgramUnit = (id: string) => allProgramUnits.find((item) => item.id.toLowerCase() === id.toLowerCase());
export const getProgramDomainForSkill = (skillId: string) => { const skill = getProgramSkill(skillId); return skill ? getProgramDomain(skill.domainId) : undefined; };


export type CategoryAccent = "algebra" | "advanced" | "data" | "geometry";
export type ProgressStatus = "locked" | "available" | "in_progress" | "complete" | "review";
export type TopicStatus = ProgressStatus;
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple_choice" | "student_response";
export type QuestionStatus = "draft" | "active" | "review" | "archived";

export interface FrameworkTarget { id: string; skillId: string; drillUnitId: string; description: string; order: number; }
export interface DrillUnit {
  id: string; skillId: string; code: string; name: string; description: string; order: number; isActive: boolean;
  easyQuestionCount: number; mediumQuestionCount: number; concept: { label: string; formula: string }[];
  workedExample: { prompt: string; steps: string[] }; frameworkTargets: FrameworkTarget[];
}
export interface Skill {
  id: string; domainId: string; categoryId: string; code: string; title: string; subtitle?: string; order: number; gateQuestionCount: number;
  gateThreshold: number; drillUnits: DrillUnit[];
  /** Compatibility fields for the existing lesson components. */
  concept: { label: string; formula: string }[]; workedExample: { prompt: string; steps: string[] };
}
export type Topic = Skill;
export interface Domain { id: string; name: string; shortName: string; weight: number; accent: CategoryAccent; skills: Skill[]; topics: Skill[]; }
export type Category = Domain;

export interface Question {
  id: string; domainId: string; domain: string; skillId: string; skillName: string; drillUnitId: string; drillUnitName: string;
  frameworkTarget: string; frameworkTargetId: string; difficulty: QuestionDifficulty; questionType: QuestionType;
  prompt: string; math?: string; imageUrl?: string; choices?: string[]; correctAnswer: string; explanation: string;
  questionModelId?: string; sourceType: "original" | "legacy" | "placeholder"; sourceQuestionId?: string; order: number;
  status: QuestionStatus; isGate?: boolean; requiresReview?: boolean;
  /** Compatibility aliases retained while old records migrate. */
  categoryId: string; topicId: string; type: QuestionType; sourceLabel: string;
}

export interface QuestionModel {
  id: string; drillUnitId: string; frameworkTargetId: string; name: string; difficulty: QuestionDifficulty;
  description: string; template: string; parameterRules: string; answerRules: string; solutionMethod: string;
  forbiddenFeatures: string; isActive: boolean;
}

type UnitSeed = [code: string, name: string, targets: string[], description?: string];
const unit = (skillId: string, seed: UnitSeed, order: number): DrillUnit => {
  const [code, name, targets, description] = seed;
  const id = code.toLowerCase();
  const frameworkTargets = targets.map((description, i) => ({ id: `${id}-target-${i + 1}`, skillId, drillUnitId: id, description, order: i + 1 }));
  return {
    id, skillId, code, name, description: description ?? `Build fluency with ${name.toLowerCase()} through one focused concept and a worked SAT-style example.`,
    order, isActive: true, easyQuestionCount: 3, mediumQuestionCount: 2, frameworkTargets,
    concept: [{ label: name, formula: "identify → model → solve → check" }],
    workedExample: { prompt: `Use the structure of ${name.toLowerCase()} to solve a representative SAT problem.`, steps: ["Identify the requested quantity.", "Choose the matching relationship.", "Solve and check the result in context."] },
  };
};

const skill = (categoryId: string, code: string, title: string, order: number, seeds: UnitSeed[], subtitle?: string): Skill => {
  const id = title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const drillUnits = seeds.map((seed, i) => unit(id, seed, i + 1));
  return { id, domainId: categoryId, categoryId, code, title, subtitle, order, gateQuestionCount: 4, gateThreshold: 4, drillUnits, concept: drillUnits[0].concept, workedExample: drillUnits[0].workedExample };
};

const A1: UnitSeed[] = [
  ["A1a", "Fluent solving", ["solve one-variable linear equations fluently"]],
  ["A1b", "Strategic algebraic structure", ["solve using algebraic structure", "interpret variables, factors, and terms"]],
  ["A1c", "Number of solutions", ["distinguish no solution, one solution, and infinitely many solutions"]],
  ["A1d", "Creating equations from context", ["create and use a one-variable linear equation in context", "identify an equation representing a context"]],
  ["A1e", "Interpreting equations in context", ["interpret constants, variables, factors, terms, and solutions in context"]],
];
const A2: UnitSeed[] = [
  ["A2a", "Ordered pairs and values of two-variable equations", ["find one quantity given the other", "interpret solutions as ordered pairs"]],
  ["A2b", "Tables, equations, and graphs", ["interpret Ax + By = C graphically", "connect equations, tables, and graphs"]],
  ["A2c", "Slope and equations of lines", ["interpret slope and intercepts", "write a linear equation in two variables"]],
  ["A2d", "Writing equations of lines", ["write a line from two points", "write a line from a point and slope"]],
  ["A2e", "Parallel and perpendicular lines", ["write a line from a point and a parallel line", "write a line from a point and a perpendicular line"]],
  ["A2f", "Modeling and interpreting two-variable equations", ["create and use two-variable linear equations in context", "model constraints or conditions", "interpret constants, variables, terms, factors, and solutions"]],
];
const A3: UnitSeed[] = [
  ["A3a", "Function notation: input → output", ["evaluate a linear function", "interpret input and output pairs"]],
  ["A3b", "Rate of change and initial value", ["interpret rate of change or slope in context", "interpret initial value"]],
  ["A3c", "Tables, graphs, and equations", ["connect tables, equations, and graphs", "interpret graphs in context"]],
  ["A3d", "Creating linear functions", ["create and use linear functions in context", "model relationships between quantities"]],
  ["A3e", "Interpreting linear functions in context", ["interpret constants, variables, factors, and terms in context"]],
];
const A4: UnitSeed[] = [
  ["A4a", "Solving by substitution", ["solve systems strategically by substitution"]], ["A4b", "Solving by elimination", ["solve systems fluently by elimination"]],
  ["A4c", "Algebraic and graphical solutions", ["connect algebraic and graphical representations", "interpret intersections in context"]],
  ["A4d", "Number of solutions", ["identify no solution, a unique solution, or infinitely many solutions"]],
  ["A4e", "Systems from context", ["create and use systems in context", "model constraints with a system"]],
];
const A5: UnitSeed[] = [
  ["A5a", "One-variable inequalities", ["solve and interpret one-variable inequalities"]],
  ["A5b", "Two-variable inequalities", ["create and use two-variable inequalities"]],
  ["A5c", "Tables, equations, and graphs", ["interpret points relative to a solution set", "connect tabular, algebraic, and graphical representations"]],
  ["A5d", "Systems of linear inequalities", ["solve and graph systems of inequalities"]],
  ["A5e", "Modeling and interpreting inequalities", ["model constraints in context", "interpret constants, variables, factors, terms, and solutions"]],
];
const AM1: UnitSeed[] = [
  ["AM1a", "Polynomial operations", ["add polynomials", "subtract polynomials", "multiply polynomials", "combine like terms and distribute"]],
  ["AM1b", "Common-factor factoring", ["factor out common factors"]],
  ["AM1c", "Difference of squares and trinomial factoring", ["factor a difference of squares", "factor trinomials into binomials"]],
  ["AM1d", "Other polynomial factoring", ["factor polynomial expressions using other algebraic structures"]],
  ["AM1e", "Simple rational-expression rewriting", ["rewrite simple rational expressions"]],
  ["AM1f", "Rational exponents and radical form", ["convert between rational exponents and radical form"]],
  ["AM1g", "Strategic equivalent forms", ["use algebraic structure strategically rather than only mechanical expansion"]],
];
const AM2: UnitSeed[] = [
  ["AM2a", "Quadratics using factoring and algebraic structure", ["solve quadratic equations by factoring", "use algebraic structure to solve quadratics"]], ["AM2b", "Quadratics using square-root structure", ["solve quadratic equations by taking square roots"]],
  ["AM2c", "Quadratic formula", ["solve quadratic equations with the quadratic formula"]], ["AM2d", "Completing the square", ["solve or rewrite quadratics by completing the square"]],
  ["AM2e", "Number of real quadratic solutions", ["determine the number of real quadratic solutions"]], ["AM2f", "Linear absolute-value equations", ["solve linear absolute-value equations"]],
  ["AM2g", "Simple radical equations", ["solve simple radical equations"]], ["AM2h", "Simple rational equations", ["solve simple rational equations"]],
  ["AM2i", "Polynomial equations in factored form", ["solve polynomial equations already in factored form"]],
  ["AM2j", "Linear and nonlinear systems", ["solve linear and nonlinear systems", "connect system solutions to graph intersections"]],
  ["AM2k", "Rearranging multivariable equations and formulas", ["rearrange multivariable formulas for a chosen variable"]],
];
const AM3: UnitSeed[] = [
  ["AM3a", "Nonlinear function notation: input → output", ["use function notation and evaluate nonlinear functions", "interpret input and output pairs"]],
  ["AM3b", "Quadratic functions and key features", ["identify zeros and x-intercepts", "identify f(0) and the y-intercept", "interpret quadratic key features"]],
  ["AM3c", "Quadratic representations and transformations", ["connect quadratic tables, equations, and graphs", "interpret transformations", "choose a form that exposes important features"]],
  ["AM3d", "Exponential growth and decay", ["create and use exponential functions in context"]],
  ["AM3e", "Exponential representations and transformations", ["connect exponential tables, equations, and graphs", "interpret transformations"]],
  ["AM3f", "Polynomial functions", ["interpret polynomial functions and graphs"]], ["AM3g", "Simple rational functions", ["interpret simple rational functions"]],
  ["AM3h", "Radical and other nonlinear functions", ["interpret radical and other nonlinear functions"]], ["AM3i", "Connecting nonlinear representations", ["connect nonlinear tables, equations, and graphs"]],
  ["AM3j", "Creating and selecting quadratic/exponential models", ["select an appropriate quadratic or exponential model", "create and use nonlinear functions in context"]],
  ["AM3k", "Key features, parameters, and useful forms", ["interpret initial values and intercepts", "interpret constants, factors, variables, and terms", "choose useful forms", "interpret points and portions of graphs"]],
];
const P1: UnitSeed[] = [
  ["P1a", "Ratios and proportional relationships", ["interpret and use ratios", "solve proportional relationships"]], ["P1b", "Rates and unit rates", ["interpret rates and unit rates"]],
  ["P1c", "Proportional contexts and scale drawings", ["solve proportional contexts", "use scale drawings"]],
  ["P1d", "One-step unit conversions", ["perform one-step unit conversions"]],
  ["P1e", "Multistep and multidimensional unit conversions", ["perform multistep conversions", "perform multidimensional conversions"]],
  ["P1f", "Derived units", ["interpret derived units from products", "interpret derived units from quotients"]], ["P1g", "Scale factors in proportional relationships", ["reason about scale factors in proportional relationships"]],
];
const P2: UnitSeed[] = [
  ["P2a", "Percent fundamentals", ["calculate percentages in context", "work with percentages of 100 percent or greater"]],
  ["P2b", "Finding unknown original amounts", ["find an original amount from a percentage"]],
  ["P2c", "Percent increase and decrease", ["calculate percent increases", "calculate percent decreases"]],
  ["P2d", "Percent change and growth factor", ["connect percent change to a growth factor"]],
  ["P2e", "Percent applications", ["solve tax, tip, discount, and interest contexts", "model repeated percentage changes"]],
];
const P3: UnitSeed[] = [
  ["P3a", "Frequency tables", ["interpret frequency tables"]], ["P3b", "Histograms and dot plots", ["interpret histograms", "interpret dot plots"]],
  ["P3c", "Box plots", ["interpret box plots"]], ["P3d", "Mean, median, and range", ["calculate mean", "calculate median", "calculate range"]],
  ["P3e", "Effects of outliers", ["explain effects of outliers on mean, median, and spread"]],
  ["P3f", "Comparing distributions using center and spread", ["interpret and compare standard deviation", "compare distributions by center and spread"], "Interpret and compare measures of center and spread, especially standard deviation. Do not require hand calculation of standard deviation."],
];
const P4: UnitSeed[] = [
  ["P4a", "Interpreting scatterplots", ["interpret scatterplots without prediction"]], ["P4b", "Predictions from scatterplots", ["make predictions from scatterplots"]],
  ["P4c", "Fitting linear models", ["fit and interpret linear models"]], ["P4d", "Fitting quadratic and exponential models", ["fit and interpret quadratic models", "fit and interpret exponential models"]],
  ["P4e", "Interpreting graphs modeling two quantities", ["interpret graphs relating two quantities"]], ["P4f", "Comparing linear and exponential growth", ["compare linear and exponential growth"]],
];
const P5: UnitSeed[] = [
  ["P5a", "Relative frequency and data representations", ["calculate relative frequency", "interpret one-way and two-way tables", "use area models"]], ["P5b", "Probability", ["calculate and interpret probability"]],
  ["P5c", "Conditional probability", ["calculate and interpret conditional probability"]],
  ["P5d", "Probability in context", ["interpret probability in context"]],
  ["P5e", "Missing frequencies from probability", ["infer a missing frequency from a probability"]],
];
const P6: UnitSeed[] = [
  ["P6a", "Sample mean → population mean", ["use a sample mean to estimate a population mean"]],
  ["P6b", "Sample proportion → population proportion", ["use a sample proportion to estimate a population proportion"]],
  ["P6c", "Margin of error", ["interpret margin of error"]], ["P6d", "Sample size and margin of error", ["explain the effect of larger sample size on margin of error"]],
];
const P7: UnitSeed[] = [
  ["P7a", "Random samples and generalization", ["identify the population to which a random sample can generalize", "understand random sampling"]],
  ["P7b", "Sampling methods and limitations", ["identify sampling methods and limitations"]], ["P7c", "Observational studies and experiments", ["distinguish observational studies and experiments"]],
  ["P7d", "Random assignment and causal conclusions", ["understand random assignment", "explain why random assignment supports causal inference", "determine whether causal evidence is justified"]],
];
const G1: UnitSeed[] = [
  ["G1a", "Area and perimeter", ["area of geometric figures", "perimeter", "selecting the appropriate area formula", "objects modeled by geometric figures"]],
  ["G1b", "Surface area", ["surface area", "selecting the appropriate surface-area formula"]],
  ["G1c", "Volume", ["volume", "selecting the appropriate volume formula"]],
  ["G1d", "Missing geometric measures", ["solving from a given length", "solving from a given area", "solving from a given surface area", "solving from a given volume"]],
  ["G1e", "Scale factors", ["length scale factor = k", "area scale factor = k²", "volume scale factor = k³", "real-world and purely mathematical contexts"], "Distinguish scale effects explicitly: lengths scale by k, areas by k², and volumes by k³."],
  ["G1f", "Formula selection and mixed measurement", ["select an appropriate geometry formula", "combine length, area, surface area, and volume reasoning"]],
];
const G2: UnitSeed[] = [
  ["G2a", "Vertical and related angle relationships", ["vertical angles", "supplementary and complementary angle relationships"]], ["G2b", "Triangle angle relationships", ["triangle angle sum"]],
  ["G2c", "Parallel lines and transversals", ["parallel lines cut by a transversal"]], ["G2d", "Similar triangles", ["triangle similarity"]],
  ["G2e", "Congruent triangles", ["triangle congruence"]], ["G2f", "Scale factors in similar figures", ["length scale factors in similar figures", "angle measures unchanged under scaling"]],
  ["G2g", "Geometric sufficiency and theorem reasoning", ["determine which statements are sufficient to establish a relationship or theorem"]],
];
const G3: UnitSeed[] = [
  ["G3a", "Pythagorean theorem", ["apply the Pythagorean theorem"]], ["G3b", "45-45-90 triangles", ["solve 45-45-90 triangles"]],
  ["G3c", "30-60-90 triangles", ["solve 30-60-90 triangles"]], ["G3d", "Right-triangle sine, cosine, and tangent", ["use right-triangle trigonometry"]],
  ["G3e", "Similarity and trigonometric ratios", ["use similarity to determine sine, cosine, and tangent"]],
  ["G3f", "Complementary sine/cosine relationships", ["use sine and cosine relationships for complementary angles"]],
  ["G3g", "Applied right-triangle problems", ["solve contextual right-triangle applications"]],
];
const G4: UnitSeed[] = [
  ["G4a", "Radius, diameter, and basic circle relationships", ["radius", "diameter"]], ["G4b", "Arc length and sector area", ["arc length", "sector area"]],
  ["G4c", "Circle angles and tangents", ["circle angles", "tangents"]], ["G4d", "Radian measure", ["radian measure", "degree and radian conversion"]],
  ["G4e", "Unit-circle trigonometric ratios", ["unit-circle trigonometric ratios"]],
  ["G4f", "Circle equations: creating equations, center, and radius", ["standard circle form", "create circle equations in the xy-plane", "identify center and radius"]],
  ["G4g", "Circle graphs and equation changes", ["understand how equation changes affect the graph", "understand how graph changes affect the equation"]],
  ["G4h", "Completing the square for circles", ["complete the square in circle equations"]], ["G4i", "Distance formula in circle problems", ["use the distance formula in circle problems"]],
];

const category = (id: string, name: string, shortName: string, weight: number, accent: CategoryAccent, skills: Skill[]): Category => ({ id, name, shortName, weight, accent, skills, topics: skills });
export const categories: Category[] = [
  category("algebra", "Algebra", "Algebra", 35, "algebra", [skill("algebra", "A1", "Linear equations in one variable", 1, A1), skill("algebra", "A2", "Linear equations in two variables", 2, A2), skill("algebra", "A3", "Linear functions", 3, A3), skill("algebra", "A4", "Systems of two linear equations in two variables", 4, A4), skill("algebra", "A5", "Linear inequalities in one or two variables", 5, A5)]),
  category("advanced-math", "Advanced Math", "Advanced Math", 35, "advanced", [skill("advanced-math", "AM1", "Equivalent expressions", 1, AM1), skill("advanced-math", "AM2", "Nonlinear equations in one variable and systems of equations in two variables", 2, AM2), skill("advanced-math", "AM3", "Nonlinear functions", 3, AM3)]),
  category("problem-solving-data-analysis", "Problem-Solving & Data Analysis", "Problem Solving", 15, "data", [skill("problem-solving-data-analysis", "P1", "Ratios, rates, proportional relationships, and units", 1, P1), skill("problem-solving-data-analysis", "P2", "Percentages", 2, P2), skill("problem-solving-data-analysis", "P3", "One-variable data: distributions and measures of center and spread", 3, P3), skill("problem-solving-data-analysis", "P4", "Two-variable data: models and scatterplots", 4, P4), skill("problem-solving-data-analysis", "P5", "Probability and conditional probability", 5, P5), skill("problem-solving-data-analysis", "P6", "Inference from sample statistics and margin of error", 6, P6), skill("problem-solving-data-analysis", "P7", "Evaluating statistical claims: observational studies and experiments", 7, P7)]),
  category("geometry-trigonometry", "Geometry & Trigonometry", "Geometry", 15, "geometry", [skill("geometry-trigonometry", "G1", "Area and volume", 1, G1), skill("geometry-trigonometry", "G2", "Lines, angles, and triangles", 2, G2), skill("geometry-trigonometry", "G3", "Right triangles and trigonometry", 3, G3), skill("geometry-trigonometry", "G4", "Circles", 4, G4)]),
];
export const domains: Domain[] = categories;

export const allSkills = categories.flatMap((item) => item.skills);
export const allTopics = allSkills;
export const allDrillUnits = allSkills.flatMap((item) => item.drillUnits);
export const allFrameworkTargets = allDrillUnits.flatMap((item) => item.frameworkTargets);
export const getCategory = (id: string) => categories.find((item) => item.id === id);
export const getSkill = (id: string) => allSkills.find((item) => item.id === id);
export const getTopic = getSkill;
export const getDrillUnit = (id: string) => allDrillUnits.find((item) => item.id === id);
export const getCategoryForTopic = (id: string) => { const item = getSkill(id); return item ? getCategory(item.categoryId) : undefined; };

const q = (unitId: string, difficulty: QuestionDifficulty, order: number, prompt: string, choices: string[] | undefined, answer: string, explanation: string, options: Partial<Question> = {}): Question => {
  const drillUnit = getDrillUnit(unitId)!; const owningSkill = getSkill(drillUnit.skillId)!; const categoryItem = getCategory(owningSkill.categoryId)!;
  const target = drillUnit.frameworkTargets[Math.min(order - 1, drillUnit.frameworkTargets.length - 1)] ?? drillUnit.frameworkTargets[0];
  return { id: `${unitId}-${options.isGate ? "gate" : difficulty}-${order}`, domainId: categoryItem.id, domain: categoryItem.name, skillId: owningSkill.id, skillName: owningSkill.title,
    drillUnitId: drillUnit.id, drillUnitName: drillUnit.name, frameworkTarget: target.description, frameworkTargetId: target.id, difficulty,
    questionType: choices ? "multiple_choice" : "student_response", prompt, choices, correctAnswer: answer, explanation,
    questionModelId: difficulty === "hard" ? undefined : `${unitId}-${difficulty}-model`, sourceType: "original", sourceQuestionId: `${owningSkill.code}-${unitId.toUpperCase()}-${order}`, status: "active",
    order, categoryId: owningSkill.categoryId, topicId: owningSkill.id, type: choices ? "multiple_choice" : "student_response", sourceLabel: "SAT Math Drill original", ...options };
};

const g1Questions: Question[] = [
  q("g1a", "easy", 1, "A rectangle is 9 meters long and 4 meters wide. What is its area?", ["13", "26", "36", "72"], "36", "Use A = lw: 9 × 4 = 36 square meters."),
  q("g1a", "easy", 2, "A square has side length 12 cm. What is its perimeter?", ["24", "36", "48", "144"], "48", "A square has four equal sides, so P = 4(12) = 48."),
  q("g1a", "easy", 3, "A triangle has base 10 and height 7. What is its area?", ["17", "35", "70", "140"], "35", "Use A = 1/2 bh: 1/2(10)(7) = 35."),
  q("g1a", "medium", 1, "A rectangle has perimeter 34 and length 11. What is its area?", ["33", "66", "121", "187"], "66", "2(11 + w) = 34, so w = 6 and A = 66."),
  q("g1a", "medium", 2, "A composite floor is formed by a 10-by-8 rectangle with a 2-by-3 corner removed. What is its area?", ["68", "74", "80", "86"], "74", "Subtract the removed area: 80 − 6 = 74."),
  q("g1b", "easy", 1, "A cube has side length 4. What is its surface area?", ["16", "24", "64", "96"], "96", "A cube has six square faces, so SA = 6(4²) = 96."),
  q("g1b", "easy", 2, "A rectangular prism measures 2 by 3 by 5. What is its surface area?", ["30", "42", "62", "90"], "62", "SA = 2(lw + lh + wh) = 2(6 + 10 + 15) = 62."),
  q("g1b", "easy", 3, "A cylinder has radius 3 and height 5. Which expression gives its total surface area?", ["15π", "30π", "48π", "90π"], "48π", "Use 2πr² + 2πrh = 18π + 30π = 48π."),
  q("g1b", "medium", 1, "An open-top box is 6 by 4 by 3. What is its surface area?", ["72", "84", "96", "108"], "84", "Include the base and four sides: 24 + 36 + 24 = 84."),
  q("g1b", "medium", 2, "A cube has surface area 150. What is its side length?", undefined, "5", "6s² = 150, so s² = 25 and s = 5."),
  q("g1c", "easy", 1, "A rectangular prism measures 3 by 4 by 8. What is its volume?", ["15", "32", "48", "96"], "96", "Use V = lwh: 3 × 4 × 8 = 96."),
  q("g1c", "easy", 2, "A cylinder has radius 2 and height 9. What is its volume?", ["18π", "36π", "54π", "81π"], "36π", "Use V = πr²h = π(2²)(9) = 36π."),
  q("g1c", "easy", 3, "A cube has edge length 5. What is its volume?", ["25", "75", "125", "625"], "125", "Use V = s³ = 5³ = 125."),
  q("g1c", "medium", 1, "A prism has base area 18 and height 7. What is its volume?", ["25", "63", "126", "252"], "126", "A prism's volume is base area times height: 18(7) = 126."),
  q("g1c", "medium", 2, "A cylinder has diameter 10 and height 4. What is its volume?", ["40π", "80π", "100π", "400π"], "100π", "The radius is 5, so V = π(5²)(4) = 100π."),
  q("g1d", "easy", 1, "A rectangle has area 54 and length 9. What is its width?", undefined, "6", "Since A = lw, w = 54 ÷ 9 = 6."),
  q("g1d", "easy", 2, "A rectangular prism has volume 240, length 10, and width 6. What is its height?", undefined, "4", "240 = 10 × 6 × h, so h = 4."),
  q("g1d", "easy", 3, "A square has area 81. What is its side length?", ["9", "18", "27", "40.5"], "9", "s² = 81, so the positive side length is 9."),
  q("g1d", "medium", 1, "A cylinder has volume 144π and height 9. What is its radius?", ["4", "8", "12", "16"], "4", "144π = πr²(9), so r² = 16 and r = 4."),
  q("g1d", "medium", 2, "A cube has surface area 294. What is its volume?", ["49", "147", "294", "343"], "343", "6s² = 294 gives s² = 49 and s = 7, so V = 7³ = 343."),
  q("g1e", "easy", 1, "Two similar figures have length scale factor 3. What is their area scale factor?", ["3", "6", "9", "27"], "9", "Area scales by the square of the length factor: 3² = 9."),
  q("g1e", "easy", 2, "A model is made at one-half the original length. What fraction of the original volume is the model?", ["1/2", "1/4", "1/6", "1/8"], "1/8", "Volume scales by the cube of the length factor: (1/2)³ = 1/8."),
  q("g1e", "easy", 3, "A square's side length is doubled. By what factor does its perimeter change?", ["2", "4", "6", "8"], "2", "Perimeter is a length, so it scales directly by 2."),
  q("g1e", "medium", 1, "Two similar solids have surface areas in a 16:25 ratio. What is the ratio of corresponding lengths?", ["2:5", "4:5", "8:5", "16:25"], "4:5", "Take the positive square root of the area ratio: √16:√25 = 4:5."),
  q("g1e", "medium", 2, "A cube's volume increases by a factor of 64. By what factor did its edge length increase?", ["4", "8", "16", "32"], "4", "Length uses the cube root of the volume factor: ∛64 = 4."),
];
const gatePrompts: Array<[string, string[], string, string]> = [
  ["A circle has diameter 14. What is its area?", ["14π", "28π", "49π", "196π"], "49π", "The radius is 7, so A = π(7²) = 49π."],
  ["A cube has surface area 216. What is its volume?", ["36", "108", "180", "216"], "216", "6s² = 216 gives s = 6, and 6³ = 216."],
  ["A rectangular tank with base 8 by 5 contains 240 cubic units. What is the water height?", ["4", "6", "8", "10"], "6", "240 = 8(5)h, so h = 6."],
  ["Similar solids have a length ratio of 2:3. What is their volume ratio?", ["2:3", "4:9", "6:9", "8:27"], "8:27", "Cube the length ratio: 2³:3³ = 8:27."],
];
gatePrompts.forEach((item, i) => g1Questions.push(q(`g1${String.fromCharCode(97 + i)}`, "medium", i + 1, item[0], item[1], item[2], item[3], { id: `g1-gate-${i + 1}`, isGate: true })));
g1Questions.push(q("g1e", "hard", 1, "Two similar square patios have side lengths in a 3:5 ratio. The smaller costs $1,800 to tile at the same rate per square foot. What will the larger patio cost?", ["$3,000", "$4,200", "$5,000", "$7,500"], "$5,000", "Area scales by (5/3)² = 25/9. Then $1,800 × 25/9 = $5,000.", { id: "g1-live-challenge" }));

const placeholderQuestions = allDrillUnits.filter((item) => !item.id.startsWith("g1") || item.id === "g1f").flatMap((drillUnit) => (["easy", "medium"] as const).flatMap((difficulty) => Array.from({ length: difficulty === "easy" ? 3 : 2 }, (_, i) => q(drillUnit.id, difficulty, i + 1, `${drillUnit.code} — ${drillUnit.name}: Which first step best matches this focused framework target?`, ["Identify the governing relationship", "Ignore the given units", "Change the requested quantity", "Estimate before reading"], "Identify the governing relationship", `This demo item is mapped to “${drillUnit.frameworkTargets[0].description}.” Production content requires review before release.`, { sourceType: "placeholder", sourceLabel: "Framework-mapped demo placeholder", status: "review", requiresReview: true }))));
export const areaVolumeQuestions = g1Questions;
export const seedQuestions = [...g1Questions, ...placeholderQuestions];
export const questionModels: QuestionModel[] = allDrillUnits.flatMap((drillUnit) => (["easy", "medium"] as const).map((difficulty) => ({
  id: `${drillUnit.id}-${difficulty}-model`, drillUnitId: drillUnit.id, frameworkTargetId: drillUnit.frameworkTargets[0].id,
  name: `${drillUnit.code}_${difficulty.toUpperCase()}_MODEL`, difficulty, description: `Controlled ${difficulty} model for ${drillUnit.name}.`,
  template: "Create one SAT-style item for the specified target and return one unambiguous answer.",
  parameterRules: difficulty === "easy" ? "Use direct relationships and reasonable integer values." : "Require two connected reasoning steps with SAT-style values.",
  answerRules: "The answer must be unique and verifiable by the stated solution method.", solutionMethod: "Identify the target relationship, solve, and verify.",
  forbiddenFeatures: "No unrelated targets, hidden assumptions, trick wording, or unsupported diagrams.", isActive: true,
})));

export const accentColor: Record<CategoryAccent, string> = { algebra: "#416f9d", advanced: "#755e8f", data: "#4f7a66", geometry: "#a1623c" };

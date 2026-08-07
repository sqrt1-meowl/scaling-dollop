export type CategoryAccent = "algebra" | "advanced" | "data" | "geometry";
export type TopicStatus = "locked" | "available" | "in_progress" | "review" | "complete";
export type QuestionDifficulty = "easy" | "medium" | "hard" | "gate";
export type QuestionType = "multiple_choice" | "student_response";

export interface Question {
  id: string;
  categoryId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  prompt: string;
  math?: string;
  imageUrl?: string;
  choices?: string[];
  correctAnswer: string;
  explanation: string;
  sourceLabel: string;
  sourceQuestionId: string;
  order: number;
}

export interface Topic {
  id: string;
  categoryId: string;
  code: string;
  title: string;
  subtitle?: string;
  order: number;
  concept: { label: string; formula: string }[];
  workedExample: { prompt: string; steps: string[] };
}

export interface Category {
  id: string;
  name: string;
  shortName: string;
  weight: number;
  accent: CategoryAccent;
  topics: Topic[];
}

const makeTopic = (categoryId: string, code: string, title: string, order: number, subtitle?: string): Topic => ({
  id: title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  categoryId,
  code,
  title,
  subtitle,
  order,
  concept: [
    { label: "Core relationship", formula: "y = f(x)" },
    { label: "SAT focus", formula: "\text{identify} \\rightarrow \\text{model} \\rightarrow \\text{solve}" },
  ],
  workedExample: {
    prompt: `A representative SAT problem tests ${title.toLowerCase()}. Identify the relationship, substitute the given values, and solve.`,
    steps: ["Identify the quantities and the requested value.", "Write the governing relationship.", "Substitute carefully and verify the result."],
  },
});

export const categories: Category[] = [
  {
    id: "algebra", name: "Algebra", shortName: "Algebra", weight: 35, accent: "algebra",
    topics: [
      makeTopic("algebra", "A1", "Linear equations in one variable", 1),
      makeTopic("algebra", "A2", "Linear functions", 2),
      makeTopic("algebra", "A3", "Linear equations in two variables", 3),
      makeTopic("algebra", "A4", "Systems of two linear equations", 4),
      makeTopic("algebra", "A5", "Linear inequalities", 5),
    ],
  },
  {
    id: "advanced-math", name: "Advanced Math", shortName: "Advanced Math", weight: 35, accent: "advanced",
    topics: [
      makeTopic("advanced-math", "M1", "Equivalent expressions", 1, "Combining, factoring, and distributing"),
      makeTopic("advanced-math", "M2", "Nonlinear equations in one variable", 2, "Quadratic, radical, rational, and absolute value"),
      makeTopic("advanced-math", "M3", "Systems of one linear equation and one nonlinear equation", 3),
      makeTopic("advanced-math", "M4", "Nonlinear functions", 4, "Graphs, key features, transformations, and context"),
    ],
  },
  {
    id: "problem-solving-data-analysis", name: "Problem-Solving & Data Analysis", shortName: "Problem Solving", weight: 15, accent: "data",
    topics: [
      makeTopic("problem-solving-data-analysis", "P1", "Ratios, rates, proportions, and units", 1),
      makeTopic("problem-solving-data-analysis", "P2", "Percentages and growth factor", 2),
      makeTopic("problem-solving-data-analysis", "P3", "One-variable data", 3, "Center, spread, and effects of changes"),
      makeTopic("problem-solving-data-analysis", "P4", "Two-variable data", 4, "Scatterplots and linear fit"),
      makeTopic("problem-solving-data-analysis", "P5", "Probability and conditional probability", 5),
      makeTopic("problem-solving-data-analysis", "P6", "Sample statistics and margin of error", 6),
      makeTopic("problem-solving-data-analysis", "P7", "Evaluating statistical claims", 7),
    ],
  },
  {
    id: "geometry-trigonometry", name: "Geometry & Trigonometry", shortName: "Geometry", weight: 15, accent: "geometry",
    topics: [
      {
        ...makeTopic("geometry-trigonometry", "G1", "Area and Volume", 1), id: "area-and-volume",
        concept: [
          { label: "Rectangle", formula: "A = lw" }, { label: "Triangle", formula: "A = \\frac{1}{2}bh" },
          { label: "Circle", formula: "A = \\pi r^2" }, { label: "Rectangular prism", formula: "V = lwh" },
        ],
        workedExample: { prompt: "A rectangle has length 8 cm and width 5 cm. Find its area.", steps: ["A = lw", "A = 8(5)", "A = 40\\text{ cm}^2"] },
      },
      makeTopic("geometry-trigonometry", "G2", "Lines, angles, and triangles", 2),
      makeTopic("geometry-trigonometry", "G3", "Right triangles and trigonometry", 3),
      makeTopic("geometry-trigonometry", "G4", "Circles", 4, "Equations, arcs, and sectors"),
    ],
  },
];

export const allTopics = categories.flatMap((category) => category.topics);
export const getCategory = (id: string) => categories.find((category) => category.id === id);
export const getTopic = (id: string) => allTopics.find((topic) => topic.id === id);
export const getCategoryForTopic = (topicId: string) => {
  const topic = getTopic(topicId);
  return topic ? getCategory(topic.categoryId) : undefined;
};

const av = (id: string, difficulty: QuestionDifficulty, order: number, prompt: string, choices: string[] | undefined, answer: string, explanation: string, type: QuestionType = "multiple_choice", math?: string): Question => ({
  id, categoryId: "geometry-trigonometry", topicId: "area-and-volume", difficulty, type, prompt, choices, correctAnswer: answer,
  explanation, sourceLabel: "SAT Math Drill original", sourceQuestionId: `AV-${id.toUpperCase()}`, order, math,
});

export const areaVolumeQuestions: Question[] = [
  av("e1", "easy", 1, "A square has side length 12 cm. What is its area?", ["24", "48", "144", "288"], "144", "A square's area is s². So 12² = 144."),
  av("e2", "easy", 2, "A rectangle is 9 meters long and 4 meters wide. What is its area?", ["13", "26", "36", "72"], "36", "Use A = lw: 9 × 4 = 36 square meters."),
  av("e3", "easy", 3, "A triangle has base 10 and height 7. What is its area?", ["17", "35", "70", "140"], "35", "Use A = ½bh: ½(10)(7) = 35."),
  av("e4", "easy", 4, "A circle has radius 5. What is its area in terms of π?", ["5π", "10π", "25π", "50π"], "25π", "Use A = πr²: π(5²) = 25π."),
  av("e5", "easy", 5, "A rectangular prism measures 3 by 4 by 8. What is its volume?", ["15", "32", "48", "96"], "96", "Use V = lwh: 3 × 4 × 8 = 96."),
  av("e6", "easy", 6, "The area of a rectangle is 54 square units and its length is 9. What is its width?", undefined, "6", "Since A = lw, w = 54 ÷ 9 = 6.", "student_response"),
  av("m1", "medium", 1, "A rectangle's length is 3 more than its width. If the width is 7, what is the rectangle's area?", ["49", "70", "77", "100"], "70", "The length is 10, so the area is 10 × 7 = 70."),
  av("m2", "medium", 2, "A square's side length is increased by a factor of 3. By what factor does its area increase?", ["3", "6", "9", "12"], "9", "Area scales with the square of length: 3² = 9."),
  av("m3", "medium", 3, "A cylindrical can has radius 2 and height 9. What is its volume?", ["18π", "36π", "54π", "81π"], "36π", "Use V = πr²h: π(2²)(9) = 36π."),
  av("m4", "medium", 4, "A triangle and a rectangle share a base of 12. The triangle's height is 8 and the rectangle's height is 5. How much greater is the triangle's area?", ["8", "12", "18", "36"], "12", "Triangle area is 48; rectangle area is 60. The difference is 12."),
  av("m5", "medium", 5, "A cube has volume 125 cubic units. What is the area of one face?", ["5", "20", "25", "75"], "25", "The side length is ∛125 = 5. One face has area 5² = 25."),
  av("m6", "medium", 6, "A circular garden has area 64π square feet. What is its diameter?", undefined, "16", "From πr² = 64π, r = 8. The diameter is 16.", "student_response"),
  av("g1", "gate", 1, "A rectangle has perimeter 34 and length 11. What is its area?", ["33", "66", "121", "187"], "66", "2(11 + w) = 34, so w = 6 and A = 66."),
  av("g2", "gate", 2, "A circle's diameter is 14. What is its area in terms of π?", ["14π", "28π", "49π", "196π"], "49π", "The radius is 7, so A = π(7²) = 49π."),
  av("g3", "gate", 3, "A rectangular prism has volume 240, length 10, and width 6. What is its height?", undefined, "4", "240 = 10 × 6 × h, so h = 4.", "student_response"),
  av("g4", "gate", 4, "A square and an equilateral triangle have the same perimeter, 24. What is the area of the square?", ["24", "32", "36", "64"], "36", "Each side of the square is 24 ÷ 4 = 6, so its area is 36."),
  av("challenge", "hard", 1, "Two similar square patios have side lengths in a 3:5 ratio. The smaller patio costs $1,800 to tile at the same rate per square foot. What will the larger patio cost?", ["$3,000", "$4,200", "$5,000", "$7,500"], "$5,000", "Area scales by (5/3)² = 25/9. Then $1,800 × 25/9 = $5,000."),
];

const placeholderQuestions = allTopics.filter((topic) => topic.id !== "area-and-volume").flatMap((topic) => {
  const make = (difficulty: "easy" | "medium", order: number): Question => ({
    id: `${topic.id}-${difficulty}-${order}`, categoryId: topic.categoryId, topicId: topic.id, difficulty, type: "multiple_choice",
    prompt: `${topic.title}: choose the expression that represents a correct first step for this practice item.`,
    choices: ["Identify the given relationship", "Ignore the units", "Estimate without reading", "Change the question"],
    correctAnswer: "Identify the given relationship", explanation: "Start by identifying the governing relationship and the requested quantity.",
    sourceLabel: "SAT Math Drill placeholder", sourceQuestionId: `${topic.code}-${difficulty[0].toUpperCase()}${order}`, order,
  });
  return [...Array.from({ length: 6 }, (_, i) => make("easy", i + 1)), ...Array.from({ length: 6 }, (_, i) => make("medium", i + 1))];
});

export const seedQuestions = [...areaVolumeQuestions, ...placeholderQuestions];

export const accentColor: Record<CategoryAccent, string> = {
  algebra: "#416f9d", advanced: "#755e8f", data: "#4f7a66", geometry: "#a1623c",
};

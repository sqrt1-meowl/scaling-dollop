import { getSkill, type Question } from "./curriculum";

const numeric = (question: Question, prompt: string, answer: string | number, explanation: string): Question => ({
  ...question,
  prompt,
  choices: undefined,
  correctAnswer: String(answer),
  explanation,
  questionType: "student_response",
  type: "student_response",
});

const choice = (question: Question, prompt: string, choices: string[], answer: string, explanation: string): Question => ({
  ...question,
  prompt,
  choices,
  correctAnswer: answer,
  explanation,
  questionType: "multiple_choice",
  type: "multiple_choice",
});

/** Turns internal curriculum placeholders into direct, repeatable student practice. */
export function asDirectPracticeQuestion(question: Question, variant: number): Question {
  if (question.sourceType !== "placeholder") return question;
  const skill = getSkill(question.skillId);
  if (!skill) return question;
  const level = question.difficulty === "easy" ? 1 : question.difficulty === "medium" ? 2 : 3;
  const n = variant % 7 + 2;
  const m = variant % 4 + 2;

  switch (skill.code) {
    case "A1": {
      const x = n + level;
      const b = m * x + level * 3;
      return numeric(question, `Solve for x: ${m}x + ${level * 3} = ${b}`, x, `Subtract ${level * 3}, then divide by ${m}.`);
    }
    case "A2": {
      const y = m * n + level;
      return numeric(question, `The equation y = ${m}x + ${level} defines a line. What is y when x = ${n}?`, y, `Substitute ${n} for x.`);
    }
    case "A3": {
      const value = m * n - level;
      return numeric(question, `For f(x) = ${m}x - ${level}, find f(${n}).`, value, `Evaluate the function at x = ${n}.`);
    }
    case "A4": {
      const x = n + level;
      const y = m;
      return numeric(question, `The system x + y = ${x + y} and x - y = ${x - y} has solution (x, y). What is x?`, x, "Add the equations and divide by 2.");
    }
    case "A5": {
      const bound = n + level;
      return choice(question, `Which inequality is equivalent to ${m}x + ${m * level} < ${m * bound + m * level}?`, [`x < ${bound}`, `x > ${bound}`, `x < ${bound + level}`, `x > ${bound + level}`], `x < ${bound}`, `Subtract ${m * level} and divide by ${m}.`);
    }
    case "AM1": {
      return choice(question, `Which expression is equivalent to ${m}x(x + ${n})?`, [`${m}x² + ${m * n}x`, `${m}x² + ${n}x`, `${m + n}x²`, `${m * n}x²`], `${m}x² + ${m * n}x`, "Distribute the monomial to both terms.");
    }
    case "AM2": {
      const a = n;
      const b = n + level + 1;
      return numeric(question, `The equation x² - ${a + b}x + ${a * b} = 0 has solutions ${a} and another number. What is the other solution?`, b, `Factor as (x - ${a})(x - ${b}).`);
    }
    case "AM3": {
      const base = level + 1;
      const input = variant % 3 + 2;
      const value = m * base ** input;
      return numeric(question, `For f(x) = ${m}(${base})ˣ, find f(${input}).`, value, `Substitute ${input} for x and evaluate the power first.`);
    }
    case "P1": {
      const unit = m + level;
      const quantity = n + level;
      return numeric(question, `${n} notebooks cost $${n * unit}. At the same rate, how much do ${quantity} notebooks cost?`, quantity * unit, `The unit price is $${unit}.`);
    }
    case "P2": {
      const percent = [10, 20, 25, 40, 50][variant % 5];
      const whole = (n + level) * 20;
      return numeric(question, `What is ${percent}% of ${whole}?`, percent * whole / 100, `Multiply ${whole} by ${percent / 100}.`);
    }
    case "P3": {
      const center = n * level + 4;
      return numeric(question, `What is the mean of ${center - 4}, ${center - 2}, ${center}, ${center + 2}, and ${center + 4}?`, center, "The values are symmetric around the mean.");
    }
    case "P4": {
      const x = n + level;
      const y = m * x + level;
      return numeric(question, `A line of best fit is y = ${m}x + ${level}. What value of y does the model predict when x = ${x}?`, y, `Substitute ${x} into the model.`);
    }
    case "P5": {
      const total = 10 + 2 * n;
      const favorable = n;
      return numeric(question, `A bag contains ${total} equally likely tiles, and ${favorable} are blue. What is the probability of selecting a blue tile? Give a fraction.`, `${favorable}/${total}`, "Probability is favorable outcomes divided by total outcomes.");
    }
    case "P6": {
      const mean = 40 + n * level;
      return numeric(question, `A random sample has a mean of ${mean}. What is the best point estimate for the population mean?`, mean, "Use the sample mean as the point estimate.");
    }
    case "P7": {
      const scenarios = [
        ["A random sample is observed without assigning treatments.", "Generalization, but not causation"],
        ["Volunteers are randomly assigned to treatment and control groups.", "Causation, but not broad generalization"],
        ["A random sample is also randomly assigned to treatment and control groups.", "Both causation and generalization"],
      ] as const;
      const [scenario, answer] = scenarios[variant % scenarios.length];
      return choice(question, `${scenario} What kind of conclusion is supported?`, ["Neither", "Generalization, but not causation", "Causation, but not broad generalization", "Both causation and generalization"], answer, "Random sampling supports generalization; random assignment supports causation.");
    }
    case "G1": {
      if (level === 1) return numeric(question, `A rectangle is ${n + 3} units long and ${m + 2} units wide. What is its area?`, (n + 3) * (m + 2), "Multiply length by width.");
      const height = level + 3;
      return numeric(question, `A rectangular prism measures ${n} by ${m + 1} by ${height}. What is its volume?`, n * (m + 1) * height, "Multiply the three dimensions.");
    }
    case "G2": {
      const first = 35 + n;
      const second = 55 + level;
      return numeric(question, `A triangle has angles ${first}° and ${second}°. What is the measure of the third angle?`, 180 - first - second, "Triangle angles sum to 180°.");
    }
    case "G3": {
      const scale = variant % 4 + 1;
      return numeric(question, `A right triangle has legs ${3 * scale} and ${4 * scale}. What is the length of its hypotenuse?`, 5 * scale, "Use the Pythagorean theorem.");
    }
    case "G4": {
      const radius = n + level;
      return choice(question, `A circle has radius ${radius}. What is its area?`, [`${radius * 2}π`, `${radius ** 2}π`, `${radius ** 2 * 2}π`, `${radius ** 3}π`], `${radius ** 2}π`, "Use A = πr².");
    }
    default:
      return question;
  }
}

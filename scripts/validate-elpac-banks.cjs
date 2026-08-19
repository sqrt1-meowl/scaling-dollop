const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "components", "elpac");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "elpac-bank-audit-"));
process.env.NODE_PATH = [path.join(root, "node_modules"), process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
require("node:module").Module._initPaths();

function compile(name, exposeBanks = false) {
  let source = fs.readFileSync(path.join(sourceDir, name), "utf8");
  if (exposeBanks) source += "\nexport { BANKS };\n";
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: name,
  }).outputText;
  fs.writeFileSync(path.join(tempDir, name), output);
}

const failures = [];
const fail = (message) => failures.push(message);
const countQuestions = (blocks) => blocks.reduce((total, block) => total + (block.qs?.length || 0), 0);
const countTasks = (items) => items.reduce((counts, item) => {
  const task = item.task
    .replace(/ \(\d+ of \d+\)$/i, "")
    .replace(/ \(Question \d+\)$/i, "")
    .replace(/^Writing — /, "")
    .replace(/^Describe a Picture$/, "Describe a Picture");
  counts[task] = (counts[task] || 0) + 1;
  return counts;
}, {});
const expectCounts = (actual, expected, label) => {
  for (const [task, count] of Object.entries(expected)) {
    if (actual[task] !== count) fail(`${label}: expected ${count} ${task}, found ${actual[task] || 0}`);
  }
};

try {
  compile("g1112AdditionalBanks.js");
  compile("g1112Banks.js");
  compile("ElpacPracticeV17.jsx", true);
  const { BANKS } = require(path.join(tempDir, "ElpacPracticeV17.jsx"));

  for (const [setNum, spans] of Object.entries(BANKS)) {
    for (const [span, bank] of Object.entries(spans).filter(([key, value]) => ["g35", "g68", "g910", "g1112"].includes(key) && value)) {
      const label = `Set ${setNum} ${span}`;
      const totals = {
        listening: countQuestions(bank.listening),
        speaking: bank.speaking.length,
        reading: countQuestions(bank.reading),
        writing: bank.writing.length,
      };
      for (const [domain, expected] of Object.entries({ listening: 22, speaking: 12, reading: 26, writing: 6 })) {
        if (totals[domain] !== expected) fail(`${label}: ${domain} expected ${expected}, found ${totals[domain]}`);
      }

      const listening = countTasks(bank.listening);
      expectCounts(listening, span === "g35"
        ? { "Listen to a Short Exchange": 3, "Listen to a Classroom Conversation": 1, "Listen to a Story": 2, "Listen to an Oral Presentation": 3 }
        : { "Listen to a Short Exchange": 3, "Listen to a Classroom Conversation": 1, "Listen to an Oral Presentation": 2, "Listen to a Speaker Support an Opinion": 2 }, label);

      const speaking = countTasks(bank.speaking);
      expectCounts(speaking, span === "g35"
        ? { "Talk about a Scene": 4, "Speech Functions": 3, "Support an Opinion": 2, "Retell a Narrative": 1, "Summarize an Academic Presentation": 2 }
        : { "Talk about a Scene": 4, "Speech Functions": 2, "Support an Opinion": 2, "Present and Discuss Information": 2, "Summarize an Academic Presentation": 2 }, label);

      const reading = countTasks(bank.reading);
      expectCounts(reading, span === "g35"
        ? { "Read and Choose a Sentence": 2, "Read a Short Informational Passage": 2, "Read a Student Essay": 1, "Read a Literary Passage": 1, "Read an Informational Passage": 1 }
        : { "Read a Short Informational Passage": 2, "Read a Student Essay": 1, "Read a Literary Passage": 1, "Read an Informational Passage": 1 }, label);

      const writing = countTasks(bank.writing);
      expectCounts(writing, { "Describe a Picture": 2, "Write About an Experience": 1, "Write About Academic Information": 2, "Justify an Opinion": 1 }, label);

      for (const block of bank.listening) {
        for (const question of block.qs || []) {
          if (question.options.length !== 3) fail(`${label} listening/${block.topic}: expected 3 options, found ${question.options.length}`);
          if (question.answer < 0 || question.answer >= question.options.length) fail(`${label} listening/${block.topic}: invalid answer index`);
        }
      }
      for (const block of bank.reading) {
        const expected = block.task === "Read and Choose a Sentence" ? 3 : 4;
        for (const question of block.qs || []) {
          if (question.options.length !== expected) fail(`${label} reading/${block.topic}: expected ${expected} options, found ${question.options.length}`);
          if (question.answer < 0 || question.answer >= question.options.length) fail(`${label} reading/${block.topic}: invalid answer index`);
        }
      }
      if (span !== "g35") {
        const pair = bank.speaking.filter((item) => item.task === "Present and Discuss Information");
        if (pair.map((item) => item.presentRole).join(",") !== "summary,claim") {
          fail(`${label}: Present and Discuss must be an ordered summary/claim pair`);
        }
      }
    }

    const youngerText = ["g68", "g910"].flatMap((span) => {
      const bank = spans[span];
      return [...bank.listening.map((item) => item.transcript), ...bank.reading.map((item) => item.passage)].filter(Boolean);
    });
    const seniorText = [...spans.g1112.listening.map((item) => item.transcript), ...spans.g1112.reading.map((item) => item.passage)].filter(Boolean);
    const repeated = seniorText.filter((text) => youngerText.includes(text));
    if (repeated.length) fail(`Set ${setNum} g1112: ${repeated.length} stimulus/stimuli duplicate a younger-grade bank`);
  }
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`ELPAC validation failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log("ELPAC validation passed: all 12 grade/set banks match domain totals, task distributions, option formats, graph-task sequence, and cross-band uniqueness checks.");

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
  if (exposeBanks) source += "\nexport { BANKS, SCENE_PHOTOS, SCENE_ALTS, SCENE_PROMPTS, PENDING_SCENE_KEYS, AUDIO };\n";
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
const productionPromptOwners = new Map();
const sceneOwners = new Map();
const normalizedPrompt = (text) => String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
const wordCount = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;
const STIMULUS_MINIMUMS = {
  g35: {
    reading: {
      "Read a Short Informational Passage": 60,
      "Read a Student Essay": 80,
      "Read a Literary Passage": 80,
      "Read an Informational Passage": 80,
    },
  },
  g68: {
    listening: { "Listen to a Speaker Support an Opinion": 60 },
    reading: {
      "Read a Short Informational Passage": 75,
      "Read a Student Essay": 95,
      "Read a Literary Passage": 95,
      "Read an Informational Passage": 95,
    },
  },
  g910: {
    listening: {
      "Listen to an Oral Presentation": 70,
      "Listen to a Speaker Support an Opinion": 70,
    },
    reading: {
      "Read a Short Informational Passage": 70,
      "Read a Student Essay": 90,
      "Read a Literary Passage": 90,
      "Read an Informational Passage": 90,
    },
  },
  g1112: {
    listening: { "Listen to an Oral Presentation": 80 },
    reading: {
      "Read a Short Informational Passage": 75,
      "Read a Student Essay": 110,
      "Read a Literary Passage": 115,
      "Read an Informational Passage": 95,
    },
  },
};
const stimulusMinimum = (span, domain, task) => STIMULUS_MINIMUMS[span]?.[domain]?.[task];
const rememberPrompt = (span, domain, setNum, index, text) => {
  const key = `${span}:${domain}:${normalizedPrompt(text)}`;
  const owners = productionPromptOwners.get(key) || [];
  owners.push({ setNum, index, text });
  productionPromptOwners.set(key, owners);
};
const rememberScene = (scene, owner) => {
  if (!scene) return;
  const owners = sceneOwners.get(scene) || [];
  owners.push(owner);
  sceneOwners.set(scene, owners);
};
const publicAssetPath = (asset) =>
  path.join(root, "public", String(asset || "").replace(/^\/+/, "").split("/").join(path.sep));

const expectCounts = (actual, expected, label) => {
  for (const [task, count] of Object.entries(expected)) {
    if (actual[task] !== count) fail(`${label}: expected ${count} ${task}, found ${actual[task] || 0}`);
  }
};

const expectBalancedAnswers = (blocks, label) => {
  const groups = new Map();
  for (const block of blocks) {
    for (const question of block.qs || []) {
      const optionCount = question.options.length;
      const counts = groups.get(optionCount) || Array(optionCount).fill(0);
      counts[question.answer] += 1;
      groups.set(optionCount, counts);
    }
  }
  for (const [optionCount, counts] of groups) {
    const spread = Math.max(...counts) - Math.min(...counts);
    if (spread > 1) {
      fail(`${label}: ${optionCount}-choice correct-answer positions are unbalanced (${counts.join("/")})`);
    }
  }
};

try {
  compile("g1112AdditionalBanks.js");
  compile("g1112Banks.js");
  compile("sets45Banks.js");
  compile("ElpacPracticeV17.jsx", true);
  const { BANKS, SCENE_PHOTOS, SCENE_ALTS, SCENE_PROMPTS, PENDING_SCENE_KEYS, AUDIO } =
    require(path.join(tempDir, "ElpacPracticeV17.jsx"));
  let validatedBankCount = 0;
  let pendingImageCount = 0;

  for (const [scene, asset] of Object.entries(SCENE_PHOTOS)) {
    if (!fs.existsSync(publicAssetPath(asset))) fail("Scene " + scene + ": missing media file " + asset);
    if (!String(SCENE_ALTS[scene] || "").trim()) fail("Scene " + scene + ": missing meaningful alt text");
  }
  for (const [audioId, asset] of Object.entries(AUDIO)) {
    if (!fs.existsSync(publicAssetPath(asset))) fail("Listening audio " + audioId + ": missing media file " + asset);
  }

  for (const [setNum, spans] of Object.entries(BANKS)) {
    for (const [span, bank] of Object.entries(spans).filter(([key, value]) => ["g35", "g68", "g910", "g1112"].includes(key) && value)) {
      const label = `Set ${setNum} ${span}`;
      validatedBankCount += 1;
      const totals = {
        listening: countQuestions(bank.listening),
        speaking: bank.speaking.length,
        reading: countQuestions(bank.reading),
        writing: bank.writing.length,
      };
      for (const [domain, expected] of Object.entries({ listening: 22, speaking: 12, reading: 26, writing: 6 })) {
        if (totals[domain] !== expected) fail(`${label}: ${domain} expected ${expected}, found ${totals[domain]}`);
      }
      for (const [domain, field] of [["listening", "transcript"], ["reading", "passage"]]) {
        for (const item of bank[domain]) {
          const minimum = stimulusMinimum(span, domain, item.task);
          const words = wordCount(item[field]);
          if (minimum && words < minimum) {
            fail(label + " " + domain + "/" + item.topic + ": " + words + " stimulus words, minimum " + minimum + " for " + item.task);
          }
        }
      }
      if (process.env.ELPAC_REPORT) {
        for (const item of bank.listening) {
          console.log(["STIMULUS", setNum, span, "listening", item.task, item.topic,
            String(item.transcript || "").trim().split(/\s+/).filter(Boolean).length].join("\t"));
        }
        for (const item of bank.reading) {
          console.log(["STIMULUS", setNum, span, "reading", item.task, item.topic,
            String(item.passage || "").trim().split(/\s+/).filter(Boolean).length].join("\t"));
        }
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

      for (const domain of ["speaking", "reading", "writing"]) {
        bank[domain].forEach((item, index) =>
          rememberScene(item.scene, label + " " + domain + " item " + (index + 1))
        );
      }
      bank.speaking.forEach((item, index) =>
        rememberPrompt(span, "speaking", Number(setNum), index, item.prompt)
      );
      bank.writing.forEach((item, index) =>
        rememberPrompt(span, "writing", Number(setNum), index, item.stem)
      );

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
      expectBalancedAnswers(bank.listening, `${label} listening`);
      expectBalancedAnswers(bank.reading, `${label} reading`);
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
    if (repeated.length) fail(`Set ${setNum} g1112: ${repeated.length} stimulus/stimuli duplicate a younger-grade bank: ${repeated.map((text) => JSON.stringify(text.slice(0, 120))).join(" | ")}`);
  }

  for (const [key, owners] of productionPromptOwners) {
    const distinctSets = new Set(owners.map((owner) => owner.setNum));
    if (distinctSets.size > 1) {
      fail(`Repeated production prompt ${key.split(":").slice(0, 2).join("/")} in ${owners.map((owner) => `Set ${owner.setNum} item ${owner.index + 1}`).join(", ")}: "${owners[0].text}"`);
    }
  }
  for (const [scene, owners] of sceneOwners) {
    if (SCENE_PROMPTS[scene] && !SCENE_PHOTOS[scene]) {
      if (PENDING_SCENE_KEYS?.has(scene)) pendingImageCount += 1;
      else fail("Scene " + scene + " still uses a picture-needed placeholder in " + owners.join(", "));
    }
  }
  for (const scene of PENDING_SCENE_KEYS || []) {
    if (!sceneOwners.has(scene)) fail("Pending scene " + scene + " is not used by any practice item");
  }

  if (!failures.length) {
    console.log(`ELPAC validation passed: all ${validatedBankCount} grade/set banks match domain totals, task distributions, option formats, balanced answer positions, stimulus-depth floors, media files, alt text, graph-task sequence, cross-band uniqueness, and production-prompt uniqueness checks; ${pendingImageCount} new image scenes are explicitly pending.`);
  }
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`ELPAC validation failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

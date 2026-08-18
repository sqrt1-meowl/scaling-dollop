import { writeFile } from "node:fs/promises";
import { masterySchema } from "../db/schema.ts";
import { masteryLevels, masterySkills, masteryStrands, worksheetIdFor, worksheetTypeFor } from "../lib/masterySpine.ts";

const sql = (value) => value === null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const rows = (values) => values.map((value) => `(${value.map(sql).join(",")})`).join(",\n");

const statements = [
  "PRAGMA foreign_keys = ON",
  ...masterySchema,
  `INSERT OR IGNORE INTO mastery_strands (code,name,sort_order) VALUES\n${rows(masteryStrands.map((strand) => [strand.code, strand.name, strand.sortOrder]))}`,
  `INSERT OR IGNORE INTO mastery_skills (code,name,strand_code,sort_order) VALUES\n${rows(masterySkills.map((skill) => [skill.code, skill.name, skill.strandCode, skill.sortOrder]))}`,
  ...Array.from({ length: Math.ceil(masteryLevels.length / 25) }, (_, index) => {
    const page = masteryLevels.slice(index * 25, (index + 1) * 25);
    return `INSERT OR IGNORE INTO mastery_levels
      (id,code,name,strand_code,skill_code,sequence_index,tier,time_standard_seconds,accuracy_threshold,video_url) VALUES\n${rows(page.map((level) => [
      level.id, level.code, level.name, level.strandCode, level.skillCode, level.sequenceIndex,
      level.tier, level.timeStandardSeconds, level.accuracyThreshold, level.videoUrl,
    ]))}`;
  }),
  ...Array.from({ length: Math.ceil(masteryLevels.length / 25) }, (_, index) => {
    const page = masteryLevels.slice(index * 25, (index + 1) * 25);
    const worksheets = page.flatMap((level) => Array.from({ length: 5 }, (_, worksheetIndex) => [
      worksheetIdFor(level.code, worksheetIndex + 1), level.id, worksheetIndex + 1, worksheetTypeFor(worksheetIndex + 1),
    ]));
    return `INSERT OR IGNORE INTO mastery_worksheets (id,level_id,worksheet_index,worksheet_type) VALUES\n${rows(worksheets)}`;
  }),
  `INSERT OR IGNORE INTO mastery_students
    (id,display_name,placement_level_index,current_level_id,daily_page_target)
    VALUES ('demo-student','Alex',1,'level-f1a',3)`,
  "PRAGMA optimize",
];

await writeFile(new URL("../drizzle/0008_kumon_mastery_spine.sql", import.meta.url), `${statements.join(";\n\n")};\n`, "utf8");
console.log(`Generated migration for ${masteryLevels.length} levels and ${masteryLevels.length * 5} worksheets.`);

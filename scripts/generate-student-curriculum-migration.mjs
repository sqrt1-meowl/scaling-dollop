import { writeFile } from "node:fs/promises";
import {
  studentSkills, studentStrands, studentSubskills, studentUnitHasWorksheets, studentWorksheetIdFor, studentWorksheetTypeFor,
} from "../lib/studentCurriculum.ts";

const sql = (value) => value === null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const rows = (values) => values.map((value) => `(${value.map(sql).join(",")})`).join(",\n");

const worksheetUnits = studentSubskills.filter(studentUnitHasWorksheets);
const worksheets = worksheetUnits.flatMap((level) => Array.from({ length: 5 }, (_, index) => [
  studentWorksheetIdFor(level.code, index + 1), level.id, index + 1, studentWorksheetTypeFor(index + 1),
]));
const startingUnit = studentSubskills.find((level) => level.code === "X1");
if (!startingUnit) throw new Error("X1 must exist as the default starting unit.");

const statements = [
  "DROP TABLE IF EXISTS mastery_students_backup_0011",
  `CREATE TABLE mastery_students_backup_0011 AS
    SELECT id,display_name,daily_page_target,created_at,updated_at FROM mastery_students`,
  "DELETE FROM mastery_attempts",
  "DELETE FROM mastery_records",
  "DELETE FROM mastery_problems",
  "DELETE FROM mastery_worksheets",
  "DELETE FROM mastery_students",
  "DELETE FROM mastery_levels",
  "DELETE FROM mastery_skills",
  "DELETE FROM mastery_strands",
  `INSERT INTO mastery_strands (code,name,sort_order) VALUES\n${rows(studentStrands.map((strand) => [strand.code, strand.name, strand.sortOrder]))}`,
  `INSERT INTO mastery_skills (code,name,strand_code,sort_order) VALUES\n${rows(studentSkills.map((skill) => [skill.code, skill.name, skill.strandCode, skill.sortOrder]))}`,
  `INSERT INTO mastery_levels (id,code,name,strand_code,skill_code,sequence_index,tier,time_standard_seconds,accuracy_threshold,video_url) VALUES\n${rows(studentSubskills.map((level) => [
    level.id, level.code, level.name, level.strandCode, level.skillCode, level.sequenceIndex,
    level.tier, level.timeStandardSeconds, level.accuracyThreshold, level.videoUrl,
  ]))}`,
  `INSERT INTO mastery_worksheets (id,level_id,worksheet_index,worksheet_type) VALUES\n${rows(worksheets)}`,
  `INSERT INTO mastery_students
    (id,display_name,placement_level_index,current_level_id,daily_page_target,created_at,updated_at)
    SELECT id,display_name,${startingUnit.sequenceIndex},${sql(startingUnit.id)},daily_page_target,created_at,CURRENT_TIMESTAMP
    FROM mastery_students_backup_0011`,
  "DROP TABLE mastery_students_backup_0011",
  `INSERT OR IGNORE INTO mastery_students (id,display_name,placement_level_index,current_level_id,daily_page_target) VALUES ('demo-student','Alex',${startingUnit.sequenceIndex},${sql(startingUnit.id)},3)`,
  "PRAGMA optimize",
];

await writeFile(new URL("../drizzle/0011_diagnostic_gated_62_unit_curriculum.sql", import.meta.url), `${statements.join(";\n\n")};\n`, "utf8");
console.log(`Generated migration for ${studentSubskills.length} units and ${worksheets.length} worksheets; Foundations remains diagnostic-only and student accounts are retained.`);

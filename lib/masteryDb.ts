import { masterySchema } from "@/db/schema";
import { masteryLevels, masterySkills, masteryStrands, worksheetIdFor } from "@/lib/masterySpine";

export interface SpineLevelRow {
  id: string;
  code: string;
  name: string;
  strandCode: string;
  skillCode: string;
  skillName: string;
  sequenceIndex: number;
  tier: "CORE" | "EXT";
  timeStandardSeconds: number | null;
  accuracyThreshold: number;
  videoUrl: string;
  state: "mastered" | "current" | "locked";
}

const DEMO_STUDENT_ID = "demo-student";
const initializationByDatabase = new WeakMap<D1Database, Promise<void>>();

function chunk<T>(values: readonly T[], size: number) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));
}

async function initializeMasteryDatabase(db: D1Database) {
  for (const statement of masterySchema) await db.prepare(statement).run();

  const strandStatements = masteryStrands.map((strand) => db.prepare(
    "INSERT OR IGNORE INTO mastery_strands (code,name,sort_order) VALUES (?,?,?)",
  ).bind(strand.code, strand.name, strand.sortOrder));
  await db.batch(strandStatements);

  const skillStatements = masterySkills.map((skill) => db.prepare(
    "INSERT OR IGNORE INTO mastery_skills (code,name,strand_code,sort_order) VALUES (?,?,?,?)",
  ).bind(skill.code, skill.name, skill.strandCode, skill.sortOrder));
  await db.batch(skillStatements);

  for (const levelChunk of chunk(masteryLevels, 10)) {
    const placeholders = levelChunk.map(() => "(?,?,?,?,?,?,?,?,?,?)").join(",");
    const values = levelChunk.flatMap((level) => [
      level.id, level.code, level.name, level.strandCode, level.skillCode, level.sequenceIndex,
      level.tier, level.timeStandardSeconds, level.accuracyThreshold, level.videoUrl,
    ]);
    await db.prepare(`INSERT OR IGNORE INTO mastery_levels
      (id,code,name,strand_code,skill_code,sequence_index,tier,time_standard_seconds,accuracy_threshold,video_url)
      VALUES ${placeholders}`).bind(...values).run();
  }

  await db.prepare(`INSERT OR IGNORE INTO mastery_worksheets (id,level_id,worksheet_index,worksheet_type)
    SELECT 'ws-' || lower(level.code) || '-' || printf('%02d', page.index_value), level.id, page.index_value,
      CASE WHEN page.index_value <= 3 THEN 'PRACTICE' WHEN page.index_value = 4 THEN 'MIXED' ELSE 'MASTERY_CHECK' END
    FROM mastery_levels level
    CROSS JOIN (SELECT 1 index_value UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) page`).run();

  await db.prepare(`INSERT OR IGNORE INTO mastery_students
    (id,display_name,placement_level_index,current_level_id,daily_page_target)
    VALUES (?,?,?,?,?)`).bind(DEMO_STUDENT_ID, "Alex", 1, masteryLevels[0].id, 3).run();

  const count = await db.prepare("SELECT COUNT(*) AS count FROM mastery_levels").first<{ count: number }>();
  if (Number(count?.count) !== 210) throw new Error(`Mastery spine seed is incomplete: expected 210 levels, found ${count?.count ?? 0}.`);
}

export async function ensureMasteryDatabase(db: D1Database) {
  let initialization = initializationByDatabase.get(db);
  initialization ??= initializeMasteryDatabase(db).catch((error) => {
    initializationByDatabase.delete(db);
    throw error;
  });
  initializationByDatabase.set(db, initialization);
  await initialization;
  return db;
}

export function studentIdFromHeaders(headers: Headers) {
  return headers.get("oai-authenticated-user-id") || DEMO_STUDENT_ID;
}

export async function ensureStudent(db: D1Database, studentId: string, displayName = "Student") {
  await ensureMasteryDatabase(db);
  await db.prepare(`INSERT OR IGNORE INTO mastery_students
    (id,display_name,placement_level_index,current_level_id,daily_page_target)
    VALUES (?,?,?,?,?)`).bind(studentId, displayName, 1, masteryLevels[0].id, 3).run();
}

export async function getSpineForStudent(db: D1Database, studentId = DEMO_STUDENT_ID): Promise<SpineLevelRow[]> {
  await ensureMasteryDatabase(db);
  await ensureStudent(db, studentId);
  const result = await db.prepare(`SELECT
      level.id, level.code, level.name, level.strand_code AS strandCode,
      level.skill_code AS skillCode, skill.name AS skillName,
      level.sequence_index AS sequenceIndex, level.tier,
      level.time_standard_seconds AS timeStandardSeconds,
      level.accuracy_threshold AS accuracyThreshold, level.video_url AS videoUrl,
      CASE
        WHEN record.mastered_at IS NOT NULL THEN 'mastered'
        WHEN student.current_level_id = level.id THEN 'current'
        ELSE 'locked'
      END AS state
    FROM mastery_levels level
    JOIN mastery_skills skill ON skill.code = level.skill_code
    JOIN mastery_students student ON student.id = ?
    LEFT JOIN mastery_records record ON record.student_id = student.id AND record.level_id = level.id
    ORDER BY level.sequence_index`).bind(studentId).all<SpineLevelRow>();
  return result.results;
}

export async function startOrResumeAttempt(db: D1Database, studentId: string, worksheetId: string) {
  await ensureMasteryDatabase(db);
  await ensureStudent(db, studentId);
  const worksheet = await db.prepare("SELECT id FROM mastery_worksheets WHERE id = ?").bind(worksheetId).first<{ id: string }>();
  if (!worksheet) return null;

  const active = await db.prepare(`SELECT id,started_at AS startedAt
    FROM mastery_attempts WHERE student_id=? AND worksheet_id=? AND submitted_at IS NULL
    ORDER BY started_at DESC LIMIT 1`).bind(studentId, worksheetId).first<{ id: string; startedAt: string }>();
  if (active) return active;

  const attemptId = `attempt-${crypto.randomUUID()}`;
  await db.prepare(`INSERT INTO mastery_attempts (id,student_id,worksheet_id,started_at)
    VALUES (?,?,?,CURRENT_TIMESTAMP)`).bind(attemptId, studentId, worksheetId).run();
  return db.prepare("SELECT id,started_at AS startedAt FROM mastery_attempts WHERE id=?")
    .bind(attemptId).first<{ id: string; startedAt: string }>();
}

export function isKnownWorksheetId(worksheetId: string) {
  return masteryLevels.some((level) => Array.from({ length: 5 }, (_, index) => worksheetIdFor(level.code, index + 1)).includes(worksheetId));
}

CREATE TABLE IF NOT EXISTS mastery_mistakes (
  student_id TEXT NOT NULL REFERENCES mastery_students(id) ON DELETE CASCADE,
  worksheet_id TEXT NOT NULL REFERENCES mastery_worksheets(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  given_answer TEXT NOT NULL,
  miss_count INTEGER NOT NULL DEFAULT 1 CHECK (miss_count > 0),
  first_missed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_missed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, worksheet_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_mastery_mistakes_student_worksheet
ON mastery_mistakes(student_id, worksheet_id, last_missed_at DESC);

PRAGMA optimize;

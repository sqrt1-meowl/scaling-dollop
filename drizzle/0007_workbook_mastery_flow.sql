PRAGMA foreign_keys = OFF;

CREATE TABLE questions_workbook_next (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL REFERENCES domains(id) ON DELETE RESTRICT,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  drill_unit_id TEXT REFERENCES drill_units(id) ON DELETE RESTRICT,
  framework_target_id TEXT REFERENCES framework_targets(id) ON DELETE RESTRICT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice','student_response')),
  prompt TEXT NOT NULL,
  choices TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  question_model_id TEXT REFERENCES question_models(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('college_board','original','legacy','placeholder')),
  source_question_id TEXT,
  learning_stage TEXT CHECK (learning_stage IN ('review','easy','medium','hard')),
  set_id TEXT CHECK (set_id IN ('A','B','C')),
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','review','archived')),
  requires_review INTEGER NOT NULL DEFAULT 0,
  is_gate INTEGER NOT NULL DEFAULT 0
);

INSERT INTO questions_workbook_next (
  id,domain_id,skill_id,drill_unit_id,framework_target_id,difficulty,question_type,prompt,choices,
  correct_answer,explanation,question_model_id,source_type,source_question_id,learning_stage,set_id,
  sort_order,status,requires_review,is_gate
)
SELECT
  id,domain_id,skill_id,drill_unit_id,framework_target_id,difficulty,question_type,prompt,choices,
  correct_answer,explanation,question_model_id,source_type,source_question_id,
  CASE WHEN is_gate=1 THEN 'review' ELSE difficulty END,
  CASE WHEN sort_order <= 5 THEN 'A' WHEN sort_order <= 10 THEN 'B' ELSE 'C' END,
  sort_order,status,requires_review,is_gate
FROM questions;

DROP TABLE questions;
ALTER TABLE questions_workbook_next RENAME TO questions;
CREATE INDEX IF NOT EXISTS questions_curriculum_idx ON questions(domain_id, skill_id, drill_unit_id, framework_target_id, difficulty, sort_order);
CREATE INDEX IF NOT EXISTS questions_review_idx ON questions(status, requires_review);
CREATE INDEX IF NOT EXISTS questions_workbook_set_idx ON questions(skill_id, learning_stage, set_id, sort_order);

CREATE TABLE IF NOT EXISTS topic_learning_progress (
  user_id TEXT NOT NULL,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'concept' CHECK (stage IN ('review','concept','example','easy','medium','hard','mastered')),
  current_set TEXT NOT NULL DEFAULT 'A' CHECK (current_set IN ('A','B','C')),
  current_question INTEGER NOT NULL DEFAULT 0,
  current_score INTEGER NOT NULL DEFAULT 0,
  completed_sets TEXT NOT NULL DEFAULT '[]',
  scores TEXT NOT NULL DEFAULT '{}',
  mastered INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS topic_learning_progress_user_idx ON topic_learning_progress(user_id, mastered, updated_at);

PRAGMA foreign_keys = ON;
PRAGMA optimize;

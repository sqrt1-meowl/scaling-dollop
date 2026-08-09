/** Canonical D1 schema for the curriculum hierarchy and student progress. */
export const curriculumSchema = [
  `CREATE TABLE IF NOT EXISTS domains (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, short_name TEXT NOT NULL,
    sat_weight INTEGER NOT NULL CHECK (sat_weight BETWEEN 0 AND 100),
    accent TEXT NOT NULL, sort_order INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','archived'))
  )`,
  `CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY, domain_id TEXT NOT NULL REFERENCES domains(id) ON DELETE RESTRICT,
    code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL, gate_question_count INTEGER NOT NULL DEFAULT 4,
    gate_threshold INTEGER NOT NULL DEFAULT 4, status TEXT NOT NULL DEFAULT 'active'
      CHECK (status IN ('draft','active','archived'))
  )`,
  `CREATE TABLE IF NOT EXISTS drill_units (
    id TEXT PRIMARY KEY, skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL, worked_example_count INTEGER NOT NULL DEFAULT 3,
    easy_question_count INTEGER NOT NULL DEFAULT 5, medium_question_count INTEGER NOT NULL DEFAULT 5,
    hard_question_count INTEGER NOT NULL DEFAULT 3, video_url TEXT NOT NULL DEFAULT '', concept_notes TEXT NOT NULL DEFAULT '[]',
    worked_example TEXT NOT NULL DEFAULT '{}', is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS framework_targets (
    id TEXT PRIMARY KEY, skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    drill_unit_id TEXT NOT NULL REFERENCES drill_units(id) ON DELETE CASCADE,
    description TEXT NOT NULL, sort_order INTEGER NOT NULL,
    UNIQUE (drill_unit_id, sort_order)
  )`,
  `CREATE TABLE IF NOT EXISTS question_models (
    id TEXT PRIMARY KEY, drill_unit_id TEXT NOT NULL REFERENCES drill_units(id) ON DELETE CASCADE,
    framework_target_id TEXT NOT NULL REFERENCES framework_targets(id) ON DELETE RESTRICT,
    name TEXT NOT NULL, difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
    description TEXT NOT NULL, template TEXT NOT NULL, parameter_rules TEXT NOT NULL,
    answer_rules TEXT NOT NULL, solution_method TEXT NOT NULL, forbidden_features TEXT NOT NULL DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY, domain_id TEXT NOT NULL REFERENCES domains(id) ON DELETE RESTRICT,
    skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    drill_unit_id TEXT REFERENCES drill_units(id) ON DELETE RESTRICT,
    framework_target_id TEXT REFERENCES framework_targets(id) ON DELETE RESTRICT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice','student_response')),
    prompt TEXT NOT NULL, choices TEXT, correct_answer TEXT NOT NULL, explanation TEXT NOT NULL,
    question_model_id TEXT REFERENCES question_models(id) ON DELETE SET NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('original','legacy','placeholder')),
    source_question_id TEXT, sort_order INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','review','archived')),
    requires_review INTEGER NOT NULL DEFAULT 0, is_gate INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS skill_progress (
    user_id TEXT NOT NULL, skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    easy_completed INTEGER NOT NULL DEFAULT 0, medium_completed INTEGER NOT NULL DEFAULT 0,
    gate_score INTEGER, challenge_completed INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','available','in_progress','complete','review')),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, skill_id)
  )`,
  `CREATE TABLE IF NOT EXISTS drill_unit_progress (
    user_id TEXT NOT NULL, drill_unit_id TEXT NOT NULL REFERENCES drill_units(id) ON DELETE CASCADE,
    easy_completed INTEGER NOT NULL DEFAULT 0, easy_total INTEGER NOT NULL DEFAULT 5,
    medium_completed INTEGER NOT NULL DEFAULT 0, medium_total INTEGER NOT NULL DEFAULT 5,
    hard_completed INTEGER NOT NULL DEFAULT 0, hard_total INTEGER NOT NULL DEFAULT 3,
    stage TEXT NOT NULL DEFAULT 'examples' CHECK (stage IN ('examples','easy','medium','hard','video','complete')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('locked','available','in_progress','complete','review')),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, drill_unit_id)
  )`,
  `CREATE INDEX IF NOT EXISTS skills_domain_order_idx ON skills(domain_id, sort_order)`,
  `CREATE INDEX IF NOT EXISTS drill_units_skill_order_idx ON drill_units(skill_id, sort_order)`,
  `CREATE INDEX IF NOT EXISTS targets_unit_order_idx ON framework_targets(drill_unit_id, sort_order)`,
  `CREATE INDEX IF NOT EXISTS questions_curriculum_idx ON questions(domain_id, skill_id, drill_unit_id, framework_target_id, difficulty, sort_order)`,
  `CREATE INDEX IF NOT EXISTS questions_review_idx ON questions(status, requires_review)`,
  `CREATE INDEX IF NOT EXISTS skill_progress_user_idx ON skill_progress(user_id, status)`,
  `CREATE INDEX IF NOT EXISTS unit_progress_user_idx ON drill_unit_progress(user_id, status)`,
] as const;

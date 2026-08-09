PRAGMA foreign_keys = OFF;
ALTER TABLE drill_units ADD COLUMN worked_example_count INTEGER NOT NULL DEFAULT 3;
ALTER TABLE drill_units ADD COLUMN hard_question_count INTEGER NOT NULL DEFAULT 3;
ALTER TABLE drill_units ADD COLUMN video_url TEXT NOT NULL DEFAULT '';
UPDATE drill_units SET worked_example_count=3,easy_question_count=5,medium_question_count=5,hard_question_count=3;
CREATE TABLE drill_unit_progress_next (
    user_id TEXT NOT NULL, drill_unit_id TEXT NOT NULL REFERENCES drill_units(id) ON DELETE CASCADE,
    easy_completed INTEGER NOT NULL DEFAULT 0, easy_total INTEGER NOT NULL DEFAULT 5,
    medium_completed INTEGER NOT NULL DEFAULT 0, medium_total INTEGER NOT NULL DEFAULT 5,
    hard_completed INTEGER NOT NULL DEFAULT 0, hard_total INTEGER NOT NULL DEFAULT 3,
    stage TEXT NOT NULL DEFAULT 'examples' CHECK (stage IN ('examples','easy','medium','hard','video','complete')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('locked','available','in_progress','complete','review')),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, drill_unit_id)
  );
INSERT INTO drill_unit_progress_next (user_id,drill_unit_id,easy_completed,easy_total,medium_completed,medium_total,hard_completed,hard_total,stage,status,updated_at)
   SELECT user_id,drill_unit_id,easy_completed,5,medium_completed,5,CASE WHEN status='complete' THEN 3 ELSE 0 END,3,
     CASE WHEN status='complete' THEN 'complete' WHEN stage='medium' THEN 'medium' WHEN stage='easy' THEN 'easy' ELSE 'examples' END,
     CASE WHEN status='locked' THEN 'available' ELSE status END,updated_at FROM drill_unit_progress;
DROP TABLE drill_unit_progress;
ALTER TABLE drill_unit_progress_next RENAME TO drill_unit_progress;
CREATE INDEX IF NOT EXISTS unit_progress_user_idx ON drill_unit_progress(user_id, status);
PRAGMA foreign_keys = ON;
PRAGMA optimize;

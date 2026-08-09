import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const configHome = resolve(root, ".wrangler", "config");
const logPath = resolve(root, ".wrangler", "logs");
await mkdir(configHome, { recursive: true }); await mkdir(logPath, { recursive: true });
const wrangler = resolve(root, "node_modules", "wrangler", "bin", "wrangler.js");
const query = `SELECT
  (SELECT COUNT(*) FROM domains) AS domains,
  (SELECT COUNT(*) FROM skills) AS skills,
  (SELECT COUNT(*) FROM drill_units) AS drill_units,
  (SELECT COUNT(*) FROM framework_targets) AS framework_targets,
  (SELECT COUNT(*) FROM questions) AS questions,
  (SELECT COUNT(*) FROM question_models) AS question_models,
  (SELECT COUNT(*) FROM (SELECT code FROM drill_units GROUP BY code HAVING COUNT(*) > 1)) AS duplicate_unit_codes,
  (SELECT COUNT(*) FROM (SELECT sort_order, ROW_NUMBER() OVER (PARTITION BY skill_id ORDER BY sort_order) expected_order FROM drill_units) WHERE sort_order != expected_order) AS unit_order_errors,
  (SELECT COUNT(*) FROM drill_units WHERE is_active != 1) AS inactive_units,
  (SELECT COUNT(*) FROM questions WHERE drill_unit_id IS NULL OR framework_target_id IS NULL) AS questions_requiring_mapping,
  (SELECT COUNT(*) FROM questions WHERE id LIKE 'p2f-%' AND drill_unit_id = 'p2e') +
  (SELECT COUNT(*) FROM questions WHERE id LIKE 'p3g-%' AND drill_unit_id = 'p3f') +
  (SELECT COUNT(*) FROM questions WHERE id LIKE 'p6e-%' AND drill_unit_id = 'p6d') +
  (SELECT COUNT(*) FROM questions WHERE id LIKE 'p7e-%' AND drill_unit_id = 'p7d') AS preserved_retired_unit_questions`;
const child = spawn(process.execPath, [wrangler, "d1", "execute", "DB", "--local", "--config", "wrangler.jsonc", "--command", query], {
  cwd: root, stdio: "inherit", env: { ...process.env, XDG_CONFIG_HOME: configHome, WRANGLER_LOG_PATH: logPath, WRANGLER_WRITE_LOGS: "false" },
});
child.on("exit", (code) => process.exit(code ?? 1));

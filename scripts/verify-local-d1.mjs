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
  (SELECT COUNT(*) FROM question_models) AS question_models`;
const child = spawn(process.execPath, [wrangler, "d1", "execute", "DB", "--local", "--config", "wrangler.jsonc", "--command", query], {
  cwd: root, stdio: "inherit", env: { ...process.env, XDG_CONFIG_HOME: configHome, WRANGLER_LOG_PATH: logPath, WRANGLER_WRITE_LOGS: "false" },
});
child.on("exit", (code) => process.exit(code ?? 1));

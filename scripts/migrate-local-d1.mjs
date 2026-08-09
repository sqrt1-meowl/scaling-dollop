import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const configHome = resolve(root, ".wrangler", "config");
const logPath = resolve(root, ".wrangler", "logs");
await mkdir(configHome, { recursive: true });
await mkdir(logPath, { recursive: true });
const command = resolve(root, "node_modules", "wrangler", "bin", "wrangler.js");
const child = spawn(process.execPath, [command, "d1", "migrations", "apply", "DB", "--local", "--config", "wrangler.jsonc"], {
  cwd: root, stdio: "inherit",
  env: { ...process.env, XDG_CONFIG_HOME: configHome, WRANGLER_LOG_PATH: logPath, WRANGLER_WRITE_LOGS: "false" },
});
child.on("exit", (code) => process.exit(code ?? 1));

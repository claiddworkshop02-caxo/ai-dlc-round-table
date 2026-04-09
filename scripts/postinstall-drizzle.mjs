import { config } from "dotenv";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

config({ path: join(root, ".env") });
config({ path: join(root, ".env.local"), override: true });

if (!process.env.DATABASE_URL) {
  console.log(
    "postinstall-drizzle: DATABASE_URL is not set; skipping generate and migrate.",
  );
  process.exit(0);
}

function runDrizzleKit(subcommand, extraArgs = []) {
  const result = spawnSync(
    "npx",
    ["drizzle-kit", subcommand, ...extraArgs],
    {
      cwd: root,
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    },
  );
  if (result.status === null || result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

console.log("postinstall-drizzle: drizzle-kit generate");
runDrizzleKit("generate");
console.log("postinstall-drizzle: drizzle-kit migrate");
runDrizzleKit("migrate");
console.log("postinstall-drizzle: done.");

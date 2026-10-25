import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

process.env.PAYLOAD_SECRET ||= "knip-static-analysis";

const knipCli = fileURLToPath(
  new URL("../node_modules/knip/bin/knip.js", import.meta.url)
);
const result = spawnSync(process.execPath, [knipCli, ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;

#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const dash = process.argv.indexOf("--");
if (dash < 0 || process.argv[2] === undefined) {
  fail("usage: observe.mjs <out-dir> -- <hello-greet args...>");
}

const outDir = process.argv[2];
const cliArgs = process.argv.slice(dash + 1);

if (!outDir || outDir.startsWith("-")) {
  fail("usage: observe.mjs <out-dir> -- <hello-greet args...>");
}

mkdirSync(outDir, { recursive: true });

const result = spawnSync("npx", ["tsx", "src/cli.ts", ...cliArgs], {
  cwd: process.cwd(),
  encoding: "buffer",
});

if (result.error) {
  fail(`observe: failed to spawn npx tsx src/cli.ts: ${result.error.message}`);
}

const stdout = result.stdout ?? Buffer.alloc(0);
const stderr = result.stderr ?? Buffer.alloc(0);
const exitCode = result.status === null ? 1 : result.status;
const argvLine = ["npx", "tsx", "src/cli.ts", ...cliArgs]
  .map((token) => JSON.stringify(token))
  .join(" ");

writeFileSync(join(outDir, "command.txt"), `${argvLine}\n`);
writeFileSync(join(outDir, "stdout.bin"), stdout);
writeFileSync(join(outDir, "stderr.bin"), stderr);
writeFileSync(join(outDir, "exit.txt"), `${exitCode}\n`);
writeFileSync(join(outDir, "stdout.hex"), stdout.toString("hex") + (stdout.length ? "\n" : ""));
writeFileSync(join(outDir, "stderr.hex"), stderr.toString("hex") + (stderr.length ? "\n" : ""));

process.stdout.write(
  `exit=${exitCode} stdout=${stdout.length}B stderr=${stderr.length}B out=${outDir}\n`,
);

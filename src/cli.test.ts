import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function spawnCli(args: readonly string[]) {
  return spawnSync("npx", ["tsx", "src/cli.ts", ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 30_000,
  });
}

describe("cli", () => {
  test("Ada", () => {
    const result = spawnCli(["Ada"]);
    expect(result.stdout).toBe("hello, Ada\n");
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  }, 30_000);

  test("missing name", () => {
    const result = spawnCli([]);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe("usage: hello-greet <name>\n");
    expect(result.status).toBe(1);
  }, 30_000);
});

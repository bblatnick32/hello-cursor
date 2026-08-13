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

  test("--json Ada", () => {
    const result = spawnCli(["--json", "Ada"]);
    expect(JSON.parse(result.stdout)).toEqual({
      message: "hello, Ada",
      name: "Ada",
    });
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  }, 30_000);

  test("--json", () => {
    const result = spawnCli(["--json"]);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe("usage: hello-greet <name>\n");
    expect(result.status).toBe(1);
  }, 30_000);

  test("--repeat 3 Ada", () => {
    const result = spawnCli(["--repeat", "3", "Ada"]);
    expect(result.stdout).toBe("hello, Ada\nhello, Ada\nhello, Ada\n");
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  }, 30_000);
});

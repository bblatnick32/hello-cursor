import { describe, expect, test } from "vitest";
import { run } from "./run.ts";

const cases = [
  {
    label: "Ada",
    args: ["Ada"],
    result: {
      exitCode: 0 as const,
      stdout: "hello, Ada\n",
      stderr: "" as const,
    },
  },
  {
    label: '"  Ada  "',
    args: ["  Ada  "],
    result: {
      exitCode: 0 as const,
      stdout: "hello, Ada\n",
      stderr: "" as const,
    },
  },
  {
    label: '["Ada", "Lovelace"]',
    args: ["Ada", "Lovelace"],
    result: {
      exitCode: 0 as const,
      stdout: "hello, Ada\n",
      stderr: "" as const,
    },
  },
  {
    label: "[]",
    args: [],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '[""]',
    args: [""],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["   "]',
    args: ["   "],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["\\t\\n"]',
    args: ["\t\n"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
] as const;

describe("run", () => {
  test.each(cases)("$label", ({ args, result }) => {
    expect(run(args)).toEqual(result);
  });
});

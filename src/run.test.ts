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
  {
    label: '["--json", "Ada"]',
    args: ["--json", "Ada"],
    result: {
      exitCode: 0 as const,
      stdout: '{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
  {
    label: '["Ada", "--json"]',
    args: ["Ada", "--json"],
    result: {
      exitCode: 0 as const,
      stdout: '{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
  {
    label: '["--json", "  Ada  "]',
    args: ["--json", "  Ada  "],
    result: {
      exitCode: 0 as const,
      stdout: '{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
  {
    label: '["--json"]',
    args: ["--json"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["--json", "   "]',
    args: ["--json", "   "],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["", "Ada"]',
    args: ["", "Ada"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["--json", "--json", "Ada"]',
    args: ["--json", "--json", "Ada"],
    result: {
      exitCode: 0 as const,
      stdout: '{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
  {
    label: '["Ada", "Lovelace", "--json"]',
    args: ["Ada", "Lovelace", "--json"],
    result: {
      exitCode: 0 as const,
      stdout: '{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
] as const;

describe("run", () => {
  test.each(cases)("$label", ({ args, result }) => {
    expect(run(args)).toEqual(result);
  });

  test("json Ada parses", () => {
    expect(JSON.parse(run(["--json", "Ada"]).stdout)).toEqual({
      message: "hello, Ada",
      name: "Ada",
    });
  });

  test("json name with quote round-trips", () => {
    const name = 'Ada "Lovelace"';
    expect(JSON.parse(run(["--json", name]).stdout)).toEqual({
      message: `hello, ${name}`,
      name,
    });
  });
});

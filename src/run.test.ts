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
  {
    label: '["--repeat", "3", "Ada"]',
    args: ["--repeat", "3", "Ada"],
    result: {
      exitCode: 0 as const,
      stdout: "hello, Ada\nhello, Ada\nhello, Ada\n",
      stderr: "" as const,
    },
  },
  {
    label: '["Ada", "--repeat", "3"]',
    args: ["Ada", "--repeat", "3"],
    result: {
      exitCode: 0 as const,
      stdout: "hello, Ada\nhello, Ada\nhello, Ada\n",
      stderr: "" as const,
    },
  },
  {
    label: '["--repeat", "3", "--json", "Ada"]',
    args: ["--repeat", "3", "--json", "Ada"],
    result: {
      exitCode: 0 as const,
      stdout:
        '{"message":"hello, Ada","name":"Ada"}\n{"message":"hello, Ada","name":"Ada"}\n{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
  {
    label: '["--json", "Ada", "--repeat", "3"]',
    args: ["--json", "Ada", "--repeat", "3"],
    result: {
      exitCode: 0 as const,
      stdout:
        '{"message":"hello, Ada","name":"Ada"}\n{"message":"hello, Ada","name":"Ada"}\n{"message":"hello, Ada","name":"Ada"}\n',
      stderr: "" as const,
    },
  },
  {
    label: '["--repeat", "2", "--repeat", "3", "Ada"]',
    args: ["--repeat", "2", "--repeat", "3", "Ada"],
    result: {
      exitCode: 0 as const,
      stdout: "hello, Ada\nhello, Ada\nhello, Ada\n",
      stderr: "" as const,
    },
  },
  {
    label: '["--repeat"]',
    args: ["--repeat"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["--repeat", "0", "Ada"]',
    args: ["--repeat", "0", "Ada"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["--repeat", "Ada"]',
    args: ["--repeat", "Ada"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["Ada", "--repeat"]',
    args: ["Ada", "--repeat"],
    result: {
      exitCode: 1 as const,
      stdout: "" as const,
      stderr: "usage: hello-greet <name>\n",
    },
  },
  {
    label: '["--repeat", "3"]',
    args: ["--repeat", "3"],
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

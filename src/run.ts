export type ProcessResult =
  | { readonly exitCode: 0; readonly stdout: string; readonly stderr: "" }
  | { readonly exitCode: 1; readonly stdout: ""; readonly stderr: string };

type ParseResult =
  { readonly kind: "ok"; readonly name: string } | { readonly kind: "usage" };

const USAGE = "usage: hello-greet <name>\n";

function parse(userArgs: readonly string[]): ParseResult {
  const name = userArgs[0]?.trim() ?? "";
  if (name === "") {
    return { kind: "usage" };
  }
  return { kind: "ok", name };
}

function formatGreeting(name: string): string {
  return `hello, ${name}\n`;
}

export function run(userArgs: readonly string[]): ProcessResult {
  const parsed = parse(userArgs);
  switch (parsed.kind) {
    case "ok":
      return { exitCode: 0, stdout: formatGreeting(parsed.name), stderr: "" };
    case "usage":
      return { exitCode: 1, stdout: "", stderr: USAGE };
    default: {
      const _exhaustive: never = parsed;
      throw new Error(`unhandled parse result: ${_exhaustive}`);
    }
  }
}

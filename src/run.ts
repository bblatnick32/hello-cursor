export type ProcessResult =
  | { readonly exitCode: 0; readonly stdout: string; readonly stderr: "" }
  | { readonly exitCode: 1; readonly stdout: ""; readonly stderr: string };

type Format = "text" | "json";

type Command =
  | { readonly kind: "greet"; readonly format: Format; readonly name: string }
  | { readonly kind: "usage" };

const USAGE = "usage: hello-greet <name>\n";

function parse(userArgs: readonly string[]): Command {
  let format: Format = "text";
  let rawName: string | undefined;
  for (const token of userArgs) {
    if (token === "--json") {
      format = "json";
      continue;
    }
    if (rawName === undefined) {
      rawName = token;
    }
  }
  const name = rawName?.trim() ?? "";
  if (name === "") {
    return { kind: "usage" };
  }
  return { kind: "greet", format, name };
}

function greetingMessage(name: string): string {
  return `hello, ${name}`;
}

export function run(userArgs: readonly string[]): ProcessResult {
  const command = parse(userArgs);
  switch (command.kind) {
    case "greet": {
      const message = greetingMessage(command.name);
      switch (command.format) {
        case "text":
          return { exitCode: 0, stdout: message + "\n", stderr: "" };
        case "json":
          return {
            exitCode: 0,
            stdout: JSON.stringify({ message, name: command.name }) + "\n",
            stderr: "",
          };
        default: {
          const _exhaustive: never = command.format;
          throw new Error(`unhandled format: ${_exhaustive}`);
        }
      }
    }
    case "usage":
      return { exitCode: 1, stdout: "", stderr: USAGE };
    default: {
      const _exhaustive: never = command;
      throw new Error(`unhandled command: ${_exhaustive}`);
    }
  }
}

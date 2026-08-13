export type ProcessResult =
  | { readonly exitCode: 0; readonly stdout: string; readonly stderr: "" }
  | { readonly exitCode: 1; readonly stdout: ""; readonly stderr: string };

type Format = "text" | "json";

type Command =
  | {
      readonly kind: "greet";
      readonly format: Format;
      readonly name: string;
      readonly repeat: number;
    }
  | { readonly kind: "usage" };

const USAGE = "usage: hello-greet <name>\n";
const REPEAT_COUNT = /^[1-9]\d*$/;
const MAX_REPEAT = 1_000_000;

function parseRepeatCount(token: string): number | undefined {
  if (!REPEAT_COUNT.test(token)) {
    return undefined;
  }
  const count = Number(token);
  if (!Number.isSafeInteger(count) || count > MAX_REPEAT) {
    return undefined;
  }
  return count;
}

function parse(userArgs: readonly string[]): Command {
  let format: Format = "text";
  let rawName: string | undefined;
  let repeat = 1;
  for (let i = 0; i < userArgs.length; i += 1) {
    const token = userArgs[i];
    if (token === undefined) {
      continue;
    }
    if (token === "--json") {
      format = "json";
      continue;
    }
    if (token === "--repeat") {
      const rawCount = userArgs[i + 1];
      if (rawCount === undefined) {
        return { kind: "usage" };
      }
      const count = parseRepeatCount(rawCount);
      if (count === undefined) {
        return { kind: "usage" };
      }
      repeat = count;
      i += 1;
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
  return { kind: "greet", format, name, repeat };
}

function greetingMessage(name: string): string {
  return `hello, ${name}`;
}

function greetLine(format: Format, name: string): string {
  const message = greetingMessage(name);
  switch (format) {
    case "text":
      return message + "\n";
    case "json":
      return JSON.stringify({ message, name }) + "\n";
    default: {
      const _exhaustive: never = format;
      throw new Error(`unhandled format: ${_exhaustive}`);
    }
  }
}

export function run(userArgs: readonly string[]): ProcessResult {
  const command = parse(userArgs);
  switch (command.kind) {
    case "greet":
      return {
        exitCode: 0,
        stdout: greetLine(command.format, command.name).repeat(command.repeat),
        stderr: "",
      };
    case "usage":
      return { exitCode: 1, stdout: "", stderr: USAGE };
    default: {
      const _exhaustive: never = command;
      throw new Error(`unhandled command: ${_exhaustive}`);
    }
  }
}

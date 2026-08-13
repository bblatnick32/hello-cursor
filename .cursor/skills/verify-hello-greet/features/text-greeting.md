# Text greeting

Text greeting prints `hello, <name>` on stdout and exits 0 when the user supplies a usable name and does not pass `--json`.

## Sub-features

- `greet-basic` prints `hello, Ada\n` for a single positional name.
- `greet-trim` trims leading and trailing whitespace on the name before greeting.
- `greet-extra` greets using the first positional and ignores later positionals.

## How to get to it (user POV)

- Run `npx tsx src/cli.ts Ada` in a terminal at the repo root.
- Run `npx tsx src/cli.ts "  Ada  "` to greet with surrounding spaces in the argument.
- Run `npx tsx src/cli.ts Ada extra` to pass a second unused word.

## Driving it with observe.mjs

Preconditions:

- Doctor printed `doctor: ok` from the repo root.
- The out-dirs below are under `.cursor/skills/verify-hello-greet/artifacts/`.

- **Basic greet.** Pass one name. Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/text-greeting/ada -- Ada`. `exit.txt` is `0`. `stdout.hex` is `68656c6c6f2c204164610a`. `stderr.bin` is 0 bytes.
- **Trimmed name.** Pass padded whitespace. Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/text-greeting/trim -- "  Ada  "`. Same stdout hex and exit as basic greet. `stderr.bin` is 0 bytes.
- **Extra positionals.** Pass a second word. Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/text-greeting/extra -- Ada extra`. Same stdout hex and exit as basic greet. `stderr.bin` is 0 bytes.
- **Proof.** Keep the three case directories. Each `command.txt` must list `npx`, `tsx`, `src/cli.ts` and the argv used. Do not accept a passing vitest run in place of these files.

## Gotchas

- The comma is followed by exactly one space. `hello,  Ada` (two spaces) is a failure.
- The first positional owns the name even if it is blank. `"" Ada` is usage, not a greet of Ada. Prove that under Usage, not here.
- A UTF-8 print of stdout can hide a missing trailing newline. Assert `stdout.hex` or the exact byte length `11` for `hello, Ada\n`.

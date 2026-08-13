# Usage

Usage writes `usage: hello-greet <name>\n` to stderr, writes nothing to stdout, and exits 1 when the user does not supply a usable name.

## Sub-features

- `usage-missing` runs with no user arguments.
- `usage-blank` runs with an empty string as the first positional.
- `usage-whitespace` runs with a whitespace-only first positional.
- `usage-json-only` runs with `--json` and no usable name.

## How to get to it (user POV)

- Run `npx tsx src/cli.ts` with no arguments.
- Run `npx tsx src/cli.ts ""`.
- Run `npx tsx src/cli.ts "   "`.
- Run `npx tsx src/cli.ts --json`.
- Run `npx tsx src/cli.ts "" Ada` so a later word cannot fill a blank first name.

## Driving it with observe.mjs

Preconditions:

- Doctor printed `doctor: ok` from the repo root.
- The out-dirs below are under `.cursor/skills/verify-hello-greet/artifacts/`.

- **No args.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/usage/missing --`. `exit.txt` is `1`. `stdout.bin` is 0 bytes. `stderr.hex` is `75736167653a2068656c6c6f2d6772656574203c6e616d653e0a`.
- **Empty name.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/usage/blank -- ""`. Same exit and streams as no args.
- **Whitespace name.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/usage/whitespace -- "   "`. Same exit and streams as no args.
- **JSON without a name.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/usage/json-only -- --json`. Same exit and streams as no args. stdout must not contain `{`.
- **Blank first positional.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/usage/blank-then-name -- "" Ada`. Same exit and streams as no args.
- **Proof.** Keep each case directory. Usage never prints the greeting on stdout.

## Gotchas

- `--json` without a name is still usage, not empty JSON.
- Do not pass a placeholder name to make the process exit 0. That verifies greet, not usage.
- `observe.mjs` with no args after `--` is the no-args case. Omitting `--` entirely is a helper usage error, not a hello-greet proof.

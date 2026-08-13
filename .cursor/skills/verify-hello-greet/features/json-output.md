# JSON output

JSON output prints one compact object on stdout and exits 0 when the user passes `--json` with a usable name.

## Sub-features

- `json-after` places `--json` after the name.
- `json-before` places `--json` before the name.
- `json-repeat` passes `--json` more than once.

## How to get to it (user POV)

- Run `npx tsx src/cli.ts Ada --json`.
- Run `npx tsx src/cli.ts --json Ada`.
- Run `npx tsx src/cli.ts --json Ada --json`.

## Driving it with observe.mjs

Preconditions:

- Doctor printed `doctor: ok` from the repo root.
- The out-dirs below are under `.cursor/skills/verify-hello-greet/artifacts/`.

- **Flag after name.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/json-output/after -- Ada --json`. `exit.txt` is `0`. `stderr.bin` is 0 bytes. `stdout.bin` is exactly `{"message":"hello, Ada","name":"Ada"}\n`. `JSON.parse` of the stdout bytes (utf8) succeeds. Object keys in the file are `message` then `name`.
- **Flag before name.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/json-output/before -- --json Ada`. Same exit and stdout bytes as flag after name.
- **Repeated flag.** Run `node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/json-output/repeat -- --json Ada --json`. Same exit and stdout bytes as flag after name.
- **Proof.** Keep the three case directories. Parse stdout as JSON in addition to the hex/byte compare so a pretty-printed or reordered object cannot hide behind a successful exit.

## Gotchas

- Node will swallow `--json` unless it comes after `--` in the observe command.
- `--json` without a usable name is Usage, not this feature.
- `message` uses the same one-space greeting as text mode and has no trailing newline inside the string.
- Compact JSON only. Pretty-printed output is a failure even if `JSON.parse` succeeds.

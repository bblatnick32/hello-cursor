# hello-greet verification map

This directory is the maintained source for verifying the user-facing behavior of hello-greet. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Work from the hello-greet repo root.
- `npm install` has been run so `node_modules/tsx` exists.
- `bash .cursor/skills/verify-hello-greet/scripts/doctor.sh` prints `doctor: ok`.
- Drive only through `node .cursor/skills/verify-hello-greet/scripts/observe.mjs <out-dir> -- <args...>`.
- Each drive is a new process. Concurrent drives do not share state.

## Driving conventions

- Start every recipe from a fresh process. There is no seeded data and no session to restore.
- Treat every argv token as literal. Keep `--json` spelled exactly that way.
- Always pass CLI args after `--` so node does not consume `--json`.
- Compare `stdout.bin`, `stderr.bin`, and `exit.txt` to the bytes in the feature file. Do not trust a human-readable terminal dump alone.

## Proof and skip reporting

- Capture the observe command and the resulting streams, not only the exit code.
- CLI proof includes command, stdout, stderr, and exit code.
- When a stream must be empty, prove it with a 0-byte `.bin` file.
- Record the feature ID and case directory with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with observe.mjs` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Text greeting](./text-greeting.md) covers the default stdout greeting, name trim, and extra positionals.
- [Usage](./usage.md) covers missing, blank, and whitespace-only names, including `--json` without a name.
- [JSON output](./json-output.md) covers `--json` before or after the name and repeated `--json`.

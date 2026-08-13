---
name: verify-hello-greet
description: >-
  Drive the hello-greet CLI (npx tsx src/cli.ts) as a user would: spawn the
  real entrypoint, capture stdout/stderr/exit, and prove text greet, usage, and
  --json. Use when verifying hello-greet behavior, reproducing a CLI bug, or
  checking a greeting/usage/json change against the live binary.
---

# Verify hello-greet

hello-greet is a short-lived Node TypeScript CLI. There is no server, port, auth, or data directory. A user runs `npx tsx src/cli.ts` with a name and optional `--json`. Each drive is a fresh process. Two drives may run side by side.

Work from the repo root. Never import `run()` or call test-only helpers as proof. The user path is `npx tsx src/cli.ts`.

Read `features/README.md` and the matching feature file before driving. A proof that uses one convenient entry point is incomplete when the map lists others.

## Launch

Install deps once per checkout. There is nothing to keep alive.

```bash
npm install
```

Ready when `node_modules/tsx/package.json` exists. Confirm with Doctor.

Each drive starts its own process through `scripts/observe.mjs`. Do not wrap the CLI in a long-lived tmux session.

Teardown is process-scoped: `observe.mjs` waits for the child to exit. If a spawn is still running after a failed iteration, kill that child PID only, never `node` or `npx` by name.

## Doctor

Read-only. Run from the repo root before the first drive, on any surprise, and before retrying after a failed drive.

```bash
bash .cursor/skills/verify-hello-greet/scripts/doctor.sh
```

Require:

- stdout contains `doctor: ok`
- `package=hello-greet`
- `cli=src/cli.ts`
- `tsx=node_modules/tsx`

If doctor fails because deps are missing, run Launch and doctor again. Do not drive an instance whose cwd is not this repo.

## Drive

Capture every invocation with the helper. The `--` is required so `--json` is not eaten by node.

```bash
node .cursor/skills/verify-hello-greet/scripts/observe.mjs <out-dir> -- <args...>
```

That runs `npx tsx src/cli.ts <args...>` with `cwd` at the repo root and writes:

- `command.txt` holds the argv as JSON strings.
- `stdout.bin` and `stderr.bin` are the raw bytes.
- `stdout.hex` and `stderr.hex` are lowercase hex of those bytes.
- `exit.txt` is the exit code plus a newline.

Stable handles (literal):

- Entry: `npx tsx src/cli.ts`
- Usage line: `usage: hello-greet <name>\n` (stderr)
- Text greeting: `hello, <name>\n` (stdout). One space after the comma. Name is the first positional after trim.
- JSON greeting: one compact object on stdout, keys `message` then `name`, then newline. `message` is the same `hello, <name>` string without the trailing newline.

Flag: only `--json` (exact token). Place it before or after the name. Repeated `--json` is still JSON.

Do not prove by calling `run()` from `src/run.ts`. Do not treat vitest passing as a user-path proof.

## Evidence

Store proofs under `.cursor/skills/verify-hello-greet/artifacts/<feature-id>/<case>/`. That directory survives Cleanup.

Every proof includes:

1. The exact `observe.mjs` command (action).
2. `command.txt`, `stdout.bin`, `stderr.bin`, `exit.txt` (resulting streams).
3. Byte checks against the feature file, not a visual read of a terminal.

Proof standards:

- Exercise `npx tsx src/cli.ts`, not `src/run.ts` and not `src/*.test.ts`.
- Capture the invocation and the streams, not only a pass/fail summary.
- This CLI has no files, DB rows, or network side effects. The observable state is stdout, stderr, and exit code. Confirm the unused stream is empty (`0` bytes) when the feature says so.
- No mocks. No dry-run mode.

Hex anchors:

- text `Ada` stdout: `68656c6c6f2c204164610a` (`hello, Ada\n`)
- usage stderr: `75736167653a2068656c6c6f2d6772656574203c6e616d653e0a` (`usage: hello-greet <name>\n`)
- JSON `Ada` stdout is `{"message":"hello, Ada","name":"Ada"}\n`. `JSON.parse` of `stdout.bin` (trim the trailing newline first, or parse the buffer as utf8) must succeed. Key order in the file is `message` then `name`.

Record the feature ID and case directory with the artifacts.

## Cleanup

Do not delete `.cursor/skills/verify-hello-greet/artifacts/`.

There is no shared instance. After a drive, the child has already exited. If you started a stuck spawn, kill only that PID.

Scratch state is limited to the out-dir you passed to `observe.mjs`. Leave those files in `artifacts/`. Do not `rm -rf` that tree as part of cleanup.

## Helpers

Run from the repo root. Both scripts are executable.

Doctor:

```bash
bash .cursor/skills/verify-hello-greet/scripts/doctor.sh
```

Observe (always include `--`):

```bash
node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/text-greeting/ada -- Ada
```

```bash
node .cursor/skills/verify-hello-greet/scripts/observe.mjs .cursor/skills/verify-hello-greet/artifacts/json-output/before -- --json Ada
```

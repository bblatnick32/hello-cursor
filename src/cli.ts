import { run } from "./run.ts";

const result = run(process.argv.slice(2));
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
// Piped stdout can still be draining; exitCode lets it flush instead of process.exit.
process.exitCode = result.exitCode;

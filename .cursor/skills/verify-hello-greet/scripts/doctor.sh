#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f package.json ]]; then
  echo "doctor: run from the hello-greet repo root (package.json missing)" >&2
  exit 1
fi

name="$(node -e "process.stdout.write(JSON.parse(require('node:fs').readFileSync('package.json','utf8')).name ?? '')")"
if [[ "$name" != "hello-greet" ]]; then
  echo "doctor: package.json name is '${name}', expected hello-greet" >&2
  exit 1
fi

if [[ ! -f src/cli.ts ]]; then
  echo "doctor: src/cli.ts missing" >&2
  exit 1
fi

if [[ ! -f node_modules/tsx/package.json ]]; then
  echo "doctor: tsx is not installed; run npm install from the repo root" >&2
  exit 1
fi

if [[ ! -f node_modules/typescript/package.json ]]; then
  echo "doctor: typescript is not installed; run npm install from the repo root" >&2
  exit 1
fi

node_bin="$(command -v node)"
node_ver="$(node -p "process.versions.node")"
echo "doctor: ok"
echo "cwd=$(pwd)"
echo "package=hello-greet"
echo "cli=src/cli.ts"
echo "node=${node_bin} ${node_ver}"
echo "tsx=node_modules/tsx"

#!/bin/bash
set -e

cd "$(dirname "$0")/assurecare-portal"

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-5888}"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting AssureCare Portal on ${HOST}:${PORT}..."
npm run dev -- --host "$HOST" --port "$PORT"

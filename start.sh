#!/bin/bash
set -e

cd "$(dirname "$0")/assurecare-portal"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting AssureCare Portal..."
npm run dev -- --host 0.0.0.0 --port 5173

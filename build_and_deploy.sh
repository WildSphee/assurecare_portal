#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="${APP_DIR:-$ROOT_DIR/assurecare-portal}"
TARGET_DIR="${TARGET_DIR:-/var/www/heartpatientcare.com}"
RELOAD_NGINX="${RELOAD_NGINX:-1}"

cd "$APP_DIR"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building frontend..."
npm run build

echo "Deploying dist/ to $TARGET_DIR ..."
sudo mkdir -p "$TARGET_DIR"
sudo rsync -av --delete dist/ "$TARGET_DIR"/

if [ "$RELOAD_NGINX" = "1" ]; then
  echo "Reloading nginx..."
  sudo systemctl reload nginx
fi

echo "Deploy complete."

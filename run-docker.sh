#!/usr/bin/env bash
# Runs the published image on 8080, separate from `pnpm dev`'s 5173 — both
# can run side by side.
set -euo pipefail

IMAGE="ghcr.io/nithin-studio-app/nithin-studio:latest"
OLD_ID="$(docker images -q "$IMAGE")"

echo "Checking for a newer image..."
docker pull "$IMAGE"

docker rm -f nithin-studio 2>/dev/null || true

docker run -d --name nithin-studio -p 8080:80 "$IMAGE"

NEW_ID="$(docker images -q "$IMAGE")"
if [ -n "$OLD_ID" ] && [ "$OLD_ID" != "$NEW_ID" ]; then
  echo "Removing superseded image ($OLD_ID)..."
  docker rmi "$OLD_ID" 2>/dev/null || true
fi

echo "nithin-studio running in Docker: http://localhost:8080"

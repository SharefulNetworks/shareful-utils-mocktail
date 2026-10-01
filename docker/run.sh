#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="${IMAGE_NAME:-mocktail}"
CONTAINER_NAME="${CONTAINER_NAME:-mocktail}"
PORT="${PORT:-3333}"

echo "Building Mocktail Docker image..."
docker build --no-cache -f "${ROOT_DIR}/docker/Dockerfile" -t "${IMAGE_NAME}" "${ROOT_DIR}"

echo "Stopping any existing container named '${CONTAINER_NAME}'..."
docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

echo "Starting Mocktail on http://localhost:${PORT}"
docker run --rm -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:3333" \
  "${IMAGE_NAME}"

echo "Mocktail is running. Open http://localhost:${PORT}"

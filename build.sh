#!/bin/bash
set -e

echo "=== ASIAMAX Store - Build ==="

echo "[1/4] Installing dependencies..."
pnpm install

echo "[2/4] Building frontend..."
PORT=6000 BASE_PATH="/" pnpm --filter @workspace/uc-store run build

echo "[3/4] Building backend..."
pnpm --filter @workspace/api-server run build

echo "[4/4] Copying frontend to backend dist..."
cp -r artifacts/uc-store/dist/public artifacts/api-server/dist/public

echo ""
echo "=== Build Complete ==="

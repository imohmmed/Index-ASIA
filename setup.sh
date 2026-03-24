#!/bin/bash
set -e

echo ""
echo "============================================"
echo "   ASIAMAX Store - One-Click Setup"
echo "============================================"
echo ""

APP_DIR="/var/www/asiamax.store"
DB_NAME="asiamax_store"
DB_USER="asiamax"
DB_PASS="AsiaMax2026"
BOT_TOKEN="8364532299:AAF48yZxdV9FDACokqi-dKHEeulpPVqdlUA"
CHAT_ID="1384026800"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"

echo "[1/7] Creating .env file..."
cat > "${APP_DIR}/.env" << EOF
NODE_ENV=production
PORT=6000
SERVE_STATIC=true
DB_PASSWORD=${DB_PASS}
DATABASE_URL=${DATABASE_URL}
TELEGRAM_BOT_TOKEN=${BOT_TOKEN}
TELEGRAM_CHAT_ID=${CHAT_ID}
EOF
echo "  .env created"

echo ""
echo "[2/7] Setting up PostgreSQL..."
sudo -u postgres psql -c "DROP ROLE IF EXISTS ${DB_USER};" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" 2>/dev/null
sudo -u postgres psql -d ${DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${DB_USER};" 2>/dev/null
PGPASSWORD="${DB_PASS}" psql -U ${DB_USER} -d ${DB_NAME} -h localhost < "${APP_DIR}/scripts/init-db.sql" 2>/dev/null || echo "  Tables already exist"
echo "  Database ready"

echo ""
echo "[3/7] Installing dependencies..."
cd "${APP_DIR}"
pnpm install

echo ""
echo "[4/7] Building frontend..."
PORT=6000 BASE_PATH="/" pnpm --filter @workspace/uc-store run build

echo ""
echo "[5/7] Building backend..."
pnpm --filter @workspace/api-server run build

echo ""
echo "[6/7] Copying frontend to backend..."
rm -rf artifacts/api-server/dist/public
cp -r artifacts/uc-store/dist/public artifacts/api-server/dist/public

echo ""
echo "[7/7] Starting with PM2..."
mkdir -p "${APP_DIR}/logs"
pm2 delete asiamax 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup 2>/dev/null || true

echo ""
echo "============================================"
echo "   ASIAMAX Store is RUNNING!"
echo "============================================"
echo ""
echo "  App: http://localhost:6000"
echo ""
echo "  Next: Set up Nginx + SSL"
echo "    sudo cp nginx.conf /etc/nginx/sites-available/asiamax.store"
echo "    sudo ln -sf /etc/nginx/sites-available/asiamax.store /etc/nginx/sites-enabled/"
echo "    sudo rm -f /etc/nginx/sites-enabled/default"
echo "    sudo nginx -t && sudo systemctl restart nginx"
echo "    sudo certbot --nginx -d asiamax.store -d www.asiamax.store"
echo ""

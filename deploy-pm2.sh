#!/bin/bash
set -e

echo "=== ASIAMAX Store - PM2 Deployment ==="
echo ""

if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "IMPORTANT: Edit .env with your actual values!"
  echo "  nano .env"
  exit 1
fi

source .env

if [ "$TELEGRAM_BOT_TOKEN" = "your_telegram_bot_token_here" ] || [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "ERROR: Set TELEGRAM_BOT_TOKEN in .env"
  exit 1
fi

echo "[1/3] Building project..."
bash build.sh

echo ""
echo "[2/3] Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE asiamax_store;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER asiamax WITH PASSWORD '${DB_PASSWORD}';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE asiamax_store TO asiamax;" 2>/dev/null
sudo -u postgres psql -d asiamax_store -c "GRANT ALL ON SCHEMA public TO asiamax;" 2>/dev/null
psql "$DATABASE_URL" < scripts/init-db.sql 2>/dev/null || PGPASSWORD="${DB_PASSWORD}" psql -U asiamax -d asiamax_store -h localhost < scripts/init-db.sql

echo ""
echo "[3/3] Starting with PM2..."
export DATABASE_URL="postgresql://asiamax:${DB_PASSWORD}@localhost:5432/asiamax_store"
export TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
export TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID}"

pm2 delete asiamax 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "App running at: http://localhost:6000"
echo ""
echo "PM2 Commands:"
echo "  pm2 status          # Check status"
echo "  pm2 logs asiamax    # View logs"
echo "  pm2 restart asiamax # Restart"
echo "  pm2 stop asiamax    # Stop"
echo ""
echo "Next steps:"
echo "  1. Set up Nginx:  sudo cp nginx.conf /etc/nginx/sites-available/asiamax.store"
echo "  2. Enable site:   sudo ln -sf /etc/nginx/sites-available/asiamax.store /etc/nginx/sites-enabled/"
echo "  3. Test & restart: sudo nginx -t && sudo systemctl restart nginx"
echo "  4. SSL:           sudo certbot --nginx -d asiamax.store -d www.asiamax.store"
echo "  5. Webhook:       curl -X POST 'https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook' -d 'url=https://asiamax.store/api/telegram/webhook'"
echo "  6. Auto-start:    pm2 startup && pm2 save"

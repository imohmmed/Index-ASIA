#!/bin/bash
set -e

echo "=== ASIAMAX Store - VPS Deployment ==="
echo ""

if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "IMPORTANT: Edit .env with your actual values before continuing!"
  echo "  nano .env"
  exit 1
fi

source .env

if [ "$TELEGRAM_BOT_TOKEN" = "your_telegram_bot_token_here" ] || [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "ERROR: Set TELEGRAM_BOT_TOKEN in .env"
  exit 1
fi

if [ "$TELEGRAM_CHAT_ID" = "your_telegram_chat_id_here" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "ERROR: Set TELEGRAM_CHAT_ID in .env"
  exit 1
fi

echo "Building and starting containers..."
docker compose up -d --build

echo ""
echo "Waiting for database to be ready..."
sleep 5

echo "Running database migration..."
docker compose exec -T db psql -U asiamax -d asiamax_store < scripts/init-db.sql

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "App running at: http://asiamax.store (port 6000)"
echo ""
echo "To set up Telegram webhook, run:"
echo "  curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook -d 'url=https://asiamax.store/api/telegram/webhook'"
echo ""
echo "To set up Nginx + SSL:"
echo "  sudo cp nginx.conf /etc/nginx/sites-available/asiamax.store"
echo "  sudo ln -sf /etc/nginx/sites-available/asiamax.store /etc/nginx/sites-enabled/"
echo "  sudo nginx -t && sudo systemctl restart nginx"
echo "  sudo certbot --nginx -d asiamax.store -d www.asiamax.store"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f app    # View app logs"
echo "  docker compose restart app    # Restart app"
echo "  docker compose down           # Stop everything"
echo "  docker compose up -d --build  # Rebuild and restart"

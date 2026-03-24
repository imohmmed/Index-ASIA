# Asiacell Credit Store - VPS Deployment Guide

## المتطلبات
- VPS with Ubuntu 22.04+
- Docker & Docker Compose installed
- Domain name (optional, for SSL)

## خطوات التثبيت

### 1. Clone the repository
```bash
git clone https://github.com/imohmmed/Index-ASIA.git
cd Index-ASIA
```

### 2. Configure environment
```bash
cp .env.example .env
nano .env
```

Edit the values:
```
DB_PASSWORD=your_secure_password
APP_PORT=3000
TELEGRAM_BOT_TOKEN=8364532299:AAF48yZxdV9FDACokqi-dKHEeulpPVqdlUA
TELEGRAM_CHAT_ID=1384026800
```

### 3. Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Set up Telegram Webhook
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://YOUR_DOMAIN/api/telegram/webhook"
```

### 5. (Optional) Set up Nginx + SSL

Install Nginx:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Copy nginx config:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/asiacell
sudo ln -s /etc/nginx/sites-available/asiacell /etc/nginx/sites-enabled/
```

Edit domain name:
```bash
sudo nano /etc/nginx/sites-available/asiacell
# Replace YOUR_DOMAIN with your actual domain
```

Get SSL certificate:
```bash
sudo certbot --nginx -d YOUR_DOMAIN
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

## الأوامر المفيدة

```bash
# عرض السجلات
docker compose logs -f app

# إعادة تشغيل التطبيق
docker compose restart app

# إيقاف كل شيء
docker compose down

# إعادة البناء والتشغيل
docker compose up -d --build

# الدخول لقاعدة البيانات
docker compose exec db psql -U asiacell -d asiacell_store
```

## البنية
- **Port 3000**: التطبيق (API + Frontend)
- **Port 5432**: PostgreSQL (داخلي فقط)
- Frontend يعمل على نفس السيرفر مع API
- كل البيانات محفوظة في Docker volume

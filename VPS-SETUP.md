# ASIAMAX Store - VPS Deployment Guide

## المتطلبات
- VPS with Ubuntu 22.04+
- Docker & Docker Compose installed
- Domain: asiamax.store (pointed to your VPS IP)

## خطوات التثبيت

### 1. Clone the repository
```bash
cd /var/www
git clone https://github.com/imohmmed/Index-ASIA.git asiamax.store
cd asiamax.store
```

### 2. Configure environment
```bash
cp .env.example .env
nano .env
```

Edit the values:
```
DB_PASSWORD=your_secure_password
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 3. Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Set up Nginx + SSL
```bash
sudo apt install nginx certbot python3-certbot-nginx -y

sudo cp nginx.conf /etc/nginx/sites-available/asiamax.store
sudo ln -sf /etc/nginx/sites-available/asiamax.store /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

sudo certbot --nginx -d asiamax.store -d www.asiamax.store
```

### 5. Set up Telegram Webhook
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://asiamax.store/api/telegram/webhook"
```

## الأوامر المفيدة

```bash
docker compose logs -f app           # عرض السجلات
docker compose restart app            # إعادة تشغيل التطبيق
docker compose down                   # إيقاف كل شيء
docker compose up -d --build          # إعادة البناء والتشغيل
docker compose exec db psql -U asiamax -d asiamax_store  # الدخول لقاعدة البيانات
```

## البنية
- **Port 6000**: التطبيق (API + Frontend)
- **Port 5432**: PostgreSQL (داخلي فقط)
- **Domain**: asiamax.store
- **Path**: /var/www/asiamax.store

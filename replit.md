# Workspace

## Overview

pnpm workspace monorepo using TypeScript. UC Store - a PUBG Mobile UC (Unknown Cash) currency store with Telegram bot integration for order management.

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
- **Build**: esbuild (CJS bundle)
- **Notifications**: Telegram Bot API

## Features

- UC package selection (60, 300, 600, 1500, 3000, 6000 UC)
- WhatsApp contact collection
- Code verification system
- Real-time order status polling
- Telegram bot notifications with approve/reject inline buttons
- IP tracking per order
- Arabic RTL interface
- Dark gaming theme with gold accents

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server with Telegram integration
│   └── uc-store/           # React + Vite frontend (UC Store)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package
```

## API Endpoints

- `POST /api/orders` - Create order (sends Telegram notification)
- `POST /api/orders/:id/contact` - Submit WhatsApp + name (sends Telegram notification)
- `POST /api/orders/:id/code` - Submit verification code (sends Telegram notification with approve/reject buttons)
- `GET /api/orders/:id/status` - Poll order status
- `POST /api/orders/:id/decide` - Approve/reject order
- `POST /api/telegram/webhook` - Telegram bot webhook for inline button callbacks

## Environment Variables

- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_CHAT_ID` - Telegram chat ID for notifications
- `DATABASE_URL` - PostgreSQL connection string

## Order Flow

1. User selects UC package → Order created → Telegram notification
2. User enters WhatsApp + name → Contact saved → Telegram notification
3. Admin sends code to user via WhatsApp
4. User enters code → Code saved → Telegram notification with approve/reject buttons
5. Admin clicks approve/reject in Telegram → Status updated → Frontend polls and shows result

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Database Schema

### orders table
- id (varchar, PK)
- product_id, product_name, price, quantity
- whatsapp, name (nullable)
- code (nullable)
- status (pending → contact_submitted → code_submitted → approved/rejected)
- ip_address
- created_at

import { logger } from "./logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramMessage(text: string, inlineKeyboard?: any[][]) {
  try {
    const body: any = {
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    };
    if (inlineKeyboard) {
      body.reply_markup = JSON.stringify({ inline_keyboard: inlineKeyboard });
    }
    const res = await fetch(`${API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) {
      logger.error({ data }, "Telegram sendMessage failed");
    }
    return data;
  } catch (err) {
    logger.error({ err }, "Telegram sendMessage error");
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    await fetch(`${API_BASE}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || "",
      }),
    });
  } catch (err) {
    logger.error({ err }, "Telegram answerCallbackQuery error");
  }
}

type UpdateHandler = (update: any) => Promise<void>;
let pollingActive = false;

export function startPolling(handler: UpdateHandler) {
  if (!BOT_TOKEN) {
    logger.warn("TELEGRAM_BOT_TOKEN not set, skipping polling");
    return;
  }

  fetch(`${API_BASE}/deleteWebhook`).then(() => {
    logger.info("Telegram webhook deleted, starting polling");
  }).catch(() => {});

  pollingActive = true;
  let offset = 0;

  async function poll() {
    if (!pollingActive) return;
    try {
      const res = await fetch(`${API_BASE}/getUpdates?offset=${offset}&timeout=30`, {
        signal: AbortSignal.timeout(35000),
      });
      const data = await res.json();
      if (data.ok && data.result?.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          try {
            await handler(update);
          } catch (err) {
            logger.error({ err }, "Error handling telegram update");
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "TimeoutError") {
        logger.error({ err }, "Polling error");
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    setTimeout(poll, 100);
  }

  poll();
  logger.info("Telegram bot polling started");
}

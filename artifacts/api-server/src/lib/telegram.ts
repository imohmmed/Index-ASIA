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

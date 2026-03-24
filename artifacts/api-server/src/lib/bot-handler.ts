import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendTelegramMessage, answerCallbackQuery } from "./telegram";
import { getRate, setRate, calcPackages } from "../routes/settings";
import { logger } from "./logger";

async function sendAdminPanel() {
  const rate = await getRate();
  const packages = calcPackages(rate);
  const pkgList = packages
    .map((p) => `  ${p.faceValue.toLocaleString()} ← ${p.price.toLocaleString()} IQD`)
    .join("\n");

  await sendTelegramMessage(
    `⚙️ <b>لوحة التحكم</b>\n\n` +
      `📊 سعر الصرف الحالي: <b>${rate}</b>\n\n` +
      `📦 الأسعار الحالية:\n<code>${pkgList}</code>\n\n` +
      `🔧 اختر سعر الصرف الجديد:`,
    [
      [
        { text: "1.05", callback_data: "rate_1.05" },
        { text: "1.10", callback_data: "rate_1.1" },
        { text: "1.15", callback_data: "rate_1.15" },
      ],
      [
        { text: "1.20", callback_data: "rate_1.2" },
        { text: "1.25", callback_data: "rate_1.25" },
        { text: "1.30", callback_data: "rate_1.3" },
      ],
      [
        { text: "1.35", callback_data: "rate_1.35" },
        { text: "1.40", callback_data: "rate_1.4" },
        { text: "1.50", callback_data: "rate_1.5" },
      ],
    ]
  );
}

export async function handleUpdate(update: any) {
  if (update.message?.text) {
    const text = update.message.text.trim().split("@")[0];
    if (text === "/admin" || text === "/start") {
      try {
        await sendAdminPanel();
      } catch (err: any) {
        logger.error({ err }, "Error in sendAdminPanel");
        await sendTelegramMessage(`❌ خطأ: ${err.message}`);
      }
      return;
    }
  }

  if (update.callback_query) {
    const callbackData = update.callback_query.data as string;
    const callbackQueryId = update.callback_query.id;

    if (callbackData.startsWith("rate_")) {
      const newRate = parseFloat(callbackData.replace("rate_", ""));
      if (!isNaN(newRate) && newRate > 0) {
        await setRate(newRate);
        const packages = calcPackages(newRate);
        const pkgList = packages
          .map((p) => `  ${p.faceValue.toLocaleString()} ← ${p.price.toLocaleString()} IQD`)
          .join("\n");

        await answerCallbackQuery(callbackQueryId, `تم تغيير السعر إلى ${newRate}`);
        await sendTelegramMessage(
          `✅ <b>تم تحديث سعر الصرف</b>\n\n` +
            `📊 السعر الجديد: <b>${newRate}</b>\n\n` +
            `📦 الأسعار المحدثة:\n<code>${pkgList}</code>`
        );
      }
      return;
    }

    if (callbackData.startsWith("approve_") || callbackData.startsWith("reject_")) {
      const parts = callbackData.split("_");
      const action = parts[0];
      const orderId = parts.slice(1).join("_");
      const decision = action === "approve" ? "approved" : "rejected";

      const [order] = await db
        .update(ordersTable)
        .set({ status: decision })
        .where(eq(ordersTable.id, orderId))
        .returning();

      if (order) {
        const statusText =
          decision === "approved"
            ? `✅ تمت الموافقة على الطلب <code>${orderId}</code>`
            : `❌ تم رفض الطلب <code>${orderId}</code>`;

        await sendTelegramMessage(statusText);
        await answerCallbackQuery(
          callbackQueryId,
          decision === "approved" ? "تمت الموافقة" : "تم الرفض"
        );
      }
    }
  }
}

import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendTelegramMessage, answerCallbackQuery } from "./telegram";
import { PACKAGES, getAllPackages, setPackagePrice } from "../routes/settings";
import { logger } from "./logger";

let editingPackage: number | null = null;

async function sendAdminPanel() {
  const packages = await getAllPackages();
  let text = `⚙️ <b>لوحة التحكم - ASIAMAX</b>\n\n`;
  text += `📦 <b>الأسعار الحالية:</b>\n\n`;

  for (const pkg of packages) {
    text += `  💳 ${pkg.faceValue.toLocaleString()} رصيد ← <b>${pkg.price.toLocaleString()} IQD</b>\n`;
  }

  text += `\n🔧 اضغط على الباقة لتغيير سعرها:`;

  const buttons = packages.map((pkg) => [
    {
      text: `✏️ ${pkg.faceValue.toLocaleString()} (حالياً ${pkg.price.toLocaleString()})`,
      callback_data: `edit_${pkg.faceValue}`,
    },
  ]);

  await sendTelegramMessage(text, buttons);
}

export async function handleUpdate(update: any) {
  if (update.message?.text) {
    const text = update.message.text.trim().split("@")[0];

    if (text === "/admin" || text === "/start") {
      editingPackage = null;
      try {
        await sendAdminPanel();
      } catch (err: any) {
        logger.error({ err }, "Error in sendAdminPanel");
        await sendTelegramMessage(`❌ خطأ: ${err.message}`);
      }
      return;
    }

    if (editingPackage !== null) {
      const newPrice = parseInt(text.replace(/[,،]/g, ""));
      if (isNaN(newPrice) || newPrice <= 0) {
        await sendTelegramMessage(`❌ سعر غير صحيح. أرسل رقم صحيح (مثال: 4500)`);
        return;
      }

      const faceValue = editingPackage;
      editingPackage = null;

      try {
        await setPackagePrice(faceValue, newPrice);
        const packages = await getAllPackages();
        let text = `✅ <b>تم تحديث السعر</b>\n\n`;
        text += `💳 رصيد ${faceValue.toLocaleString()} ← <b>${newPrice.toLocaleString()} IQD</b>\n\n`;
        text += `📦 <b>جميع الأسعار:</b>\n`;
        for (const pkg of packages) {
          const marker = pkg.faceValue === faceValue ? " ✅" : "";
          text += `  ${pkg.faceValue.toLocaleString()} ← ${pkg.price.toLocaleString()} IQD${marker}\n`;
        }
        text += `\nأرسل /admin للعودة للوحة التحكم`;
        await sendTelegramMessage(text);
      } catch (err: any) {
        logger.error({ err }, "Error setting price");
        await sendTelegramMessage(`❌ خطأ: ${err.message}`);
      }
      return;
    }
  }

  if (update.callback_query) {
    const callbackData = update.callback_query.data as string;
    const callbackQueryId = update.callback_query.id;

    if (callbackData.startsWith("edit_")) {
      const faceValue = parseInt(callbackData.replace("edit_", ""));
      const pkg = PACKAGES.find((p) => p.faceValue === faceValue);
      if (pkg) {
        editingPackage = faceValue;
        await answerCallbackQuery(callbackQueryId, `تعديل سعر ${pkg.name}`);
        await sendTelegramMessage(
          `✏️ <b>تعديل سعر: ${pkg.name}</b>\n\n` +
            `💳 الرصيد: ${faceValue.toLocaleString()}\n\n` +
            `📝 أرسل السعر الجديد بالدينار العراقي:\n` +
            `(مثال: 4500)`
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

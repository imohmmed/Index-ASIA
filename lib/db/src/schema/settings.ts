import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

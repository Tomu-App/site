import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subscribers = sqliteTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status", { enum: ["pending", "confirmed"] }).notNull(),
  consentVersion: text("consent_version").notNull(),
  createdAt: integer("created_at").notNull(),
  confirmedAt: integer("confirmed_at"),
  mailWindowStart: integer("mail_window_start"),
  mailWindowCount: integer("mail_window_count").notNull().default(0),
});

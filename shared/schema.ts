import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  items: jsonb("items").notNull().$type<{ name: string; quantity: number; size?: string }[]>(),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // bit, paybox
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  lyrics: text("lyrics").notNull(),
  videoUrl: text("video_url"),
  category: text("category").notNull(), // unit, commander, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'home_title', 'home_subtitle'
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertSongSchema = createInsertSchema(songs).omit({ id: true, createdAt: true });
export const insertContentSchema = createInsertSchema(siteContent).omit({ id: true, updatedAt: true });

export type Order = typeof orders.$inferSelect;
export type Song = typeof songs.$inferSelect;
export type Content = typeof siteContent.$inferSelect;

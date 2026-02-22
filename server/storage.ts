import { db } from "./db";
import { orders, type InsertOrder, type Order, songs, type Song, siteContent, type Content } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getSongs(): Promise<Song[]>;
  createSong(song: any): Promise<Song>;
  getContent(): Promise<Content[]>;
  updateContent(key: string, value: string): Promise<Content>;
}

export class DatabaseStorage implements IStorage {
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getSongs(): Promise<Song[]> {
    return await db.select().from(songs);
  }

  async createSong(song: any): Promise<Song> {
    const [newSong] = await db.insert(songs).values(song).returning();
    return newSong;
  }

  async getContent(): Promise<Content[]> {
    return await db.select().from(siteContent);
  }

  async updateContent(key: string, value: string): Promise<Content> {
    const [existing] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    if (existing) {
      const [updated] = await db.update(siteContent).set({ value }).where(eq(siteContent.key, key)).returning();
      return updated;
    } else {
      const [created] = await db.insert(siteContent).values({ key, value }).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();

import { db } from "./db";
import { orders, type InsertOrder, type Order } from "@shared/schema";

export interface IStorage {
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }
}

export const storage = new DatabaseStorage();
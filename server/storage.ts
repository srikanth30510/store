import { drizzle } from "drizzle-orm/node-postgres";
import { users, stores, ratings } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import pkg from 'pg';
const { Pool } = pkg;
import session from "express-session";
import connectPg from "connect-pg-simple";
import { IStorage } from "./types";
import { InsertUser, InsertStore, InsertRating, User, Store, Rating } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  createStore(store: InsertStore): Promise<Store>;
  getAllStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  getStoresByOwner(ownerId: number): Promise<Store[]>;
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsByStore(storeId: number): Promise<Rating[]>;
  getRatingByUserAndStore(userId: number, storeId: number): Promise<Rating | undefined>;
  updateRating(id: number, rating: number): Promise<Rating | undefined>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  sessionStore: session.Store;

  constructor() {
    this.db = drizzle(pool);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await this.db.insert(users).values(user).returning();
    return result;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async createStore(store: InsertStore): Promise<Store> {
    const [result] = await this.db.insert(stores).values(store).returning();
    return result;
  }

  async getAllStores(): Promise<Store[]> {
    return await this.db.select().from(stores);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const results = await this.db.select().from(stores).where(eq(stores.id, id));
    return results[0];
  }

  async getStoresByOwner(ownerId: number): Promise<Store[]> {
    return await this.db.select().from(stores).where(eq(stores.ownerId, ownerId));
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const [result] = await this.db.insert(ratings).values(rating).returning();
    return result;
  }

  async getRatingsByStore(storeId: number): Promise<Rating[]> {
    return await this.db
      .select()
      .from(ratings)
      .where(eq(ratings.storeId, storeId));
  }

  async getRatingByUserAndStore(
    userId: number,
    storeId: number
  ): Promise<Rating | undefined> {
    const results = await this.db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.userId, userId),
          eq(ratings.storeId, storeId)
        )
      );
    return results[0];
  }

  async updateRating(id: number, rating: number): Promise<Rating | undefined> {
    const [result] = await this.db
      .update(ratings)
      .set({ rating })
      .where(eq(ratings.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
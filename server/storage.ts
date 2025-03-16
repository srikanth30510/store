import { drizzle } from "drizzle-orm/node-postgres";
import { users, stores, ratings } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import pg from "pg";
const { Pool } = pg;
import session from "express-session";
import connectPg from "connect-pg-simple";
import { IStorage } from "./types";
import { InsertUser, InsertStore, InsertRating, User, Store, Rating } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

if (!process.env.PGHOST || !process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGDATABASE) {
  throw new Error("Database configuration environment variables are not set properly");
}

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || "5432"),
  ssl: process.env.PGHOST === "localhost" ? false : { rejectUnauthorized: false }, // Disable SSL for local database
});

// Test the database connection
pool.connect().then(() => {
  console.log("Successfully connected to database");
}).catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

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
    try {
      const results = await this.db.select().from(users).where(eq(users.id, id));
      return results[0];
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    try {
      const results = await this.db.select().from(users).where(eq(users.email, email));
      return results[0];
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const [result] = await this.db.insert(users).values(user).returning();
      return result;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.db.select().from(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async createStore(store: InsertStore): Promise<Store> {
    try {
      const [result] = await this.db.insert(stores).values(store).returning();
      return result;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  }

  async getAllStores(): Promise<Store[]> {
    try {
      return await this.db.select().from(stores);
    } catch (error) {
      console.error("Error getting all stores:", error);
      throw error;
    }
  }

  async getStore(id: number): Promise<Store | undefined> {
    try {
      const results = await this.db.select().from(stores).where(eq(stores.id, id));
      return results[0];
    } catch (error) {
      console.error("Error getting store:", error);
      throw error;
    }
  }

  async getStoresByOwner(ownerId: number): Promise<Store[]> {
    try {
      return await this.db.select().from(stores).where(eq(stores.ownerId, ownerId));
    } catch (error) {
      console.error("Error getting stores by owner:", error);
      throw error;
    }
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    try {
      const [result] = await this.db.insert(ratings).values(rating).returning();
      return result;
    } catch (error) {
      console.error("Error creating rating:", error);
      throw error;
    }
  }

  async getRatingsByStore(storeId: number): Promise<Rating[]> {
    try {
      return await this.db
        .select()
        .from(ratings)
        .where(eq(ratings.storeId, storeId));
    } catch (error) {
      console.error("Error getting ratings by store:", error);
      throw error;
    }
  }

  async getRatingByUserAndStore(
    userId: number,
    storeId: number
  ): Promise<Rating | undefined> {
    try {
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
    } catch (error) {
      console.error("Error getting rating by user and store:", error);
      throw error;
    }
  }

  async updateRating(id: number, rating: number): Promise<Rating | undefined> {
    try {
      const [result] = await this.db
        .update(ratings)
        .set({ rating })
        .where(eq(ratings.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating rating:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
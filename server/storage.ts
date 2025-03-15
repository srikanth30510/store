import { IStorage } from "./types";
import { InsertUser, InsertStore, InsertRating, User, Store, Rating } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stores: Map<number, Store>;
  private ratings: Map<number, Rating>;
  sessionStore: session.Store;
  currentId: { users: number; stores: number; ratings: number };

  constructor() {
    this.users = new Map();
    this.stores = new Map();
    this.ratings = new Map();
    this.currentId = { users: 1, stores: 1, ratings: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createStore(store: InsertStore): Promise<Store> {
    const id = this.currentId.stores++;
    const newStore = { ...store, id };
    this.stores.set(id, newStore);
    return newStore;
  }

  async getAllStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async getStoresByOwner(ownerId: number): Promise<Store[]> {
    return Array.from(this.stores.values()).filter(
      (store) => store.ownerId === ownerId
    );
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const id = this.currentId.ratings++;
    const newRating = { ...rating, id };
    this.ratings.set(id, newRating);
    return newRating;
  }

  async getRatingsByStore(storeId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(
      (rating) => rating.storeId === storeId
    );
  }

  async getRatingByUserAndStore(
    userId: number,
    storeId: number
  ): Promise<Rating | undefined> {
    return Array.from(this.ratings.values()).find(
      (rating) => rating.userId === userId && rating.storeId === storeId
    );
  }

  async updateRating(id: number, rating: number): Promise<Rating | undefined> {
    const existingRating = this.ratings.get(id);
    if (!existingRating) return undefined;
    const updatedRating = { ...existingRating, rating };
    this.ratings.set(id, updatedRating);
    return updatedRating;
  }
}

export const storage = new MemStorage();

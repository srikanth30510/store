import { User, Store, Rating, InsertUser, InsertStore, InsertRating } from "@shared/schema";
import { Store as SessionStore } from "express-session";

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
  sessionStore: SessionStore;
}

import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoles = ["admin", "user", "store_owner"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  address: text("address").notNull(),
  role: text("role", { enum: userRoles }).notNull().default("user"),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  ownerId: integer("owner_id").references(() => users.id),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id),
  userId: integer("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users)
  .extend({
    name: z.string().min(20).max(60),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .max(16)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
    address: z.string().max(400),
    role: z.enum(userRoles),
  })
  .omit({ id: true });

export const insertStoreSchema = createInsertSchema(stores).omit({ id: true });

export const insertRatingSchema = createInsertSchema(ratings)
  .extend({
    rating: z.number().min(1).max(5),
  })
  .omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type User = typeof users.$inferSelect;
export type Store = typeof stores.$inferSelect;
export type Rating = typeof ratings.$inferSelect;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertStoreSchema, insertRatingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Store routes
  app.get("/api/stores", async (req, res) => {
    const stores = await storage.getAllStores();
    res.json(stores);
  });

  app.post("/api/stores", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    const parseResult = insertStoreSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }
    const store = await storage.createStore(parseResult.data);
    res.status(201).json(store);
  });

  // Rating routes
  app.post("/api/stores/:storeId/ratings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    const parseResult = insertRatingSchema.safeParse({
      ...req.body,
      storeId: parseInt(req.params.storeId),
      userId: req.user.id,
    });
    
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const existing = await storage.getRatingByUserAndStore(
      req.user.id,
      parseResult.data.storeId
    );

    if (existing) {
      const updated = await storage.updateRating(existing.id, parseResult.data.rating);
      return res.json(updated);
    }

    const rating = await storage.createRating(parseResult.data);
    res.status(201).json(rating);
  });

  app.get("/api/stores/:storeId/ratings", async (req, res) => {
    const ratings = await storage.getRatingsByStore(parseInt(req.params.storeId));
    res.json(ratings);
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    const users = await storage.getAllUsers();
    res.json(users);
  });

  const httpServer = createServer(app);
  return httpServer;
}

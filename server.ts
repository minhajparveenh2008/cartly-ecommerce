import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import connectDB from "./server/config/db.js";
import { seedIfEmpty } from "./server/seed/seedData.js";
import authRoutes from "./server/routes/authRoutes.js";
import productRoutes from "./server/routes/productRoutes.js";
import orderRoutes from "./server/routes/orderRoutes.js";
import { notFound, errorHandler } from "./server/middleware/errorMiddleware.js";

dotenv.config();

async function startServer() {
  await connectDB();
  await seedIfEmpty();

  const app = express();
  const PORT = 3000;

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    })
  );
  app.use(express.json());

  // Serve generated studio assets in both dev and production
  app.use(
    "/src/assets/images",
    express.static(path.join(process.cwd(), "src", "assets", "images"))
  );

  // Backend REST APIs
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "Cartly Full-Stack API" });
  });

  // API 404 handler for unmatched /api/* routes
  app.use("/api", notFound);
  app.use("/api", errorHandler);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cartly server running on http://localhost:${PORT}`);
  });
}

startServer();


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "SkillSync API",
    database: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error("Request error:", err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing from environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected successfully.");

    app.listen(port, "0.0.0.0", () => {
      console.log(`SkillSync API listening on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed.");
    console.error("Error name:", err.name);
    console.error("Error code:", err.code || "not provided");
    console.error("Error message:", err.message);

    if (err.cause) {
      console.error("Underlying cause:", err.cause.message || err.cause);
    }

    process.exit(1);
  }
}

startServer();

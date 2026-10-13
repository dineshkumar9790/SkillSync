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
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "SkillSync API" }));
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://dineshkumarr1402_db_user:hKP1AT2mdVHexrlb@cluster0.wadaxv8.mongodb.net")
  .then(() => app.listen(port, () => console.log(`SkillSync API listening on ${port}`)))
  .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });

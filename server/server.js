import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import registrationRoutes from "./routes/registrationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// =========================
// DATABASE
// =========================

await connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// =========================
// API
// =========================

app.use("/api/waheguru-simran", registrationRoutes);

app.use("/api/admin", adminRoutes);

// =========================
// HEALTH
// =========================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// =========================
// REACT BUILD
// =========================

const buildPath = path.join(__dirname, "..", "build");

app.use(express.static(buildPath));

// =========================
// REACT ROUTER FALLBACK
// =========================

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found.",
    });
  }

  res.sendFile(path.join(buildPath, "index.html"));
});

// =========================
// SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

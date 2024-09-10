// src/server.ts

import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductRoutes from "./routes/ProductRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI as string;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api", ProductRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

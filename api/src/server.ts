import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import ProductRoutes from "./routes/ProductRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import OrderRoutes from "./routes/OrderRoute";
import WishlistRoutes from "./routes/Wishlist";
import connectDB from "./db/mongodb";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI as string;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
connectDB(mongoUri);

// Routes
app.use("/api", ProductRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api", OrderRoutes);
app.use("/api", WishlistRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

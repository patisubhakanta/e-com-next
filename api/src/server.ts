import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/allRoutes";

import connectDB from "./config/db";

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
app.use('/api', routes);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the homepage!");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
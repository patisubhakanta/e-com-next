import { Router } from "express";
import ProductRoutes from "./ProductRoutes";
import AuthRoutes from "./AuthRoutes";
import OrderRoutes from "./OrderRoute";
import WishlistRoutes from "./Wishlist";

const router = Router();

// Route configurations
router.use("/api", ProductRoutes);
router.use("/api/auth", AuthRoutes);
router.use("/api", OrderRoutes);
router.use("/api", WishlistRoutes);

export default router;
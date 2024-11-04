import { Router } from "express";
import ProductRoutes from "./product";
import AuthRoutes from "./auth";
import OrderRoutes from "./order";
import WishlistRoutes from "./wishlistroute";
import CartRoute from "./cartRoute"

const router = Router();

// Route configurations
router.use( ProductRoutes);
router.use("/auth", AuthRoutes);
router.use( OrderRoutes);
router.use( WishlistRoutes);
router.use("/cart", CartRoute);

export default router;
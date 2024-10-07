import express from "express";
import { placeOrder } from "../controller/Order";
import { getUserOrders } from "../controller/Profile";

const router = express.Router();

router.post('/order', placeOrder);
router.get('/orders/:userId', getUserOrders);

export default router;

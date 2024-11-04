import express from "express";


import { placeOrder } from "../controller/placeOrder";
import { getUserOrders } from "../controller/getUserOrders";

const router = express.Router();

router.post('/order', placeOrder);
router.get('/orders/:userId', getUserOrders);

export default router;

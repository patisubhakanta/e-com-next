import express from "express";
import { addCartItems } from "../controller/addCart";
import { validateUser } from "../middleware/authMiddleware";
import { removeCartItem } from "../controller/removeCartProduct";
import { getCartDetails } from "../controller/cart";


const router = express.Router();

router.post('/add', validateUser, addCartItems);
router.post('/remove', validateUser, removeCartItem);
router.get('/items', validateUser, getCartDetails);

export default router;

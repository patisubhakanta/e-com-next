import express from "express";
import { viewWishlist } from "../controller/ViewWishList";
import { addWishlistItems } from "../controller/AddProductWishlist";
import { removeWishlist } from "../controller/RemoveWishlist";

const router = express.Router();

router.post('/wishlist/add', addWishlistItems);
router.post('/wishlist/remove', removeWishlist)
router.get('/wishlist', viewWishlist);

export default router;

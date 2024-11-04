import express from "express";
import { addWishlistItems } from "../controller/addWishlist";
import { removeWishlist } from "../controller/removeWishlistProduct";
import { viewWishlist } from "../controller/wishlistsProducts";

const router = express.Router();

router.post('/wishlist/add', addWishlistItems);
router.post('/wishlist/remove', removeWishlist)
router.get('/wishlist', viewWishlist);

export default router;

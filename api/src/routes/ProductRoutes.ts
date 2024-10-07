import express from "express";
import { allProducts } from "../controller/ProductController";
import { addProducts } from "../controller/AddProductController";
import { productDetails } from "../controller/ProductDetailsController";
import { search } from "../controller/SearchController";

const router = express.Router();

router.get("/products", allProducts);
router.get("/product/:id", productDetails);
router.post("/addProduct", addProducts);
router.get("/products/search/:name", search);

export default router;

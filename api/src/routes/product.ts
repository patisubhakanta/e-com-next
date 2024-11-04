import express from "express";

import { addProducts } from "../controller/addProducts";
import { allProducts } from "../controller/allProducts";
import { productDetails } from "../controller/productDetails";

const router = express.Router();

router.get("/products", allProducts);
router.get("/product/:id", productDetails);
router.post("/addProduct", addProducts);

export default router;

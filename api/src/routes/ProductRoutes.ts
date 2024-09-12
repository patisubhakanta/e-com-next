import express from "express";
import { allProducts } from "../controller/ProductController";
import { addProducts } from "../controller/AddProductController";
import { productDetails } from "../controller/ProductDetailsController";
import { search } from "../controller/SearchController";
import { signup } from "../controller/Signup";
import { signin } from "../controller/SignIn";

const router = express.Router();

router.get("/", allProducts);
router.get("/product/:id", productDetails);
router.post("/addProduct", addProducts);
router.get("/products/search/:name", search);
router.post('/auth/signup', signup);
router.post('/auth/signin', signin);


export default router;

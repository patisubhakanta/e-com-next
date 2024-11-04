import express from "express";
import { forgetPassword } from "../controller/resetPassword";
import { signup } from "../controller/createAccount";
import { signin } from "../controller/login";

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/reset-password', forgetPassword);


export default router;

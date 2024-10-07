import express from "express";

import { signup } from "../controller/Signup";
import { signin } from "../controller/SignIn";
import { forgetPassword } from "../controller/ForgotPassword";

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/reset-password', forgetPassword);


export default router;

import express from "express";
import { signup } from "../Controllers/AuthController/SignUp.js";
import { login } from "../Controllers/AuthController/Login.js";
import { auth } from "../Middlewares/AuthUser.js";
import { logout } from "../Controllers/AuthController/Logout.js";
import { sendVerificationOTP } from "../Controllers/AuthController/SendVerificationOTP.js";
import { verifyAccount } from "../Controllers/AuthController/VerifyAccountWithOTP.js";
import { isAuthenticated } from "../Controllers/AuthController/IsAuthenticated.js";
import { sendPasswordResetOTP } from "../Controllers/AuthController/SendPasswordResetOTP.js";
import { resetPassword } from "../Controllers/AuthController/ResetPassword.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sendVerificationOTP", auth, sendVerificationOTP);
router.post("/verifyAccount", auth, verifyAccount);
router.post("/isAuthenticated", auth, isAuthenticated);
router.post("/sendPasswordResetOTP", auth, sendPasswordResetOTP);
router.post("/resetPassword", auth, resetPassword);
export default router;

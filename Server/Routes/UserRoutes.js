import express from "express";
import { auth } from "../Middlewares/AuthUser.js";
import { getUserData } from "../Controllers/UserController/GetUserData.js";
const router = express.Router();

router.get("/data", auth, getUserData);

export default router;

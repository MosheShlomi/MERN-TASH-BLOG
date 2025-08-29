import express from "express";
import { google, signIn, signUp, checkSession } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);
router.get("/check", checkSession);

export default router;
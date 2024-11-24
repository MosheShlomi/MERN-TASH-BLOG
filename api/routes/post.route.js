import express from "express";
import { verifyToken } from "../utils/verifyUser";
import { create } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, create);

export default router;
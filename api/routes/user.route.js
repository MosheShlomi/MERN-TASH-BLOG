import express from "express";
import { test } from "../controllers/user.controller.js";
import { updateUser, deleteUser, signout, getUsers, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/get-users", verifyToken, getUsers);
router.get("/:userId", getUser);

export default router;
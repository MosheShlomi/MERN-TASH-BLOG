import express from "express";
import { verifyAdminToken } from "../utils/verifyUser.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/get-categories", getCategories);
router.post("/", verifyAdminToken, createCategory);
router.route("/:categoryId")
    .put(verifyAdminToken, updateCategory)
    .delete(verifyAdminToken, deleteCategory);

export default router;
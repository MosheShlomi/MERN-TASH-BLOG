import express from "express";
import { createComment, getPostComments, likeComment, updateComment,deleteComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/get-post-comments/:postId", getPostComments);
router.put("/like-comment/:commentId", verifyToken, likeComment);
router.put("/update-comment/:commentId", verifyToken, updateComment);
router.delete("/delete-comment/:commentId", verifyToken, deleteComment);

export default router;
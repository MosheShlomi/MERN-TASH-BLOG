import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts, getDraftPosts, deletePost, updatePost, likePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/get-posts", getPosts);
router.get("/get-draft-posts", verifyToken, getDraftPosts);
router.put("/like-post/:postId", verifyToken, likePost);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost);
router.put("/update-post/:postId/:userId", verifyToken, updatePost);

export default router;
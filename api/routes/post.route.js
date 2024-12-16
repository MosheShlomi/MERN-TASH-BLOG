import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts, getDraftPosts, deletePost, updatePost, likePost, updatePostStatus, getPostsForDashboard, getPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/get-posts", getPosts);
router.get("/get-post/:postId", verifyToken, getPost);
router.get("/get-draft-posts", verifyToken, getDraftPosts);
router.get("/get-dash-posts", verifyToken, getPostsForDashboard);
router.put("/like-post/:postId", verifyToken, likePost);
router.delete("/delete-post/:postId", verifyToken, deletePost);
router.put("/update-post/:postId", verifyToken, updatePost);
router.put("/change-status/:postId", verifyToken, updatePostStatus);

export default router;
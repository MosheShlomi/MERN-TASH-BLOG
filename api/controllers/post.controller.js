import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    // if (!req.user.isAdmin) {
    //     return next(errorHandler(403, "You are not allowed to create a post."));
    // }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(403, "Please provide all required fields."));
    }
    const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-\u0590-\u05FF]/g, "");

    const newPost = new Post({
        ...req.body, slug, userId: req.user.id,
        category: req.body.category || undefined,
        status: req.user.isAdmin ? "published" : "pending",
        approvedBy: req.user.isAdmin ? req.user.id : null
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
            ...((req.query.status && req.query.status === "all") ? {} : { status: "published" })
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts, totalPosts, lastMonthPosts
        });


    } catch (error) {
        next(error);
    }
};

export const getDraftPosts = async (req, res, next) => {
    try {
        const { isAdmin } = req.user;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;

        console.log(isAdmin, req.query.userId);

        let filters = {};

        if (!isAdmin) {
            filters = {
                status: { $in: ["pending", "published", "rejected"] },
                userId: req.query.userId,
            };
        } else {
            filters = {
                status: { $in: ["pending", "rejected"] },
            };
        }

        const posts = await Post.find(filters)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments(filters);

        res.status(200).json({
            posts,
            totalPosts,
        });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this post."));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("The post has been deleted.");
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, "Post not found."));
        }

        if (!req.user.isAdmin && req.user.id !== post.userId) {
            return next(errorHandler(403, "You are not allowed to update this post."));
        }

        const updateFields = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
        };

        if (req.user.isAdmin) {
            if (req.body.status) updateFields.status = req.body.status;
            if (req.body.status === "published") {
                updateFields.approvedBy = req.user.id;
            } else if (req.body.status === "pending" || req.body.status === "rejected") {
                updateFields.approvedBy = null;
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: updateFields,
        }, { new: true });

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, "Post not found"));
        }

        const userIndex = post.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            post.likes.push(req.user.id);
            post.numberOfLikes += 1;
        } else {
            post.likes.splice(userIndex, 1);
            post.numberOfLikes -= 1;
        }
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};
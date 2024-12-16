import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

//new code !!!!
//
//
//
//
const parsePagination = (query) => ({
    startIndex: parseInt(query.startIndex) || 0,
    limit: parseInt(query.limit) || 9,
    sortDirection: query.order === "asc" ? 1 : -1,
});

const generateSlug = (title) => title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-\u0590-\u05FF]/g, "");

//done
export const create = async (req, res, next) => {
    const { title, content, category } = req.body;
    const { isAdmin, id: userId } = req.user;

    if (!title || !content) {
        return next(errorHandler(400, "אנא מלא את כל השדות הנדרשים."));
    }

    const slug = generateSlug(title);

    const newPost = new Post({
        title,
        content,
        slug,
        userId,
        category: category || undefined,
        status: isAdmin ? "published" : "pending",
        approvedBy: isAdmin ? userId : null,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

const buildPostFilters = (query) => ({
    ...(query.userId && { userId: query.userId }),
    ...(query.category && { category: query.category }),
    ...(query.slug && { slug: query.slug }),
    ...(query.postId && { _id: query.postId }),
    ...(query.searchTerm && {
        $or: [
            { title: { $regex: query.searchTerm, $options: "i" } },
            { content: { $regex: query.searchTerm, $options: "i" } },
        ],
    }),
    ...({ status: "published" }),
    // ...(query.status === "all" ? {} : { status: "published" }),
    // ...(user.isAdmin ? {} : { userId: user.id }),
});

export const getPosts = async (req, res, next) => {
    try {
        const { startIndex, limit, sortDirection } = parsePagination(req.query);
        const filters = buildPostFilters(req.query);

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthFilters = {
            ...filters,
            createdAt: { $gte: oneMonthAgo },
        };

        const [posts, totalPosts, lastMonthPosts] = await Promise.all([
            Post.find(filters).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit),
            Post.countDocuments(filters),
            Post.countDocuments(lastMonthFilters),
        ]);

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        next(error);
    }
};

export const getPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { id, isAdmin } = req.user;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "פוסט לא נמצא." });
        }

        if (post.userId !== id && !isAdmin) {
            return res.status(403).json({ message: "אינך רשאי לגשת לכאן." });
        }

        res.status(200).json({ post });
    } catch (error) {
        next(error);
    }
};


export const deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { id, isAdmin } = req.user;

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({ message: "פוסט לא נמצא." });
    }

    if (post.userId !== id && !isAdmin) {
        return res.status(403).json({ message: "אינך רשאי למחוק את הפוסט הזה." });
    }

    try {
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "הפוסט נמחק." });
    } catch (error) {
        next(error);
    }
};

export const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return next(errorHandler(404, "פוסט לא נמצא."));

        const userIndex = post.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            post.likes.push(req.user.id);
            post.numberOfLikes++;
        } else {
            post.likes.splice(userIndex, 1);
            post.numberOfLikes--;
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};


export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const { id: userId, isAdmin } = req.user;
        const updateData = req.body;

        // Fetch the post
        const post = await Post.findById(postId);
        if (!post) {
            return next(errorHandler(404, "פוסט לא נמצא."));
        }

        const isOwner = userId === post.userId;
        if (!isAdmin && !isOwner) {
            return next(errorHandler(403, "אינך רשאי לעדכן את הפוסט הזה."));
        }

        const updateFields = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
            slug: req.body.title
                ? generateSlug(req.body.title)
                : post.slug,
        };

        // Handle non-admin updates (draft mode)
        if (!isAdmin && post.status === "published") {
            await Post.findByIdAndUpdate(
                postId, { $set: { draftVersion: updateFields, updateStatus: "pending" }, },
                { new: true }
            );
            return res.status(200).json({
                message: "השינויים נשמרו בטיוטה וממתינים לאישור מנהל המערכת.",
            });
        }

        // Handle admin-specific updates
        if (isAdmin) {
            if (updateData.status) {
                updateFields.status = updateData.status;
            }

            if (updateData.status === "published") {
                if (updateData.applyDraft && updateData.draftVersion) {

                    updateFields.title = req.body.draftVersion.title || post.title;
                    updateFields.content = req.body.draftVersion.content || post.content;
                    updateFields.category = req.body.draftVersion.category || post.category;
                    updateFields.image = req.body.draftVersion.image || post.image;
                    updateFields.slug = req.body.draftVersion.slug || post.slug;

                    updateFields.draftVersion = null;
                    updateFields.updateStatus = "accepted";
                } else {
                    updateFields.draftVersion = post.draftVersion;
                }
                updateFields.approvedBy = userId;
            } else {
                updateFields.approvedBy = null;
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $set: updateFields,
        }, { new: true });

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const updatePostStatus = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "אינך רשאי לעדכן את הפוסט הזה."));
    }

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, "פוסט לא נמצא"));
        }

        const newStatus = req.body.status;
        post.status = newStatus;

        if (newStatus === "published") {
            post.approvedBy = req.user.id;
        }
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};


export const getPostsForDashboard = async (req, res, next) => {
    try {
        const { startIndex, limit, sortDirection } = parsePagination(req.query);
        const { isAdmin, id } = req.user;

        let filters = {};

        if (!isAdmin) {
            filters = {
                status: { $in: ["pending", "published", "rejected"] },
                userId: id,
            };
        } else {
            filters = {
                $or: [
                    { status: { $in: ["published",] } },
                ],
            };
        }

        const posts = await Post.find(filters)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};


export const getDraftPosts = async (req, res, next) => {
    try {
        const { startIndex, limit, sortDirection } = parsePagination(req.query);
        const { isAdmin } = req.user;

        if (!isAdmin) {
            return next(errorHandler(403, "אינך רשאי לגשת לכאן."));
        }

        let filters = {
            $or: [
                { status: { $in: ["pending", "rejected"] } },
                { "draftVersion.title": { $exists: true, $ne: null } },
            ],
        };

        const posts = await Post.find(filters)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({ posts, });
    } catch (error) {
        next(error);
    }
};







import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.webp"
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    likes: {
        type: Array,
        default: []
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending", "published", "rejected"],
        default: "pending",
    },
    approvedBy: {
        type: String,
        default: null,
    },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import categoryRoutes from "./routes/category.route.js";
import cookieParser from "cookie-parser";
import path from 'path';
import { generateSitemap } from "./utils/sitemapGenerator.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Mongodb is connected!");
    })
    .catch((err) => console.log(err));

const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/category", categoryRoutes);
app.get('/api/generate-sitemap', async (req, res) => {
    try {
        const success = await generateSitemap();
        if (success) {
            res.status(200).json('Sitemap generated and saved successfully!');
        } else {
            res.status(500).json('Failed to generate sitemap.');
        }
    } catch (error) {
        res.status(500).json('Error generating sitemap: ' + error.message);
    }
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, "api", 'public', 'sitemap.xml'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

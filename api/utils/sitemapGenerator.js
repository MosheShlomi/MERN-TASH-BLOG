import fs from "fs";
import path from "path";
import Post from "../models/post.model.js";

export const generateSitemap = async () => {
    const __dirname = path.resolve();

    try {
        const posts = await Post.find({ status: "published" });

        // Static pages
        const staticPages = [
            { loc: "/", priority: 1.0 },
            { loc: "/about", priority: 0.8 },
            { loc: "/sign-up", priority: 0.5 },
            { loc: "/sign-in", priority: 0.5 },
            { loc: "/contact", priority: 0.8 },
            { loc: "/posts", priority: 0.7 },
        ];

        // Dynamic pages for posts
        const dynamicPages = posts.map(post => ({
            loc: `/post/${post.slug}`,
            lastmod: post.updatedAt,
            priority: 0.6,
        }));

        // Combine static and dynamic pages
        const allUrls = [...staticPages, ...dynamicPages];

        // Generate the sitemap XML content
        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allUrls
                .map(url => `
            <url>
                <loc>https://tash-blog.com${url.loc}</loc>
                <priority>${url.priority}</priority>
                ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
            </url>
            `)
                .join('')}
        </urlset>`;

        // Define the file path where the sitemap will be saved
        const filePath = path.join(__dirname, 'api/public', 'sitemap.xml');

        // Write the sitemap XML to the public directory
        fs.writeFileSync(filePath, sitemapXML, 'utf8');

        return true;
    } catch (error) {
        console.error('Error generating sitemap:', error.message);
        return false;
    }
};

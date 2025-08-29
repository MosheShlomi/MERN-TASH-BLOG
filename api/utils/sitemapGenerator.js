import fs from "fs";
import path from "path";
import Post from "../models/post.model.js";

export const generateSitemap = async () => {
    const __dirname = path.resolve();

    try {
        const posts = await Post.find({ status: "published" });

        // Static pages
        const staticPages = [
            { loc: "/", priority: 1.0, changefreq: "daily" },
            { loc: "/posts", priority: 0.8, changefreq: "daily" },
            { loc: "/about", priority: 0.6, changefreq: "monthly" },
            { loc: "/contact", priority: 0.6, changefreq: "monthly" },
            { loc: "/sign-up", priority: 0.3, changefreq: "yearly" },
            { loc: "/sign-in", priority: 0.3, changefreq: "yearly" },
        ];

        // Dynamic pages for posts
        const dynamicPages = posts.map((post) => ({
            loc: `/post/${post.slug}`,
            lastmod: post.updatedAt ? post.updatedAt.toISOString() : undefined,
            priority: 0.8,
            changefreq: "weekly",
        }));

        // Combine static and dynamic pages
        const allUrls = [...staticPages, ...dynamicPages];

        // Generate the sitemap XML content
        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
                .map(
                    (url) => `
  <url>
    <loc>https://tash-blog.com${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
                )
                .join("")}
</urlset>`;

        // Define the file path where the sitemap will be saved
        const filePath = path.join(__dirname, "api/public", "sitemap.xml");

        // Write the sitemap XML to the public directory
        fs.writeFileSync(filePath, sitemapXML.trim(), "utf8");

        return true;
    } catch (error) {
        console.error("Error generating sitemap:", error.message);
        return false;
    }
};

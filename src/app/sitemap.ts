import type { MetadataRoute } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC"
  );

  const postEntries: MetadataRoute.Sitemap = rows.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...postEntries,
  ];
}

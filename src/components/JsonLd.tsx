import { Post } from "@/types";

interface JsonLdProps {
  post: Post;
}

export default function JsonLd({ post }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "부놈의 경매이야기";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || "",
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "부놈",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    url: `${siteUrl}/posts/${post.slug}`,
    ...(post.thumbnail_url && { image: post.thumbnail_url }),
    keywords: post.keywords || "",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

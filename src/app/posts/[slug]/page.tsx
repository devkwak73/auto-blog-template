import { notFound } from "next/navigation";
import type { Metadata } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Post } from "@/types";
import JsonLd from "@/components/JsonLd";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";

// ISR: 1시간마다 재생성
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string): Promise<Post | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM posts WHERE slug = ? AND status = 'published'",
    [slug]
  );
  return (rows[0] as Post) || null;
}

async function getLikeCount(postId: number): Promise<number> {
  const [[row]] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
    [postId]
  );
  return row?.count || 0;
}

export async function generateStaticParams() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT slug FROM posts WHERE status = 'published'"
  );
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.meta_description || post.title,
    keywords: post.keywords || undefined,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.title,
      url: `${siteUrl}/posts/${post.slug}`,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      ...(post.thumbnail_url && { images: [{ url: post.thumbnail_url }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description || post.title,
      ...(post.thumbnail_url && { images: [post.thumbnail_url] }),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // 조회수 증가 (서버 컴포넌트에서 직접 처리)
  await pool.query("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [post.id]);

  const likeCount = await getLikeCount(post.id);

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const categoryLabels: Record<string, string> = {
    general: "일반",
    auction: "경매",
    ai: "AI 도구",
    invest: "투자",
    law: "법률",
  };

  return (
    <>
      <JsonLd post={post} />
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
              경매AI블로그
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 글 헤더 */}
          <article className="bg-white rounded-xl shadow-sm p-6 md:p-10 mb-8">
            <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {categoryLabels[post.category] || post.category}
              </span>
              {publishedDate && <span>{publishedDate}</span>}
              <span>조회 {post.view_count.toLocaleString()}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {post.thumbnail_url && (
              <div className="mb-6 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {/* 글 본문 */}
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* 좋아요 & 공유 */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
              <LikeButton postId={post.id} initialCount={likeCount} />
              <ShareButton title={post.title} />
            </div>
          </article>

          {/* 댓글 섹션 */}
          <CommentSection postId={post.id} />
        </main>
      </div>
    </>
  );
}

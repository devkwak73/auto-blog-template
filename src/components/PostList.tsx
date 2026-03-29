import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";

interface PostListProps {
  posts: Partial<Post>[];
}

const categoryLabels: Record<string, string> = {
  before: "입찰준비",
  bidding: "입찰·낙찰",
  after: "명도·출구",
  tax: "세금·대출",
  law: "권리분석",
  ai: "AI활용",
};

const categoryColors: Record<string, string> = {
  before: "bg-sky-100 text-sky-700",
  bidding: "bg-orange-100 text-orange-700",
  after: "bg-teal-100 text-teal-700",
  tax: "bg-green-100 text-green-700",
  law: "bg-purple-100 text-purple-700",
  ai: "bg-blue-100 text-blue-700",
};

function getLevelBadge(slug?: string): { label: string; color: string } | null {
  if (!slug) return null;
  if (slug.startsWith("basic-")) return { label: "기초", color: "bg-emerald-100 text-emerald-700" };
  if (slug.startsWith("mid-")) return { label: "중급", color: "bg-amber-100 text-amber-700" };
  if (slug.startsWith("adv-")) return { label: "고급", color: "bg-red-100 text-red-700" };
  return null;
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">아직 게시된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post, index) => {
        const category = post.category || "before";
        const colorClass = categoryColors[category] || "bg-gray-100 text-gray-600";
        const labelText = categoryLabels[category] || category;
        const level = getLevelBadge(post.slug);
        const publishedDate = post.published_at
          ? new Date(post.published_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";

        return (
          <article
            key={post.id}
            className={`bg-white px-6 py-10 md:px-10 md:py-12 ${
              index !== 0 ? "border-t border-gray-200" : ""
            }`}
          >
            {/* 메타 정보 */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                {labelText}
              </span>
              {level && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${level.color}`}>
                  {level.label}
                </span>
              )}
              {publishedDate && <span>{publishedDate}</span>}
              <span>조회 {(post.view_count || 0).toLocaleString()}</span>
            </div>

            {/* 제목 */}
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-4 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>

            {/* 썸네일 */}
            {post.thumbnail_url && (
              <div className="relative w-full h-56 md:h-72 mb-6 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={post.thumbnail_url}
                  alt={post.title || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* 본문 (HTML 렌더링) */}
            {post.content && (
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* 글 하단 */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={`/posts/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                댓글 · 좋아요 보기 →
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

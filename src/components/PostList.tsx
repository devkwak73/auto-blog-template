import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";

interface PostListProps {
  posts: Partial<Post>[];
}

const categoryLabels: Record<string, string> = {
  general: "일반",
  auction: "경매",
  ai: "AI 도구",
  invest: "투자",
  law: "법률",
};

const categoryColors: Record<string, string> = {
  general: "bg-gray-100 text-gray-600",
  auction: "bg-orange-100 text-orange-700",
  ai: "bg-blue-100 text-blue-700",
  invest: "bg-green-100 text-green-700",
  law: "bg-purple-100 text-purple-700",
};

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
        const category = post.category || "general";
        const colorClass = categoryColors[category] || categoryColors.general;
        const labelText = categoryLabels[category] || category;
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
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                {labelText}
              </span>
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

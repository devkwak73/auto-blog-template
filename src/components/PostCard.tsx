import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";

interface PostCardProps {
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

export default function PostCard({ posts }: PostCardProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">아직 게시된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post) => {
        const category = post.category || "general";
        const colorClass = categoryColors[category] || categoryColors.general;
        const labelText = categoryLabels[category] || category;
        const publishedDate = post.published_at
          ? new Date(post.published_at).toLocaleDateString("ko-KR")
          : "";

        return (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
          >
            {post.thumbnail_url ? (
              <div className="relative w-full h-44 bg-gray-100">
                <Image
                  src={post.thumbnail_url}
                  alt={post.title || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <span className="text-3xl">📰</span>
              </div>
            )}

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                  {labelText}
                </span>
              </div>
              <h2 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 flex-1">
                {post.title}
              </h2>
              {post.meta_description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {post.meta_description}
                </p>
              )}
              <div className="flex justify-between text-xs text-gray-400 mt-auto">
                {publishedDate && <span>{publishedDate}</span>}
                <span>조회 {(post.view_count || 0).toLocaleString()}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

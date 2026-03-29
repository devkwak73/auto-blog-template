import { Suspense } from "react";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import PostList from "@/components/PostList";
import PostCard from "@/components/PostCard";
import ViewToggle from "@/components/ViewToggle";
import Pagination from "@/components/Pagination";

const LIMIT = 10;

const categoryLabels: Record<string, string> = {
  general: "일반",
  auction: "경매",
  ai: "AI 도구",
  invest: "투자",
  law: "법률",
};

type SearchParams = Promise<{
  view?: string;
  page?: string;
  category?: string;
}>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { view = "list", page = "1", category } = await searchParams;

  const currentView = view === "card" ? "card" : "list";
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * LIMIT;

  const whereCategory = category ? " AND category = ?" : "";
  const queryParams: (string | number)[] = category
    ? [category, LIMIT, offset]
    : [LIMIT, offset];
  const countParams: string[] = category ? [category] : [];

  const [[{ total }]] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM posts WHERE status = 'published'${whereCategory}`,
    countParams
  );

  const [posts] = await pool.query<RowDataPacket[]>(
    `SELECT id, title, slug, category, thumbnail_url, meta_description, content, published_at, view_count
     FROM posts WHERE status = 'published'${whereCategory}
     ORDER BY published_at DESC LIMIT ? OFFSET ?`,
    queryParams
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {process.env.NEXT_PUBLIC_SITE_NAME || "경매AI블로그"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">부동산 경매 × AI 도구 활용</p>
            </div>
          </div>
        </div>
      </header>

      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-hide">
            {([null, "auction", "ai", "invest", "law", "general"] as (string | null)[]).map((cat) => {
              const label = cat ? (categoryLabels[cat] || cat) : "전체";
              const isActive = (!cat && !category) || cat === category;
              const href = cat ? `/?view=${currentView}&category=${cat}` : `/?view=${currentView}`;
              return (
                <a
                  key={cat ?? "all"}
                  href={href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto">
        {/* 뷰 토글 + 글 수 */}
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-sm text-gray-500">
            총 <strong className="text-gray-700">{total}</strong>개의 글
          </span>
          <Suspense>
            <ViewToggle currentView={currentView} />
          </Suspense>
        </div>

        {/* 글 목록 */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6">
          {currentView === "card" ? (
            <div className="p-4">
              <PostCard posts={posts as unknown as Partial<import("@/types").Post>[]} />
            </div>
          ) : (
            <PostList posts={posts as unknown as Partial<import("@/types").Post>[]} />
          )}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          view={currentView}
          category={category}
        />
      </main>
    </div>
  );
}

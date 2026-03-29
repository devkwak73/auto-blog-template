import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  view: string;
  category?: string;
}

export default function Pagination({ currentPage, totalPages, view, category }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    params.set("view", view);
    params.set("page", String(page));
    if (category) params.set("category", category);
    return `/?${params.toString()}`;
  };

  // 최대 5개 페이지 버튼 표시
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav aria-label="페이지 네비게이션" className="flex justify-center items-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          ‹ 이전
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`px-3 py-2 text-sm rounded-lg ${
            page === currentPage
              ? "bg-blue-600 text-white font-medium"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          다음 ›
        </Link>
      )}
    </nav>
  );
}

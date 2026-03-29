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

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav aria-label="페이지 네비게이션" className="pagination" style={{ marginBottom: "0" }}>
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className="page-btn">
          ‹
        </Link>
      )}

      {startPage > 1 && (
        <>
          <Link href={buildHref(1)} className="page-btn">1</Link>
          {startPage > 2 && (
            <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", padding: "0 0.25rem" }}>…</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`page-btn${page === currentPage ? " active" : ""}`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", padding: "0 0.25rem" }}>…</span>
          )}
          <Link href={buildHref(totalPages)} className="page-btn">{totalPages}</Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className="page-btn">
          ›
        </Link>
      )}
    </nav>
  );
}

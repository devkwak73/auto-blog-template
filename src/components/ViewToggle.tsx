"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ViewToggleProps {
  currentView: string;
}

export default function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 첫 방문 시 localStorage 선호 설정 적용
  useEffect(() => {
    const urlView = searchParams.get("view");
    if (!urlView) {
      const saved = localStorage.getItem("preferred-view");
      if (saved && saved !== "list") {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", saved);
        router.replace(`/?${params.toString()}`);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchView = (view: string) => {
    localStorage.setItem("preferred-view", view);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => switchView("list")}
        aria-label="목록형"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentView === "list"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        ☰ 목록
      </button>
      <button
        onClick={() => switchView("card")}
        aria-label="카드형"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentView === "card"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        ⊞ 카드
      </button>
    </div>
  );
}

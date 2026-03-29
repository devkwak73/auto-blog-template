"use client";

import { useState } from "react";

interface LikeButtonProps {
  postId: number;
  initialCount: number;
}

export default function LikeButton({ postId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") return false;
    const likedPosts = JSON.parse(localStorage.getItem("liked-posts") || "[]") as number[];
    return likedPosts.includes(postId);
  });
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
        setLiked(data.liked);

        // localStorage 업데이트
        const likedPosts = JSON.parse(localStorage.getItem("liked-posts") || "[]") as number[];
        if (data.liked) {
          localStorage.setItem("liked-posts", JSON.stringify([...new Set([...likedPosts, postId])]));
        } else {
          localStorage.setItem("liked-posts", JSON.stringify(likedPosts.filter((id: number) => id !== postId)));
        }
      }
    } catch {
      // 무시
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${
        liked
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
      } disabled:opacity-50`}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
    >
      <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
      <span>{count.toLocaleString()}</span>
    </button>
  );
}

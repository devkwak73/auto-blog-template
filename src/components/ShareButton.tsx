"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: execCommand
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKakao = () => {
    const url = window.location.href;
    const kakaoShareUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
    window.open(kakaoShareUrl, "_blank", "width=550,height=450");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
          copied
            ? "bg-green-50 border-green-200 text-green-600"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
        }`}
        aria-label="링크 복사"
      >
        <span>{copied ? "✓" : "🔗"}</span>
        <span>{copied ? "복사됨!" : "링크 복사"}</span>
      </button>

      <button
        onClick={handleKakao}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-300 bg-yellow-50 text-yellow-700 text-sm font-medium hover:bg-yellow-100 transition-all"
        aria-label="카카오톡 공유"
        title={`${title} 공유하기`}
      >
        <span>💬</span>
        <span>카카오</span>
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => window.location.href;

  const handleCopy = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakao = () => {
    const url = `https://story.kakao.com/share?url=${encodeURIComponent(getUrl())}`;
    window.open(url, "_blank", "width=550,height=450");
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`;
    window.open(url, "_blank", "width=550,height=450");
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 1rem",
    borderRadius: "999px",
    border: "1.5px solid var(--border)",
    background: "var(--bg)",
    color: "var(--ink-muted)",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
      {/* 링크 복사 */}
      <button
        onClick={handleCopy}
        aria-label="링크 복사"
        style={{
          ...btnBase,
          ...(copied
            ? { background: "#f0fdf4", borderColor: "#86efac", color: "#16a34a" }
            : {}),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M13 7H15C16.657 7 18 8.343 18 10C18 11.657 16.657 13 15 13H13M7 13H5C3.343 13 2 11.657 2 10C2 8.343 3.343 7 5 7H7M7 10H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        {copied ? "복사됨!" : "링크 복사"}
      </button>

      {/* 카카오 공유 */}
      <button
        onClick={handleKakao}
        aria-label="카카오톡 공유"
        style={{
          ...btnBase,
          background: "#FEE500",
          borderColor: "#E6CF00",
          color: "#3C1E1E",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.74 1.63 5.16 4.1 6.66l-.9 3.37c-.06.24.21.43.42.3L9.8 18.8C10.5 18.93 11.24 19 12 19c5.523 0 10-3.477 10-8s-4.477-8-10-8z"/>
        </svg>
        카카오
      </button>

      {/* X(트위터) 공유 */}
      <button
        onClick={handleTwitter}
        aria-label="X(트위터) 공유"
        style={{
          ...btnBase,
          background: "#000",
          borderColor: "#333",
          color: "#fff",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </button>
    </div>
  );
}

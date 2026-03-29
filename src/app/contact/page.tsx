import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "문의하기",
  description: "부놈의 경매이야기 — 문의 및 연락처",
};

export default function ContactPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "부놈의 경매이야기";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* 헤더 */}
      <header style={{ background: "var(--header-bg)" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "1.5rem 1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              color: "var(--header-muted)",
              textDecoration: "none",
            }}
          >
            ← {siteName}
          </Link>
        </div>
      </header>

      {/* 본문 */}
      <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 800,
          color: "var(--ink)",
          marginBottom: "0.5rem",
          lineHeight: 1.3,
        }}>
          문의하기
        </h1>
        <p style={{
          fontSize: "0.9375rem",
          color: "var(--ink-muted)",
          marginBottom: "2.5rem",
          lineHeight: 1.7,
        }}>
          블로그 관련 질문, 광고·제휴 문의, 개인정보 처리 관련 요청 등<br />
          아래 이메일로 연락 주시면 빠르게 답변드립니다.
        </p>

        {/* 연락처 카드 */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}>

          <div style={{
            background: "var(--header-bg)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}>
            <span style={{ fontSize: "1.25rem" }}>✉️</span>
            <span style={{
              fontWeight: 700,
              color: "var(--header-text)",
              fontSize: "0.9375rem",
            }}>
              이메일 문의
            </span>
          </div>

          <div style={{ padding: "1.5rem" }}>
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "dev.kwak73@gmail.com"}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: "var(--accent)",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "dev.kwak73@gmail.com"}
            </a>
            <p style={{
              fontSize: "0.8125rem",
              color: "var(--ink-muted)",
              marginTop: "0.75rem",
              lineHeight: 1.6,
            }}>
              영업일 기준 1~3일 내 답변을 드립니다.<br />
              개인정보 관련 요청(열람·삭제·정정)도 동일 이메일로 문의 가능합니다.
            </p>
          </div>
        </div>

        {/* 문의 유형 안내 */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1rem",
          }}>
            문의 유형별 안내
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { icon: "📝", title: "콘텐츠 오류 신고", desc: "글의 내용 중 오류나 개선이 필요한 부분을 알려주세요." },
              { icon: "🤝", title: "광고·제휴 문의", desc: "배너 광고, 협업, 스폰서십 관련 문의를 받습니다." },
              { icon: "🔒", title: "개인정보 요청", desc: "수집된 개인정보의 열람·정정·삭제를 요청할 수 있습니다." },
              { icon: "💬", title: "기타 문의", desc: "블로그 운영, 경매 관련 기타 문의 사항을 보내주세요." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: "flex",
                gap: "0.875rem",
                alignItems: "flex-start",
              }}>
                <span style={{
                  fontSize: "1.125rem",
                  flexShrink: 0,
                  marginTop: "0.1rem",
                }}>
                  {icon}
                </span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--ink)", marginBottom: "0.2rem" }}>
                    {title}
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--ink-muted)", lineHeight: 1.55, margin: 0 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "0.8125rem", color: "var(--ink-faint)", textAlign: "center", lineHeight: 1.6 }}>
          개인정보처리방침은{" "}
          <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "underline" }}>
            이 페이지
          </Link>
          에서 확인하실 수 있습니다.
        </p>

      </main>
    </div>
  );
}

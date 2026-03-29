import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "블로그 소개",
  description: "부놈의 경매이야기 — 부동산 경매 전문 블로그 소개",
};

export default function AboutPage() {
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

      {/* 히어로 */}
      <div style={{ background: "var(--header-bg)", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            paddingTop: "1rem",
          }}>
            <div style={{
              width: "3px",
              height: "4rem",
              background: "var(--accent)",
              borderRadius: "2px",
              flexShrink: 0,
              marginTop: "0.25rem",
            }} />
            <div>
              <p style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "0.5rem",
              }}>
                About
              </p>
              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--header-text)",
                lineHeight: 1.25,
              }}>
                {siteName}
              </h1>
              <p style={{
                fontSize: "1rem",
                color: "var(--header-muted)",
                marginTop: "0.75rem",
                lineHeight: 1.7,
              }}>
                AI로 더 쉽게, 더 스마트하게 — 경매 기초부터 실전까지
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* 블로그 소개 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1.25rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border)",
          }}>
            블로그 소개
          </h2>
          <div className="prose">
            <p>
              <strong>부놈의 경매이야기</strong>는 부동산 경매에 관심 있는 분들을 위한 전문 블로그입니다.
              복잡하고 어렵게 느껴지는 경매 절차를 쉽고 명확하게 설명하는 것을 목표로 합니다.
            </p>
            <p>
              입찰 준비부터 낙찰 이후의 명도, 세금 처리, 권리분석까지 — 경매 전 과정에 걸친
              실용적인 정보를 제공합니다. 단순한 이론 설명에서 그치지 않고,
              실제 경매 현장에서 마주치는 상황들을 중심으로 콘텐츠를 구성합니다.
            </p>
            <p>
              또한 <strong>AI 기술</strong>을 활용해 경매 정보를 더 빠르고 효율적으로 분석하는 방법을 소개합니다.
              AI 도구를 경매에 접목하는 실전 활용 사례도 꾸준히 업데이트됩니다.
            </p>
          </div>
        </section>

        {/* 카테고리 안내 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1.5rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border)",
          }}>
            다루는 주제
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
            gap: "1rem",
          }}>
            {[
              { label: "입찰준비", color: "var(--cat-before-c)", bg: "var(--cat-before-bg)", desc: "물건 검색, 권리분석 기초, 입찰 준비 체크리스트" },
              { label: "입찰·낙찰", color: "var(--cat-bidding-c)", bg: "var(--cat-bidding-bg)", desc: "입찰가 산정, 경매 당일, 낙찰 이후 절차" },
              { label: "명도·출구", color: "var(--cat-after-c)", bg: "var(--cat-after-bg)", desc: "점유자 명도, 인도명령, 잔금 납부 이후" },
              { label: "세금·대출", color: "var(--cat-tax-c)", bg: "var(--cat-tax-bg)", desc: "취득세, 양도세, 경매 전용 대출 활용법" },
              { label: "권리분석", color: "var(--cat-law-c)", bg: "var(--cat-law-bg)", desc: "말소기준권리, 임차인 보호, 유치권 등" },
              { label: "AI활용", color: "var(--cat-ai-c)", bg: "var(--cat-ai-bg)", desc: "AI 도구를 활용한 경매 물건 분석 실전법" },
            ].map(({ label, color, bg, desc }) => (
              <div key={label} style={{
                background: "var(--bg-card)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  padding: "0.2em 0.65em",
                  borderRadius: "999px",
                  width: "fit-content",
                  color,
                  background: bg,
                }}>
                  {label}
                </span>
                <p style={{ fontSize: "0.8125rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 관련 서비스 */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "1.5rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid var(--border)",
          }}>
            함께 만든 서비스
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <a
              href="https://www.easyhelper.kr/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                background: "var(--header-bg)",
                borderRadius: "12px",
                padding: "1.5rem",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <div style={{
                width: "3rem",
                height: "3rem",
                background: "var(--accent)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}>
                🏠
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--header-text)", marginBottom: "0.25rem", fontSize: "1rem" }}>
                  경매도우미 (easyhelper.kr)
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--header-muted)", margin: 0, lineHeight: 1.5 }}>
                  AI 기반 부동산 경매 분석 웹 서비스 — 복잡한 권리분석을 AI로 간편하게
                </p>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                background: "var(--accent-faint)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              <div style={{
                width: "3rem",
                height: "3rem",
                background: "var(--accent)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}>
                📱
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "0.25rem", fontSize: "1rem" }}>
                  토닥토닥 곁에 (Android)
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.5 }}>
                  시니어 안전 지킴이 안드로이드 앱 — Google Play에서 무료 다운로드
                </p>
              </div>
            </a>

          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            문의하기 →
          </Link>
        </div>

      </main>
    </div>
  );
}

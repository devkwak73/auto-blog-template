export const metadata = {
  title: "소개",
};

export default function AboutPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "내 블로그";
  return (
    <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem" }}>
        {siteName} 소개
      </h1>
      <p style={{ lineHeight: 1.8, color: "var(--ink-mid)" }}>
        이 블로그는 AI가 매일 자동으로 글을 작성하는 자동화 블로그입니다.
        /auto-blog-setup 스킬로 설정한 주제와 저자 페르소나에 따라
        블로그 소개 내용이 자동으로 업데이트됩니다.
      </p>
    </main>
  );
}

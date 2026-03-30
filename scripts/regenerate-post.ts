/**
 * 특정 글 재생성 스크립트
 * 사용법: npx tsx scripts/regenerate-post.ts basic-002
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import mysql from "mysql2/promise";
import { allTopics, Topic } from "./topics";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "auction_blog",
  socketPath: process.env.DATABASE_SOCKET || undefined,
  charset: "utf8mb4",
});

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY가 .env.local에 설정되어 있지 않습니다.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function buildPrompt(topic: Topic): string {
  return `당신은 "부놈의 경매이야기" 블로그의 운영자 '부놈'입니다. 부동산 경매 전문 블로그 작가입니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
난이도: ${topic.level}
카테고리: ${topic.category}

[작성 규칙]
1. 중학생도 이해할 수 있는 친근하고 쉬운 말투로 작성
2. 반드시 존댓말(~요, ~습니다, ~세요)만 사용. 반말(~야, ~해, ~이야) 절대 금지
3. 블로그 운영자 '부놈'이 독자에게 따뜻하게 설명해주는 느낌으로 작성
4. 예시: "여러분, 부동산 경매라는 말 들어보셨나요?", "걱정 마세요! 오늘은 제가 알려드릴게요" 처럼 친근하지만 존댓말 유지
5. 3000자 내외 (너무 짧으면 안 됨)
6. 표(<table>)와 목록(<ul><li>)을 최대한 많이 활용
7. 숫자나 비율로 설명할 수 있는 내용은 반드시 표로 만들 것
8. 어려운 개념은 쉬운 예시로 반드시 설명
9. 글의 흐름이 자연스럽게 이어지도록 작성
10. 글 마지막에 반드시 아래 형식의 "AI 도구 활용 팁" 섹션 추가

[AI 도구 활용 팁 규칙]
- 이 주제(${topic.title})와 직접 관련된 실용적인 팁 5~8줄
- 특정 AI 도구 이름(Claude, ChatGPT, Gemini 등) 절대 언급 금지
- 반드시 "AI 도구"라고만 표기
- 실제로 복사해서 바로 쓸 수 있는 프롬프트 예시 1~2개 포함

[출력 형식 - 매우 중요]
- 순수 HTML 태그만 출력 (코드 블록, 마크다운 절대 사용 금지)
- **, ##, *, \`\`\` 같은 마크다운 기호 절대 사용 금지
- 사용 가능한 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 태그 사용 금지 (제목은 별도로 표시됨)
- 응답은 HTML 태그로 시작하고 HTML 태그로 끝날 것

[AI 도구 활용 팁 HTML 형식]
<h2>💡 AI 도구 활용 팁</h2>
<p>...</p>
<ul>
  <li>...</li>
</ul>
<blockquote>프롬프트 예시: "..."</blockquote>`;
}

function cleanHtml(raw: string): string {
  return raw
    .replace(/```html\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,6}\s+(.+)$/gm, "<p>$1</p>")
    .trim();
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("❌ slug를 인자로 전달하세요. 예: npx tsx scripts/regenerate-post.ts basic-002");
    process.exit(1);
  }

  const topic = allTopics.find((t) => t.slug === slug);
  if (!topic) {
    console.error(`❌ slug '${slug}'에 해당하는 주제를 찾을 수 없습니다.`);
    process.exit(1);
  }

  console.log(`📝 재생성 대상: [${topic.level}] ${topic.title}`);
  console.log("🤖 Gemini로 글 생성 중...");

  const prompt = buildPrompt(topic);
  const result = await model.generateContent(prompt);
  const rawContent = result.response.text();
  const content = cleanHtml(rawContent);

  console.log(`✍️  생성 완료 (${content.length}자)`);

  await pool.query(
    `UPDATE posts SET content = ?, updated_at = NOW() WHERE slug = ?`,
    [content, slug]
  );

  console.log(`💾 DB 업데이트 완료 (slug: ${slug})`);
  console.log(`🌐 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`);

  await pool.end();
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});

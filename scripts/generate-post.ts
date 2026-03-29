/**
 * 경매AI블로그 자동 글 생성 스크립트
 * 사용법: npx tsx scripts/generate-post.ts
 * 크론탭: 0 9 * * 1-5 cd /path/to/auction-blog && npx tsx scripts/generate-post.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import mysql from "mysql2/promise";
import { allTopics, Topic } from "./topics";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ── DB 연결 ──────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "auction_blog",
  socketPath: process.env.DATABASE_SOCKET || undefined,
  charset: "utf8mb4",
});

// ── Gemini 클라이언트 ─────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY가 .env.local에 설정되어 있지 않습니다.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ── 다음 발행할 주제 결정 ─────────────────────────
async function getNextTopic(): Promise<Topic | null> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug FROM posts WHERE slug REGEXP '^(basic|mid|adv)-[0-9]+$'"
  );
  const existingSlugs = new Set(rows.map((r) => r.slug));

  for (const topic of allTopics) {
    if (!existingSlugs.has(topic.slug)) {
      return topic;
    }
  }
  return null; // 모든 주제 완료
}

// ── Gemini 프롬프트 생성 ──────────────────────────
function buildPrompt(topic: Topic): string {
  return `당신은 부동산 경매 전문 블로그 작가입니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
난이도: ${topic.level}
카테고리: ${topic.category}

[작성 규칙]
1. 중학생도 이해할 수 있는 친근하고 쉬운 말투로 작성
2. 3000자 내외 (너무 짧으면 안 됨)
3. 표(<table>)와 목록(<ul><li>)을 최대한 많이 활용
4. 숫자나 비율로 설명할 수 있는 내용은 반드시 표로 만들 것
5. 어려운 개념은 쉬운 예시로 반드시 설명
6. 글의 흐름이 자연스럽게 이어지도록 작성
7. 글 마지막에 반드시 아래 형식의 "AI 도구 활용 팁" 섹션 추가

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

// ── HTML 정리: 마크다운 잔재 제거 ────────────────
function cleanHtml(raw: string): string {
  return raw
    .replace(/```html\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,6}\s+(.+)$/gm, "<p>$1</p>")
    .trim();
}

// ── DB에 글 저장 ──────────────────────────────────
async function savePost(topic: Topic, content: string): Promise<number> {
  const now = new Date();
  const publishedAt = now.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `INSERT INTO posts
      (title, content, slug, category, meta_description, keywords, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, 'published', ?)`,
    [
      topic.title,
      content,
      topic.slug,
      topic.category,
      topic.meta_description,
      topic.keywords,
      publishedAt,
    ]
  );
  return result.insertId;
}

// ── 로그 파일 기록 ────────────────────────────────
function writeLog(message: string): void {
  const logPath = path.resolve(process.cwd(), "scripts/generate.log");
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, line, "utf-8");
  console.log(message);
}

// ── 메인 실행 ─────────────────────────────────────
async function main() {
  writeLog("=== 글 자동 생성 시작 ===");

  try {
    const topic = await getNextTopic();

    if (!topic) {
      writeLog("✅ 모든 주제(130개)가 발행 완료됐습니다!");
      await pool.end();
      return;
    }

    writeLog(`📝 주제 선택: [${topic.level}] ${topic.index}/130 - ${topic.title}`);

    // Gemini로 글 생성
    writeLog("🤖 Gemini로 글 생성 중...");
    const prompt = buildPrompt(topic);

    const result = await model.generateContent(prompt);
    const rawContent = result.response.text();
    const content = cleanHtml(rawContent);

    writeLog(`✍️  생성 완료 (${content.length}자)`);

    // DB 저장
    const postId = await savePost(topic, content);
    writeLog(`💾 DB 저장 완료 (id: ${postId}, slug: ${topic.slug})`);
    writeLog(`🌐 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/posts/${topic.slug}`);
    writeLog("=== 완료 ===\n");

  } catch (error) {
    writeLog(`❌ 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

# Skill: auto-blog-setup

## 트리거
다음 중 하나일 때 이 스킬을 실행:
- `/auto-blog-setup` 명령
- "블로그 세팅해줘", "블로그 만들어줘", "auto blog setup" 요청
- "새 블로그 시작하고 싶어", "auto-blog-setup" 키워드

## 전제 조건
- Node.js 18+ 설치됨
- Git 설치 및 GitHub 계정 보유
- Claude Code (이 도구) 실행 중

---

## 실행 지침

이 스킬을 실행할 때 아래 Phase를 **순서대로** 진행한다.
각 Phase에서 사용자 답변을 변수로 저장하고, 다음 Phase에서 활용한다.
Phase 5(배포)는 선택한 스택에 따라 분기한다.

---

## Phase 1: 인터뷰 — 블로그 기본 정보

다음 질문을 **하나씩 순서대로** 묻는다. 한꺼번에 묻지 않는다.

```
[질문 1/5] 어떤 주제의 블로그를 만들고 싶으신가요?
예시: 부동산 경매, 건강/헬스, 요리 레시피, 재테크/투자,
      여행, IT/프로그래밍, 뷰티, 육아, 반려동물, 패션 등
```

```
[질문 2/5] 블로그 이름은 무엇으로 할까요?
예시: "부놈의 경매이야기", "건강한 하루하루", "코딩하는 토끼"
```

```
[질문 3/5] 글을 쓰는 저자(필명/캐릭터)는 누구인가요?
예시: "부놈 — 10년차 경매 전문가", "헬시토끼 — 영양사 출신 건강 블로거"
(블로그 글의 톤과 AI 프롬프트에 활용됩니다)
```

```
[질문 4/5] 타겟 독자는 누구이고, 독자가 블로그에서 얻고 싶은 것은 무엇인가요?
예시: "30~50대 직장인, 재테크와 경매로 내 집 마련을 원하는 분들"
```

```
[질문 5/5] 블로그 글은 어떤 언어로 작성할까요?
① 한국어  ② 영어  ③ 기타 (직접 입력)
```

→ 답변 저장: NICHE, SITE_NAME, AUTHOR_PERSONA, TARGET_AUDIENCE, LANGUAGE

---

## Phase 2: LLM 선택

```
어떤 AI 모델로 블로그 글을 자동 생성할까요?

① Gemini 2.5 Flash  — 무료 (1,500회/일), 한국어 우수, 추천
② GPT-4o mini       — 유료 ($0.15/1M tokens), 영어 블로그에 강점
③ Claude Haiku      — 유료 ($0.25/1M tokens), 균형잡힌 성능

선택 (1~3):
```

→ 답변 저장: LLM_CHOICE

**LLM별 필요 API 키:**
- ① → `GEMINI_API_KEY` (발급: https://aistudio.google.com/app/apikey)
- ② → `OPENAI_API_KEY` (발급: https://platform.openai.com/api-keys)
- ③ → `ANTHROPIC_API_KEY` (발급: https://console.anthropic.com/settings/keys)

---

## Phase 3: 이미지 방식 선택

```
블로그 이미지를 어떻게 가져올까요?

① Unsplash API  — 무료 검색 이미지 (50회/시간), 추천
② Pexels API    — 무료 검색 이미지 (무제한), 다양한 사진
③ DALL-E 3      — AI가 직접 이미지 생성 (OpenAI 유료, ~$0.04/장)
④ 이미지 없음   — 텍스트만으로 블로그 운영

선택 (1~4):
```

→ 답변 저장: IMAGE_CHOICE

**이미지별 필요 API 키:**
- ① → `UNSPLASH_ACCESS_KEY` (발급: https://unsplash.com/developers → New Application)
- ② → `PEXELS_API_KEY` (발급: https://www.pexels.com/api/)
- ③ → `OPENAI_API_KEY` (LLM에서 이미 선택했다면 동일 키 사용)
- ④ → 없음

---

## Phase 4: 배포 환경 선택

```
어떤 환경에 블로그를 배포할까요?

① Vercel + Neon      — 완전 무료, 빠른 시작, PostgreSQL DB
② Vercel + Supabase  — 완전 무료, PostgreSQL + 추가 기능
③ Railway            — 무료 크레딧 $5/월, MySQL 또는 PostgreSQL 선택
④ VPS (클라우드 서버) — 유료, 완전한 자유도 (현재 블로그 방식)

💡 처음이라면 ①번 Vercel + Neon을 추천드립니다.

선택 (1~4):
```

→ 답변 저장: DEPLOY_STACK

**배포 스택별 추가 질문:**

Stack ① 또는 ②:
```
GitHub 유저명을 알려주세요 (fork에 사용됩니다):
도메인이 있다면 입력해주세요 (없으면 Enter — Vercel 기본 도메인 사용):
```

Stack ③:
```
GitHub 유저명을 알려주세요:
Railway에서 MySQL과 PostgreSQL 중 어떤 DB를 사용할까요? (1: MySQL / 2: PostgreSQL):
도메인이 있다면 입력해주세요 (없으면 Enter):
```

Stack ④:
```
GitHub 유저명을 알려주세요:
서버 IP 주소:
SSH 접속 유저명 (보통 root 또는 ubuntu):
PEM 파일 경로 (예: ~/.ssh/myserver.pem):
도메인 주소 (예: blog.mysite.com):
SSL 인증서용 이메일:
```

→ 추가 저장: GITHUB_USER, DOMAIN, SERVER_IP, SSH_USER, PEM_PATH, EMAIL (스택별로)

---

## Phase 5: 디자인 템플릿 선택

```
블로그 디자인 테마를 선택하세요:

① Warm Editorial   — 크림+딥레드, 신뢰감 있는 전문가 스타일
                     추천: 부동산, 법률, 금융, 경매
② Forest Green     — 민트그린+화이트, 청량하고 건강한 스타일
                     추천: 건강, 음식, 자연, 피트니스
③ Deep Ocean       — 네이비+블루, 깔끔한 테크 스타일
                     추천: IT, 프로그래밍, SaaS, 데이터
④ Lavender Studio  — 라벤더+화이트, 감성적인 라이프스타일
                     추천: 여행, 뷰티, 패션, 창작
⑤ Amber Minimal    — 앰버+크림, 단정한 비즈니스 스타일
                     추천: 재테크, 비즈니스, 생산성

선택 (1~5):
```

→ 답변 저장: THEME_CHOICE

---

## Phase 6: API 키 수집

수집된 선택을 기반으로 필요한 API 키를 안내한다.

```
이제 필요한 API 키를 발급받겠습니다.
아래 키들이 필요합니다. 발급 링크를 안내해드릴게요.
```

**LLM API 키:**

[Gemini 선택 시]
```
■ Google Gemini API 키 발급 방법:
  1. https://aistudio.google.com/app/apikey 접속
  2. Google 계정으로 로그인
  3. "Create API key" 클릭 → "Create API key in new project" 선택
  4. 생성된 키(AIza...로 시작)를 복사

무료 한도: 15회/분, 1,500회/일 (블로그 자동화에 충분)

GEMINI_API_KEY=
```

[GPT-4o mini 선택 시]
```
■ OpenAI API 키 발급 방법:
  1. https://platform.openai.com/api-keys 접속
  2. "Create new secret key" 클릭
  3. 이름 입력 후 생성, sk-...로 시작하는 키 복사
  (주의: 한 번만 표시되므로 반드시 저장)

OPENAI_API_KEY=
```

[Claude Haiku 선택 시]
```
■ Anthropic API 키 발급 방법:
  1. https://console.anthropic.com/settings/keys 접속
  2. "Create Key" 클릭
  3. sk-ant-...로 시작하는 키 복사

ANTHROPIC_API_KEY=
```

**이미지 API 키:**

[Unsplash 선택 시]
```
■ Unsplash API 키 발급 방법:
  1. https://unsplash.com/developers 접속
  2. "Your apps" → "New Application" 클릭
  3. 약관 동의 후 앱 이름/설명 입력 (블로그 이름 사용)
  4. "Access Key" 복사 (Secret Key 아님)

무료 한도: 50회/시간 (충분)

UNSPLASH_ACCESS_KEY=
```

[Pexels 선택 시]
```
■ Pexels API 키 발급 방법:
  1. https://www.pexels.com/api/ 접속
  2. "Your API Key" 버튼 클릭 → 계정 생성
  3. API 키 복사 (무제한 무료)

PEXELS_API_KEY=
```

**댓글 스팸 방지 (hCaptcha — 모든 스택 필수):**
```
■ hCaptcha 키 발급 방법:
  1. https://www.hcaptcha.com 접속
  2. "Sign Up" → 계정 생성
  3. "New Site" 추가 → 도메인 입력
  4. Site Key와 Secret Key 복사

NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET_KEY=
```

**Google Analytics (선택):**
```
■ Google Analytics 4 발급 방법:
  1. https://analytics.google.com 접속
  2. "관리" → "계정 만들기"
  3. 속성 생성 → "웹" 플랫폼 선택
  4. 측정 ID (G-XXXXXXXXXX) 복사

NEXT_PUBLIC_GA_ID=    (선택 — Enter로 건너뛸 수 있음)
```

모든 키 입력이 완료되면 Phase 7로 진행.

---

## Phase 7: 코드 자동 커스터마이징

수집된 모든 정보를 바탕으로 다음 파일들을 자동 수정한다.

### 7-1. GitHub fork 안내

```
이제 베이스 레포지토리를 fork하겠습니다.

1. 브라우저에서 https://github.com/devkwak73/auction-blog 접속
2. 우측 상단 "Fork" 버튼 클릭
3. Repository name을 "{niche}-blog" 형태로 변경
   (예: health-blog, cooking-blog, finance-blog)
4. "Create fork" 클릭
5. fork된 repo를 로컬에 clone:
   git clone https://github.com/{GITHUB_USER}/{REPO_NAME}.git
   cd {REPO_NAME}

완료되면 Enter를 눌러주세요.
```

### 7-2. DB 이름 결정

SITE_NAME의 영문 슬러그를 기반으로 DB 이름을 자동 결정한다.
- 규칙: 영소문자, 숫자, 언더스코어만 허용, 최대 50자
- 예: "건강블로그" → `health_blog`, "부놈의 경매이야기" → `auction_blog`

### 7-3. topics.ts 완전 재생성

Claude가 인터뷰 정보를 바탕으로 130개 토픽을 생성한다.

**생성 규칙:**
- 기초편 43개 (slug: basic-001 ~ basic-043)
- 중급편 43개 (slug: mid-001 ~ mid-043)
- 고급편 44개 (slug: adv-001 ~ adv-044)
- 카테고리 6개 필수 사용: `before`, `bidding`, `after`, `tax`, `law`, `ai`
  - 각 카테고리를 NICHE에 맞게 의미 재정의
  - 예(건강 블로그): before=예방/준비, bidding=운동/실천, after=회복/관리, tax=영양/식단, law=의학정보, ai=AI건강도구
- 각 토픽: index, slug, level, category, title, keywords, meta_description 포함

**topics.ts 파일 형식 (유지):**
```typescript
export interface Topic {
  index: number;
  slug: string;
  level: "기초편" | "중급편" | "고급편";
  category: "before" | "bidding" | "after" | "tax" | "law" | "ai";
  title: string;
  keywords: string;
  meta_description: string;
}

export const allTopics: Topic[] = [
  // 130개 토픽 생성
];
```

**검증 (생성 후 자동 확인):**
- [ ] 총 130개 토픽
- [ ] 3레벨 모두 존재 (기초/중급/고급)
- [ ] 6카테고리 모두 사용
- [ ] slug 중복 없음 (basic-001~043, mid-001~043, adv-001~044)

### 7-4. generate-post.ts 수정

**수정 블록 1 — LLM 클라이언트 (파일 상단 import + 초기화):**

[Gemini 선택 시 — 기존 코드 유지]
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
// ... (기존 코드 그대로)
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

[GPT-4o mini 선택 시]
```typescript
import OpenAI from "openai";
// mysql, topics, dotenv import는 그대로 유지
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { console.error("❌ OPENAI_API_KEY가 .env.local에 없습니다."); process.exit(1); }
const openai = new OpenAI({ apiKey });
```

[Claude Haiku 선택 시]
```typescript
import Anthropic from "@anthropic-ai/sdk";
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) { console.error("❌ ANTHROPIC_API_KEY가 .env.local에 없습니다."); process.exit(1); }
const anthropic = new Anthropic({ apiKey });
```

**수정 블록 2 — AI 콘텐츠 생성 호출 (main() 내부):**

[Gemini]
```typescript
const result = await model.generateContent(prompt);
const rawContent = result.response.text();
```

[GPT-4o mini]
```typescript
const resp = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 4000,
});
const rawContent = resp.choices[0].message.content!;
```

[Claude Haiku]
```typescript
const msg = await anthropic.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 4000,
  messages: [{ role: "user", content: prompt }],
});
const rawContent = (msg.content[0] as { text: string }).text;
```

**수정 블록 3 — CATEGORY_QUERY 맵 (Unsplash/Pexels 선택 시):**

NICHE에 맞는 카테고리별 검색어로 교체. 예시(건강 블로그):
```typescript
const CATEGORY_QUERY: Record<string, string> = {
  before:  "healthy lifestyle prevention people",
  bidding: "exercise workout fitness people",
  after:   "recovery rest wellness people",
  tax:     "nutrition food healthy eating people",
  law:     "doctor medical consultation people",
  ai:      "technology health app people",
};
```

**수정 블록 4 — 이미지 fetch 함수:**

[Pexels 선택 시 — fetchUnsplashImages를 fetchPexelsImages로 교체]
```typescript
async function fetchPexelsImages(category: string, count: number, usedIds: Set<string> = new Set()): Promise<UnsplashResult[]> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) { writeLog("⚠️  PEXELS_API_KEY 미설정"); return []; }
  const query = CATEGORY_QUERY[category] ?? "lifestyle people";
  try {
    const results: UnsplashResult[] = [];
    let page = 1;
    while (results.length < count && page <= 3) {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&page=${page}&orientation=landscape`;
      const res = await fetch(url, { headers: { Authorization: pexelsKey } });
      if (!res.ok) break;
      const data = await res.json() as { photos: Array<{ id: number; src: { large2x: string }; photographer: string; url: string }> };
      if (!data.photos?.length) break;
      for (const photo of data.photos) {
        const baseUrl = photo.src.large2x.split("?")[0];
        if (usedIds.has(baseUrl)) continue;
        usedIds.add(baseUrl);
        results.push({
          url: photo.src.large2x,
          attribution: `<a href="${photo.url}" rel="noopener noreferrer" style="color:rgba(255,255,255,0.9);">${photo.photographer}</a> / Pexels`,
        });
        if (results.length >= count) break;
      }
      page++;
    }
    return results;
  } catch (err) {
    writeLog(`⚠️  Pexels fetch 실패: ${err}`);
    return [];
  }
}
```

[DALL-E 3 선택 시 — 이미지 생성 함수로 교체]
```typescript
async function generateDalleImages(topic: Topic, count: number): Promise<UnsplashResult[]> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return [];
  const openai = new OpenAI({ apiKey: openaiKey });
  const results: UnsplashResult[] = [];
  const prompt = `${topic.title} 관련 블로그 썸네일 이미지. 깔끔하고 전문적인 느낌. 텍스트 없음.`;
  for (let i = 0; i < count; i++) {
    try {
      const resp = await openai.images.generate({ model: "dall-e-3", prompt, n: 1, size: "1792x1024" });
      const url = resp.data[0]?.url;
      if (url) results.push({ url, attribution: "AI Generated / DALL-E 3" });
    } catch { break; }
  }
  return results;
}
```

[이미지 없음 선택 시 — 이미지 관련 코드 모두 제거, thumbnail=null, 인라인 삽입 스킵]

**수정 블록 5 — buildPrompt() 함수 (NICHE 맞춤 재작성):**

아래 템플릿을 SITE_NAME, AUTHOR_PERSONA, TARGET_AUDIENCE, LANGUAGE, NICHE 값으로 채워 교체한다:

```typescript
function buildPrompt(topic: Topic): string {
  return `당신은 "${SITE_NAME}" 블로그의 운영자 '${AUTHOR_PERSONA}'입니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
난이도: ${topic.level}
카테고리: ${topic.category}

[작성 규칙]
1. 타겟 독자: ${TARGET_AUDIENCE}
2. 누구나 이해할 수 있는 쉽고 친근한 말투로 작성
3. 반드시 존댓말만 사용. 반말 절대 금지
4. "여러분", "독자님", "친구" 등 독자를 직접 부르는 호칭 절대 사용 금지
5. 글의 첫 문장은 반드시 강한 후킹으로 시작
   (의문형·충격적 사실·공감 유발 문장 중 하나)
   나쁜 예: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다" 금지
6. 3000자 내외
7. 표와 목록을 최대한 활용
8. 숫자로 설명 가능한 내용은 반드시 표로 제시
9. 글 마지막에 "💡 AI 도구 활용 팁" 섹션 필수 포함
   (AI 도구명 언급 금지, "AI 도구"라고만 표기, 실용 프롬프트 예시 1~2개)

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지

[AI 도구 활용 팁 HTML 형식]
<h2>💡 AI 도구 활용 팁</h2>
<p>...</p>
<ul><li>...</li></ul>
<blockquote>프롬프트 예시: "..."</blockquote>`;
}
```

[영어 블로그 선택 시 — 위 프롬프트를 영어로 변경]

**수정 블록 6 — DB 기본값:**
- `database: process.env.DATABASE_NAME || "{DB_NAME}"` (auction_blog → 유도된 DB 이름으로)

### 7-5. src/app/globals.css 디자인 교체

파일의 lines 1-35 (font import + `:root` 블록)을 선택한 테마로 교체한다.
아래 `@theme inline` 블록의 `--font-serif`도 함께 교체한다.

**테마 ① Warm Editorial (기존 유지 — 수정 없음)**

**테마 ② Forest Green:**
```css
@import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap");
@import "tailwindcss";

/* ── Design Tokens ──────────────────────────────── */
:root {
  --bg:           #f4f7f4;
  --bg-card:      #ffffff;
  --ink:          #1a2218;
  --ink-mid:      #3d4f3a;
  --ink-muted:    #6b7c67;
  --ink-faint:    #a8b8a3;
  --border:       #d4e0d0;
  --border-light: #e8f0e5;

  --accent:       #2d7a3a;
  --accent-hover: #1f5a29;
  --accent-faint: #edf7ee;

  --header-bg:    #142210;
  --header-text:  #edf5ea;
  --header-muted: #7a9e74;

  /* Category */
  --cat-before-c:  #0369a1; --cat-before-bg:  #e0f2fe;
  --cat-bidding-c: #c2410c; --cat-bidding-bg: #ffedd5;
  --cat-after-c:   #0f766e; --cat-after-bg:   #ccfbf1;
  --cat-tax-c:     #15803d; --cat-tax-bg:     #dcfce7;
  --cat-law-c:     #6d28d9; --cat-law-bg:     #ede9fe;
  --cat-ai-c:      #1d4ed8; --cat-ai-bg:      #dbeafe;

  /* Level */
  --lv-basic-c: #047857; --lv-basic-bg: #d1fae5;
  --lv-mid-c:   #b45309; --lv-mid-bg:   #fef3c7;
  --lv-adv-c:   #b91c1c; --lv-adv-bg:   #fee2e2;
}
```
`@theme inline`의 `--font-serif`를 `"Merriweather", Georgia, serif`로 교체.

**테마 ③ Deep Ocean:**
```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
@import "tailwindcss";

/* ── Design Tokens ──────────────────────────────── */
:root {
  --bg:           #f0f4f8;
  --bg-card:      #ffffff;
  --ink:          #0f1923;
  --ink-mid:      #2d4059;
  --ink-muted:    #5a7a96;
  --ink-faint:    #a0bdd4;
  --border:       #ccdde8;
  --border-light: #e2eef5;

  --accent:       #0b6bcb;
  --accent-hover: #084fa0;
  --accent-faint: #e8f2fc;

  --header-bg:    #0a1628;
  --header-text:  #e8f2fc;
  --header-muted: #5a8aaf;

  /* Category */
  --cat-before-c:  #0369a1; --cat-before-bg:  #e0f2fe;
  --cat-bidding-c: #c2410c; --cat-bidding-bg: #ffedd5;
  --cat-after-c:   #0f766e; --cat-after-bg:   #ccfbf1;
  --cat-tax-c:     #15803d; --cat-tax-bg:     #dcfce7;
  --cat-law-c:     #6d28d9; --cat-law-bg:     #ede9fe;
  --cat-ai-c:      #1d4ed8; --cat-ai-bg:      #dbeafe;

  /* Level */
  --lv-basic-c: #047857; --lv-basic-bg: #d1fae5;
  --lv-mid-c:   #b45309; --lv-mid-bg:   #fef3c7;
  --lv-adv-c:   #b91c1c; --lv-adv-bg:   #fee2e2;
}
```
`@theme inline`의 `--font-serif`를 `"Inter", system-ui, sans-serif`로 교체.
(Inter는 세리프가 없으므로 `--font-sans`와 동일하게 처리)

**테마 ④ Lavender Studio:**
```css
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&display=swap");
@import "tailwindcss";

/* ── Design Tokens ──────────────────────────────── */
:root {
  --bg:           #faf7ff;
  --bg-card:      #ffffff;
  --ink:          #1e1a2e;
  --ink-mid:      #4a4060;
  --ink-muted:    #7a6e96;
  --ink-faint:    #b8aed0;
  --border:       #e0d8f0;
  --border-light: #ece6f8;

  --accent:       #7c3aed;
  --accent-hover: #5b21b6;
  --accent-faint: #f3eeff;

  --header-bg:    #120d24;
  --header-text:  #f0ebff;
  --header-muted: #7a6a9e;

  /* Category */
  --cat-before-c:  #0369a1; --cat-before-bg:  #e0f2fe;
  --cat-bidding-c: #c2410c; --cat-bidding-bg: #ffedd5;
  --cat-after-c:   #0f766e; --cat-after-bg:   #ccfbf1;
  --cat-tax-c:     #15803d; --cat-tax-bg:     #dcfce7;
  --cat-law-c:     #6d28d9; --cat-law-bg:     #ede9fe;
  --cat-ai-c:      #1d4ed8; --cat-ai-bg:      #dbeafe;

  /* Level */
  --lv-basic-c: #047857; --lv-basic-bg: #d1fae5;
  --lv-mid-c:   #b45309; --lv-mid-bg:   #fef3c7;
  --lv-adv-c:   #b91c1c; --lv-adv-bg:   #fee2e2;
}
```
`@theme inline`의 `--font-serif`를 `"Playfair Display", Georgia, serif`로 교체.

**테마 ⑤ Amber Minimal:**
```css
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap");
@import "tailwindcss";

/* ── Design Tokens ──────────────────────────────── */
:root {
  --bg:           #fefcf7;
  --bg-card:      #ffffff;
  --ink:          #1a1710;
  --ink-mid:      #46421e;
  --ink-muted:    #7a7450;
  --ink-faint:    #b8b08a;
  --border:       #e8e0c4;
  --border-light: #f4f0e0;

  --accent:       #b45309;
  --accent-hover: #8a3e06;
  --accent-faint: #fff7ed;

  --header-bg:    #1c1a0e;
  --header-text:  #fdf8ee;
  --header-muted: #8a8060;

  /* Category */
  --cat-before-c:  #0369a1; --cat-before-bg:  #e0f2fe;
  --cat-bidding-c: #c2410c; --cat-bidding-bg: #ffedd5;
  --cat-after-c:   #0f766e; --cat-after-bg:   #ccfbf1;
  --cat-tax-c:     #15803d; --cat-tax-bg:     #dcfce7;
  --cat-law-c:     #6d28d9; --cat-law-bg:     #ede9fe;
  --cat-ai-c:      #1d4ed8; --cat-ai-bg:      #dbeafe;

  /* Level */
  --lv-basic-c: #047857; --lv-basic-bg: #d1fae5;
  --lv-mid-c:   #b45309; --lv-mid-bg:   #fef3c7;
  --lv-adv-c:   #b91c1c; --lv-adv-bg:   #fee2e2;
}
```
`@theme inline`의 `--font-serif`를 `"Lora", Georgia, serif`로 교체.

### 7-6. src/app/page.tsx 수정

카테고리 라벨을 NICHE에 맞게 교체. 예시(건강 블로그):
```typescript
const CATEGORY_LABELS: Record<string, string> = {
  all:     "전체",
  before:  "예방/준비",    // "사전조사" → 니치에 맞게
  bidding: "운동/실천",    // "입찰전략" → 니치에 맞게
  after:   "회복/관리",    // "낙찰후처리" → 니치에 맞게
  tax:     "영양/식단",    // "세금/비용" → 니치에 맞게
  law:     "의학정보",     // "법률/규정" → 니치에 맞게
  ai:      "AI 활용",      // 그대로 유지
};
```

서브타이틀 및 설명 텍스트도 NICHE에 맞게 교체.

### 7-7. src/app/layout.tsx 수정

```typescript
// description 메타 교체
description: "{NICHE} 전문 블로그 — {SITE_NAME}",

// lang 속성 교체 (한국어: "ko", 영어: "en")
<html lang="{LANG_CODE}">
```

### 7-8. src/app/about/page.tsx 수정

블로그 소개 텍스트를 NICHE, SITE_NAME, AUTHOR_PERSONA, TARGET_AUDIENCE에 맞게 재작성.

### 7-9. package.json 수정

LLM 선택에 따라 의존성 추가:
- GPT-4o mini: `"openai": "^4.0.0"` 추가
- Claude Haiku: `"@anthropic-ai/sdk": "^0.30.0"` 추가

Vercel/Supabase/Neon 스택: `"mysql2"` 제거, `"@neondatabase/serverless": "^0.9.0"` 또는 `"postgres": "^3.4.0"` 추가

---

## Phase 8: 배포 스택별 자동화

### Stack ① Vercel + Neon

**8-1. PostgreSQL 코드 변환 (MySQL → PostgreSQL)**

`src/lib/db.ts`를 다음으로 교체:
```typescript
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export default sql;
```

`src/app/api/**` 내 모든 `?` placeholder를 `$1, $2, ...`로 교체.
`ER_DUP_ENTRY` 에러 코드를 `23505`로 교체.

`scripts/generate-post.ts`의 DB 풀도 Neon 방식으로 교체:
```typescript
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
// pool.query(...) → sql`...` 템플릿 리터럴 방식으로 교체
```

`sql/init.sql` 대신 `sql/init.pg.sql` 사용 (이미 이 repo에 포함됨).

**8-2. GitHub Actions 파일 생성**

`.github/workflows/daily-post.yml`:
```yaml
name: Daily Blog Post Generation

on:
  schedule:
    - cron: '0 0 * * 1-5'   # UTC 00:00 = KST 09:00, 평일
  workflow_dispatch:          # 수동 실행 가능

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Generate post
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
        run: npm run generate
```

`.github/workflows/vercel-deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Deploy
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

`vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

**8-3. Neon DB 초기화 안내**

```
■ Neon 데이터베이스 설정:

1. https://neon.tech 접속 → "Sign Up" (GitHub 계정으로 빠르게 가입)
2. "New Project" 클릭 → 프로젝트 이름 입력
3. Region: Asia Pacific (Seoul)이 없으면 Singapore 선택
4. "Create project" 클릭
5. 연결 문자열 복사:
   postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

6. SQL 에디터(Neon 대시보드)에서 sql/init.pg.sql 내용 실행

DATABASE_URL=postgresql://...
```

**8-4. Vercel 배포 안내 + 자동화**

```
■ Vercel 배포:

1. npm install -g vercel
2. vercel login
3. vercel link (프로젝트 연결)
4. 환경변수 설정:
   vercel env add DATABASE_URL production
   vercel env add {LLM_KEY_NAME} production
   vercel env add {IMAGE_KEY_NAME} production     (이미지 사용 시)
   vercel env add NEXT_PUBLIC_HCAPTCHA_SITE_KEY production
   vercel env add HCAPTCHA_SECRET_KEY production
   vercel env add ADMIN_API_KEY production
   vercel env add NEXT_PUBLIC_SITE_URL production
   vercel env add NEXT_PUBLIC_SITE_NAME production
   vercel env add NEXT_PUBLIC_GA_ID production    (GA 사용 시)

5. vercel --prod

배포 완료 후 URL 확인!
```

**8-5. GitHub Secrets 등록 안내 (Actions용)**

```
■ GitHub Actions Secrets 등록:
레포지토리 → Settings → Secrets and variables → Actions → New repository secret

등록할 Secrets:
- DATABASE_URL        (Neon 연결 문자열)
- {LLM_KEY_NAME}      (선택한 LLM API 키)
- UNSPLASH_ACCESS_KEY (Unsplash 선택 시)
- NEXT_PUBLIC_SITE_URL
- VERCEL_TOKEN        (vercel.com → Account Settings → Tokens)
- VERCEL_ORG_ID       (vercel --prod 실행 후 .vercel/project.json에서 확인)
- VERCEL_PROJECT_ID   (동일)
```

---

### Stack ② Vercel + Supabase

Stack ①과 동일하나 DB 연결 방식이 다름:

`src/lib/db.ts`:
```typescript
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
export default sql;
```

Supabase 설정:
```
■ Supabase 설정:
1. https://supabase.com → "Start your project"
2. New project → 이름 입력, 비밀번호 설정, Region: Southeast Asia
3. Settings → Database → Connection string → URI 복사
   (Transaction pooler 사용 권장: port 6543)
4. SQL Editor → sql/init.pg.sql 내용 붙여넣기 후 실행

DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

이후 Vercel 배포는 Stack ①과 동일.

---

### Stack ③ Railway

```
■ Railway 설정:
1. https://railway.app → "Login with GitHub"
2. "New Project" → "Deploy from GitHub repo" → fork한 레포 선택
3. "Add Service" → "Database" → MySQL 또는 PostgreSQL 선택

[MySQL 선택 시]
- 기존 코드 그대로 사용 (mysql2 유지)
- Railway가 DATABASE_URL 자동 제공
- db.ts를 DATABASE_URL 파싱 방식으로 수정:
  ```typescript
  import mysql from "mysql2/promise";
  const url = new URL(process.env.DATABASE_URL!);
  const pool = mysql.createPool({
    host: url.hostname, port: Number(url.port),
    user: url.username, password: url.password,
    database: url.pathname.slice(1),
    waitForConnections: true, connectionLimit: 10,
  });
  export default pool;
  ```
- Railway Variables 탭에서 DB 스키마 초기화:
  railway run mysql $MYSQLDATABASE < sql/init.sql

[PostgreSQL 선택 시]
- Stack ①의 PG 변환 동일 적용
- railway run psql $DATABASE_URL < sql/init.pg.sql

4. Variables 탭에서 환경변수 추가:
   GEMINI_API_KEY, UNSPLASH_ACCESS_KEY 등

5. GitHub Actions daily-post.yml 생성 (Stack ①과 동일)
   Secrets에 DATABASE_URL (Railway 제공값) 추가
```

---

### Stack ④ VPS

**8-1. 로컬 커스터마이징 완료 후 GitHub push**

```bash
git add -A
git commit -m "feat: {NICHE} 블로그 커스터마이징"
git push origin main
```

**8-2. SSH 자동 서버 세팅**

Claude가 다음 명령을 실행한다 (사용자 확인 후):

```bash
ssh -i {PEM_PATH} {SSH_USER}@{SERVER_IP} << 'ENDSSH'
set -e

echo "=== 1. 패키지 업데이트 ==="
sudo apt update && sudo apt upgrade -y

echo "=== 2. Node.js 20 설치 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== 3. MySQL 8 설치 ==="
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

echo "=== 4. DB 및 유저 생성 ==="
sudo mysql -e "CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '{DB_USER}'@'localhost' IDENTIFIED BY '{DB_PASS}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "=== 5. 앱 클론 ==="
sudo mkdir -p /var/www/{APP_DIR}
sudo git clone https://github.com/{GITHUB_USER}/{REPO_NAME}.git /var/www/{APP_DIR}
cd /var/www/{APP_DIR}

echo "=== 6. 의존성 설치 ==="
sudo npm install

echo "=== 7. .env.local 생성 ==="
ADMIN_KEY=$(openssl rand -hex 16)
sudo tee .env.local > /dev/null << ENV
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER={DB_USER}
DATABASE_PASSWORD={DB_PASS}
DATABASE_NAME={DB_NAME}
NEXT_PUBLIC_SITE_URL=https://{DOMAIN}
NEXT_PUBLIC_SITE_NAME={SITE_NAME}
{LLM_KEY_NAME}={LLM_KEY_VALUE}
{IMAGE_KEY_NAME}={IMAGE_KEY_VALUE}
NEXT_PUBLIC_HCAPTCHA_SITE_KEY={HCAPTCHA_SITE}
HCAPTCHA_SECRET_KEY={HCAPTCHA_SECRET}
ADMIN_API_KEY=$ADMIN_KEY
COMMENT_RATE_LIMIT=3
RATE_LIMIT_WINDOW=60
NEXT_PUBLIC_GA_ID={GA_ID}
ENV

echo "=== 8. DB 스키마 초기화 ==="
sudo mysql {DB_NAME} < sql/init.sql

echo "=== 9. Next.js 빌드 ==="
sudo npm run build

echo "=== 10. PM2 설치 및 앱 시작 ==="
sudo npm install -g pm2
sudo pm2 start npm --name "{APP_DIR}" -- start
sudo pm2 save
sudo pm2 startup systemd -u {SSH_USER} --hp /home/{SSH_USER}

echo "=== 11. cron 등록 (평일 오전 9시 KST) ==="
(crontab -l 2>/dev/null; echo "0 0 * * 1-5 cd /var/www/{APP_DIR} && /usr/bin/npx tsx scripts/generate-post.ts >> /var/www/{APP_DIR}/scripts/generate.log 2>&1") | crontab -

echo "=== 12. Nginx 설치 및 설정 ==="
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/{APP_DIR} > /dev/null << NGINX
server {
    listen 80;
    server_name {DOMAIN};
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/{APP_DIR} /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "=== 13. SSL 인증서 발급 ==="
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d {DOMAIN} --non-interactive --agree-tos -m {EMAIL}

echo "=== 완료! ==="
echo "사이트: https://{DOMAIN}"
ENDSSH
```

**8-3. 배포 완료 확인**

```bash
# PM2 상태 확인
ssh -i {PEM_PATH} {SSH_USER}@{SERVER_IP} "pm2 list"

# 사이트 접속 확인
curl -I https://{DOMAIN}
```

---

## Phase 9: 첫 포스트 3개 생성

배포 완료 후 첫 글 3개를 즉시 생성한다.

**VPS / Railway / 로컬 방식:**
```bash
npm run generate
# 로그 확인
tail -20 scripts/generate.log

npm run generate
tail -20 scripts/generate.log

npm run generate
tail -20 scripts/generate.log
```

**Vercel + Neon/Supabase 방식:**
```
GitHub Actions → Actions 탭 → "Daily Blog Post Generation" → "Run workflow" 클릭
(3번 반복)
```

각 실행 후 로그에서 성공 메시지 확인:
```
✅ 기대 출력:
[timestamp] 📝 주제 선택: [기초편] 1/130 - {첫 번째 주제 제목}
[timestamp] 🤖 AI로 글 생성 중...
[timestamp] ✍️  생성 완료 (약 3000자)
[timestamp] 💾 DB 저장 완료 (id: 1, slug: basic-001)
[timestamp] 🌐 URL: https://{DOMAIN}/posts/basic-001
[timestamp] === 완료 ===
```

---

## Phase 10: 완료 체크리스트

```
✅ 완료 체크리스트

□ 1. 사이트 접속 확인: https://{DOMAIN}
□ 2. 첫 포스트 3개 표시 확인
□ 3. 포스트 클릭 → 상세 페이지 정상 표시
□ 4. 이미지 정상 로드
□ 5. 댓글 작성 테스트
□ 6. 카테고리 필터 작동 확인
□ 7. 모바일 화면 확인
□ 8. 다음 날 자동 발행 예약 확인 (cron 또는 GitHub Actions)
□ 9. Google Search Console에 사이트맵 등록:
     https://search.google.com/search-console
     → Add property → URL prefix → https://{DOMAIN}
     → Sitemaps → https://{DOMAIN}/sitemap.xml 제출
□ 10. (20개 글 발행 후) Google AdSense 신청:
      https://www.google.com/adsense/start
```

---

## 오류 대응 가이드

| 오류 | 원인 | 해결 |
|---|---|---|
| `Database connection failed` | DB 자격증명 오류 | .env.local의 DATABASE_* 값 재확인 |
| `API key invalid` | LLM/이미지 키 오류 | 해당 API 대시보드에서 키 재발급 |
| `Build failed` | 패키지 누락 | `npm install` 후 재시도 |
| `Port 3000 in use` | 기존 프로세스 충돌 | `pm2 restart all` |
| `SSL cert failed` | DNS 미전파 | 도메인 DNS 설정 확인 후 재시도 |
| `Image not loading` | Unsplash rate limit | 1시간 대기 후 재시도 |
| `Topics exhausted` | 130개 모두 발행 완료 | topics.ts에 새 토픽 추가 |

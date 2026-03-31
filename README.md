# auto-blog-template

AI가 매일 자동으로 블로그 글을 생성·발행하는 Next.js 블로그 템플릿.

> **이 레포지토리를 직접 수정하지 마세요.**
> `/auto-blog-setup` 스킬을 사용하면 인터뷰를 통해 자동으로 커스터마이징됩니다.

---

## 스킬로 시작하기 (권장)

```bash
# 1. 이 레포지토리 fork
# 2. Claude Code 설치 후 fork한 디렉토리에서 실행
claude

# 3. 스킬 설치 (최초 1회)
curl -sL https://raw.githubusercontent.com/devkwak73/auto-blog-skill/main/auto-blog-setup.md \
  -o ~/.claude/skills/auto-blog-setup.md

# 4. 스킬 실행
/auto-blog-setup
```

스킬이 안내하는 것:
- 블로그 주제·이름·저자·독자 설정
- LLM 선택: Gemini Flash(무료) / GPT-4o mini / Claude Haiku
- 이미지: Unsplash / Pexels / DALL-E 3 / 없음
- 배포: Vercel+Neon(무료) / Vercel+Supabase(무료) / Railway / VPS
- 디자인 테마 5종
- 서버 세팅 → DB 생성 → 테이블 생성 → 첫 포스팅 3개 자동 생성

---

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **DB**: MySQL 8 / PostgreSQL (Neon·Supabase)
- **AI**: Gemini / OpenAI / Anthropic (선택)
- **이미지**: Unsplash / Pexels API (선택)
- **스팸 방지**: hCaptcha + Honeypot + Rate Limiting
- **배포**: Vercel / Railway / Ubuntu VPS

---

## 프로젝트 구조

```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # UI 컴포넌트
│   └── lib/                 # DB·SEO·스팸 유틸
├── scripts/
│   ├── generate-post.ts     # AI 글 자동 생성
│   ├── topics.ts            # 주제 목록 (스킬이 교체)
│   └── setup-server.sh      # VPS 원클릭 세팅
├── sql/
│   ├── init.sql             # MySQL 스키마
│   └── init.pg.sql          # PostgreSQL 스키마
└── .env.production.example  # 환경변수 템플릿
```

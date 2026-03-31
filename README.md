# auto-blog-template

> Made by **부놈** | kc.kwak73@gmail.com | [GitHub](https://github.com/devkwak73)

AI가 매일 자동으로 블로그 글을 생성·발행하는 Next.js 블로그 템플릿.

**개인 사용은 자유입니다. 단, 재판매 및 상업적 판매는 금지합니다.** → [LICENSE](LICENSE) 참조

---

## 스킬로 시작하기 (권장)

```bash
# 1. 이 레포지토리 fork (GitHub 우측 상단 Fork 버튼)

# 2. fork한 레포 clone 후 Claude Code 실행
git clone https://github.com/{your-username}/auto-blog-template.git
cd auto-blog-template
claude

# 3. 스킬 실행
/auto-blog-setup
```

스킬이 인터뷰를 통해 자동으로 처리합니다:

| 단계 | 내용 |
|---|---|
| 블로그 설정 | 주제·이름·저자·독자·언어 |
| LLM 선택 | Gemini Flash(무료) / GPT-4o mini / Claude Haiku |
| 이미지 | Unsplash / Pexels / DALL-E 3 / 없음 |
| 배포 환경 | Vercel+Neon(무료) / Vercel+Supabase(무료) / Railway / VPS |
| 디자인 | 5가지 테마 |
| 자동화 | 서버 세팅 → DB 생성 → 테이블 → 첫 포스팅 3개 |

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
│   ├── generate-post.ts     # AI 글 자동 생성 (스킬이 커스터마이징)
│   ├── topics.ts            # 주제 목록 (스킬이 교체)
│   └── setup-server.sh      # VPS 원클릭 세팅
├── sql/
│   ├── init.sql             # MySQL 스키마
│   └── init.pg.sql          # PostgreSQL 스키마
├── .claude/skills/
│   └── auto-blog-setup.md   # Claude Code 셋업 스킬
└── .env.production.example  # 환경변수 템플릿
```

---

## 라이선스

개인 사용 자유 / 재판매 금지 — [LICENSE](LICENSE) 참조

© 2025 부놈 (kc.kwak73@gmail.com)

# 부놈의 경매이야기 — 프로젝트 전체 가이드

> 다른 PC에서 접속하거나, 나중에 다시 작업할 때 이 문서 하나로 전체 맥락을 파악할 수 있도록 작성되었습니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [디렉토리 구조](#3-디렉토리-구조)
4. [핵심 기능 설명](#4-핵심-기능-설명)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [환경변수 전체 목록](#6-환경변수-전체-목록)
7. [로컬 개발 환경 (MAMP)](#7-로컬-개발-환경-mamp)
8. [운영 서버 배포](#8-운영-서버-배포)
9. [수익화 설정](#9-수익화-설정)
10. [콘텐츠 자동 생성 시스템](#10-콘텐츠-자동-생성-시스템)
11. [관련 서비스 링크](#11-관련-서비스-링크)
12. [남은 작업 목록](#12-남은-작업-목록)
13. [검색엔진 등록 가이드](#13-검색엔진-등록-가이드)

---

## 1. 프로젝트 개요

**사이트명:** 부놈의 경매이야기
**URL:** https://blog.easyhelper.kr
**GitHub:** https://github.com/devkwak73/auction-blog
**목적:** 부동산 경매 전문 블로그 — AI 자동 콘텐츠 생성 + 구글 애드센스 수익화

### 전체 비즈니스 흐름

```
Gemini AI (자동 글 작성)
    ↓ 매일 오전 9시 (평일, 크론)
MySQL DB (posts 테이블)
    ↓ Next.js ISR (1시간 캐시)
블로그 독자 (SEO 유입)
    ↓
구글 애드센스 광고 수익
    + 윙배너를 통한 자사 서비스 홍보
        ├── 경매도우미 (https://www.easyhelper.kr)
        └── 토닥토닥 곁에 (Android 앱)
```

---

## 2. 기술 스택

| 항목 | 사용 기술 |
|------|----------|
| **프레임워크** | Next.js 16.2.1 (App Router) |
| **언어** | TypeScript |
| **스타일** | Tailwind CSS v4 + CSS 변수 |
| **폰트** | Noto Sans KR, Nanum Myeongjo |
| **데이터베이스** | MySQL 8.0 (mysql2/promise) |
| **AI 콘텐츠** | Google Gemini 2.5-flash API |
| **스팸 방지** | hCaptcha + IP 해시 레이트 리밋 |
| **서버** | Ubuntu, Nginx, PM2, Certbot (Let's Encrypt) |
| **분석** | Google Analytics 4 (GA4) |
| **광고** | Google AdSense |

---

## 3. 디렉토리 구조

```
auction-blog/
├── src/
│   ├── app/                          # Next.js App Router 페이지
│   │   ├── layout.tsx                # 루트 레이아웃 (GA, AdSense, Footer, WingBanner)
│   │   ├── page.tsx                  # 홈 (글 목록, 카테고리 탭)
│   │   ├── globals.css               # 디자인 토큰 + 전체 스타일
│   │   ├── posts/[slug]/page.tsx     # 글 상세 페이지
│   │   ├── about/page.tsx            # 블로그 소개 페이지
│   │   ├── contact/page.tsx          # 문의 페이지
│   │   ├── privacy/page.tsx          # 개인정보처리방침
│   │   └── api/
│   │       ├── posts/                # 글 CRUD API
│   │       ├── comments/             # 댓글 API
│   │       └── posts/[id]/like/      # 좋아요 API
│   ├── components/
│   │   ├── PostList.tsx              # 리스트 뷰 (3번째 글마다 광고)
│   │   ├── PostCard.tsx              # 카드 뷰 (6번째 카드마다 광고)
│   │   ├── AdBanner.tsx              # 애드센스 광고 컴포넌트
│   │   ├── WingBanner.tsx            # 우측 고정 윙배너 (1400px+)
│   │   ├── Footer.tsx                # 하단 푸터
│   │   ├── CommentSection.tsx        # 댓글 영역
│   │   ├── LikeButton.tsx            # 좋아요 버튼
│   │   ├── ShareButton.tsx           # 공유 버튼
│   │   ├── ViewToggle.tsx            # 리스트/카드 뷰 전환
│   │   ├── Pagination.tsx            # 페이지네이션
│   │   └── JsonLd.tsx                # SEO 구조화 데이터
│   ├── lib/
│   │   ├── db.ts                     # MySQL 커넥션 풀
│   │   ├── hash.ts                   # IP SHA-256 해시
│   │   ├── seo.ts                    # slug 생성, IP 추출, 관리자 인증
│   │   └── spam.ts                   # 스팸 방지 (허니팟, 레이트리밋, hCaptcha)
│   └── types/index.ts                # Post, Comment, Like 타입 정의
├── scripts/
│   ├── generate-post.ts              # AI 글 자동 생성 스크립트
│   ├── topics.ts                     # 130개 주제 목록
│   └── setup-server.sh              # 서버 원클릭 세팅 스크립트
├── sql/
│   └── init.sql                      # DB 스키마 초기화
├── .env.local                        # 환경변수 (git 제외됨)
├── DEPLOY.md                         # 배포 가이드 (요약)
└── PROJECT_GUIDE.md                  # 이 문서
```

---

## 4. 핵심 기능 설명

### 4-1. 글 목록 페이지 (`/`)
- 카테고리 필터 탭 (전체 / 입찰준비 / 입찰·낙찰 / 명도·출구 / 세금·대출 / 권리분석 / AI활용)
- 리스트뷰 / 카드뷰 전환
- 페이지네이션 (10개씩)
- **3번째 글마다 애드센스 광고 자동 삽입** (리스트뷰)
- **6번째 카드마다 애드센스 광고 자동 삽입** (카드뷰)

### 4-2. 글 상세 페이지 (`/posts/[slug]`)
- ISR 캐시 1시간 (빠른 응답 + 최신 유지)
- 조회수 자동 증가
- 좋아요 (localStorage + API, IP 해시 중복 방지)
- 공유 버튼 (링크복사 / 카카오 / 트위터)
- 댓글 (닉네임 + 내용, 스팸 다중 방어)
- JSON-LD 구조화 데이터 (SEO)

### 4-3. 윙배너 (우측 고정)
- 화면 너비 **1400px 이상**에서만 표시 (모바일/태블릿 미표시)
- 상단: 경매도우미 웹사이트 → https://www.easyhelper.kr/
- 하단: 토닥토닥 곁에 앱 → https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko

### 4-4. 필수 페이지 (애드센스 심사 요건)
| 경로 | 내용 |
|------|------|
| `/about` | 블로그 소개, 운영자, 관련 서비스 |
| `/contact` | 이메일 문의 (dev.kwak73@gmail.com) |
| `/privacy` | 개인정보처리방침 (애드센스 쿠키 고지 포함) |

### 4-5. 스팸 방지 (댓글)
1. 허니팟 필드 (봇 자동 걸림)
2. IP 해시 레이트 리밋 (기본: 60초에 3회)
3. hCaptcha 검증 (서버사이드)
4. spam_logs 테이블에 위반 기록

---

## 5. 데이터베이스 스키마

**DB명:** `auction_blog`

### posts 테이블
```sql
id, title, slug(unique), category, thumbnail_url,
meta_description, keywords, content(MEDIUMTEXT),
status('draft'|'published'), view_count,
published_at, created_at, updated_at
```

### comments 테이블
```sql
id, post_id(FK), nickname, content, ip_hash,
password_hash(bcrypt), is_approved(0|1), created_at
```

### likes 테이블
```sql
id, post_id(FK), visitor_hash, created_at
UNIQUE KEY (post_id, visitor_hash)
```

### spam_logs 테이블
```sql
id, ip_hash, endpoint, reason, created_at
```

### rate_limits 테이블 (MEMORY 엔진 — 서버 재시작 시 초기화)
```sql
id, ip_hash, endpoint, request_count, window_start
```

---

## 6. 환경변수 전체 목록

`.env.local` 파일에 설정. **git에 포함되지 않으므로 서버마다 직접 생성 필요.**

```bash
# ── MySQL ──
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306           # MAMP는 8889
DATABASE_USER=auction_user   # MAMP는 root
DATABASE_PASSWORD=비밀번호
DATABASE_NAME=auction_blog
# DATABASE_SOCKET=/Applications/MAMP/tmp/mysql/mysql.sock  # MAMP 전용

# ── 사이트 ──
NEXT_PUBLIC_SITE_URL=https://blog.easyhelper.kr   # 로컬: http://localhost:3000
NEXT_PUBLIC_SITE_NAME=부놈의 경매이야기

# ── 연락처 ──
NEXT_PUBLIC_CONTACT_EMAIL=dev.kwak73@gmail.com

# ── Google Analytics ──
NEXT_PUBLIC_GA_ID=G-LQC7MLGKJV           # ✅ 설정 완료

# ── Google AdSense ──
# NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX   # 승인 후 주석 해제
# NEXT_PUBLIC_ADSENSE_SLOT_LIST=1234567890             # 광고 슬롯 ID

# ── 검색엔진 인증 ──
# NEXT_PUBLIC_GOOGLE_VERIFICATION=구글서치콘솔_인증코드   # Google Search Console 인증 (없으면 meta 태그 미출력)
# NEXT_PUBLIC_NAVER_VERIFICATION=네이버서치어드바이저_코드  # 네이버 서치어드바이저 인증 (없으면 meta 태그 미출력)

# ── hCaptcha ──
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=사이트키    # 개발: 10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SECRET_KEY=시크릿키             # 개발: 0x0000...0000

# ── 관리자 API 인증 ──
ADMIN_API_KEY=랜덤_시크릿키              # 글 생성 API 보호용

# ── Rate Limit ──
COMMENT_RATE_LIMIT=3
RATE_LIMIT_WINDOW=60

# ── Gemini API ──
GEMINI_API_KEY=실제_API_키              # ✅ 발급 완료 (로컬에만 있음)
```

### 환경변수 상태 요약

| 변수 | 로컬 | 서버 | 비고 |
|------|------|------|------|
| DATABASE_* | ✅ | ✅ 자동생성 | setup.sh가 처리 |
| NEXT_PUBLIC_GA_ID | ✅ | 🔧 수동 추가 필요 | `G-LQC7MLGKJV` |
| NEXT_PUBLIC_CONTACT_EMAIL | ✅ | ✅ 자동생성 | setup.sh 포함됨 |
| NEXT_PUBLIC_ADSENSE_CLIENT | ❌ 미발급 | ❌ 미발급 | 애드센스 심사 후 |
| GEMINI_API_KEY | ✅ | 🔧 수동 입력 필요 | `AIzaSy...` |
| NEXT_PUBLIC_HCAPTCHA_SITE_KEY | 테스트키 | 🔧 실키 입력 필요 | hcaptcha.com |
| ADMIN_API_KEY | dev키 | ✅ 자동생성 | 랜덤 32자 |
| NEXT_PUBLIC_GOOGLE_VERIFICATION | ❌ 미설정 | ❌ 미설정 | Google Search Console 인증 후 |
| NEXT_PUBLIC_NAVER_VERIFICATION | ❌ 미설정 | ❌ 미설정 | 네이버 서치어드바이저 인증 후 |

---

## 7. 로컬 개발 환경 (MAMP)

**조건:** macOS + MAMP 설치됨

```bash
# 1. 저장소 클론
git clone https://github.com/devkwak73/auction-blog.git
cd auction-blog

# 2. 의존성 설치
npm install

# 3. .env.local 생성 (아래 내용 복사 후 키 입력)
cp .env.local.example .env.local   # 없으면 직접 생성
nano .env.local

# 4. MAMP MySQL 시작 후 DB 초기화
mysql -u root -p -S /Applications/MAMP/tmp/mysql/mysql.sock < sql/init.sql

# 5. 개발 서버 시작
npm run dev
# → http://localhost:3000

# 6. 테스트용 글 수동 생성
npm run generate
```

**MAMP MySQL 접속 정보:**
- Host: 127.0.0.1 / Port: 8889
- User: root / Password: root
- Socket: `/Applications/MAMP/tmp/mysql/mysql.sock`

---

## 8. 운영 서버 배포

**서버 정보:**
- 도메인: blog.easyhelper.kr
- IP: 133.186.144.41
- 경로: /var/www/auction-blog
- OS: Ubuntu 20.04+

### 최초 배포 (신규 서버)

```bash
# 1. SSH 접속
ssh root@133.186.144.41

# 2. 저장소 클론
git clone https://github.com/devkwak73/auction-blog.git /var/www/auction-blog

# 3. 세팅 스크립트 실행 (Node.js, MySQL, Nginx, SSL, PM2 전부 자동)
sudo bash /var/www/auction-blog/scripts/setup-server.sh
```

스크립트가 자동 처리하는 항목:
- Node.js 20 + PM2 설치
- MySQL 설치 + DB/유저 생성 (비밀번호 자동 생성)
- Nginx 리버스 프록시 설정
- Let's Encrypt SSL 인증서 발급
- .env.local 자동 생성 (GA ID, 연락처 포함)
- Next.js 빌드 + PM2 등록
- 크론 등록 (평일 오전 9시 자동 글 발행)

### 스크립트 완료 후 수동 입력 필요

```bash
nano /var/www/auction-blog/.env.local
```

변경 항목:
```
GEMINI_API_KEY=실제_Gemini_API_키
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=실제_hCaptcha_사이트_키
HCAPTCHA_SECRET_KEY=실제_hCaptcha_시크릿_키
```

확인 항목 (자동 설정됨):
```
NEXT_PUBLIC_GA_ID=G-LQC7MLGKJV          ← 확인
NEXT_PUBLIC_CONTACT_EMAIL=dev.kwak73@gmail.com  ← 확인
```

재빌드:
```bash
cd /var/www/auction-blog
npm run build
pm2 restart auction-blog
```

### 이후 코드 업데이트 배포

```bash
cd /var/www/auction-blog
git pull
npm install
npm run build
pm2 restart auction-blog
```

### 유용한 서버 명령어

```bash
pm2 status                          # 앱 상태 확인
pm2 logs auction-blog               # 실시간 로그
pm2 logs auction-blog --lines 100   # 최근 100줄

# 글 수동 생성 (즉시 1개 발행)
cd /var/www/auction-blog && npm run generate

# 자동 생성 로그
tail -f /var/www/auction-blog/scripts/generate.log

# 크론 확인
crontab -l

# Nginx 재시작
sudo systemctl reload nginx

# SSL 갱신 테스트
certbot renew --dry-run
```

---

## 9. 수익화 설정

### 9-1. Google Analytics 4

- **측정 ID:** `G-LQC7MLGKJV` ✅ 설정 완료
- 환경변수: `NEXT_PUBLIC_GA_ID=G-LQC7MLGKJV`
- 코드 위치: `src/app/layout.tsx` (strategy="afterInteractive")
- 확인 방법: GA4 콘솔 → 실시간 → 방문자 확인

### 9-2. Google AdSense

**현재 상태:** 코드 구현 완료, Publisher ID 미발급

**심사 신청 순서:**
1. https://adsense.google.com 접속
2. 사이트 URL 입력: `https://blog.easyhelper.kr`
3. 심사 통과 후 Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) 발급
4. 광고 단위 생성 → 슬롯 ID 발급
5. `.env.local` 에 추가:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT_LIST=슬롯ID
   ```
6. `npm run build && pm2 restart auction-blog`

**애드센스 심사 필수 요건 (구현 완료):**
- ✅ 개인정보처리방침 페이지 (`/privacy`)
- ✅ About 페이지 (`/about`)
- ✅ Contact 페이지 (`/contact`, 이메일: dev.kwak73@gmail.com)
- ✅ 충분한 콘텐츠 (130개 주제 자동 생성)
- ✅ 연락처 이메일 노출

**광고 삽입 위치 (자동):**
- 리스트뷰: 3번째 글마다 (`PostList.tsx`)
- 카드뷰: 6번째 카드마다 (`PostCard.tsx`)
- 개발 환경: 회색 "광고 영역" placeholder 표시

### 9-3. 윙배너 (자사 서비스)

1400px 이상 화면에서만 우측 고정 표시.

| 위치 | 서비스 | URL |
|------|--------|-----|
| 상단 | 경매도우미 | https://www.easyhelper.kr/ |
| 하단 | 토닥토닥 곁에 | https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko |

---

## 10. 콘텐츠 자동 생성 시스템

### 주제 목록 (`scripts/topics.ts`)

총 **130개 주제**, 3개 난이도:

| 난이도 | slug 형식 | 개수 | 카테고리 |
|--------|-----------|------|----------|
| 기초 | `basic-001` ~ | 43개 | before, bidding, after, tax, law, ai |
| 중급 | `mid-001` ~ | 43개 | 동일 |
| 고급 | `adv-001` ~ | 44개 | 동일 |

### 자동 생성 흐름

```
크론 (평일 오전 9시)
    └── npm run generate
            └── scripts/generate-post.ts
                    ├── topics.ts에서 미발행 주제 순서대로 선택
                    ├── Gemini 2.5-flash에 한국어 HTML 블로그 글 생성 요청
                    │       - 3000자 이상
                    │       - h2/h3 구조, 표, 리스트, 실전 팁 포함
                    │       - "AI 활용 팁" 섹션 포함
                    ├── HTML 정제 (마크다운 아티팩트 제거)
                    ├── posts 테이블에 INSERT (status='published')
                    └── generate.log에 결과 기록
```

### 수동 글 생성

```bash
# 로컬
npm run generate

# 서버
cd /var/www/auction-blog && npm run generate
```

### 크론 스케줄

```
0 9 * * 1-5   →   평일 오전 9시 (서버 로컬타임 기준)
```

서버 시간대 확인: `timedatectl` (한국 시간이면 `Asia/Seoul`)

---

## 11. 관련 서비스 링크

| 서비스 | URL | 용도 |
|--------|-----|------|
| 블로그 | https://blog.easyhelper.kr | 이 프로젝트 |
| 경매도우미 | https://www.easyhelper.kr | AI 경매 분석 웹 |
| 토닥토닥 곁에 | https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko | 시니어 안전 Android 앱 |
| GitHub | https://github.com/devkwak73/auction-blog | 소스코드 |
| GA4 콘솔 | https://analytics.google.com | 트래픽 분석 (ID: G-LQC7MLGKJV) |
| AdSense | https://adsense.google.com | 광고 수익 |
| Gemini API | https://aistudio.google.com | AI 글 생성 키 관리 |
| hCaptcha | https://dashboard.hcaptcha.com | 스팸 방지 키 관리 |

---

## 12. 남은 작업 목록

### 즉시 처리 (서버 접속 시)

- [ ] 서버 `.env.local`에 `NEXT_PUBLIC_GA_ID=G-LQC7MLGKJV` 추가
- [ ] `git pull && npm run build && pm2 restart auction-blog` 실행

### 애드센스 신청 후

- [ ] Publisher ID 발급 → `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX` 추가
- [ ] 광고 단위 생성 → `NEXT_PUBLIC_ADSENSE_SLOT_LIST=슬롯ID` 추가
- [ ] 재빌드 + 재시작

### 선택 사항

- [ ] hCaptcha 실제 키로 교체 (현재 개발용 테스트 키)
- [ ] 썸네일 이미지 자동 생성 추가 (현재 없음)
- [ ] 글 상세 페이지 내 광고 슬롯 추가 (본문 중간 or 하단)
- ✅ 사이트맵 자동 생성 (`/sitemap.xml`) — `src/app/sitemap.ts` 구현 완료
- ✅ robots.txt 확인/추가 — `src/app/robots.ts` 구현 완료
- [ ] Google Search Console에 사이트 등록 + sitemap 제출 → `NEXT_PUBLIC_GOOGLE_VERIFICATION` 환경변수 설정
- [ ] 네이버 서치어드바이저에 사이트 등록 + sitemap 제출 → `NEXT_PUBLIC_NAVER_VERIFICATION` 환경변수 설정

---

## 13. 검색엔진 등록 가이드

### SEO 구현 현황

| 항목 | 구현 위치 | 상태 |
|------|-----------|------|
| robots.txt | `src/app/robots.ts` (동적 생성) | ✅ 완료 |
| sitemap.xml | `src/app/sitemap.ts` (동적 생성) | ✅ 완료 |
| JSON-LD (Article) | `src/components/JsonLd.tsx` | ✅ 완료 |
| Open Graph / Twitter Card | `src/app/layout.tsx`, `posts/[slug]/page.tsx` | ✅ 완료 |
| 보안 헤더 | `next.config.ts` | ✅ 완료 |
| Google 인증 meta | 환경변수 `NEXT_PUBLIC_GOOGLE_VERIFICATION` | 🔧 등록 후 설정 |
| 네이버 인증 meta | 환경변수 `NEXT_PUBLIC_NAVER_VERIFICATION` | 🔧 등록 후 설정 |

sitemap에 포함된 페이지:
- 홈 (`/`) — priority 1.0, daily
- About (`/about`) — priority 0.5, monthly
- Contact (`/contact`) — priority 0.5, monthly
- Privacy (`/privacy`) — priority 0.3, monthly
- 개별 포스트 (`/posts/[slug]`) — priority 0.8, weekly

---

### 13-1. Google Search Console 등록

1. https://search.google.com/search-console 접속
2. **URL 접두어** 방식으로 `https://blog.easyhelper.kr` 추가
3. **HTML 태그** 인증 방식 선택 → `content="..."` 값 복사
4. 서버 `.env.local`에 추가:
   ```bash
   NEXT_PUBLIC_GOOGLE_VERIFICATION=복사한_인증코드
   ```
5. 재빌드:
   ```bash
   npm run build && pm2 restart auction-blog
   ```
6. Search Console에서 **인증 확인** 클릭
7. 좌측 메뉴 → **Sitemaps** → `https://blog.easyhelper.kr/sitemap.xml` 제출

---

### 13-2. 네이버 서치어드바이저 등록

1. https://searchadvisor.naver.com 접속 (네이버 로그인 필요)
2. **사이트 등록** → `https://blog.easyhelper.kr` 입력
3. **HTML 태그** 인증 방식 선택 → `content="..."` 값 복사
4. 서버 `.env.local`에 추가:
   ```bash
   NEXT_PUBLIC_NAVER_VERIFICATION=복사한_인증코드
   ```
5. 재빌드 + 재시작 후 서치어드바이저에서 **소유확인** 클릭
6. 요청 → **웹 페이지 수집** → sitemap 제출:
   ```
   https://blog.easyhelper.kr/sitemap.xml
   ```

---

### 13-3. Bing 웹마스터 도구 등록 (선택)

1. https://www.bing.com/webmasters 접속
2. **Google Search Console에서 가져오기** 기능으로 간편 등록 가능
   - 또는 수동으로 사이트 추가 → XML 파일 인증 방식 선택
3. sitemap 제출: `https://blog.easyhelper.kr/sitemap.xml`

> Bing 웹마스터에는 별도 인증 meta 태그 불필요 (Google Search Console 연동으로 대체 가능)

---

### 인증 후 환경변수 설정 요약

```bash
# /var/www/auction-blog/.env.local 에 추가
NEXT_PUBLIC_GOOGLE_VERIFICATION=구글서치콘솔_HTML태그_content_값
NEXT_PUBLIC_NAVER_VERIFICATION=네이버서치어드바이저_HTML태그_content_값
```

재빌드:
```bash
cd /var/www/auction-blog
npm run build
pm2 restart auction-blog
```

인증코드가 설정되지 않으면 meta 태그가 HTML에 출력되지 않으므로 **등록 전에는 환경변수를 비워 두어도 됩니다.**

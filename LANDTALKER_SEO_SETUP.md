# 토지담(landtalker.kr) SEO·광고·분석 세팅 가이드

> 2026-03-30 기준 사이트 분석 결과를 바탕으로 작성.
> 기존 워드프레스 사이트에서 동일 도메인으로 신규 구축 중인 상태.
> 체크박스를 순서대로 처리하면 완료.

---

## 현재 상태 진단

| 항목 | 현재 상태 | 조치 필요 |
|------|-----------|-----------|
| Title 태그 | ✅ "토지담 - 부동산 인사이트" | - |
| Meta description | ✅ 존재 | - |
| AdSense 스크립트 | ✅ 삽입됨 (`ca-pub-1803907039020188`) | - |
| AdSense 승인 | ✅ 기승인 (워드프레스에서 동일 도메인 승인) | 광고 단위 노출 확인만 필요 |
| robots.txt | ❌ 404 (없음) | 생성 필요 |
| sitemap.xml | ❌ 404 (없음) | 생성 필요 |
| OpenGraph 태그 | ❌ 전체 없음 | 추가 필요 |
| Google Analytics | ❌ 없음 | 연동 필요 |
| Google 인증 meta | ❌ 없음 | 등록 후 추가 |
| 네이버 인증 meta | ❌ 없음 | 등록 후 추가 |
| JSON-LD 구조화 데이터 | ❌ 없음 | 추가 권장 |
| /about 페이지 | ❌ 404 | 신뢰도·SEO용으로 생성 권장 |
| /contact 페이지 | ❌ 404 | 신뢰도·SEO용으로 생성 권장 |
| /privacy 페이지 | ❌ 404 | 개인정보처리방침 — 생성 권장 |

---

## Step 1. robots.txt 생성

현재 `https://landtalker.kr/robots.txt` → 404.
크롤러가 수집 허용 범위를 알 수 없는 상태.

아래 내용으로 생성 (전체 허용 + sitemap 위치 안내):

```
User-agent: *
Allow: /

Sitemap: https://landtalker.kr/sitemap.xml
```

- [ ] robots.txt 생성 완료
- [ ] `https://landtalker.kr/robots.txt` 브라우저에서 정상 출력 확인

---

## Step 2. sitemap.xml 생성

현재 `https://landtalker.kr/sitemap.xml` → 404.
검색엔진에 URL을 제출해도 파일이 없으면 수집 실패.

포함해야 할 URL:
- 홈 (`https://landtalker.kr/`) — priority 1.0, changefreq daily
- 카테고리 페이지 (아파트·상가·토지·정책·시장동향) — priority 0.7, monthly
- 개별 글 페이지 — priority 0.8, weekly
- `/about`, `/contact`, `/privacy` (생성 시) — priority 0.5, monthly

프레임워크에서 동적 생성이 가능하면 DB 기반으로 자동 생성 권장.

- [ ] sitemap.xml 생성 완료
- [ ] `https://landtalker.kr/sitemap.xml` 브라우저에서 URL 목록 출력 확인

---

## Step 3. OpenGraph 태그 추가

현재 og 태그 전체 없음. SNS 공유 시 미리보기가 빈 상태로 노출됨.

모든 페이지 `<head>`에 기본값 추가:

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="토지담">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="페이지 제목">
<meta property="og:description" content="페이지 설명">
<meta property="og:url" content="https://landtalker.kr/현재경로">
<meta property="og:image" content="https://landtalker.kr/대표이미지.png">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="페이지 제목">
<meta name="twitter:description" content="페이지 설명">
```

- [ ] 홈 페이지 OG 태그 추가
- [ ] 개별 글 페이지에 동적 OG 태그 추가 (글 제목·설명·썸네일 반영)

---

## Step 4. Google Analytics 4 연동

현재 GA 스크립트 없음. 방문자 수·유입 경로 파악 불가.

### 측정 ID 발급
1. https://analytics.google.com 접속
2. **관리 → 속성 만들기** → 사이트명: `토지담`, URL: `https://landtalker.kr`
3. 데이터 스트림 → 웹 → 측정 ID(`G-XXXXXXXXXX`) 복사

### 적용
- 발급받은 측정 ID를 프로젝트 설정에 추가
- 모든 페이지 `<head>`에 gtag.js 스크립트 삽입

### 확인
- [ ] GA4 측정 ID 발급 완료: `G-__________`
- [ ] 프로젝트에 스크립트 삽입
- [ ] 배포 후 GA4 콘솔 **실시간** 탭에서 수신 확인

---

## Step 5. AdSense 광고 노출 확인

AdSense는 기승인 상태. Publisher ID가 이미 삽입되어 있으므로 **광고 단위 노출 여부만 확인**하면 됨.

- Publisher ID: `ca-pub-1803907039020188` ✅

### 확인 항목
- [ ] AdSense 콘솔(adsense.google.com) 접속 → **광고 → 개요** 탭에서 노출 수 확인
- [ ] 광고 단위(슬롯 ID)가 생성되어 있는지 확인 — 없으면 **광고 → 광고 단위**에서 생성
- [ ] 실제 페이지에서 광고 노출 확인 (개발자 도구 → Network 탭에서 `adsbygoogle` 요청 확인)

> 동일 도메인 재구축 시 AdSense는 별도 재심사 없이 기존 승인이 유지됨.
> 단, 사이트 구조가 크게 달라지면 AdSense 콘솔에서 '사이트 검토 요청'이 뜰 수 있음 — 무시하지 말고 확인할 것.

---

## Step 6. Google Search Console 등록

기존 워드프레스에서 등록되어 있었다면 새 사이트로 **재인증**이 필요할 수 있음.

### 사이트 등록 및 인증
1. https://search.google.com/search-console 접속
2. `landtalker.kr` 속성이 이미 있으면 → 소유권 재확인 필요 여부 확인
3. 없거나 새로 등록 시: **속성 추가 → URL 접두어** → `https://landtalker.kr` 입력
4. **HTML 태그** 인증 방식 선택 → `content` 값 복사
5. `<head>`에 추가:
   ```html
   <meta name="google-site-verification" content="[복사한 값]">
   ```
6. 배포 후 **인증 확인** 클릭

### sitemap 제출
1. 좌측 메뉴 → **Sitemaps**
2. 기존에 워드프레스 sitemap이 등록되어 있으면 **삭제 후 새로 제출**:
   ```
   https://landtalker.kr/sitemap.xml
   ```

- [ ] Google 인증코드 발급 및 `<head>` 적용
- [ ] 배포 후 소유권 인증 확인
- [ ] 기존 워드프레스 sitemap 항목 삭제 (있을 경우)
- [ ] 새 sitemap.xml 제출 → 상태 **성공** 확인

---

## Step 7. 네이버 서치어드바이저 등록

### 사이트 등록 및 인증
1. https://searchadvisor.naver.com 접속 (네이버 계정 로그인)
2. 기존 등록 여부 확인 — 있으면 소유확인 상태 재점검
3. 없거나 재등록 시: **웹마스터 도구 → 사이트 등록** → `https://landtalker.kr` 입력
4. **HTML 태그** 인증 방식 → `content` 값 복사
5. `<head>`에 추가:
   ```html
   <meta name="naver-site-verification" content="[복사한 값]">
   ```
6. 배포 후 **소유확인** 클릭

### 수집 요청
소유확인 후 **요청 → 웹 페이지 수집**:
- `https://landtalker.kr/sitemap.xml` 제출
- `https://landtalker.kr/` 홈 URL 별도 제출

- [ ] 네이버 인증코드 발급 및 `<head>` 적용
- [ ] 소유확인 완료
- [ ] sitemap 제출 + 홈 URL 수집 요청

---

## Step 8. 부가 페이지 생성 (권장)

AdSense 심사는 이미 통과했지만, 아래 페이지가 없으면 SEO 신뢰도와 사용자 경험에 불리함.

- [ ] `/about` — 토지담 소개, 운영 목적, 운영자 정보
- [ ] `/contact` — 연락 이메일 노출
- [ ] `/privacy` — 개인정보처리방침 (AdSense 쿠키 수집 고지 포함)

생성 후 sitemap.xml에도 추가.

---

## Step 9. Bing 웹마스터 (선택)

1. https://www.bing.com/webmasters 접속
2. **Google Search Console에서 가져오기** → Step 6 완료 후 연동 (가장 빠름)
3. sitemap 제출: `https://landtalker.kr/sitemap.xml`

- [ ] Bing 웹마스터 등록

---

## 최종 체크리스트 (우선순위 순)

### 즉시 처리
- [ ] `robots.txt` 생성 및 접근 확인
- [ ] `sitemap.xml` 생성 및 접근 확인

### 코드 개선
- [ ] OpenGraph 태그 추가 (전체 페이지)
- [ ] GA4 스크립트 삽입 (측정 ID: `G-__________`)

### AdSense 확인
- [ ] AdSense 콘솔에서 광고 노출 상태 확인 (`ca-pub-1803907039020188`)
- [ ] 광고 단위(슬롯 ID) 존재 여부 확인 및 페이지 적용

### 검색엔진 등록
- [ ] Google Search Console — 인증 + 기존 sitemap 교체 + 새 sitemap 제출
- [ ] 네이버 서치어드바이저 — 인증 + sitemap·홈 URL 수집 요청
- [ ] (선택) Bing 웹마스터 등록

### 권장 추가 작업
- [ ] `/about`, `/contact`, `/privacy` 페이지 생성 후 sitemap 업데이트

# 블로그 광고·검색·분석 세팅 가이드

> 완성된 블로그에 광고, 검색엔진 등록, 분석 도구를 붙이기 위한 체크리스트.
> `[여기에 입력]` 으로 표시된 항목은 적용 전 해당 블로그에 맞게 채워넣기.

---

## 0. 등록 전 사전 확인

> 아래 항목이 갖춰지지 않으면 검색엔진 등록을 해도 콘텐츠를 제대로 수집하지 못함.

### 0-1. 브라우저에서 직접 확인

| 확인 URL | 정상 상태 | 문제 시 영향 |
|----------|-----------|-------------|
| `https://블로그URL/robots.txt` | 텍스트 내용 출력됨 | 크롤러가 수집 허용 범위를 알 수 없음 |
| `https://블로그URL/sitemap.xml` | XML URL 목록 출력됨 | sitemap 제출 자체가 실패함 |
| 홈, 글 목록, 글 상세 페이지 | 200 정상 응답 | 크롤링 불가 |

### 0-2. 페이지 소스에서 확인 (브라우저 → 우클릭 → 페이지 소스 보기)

- [ ] `<title>` 태그 존재
- [ ] `<meta name="description">` 존재
- [ ] `<meta name="robots" content="noindex">` **없어야 함** — 있으면 색인 거부됨
- [ ] HTTPS 정상 작동 + HTTP → HTTPS 자동 리다이렉트

### 0-3. AdSense 심사용 필수 페이지

- [ ] `/about` (소개 페이지) 접근 가능
- [ ] `/contact` (연락처 페이지) 접근 가능
- [ ] `/privacy` (개인정보처리방침) 접근 가능

> 위 3개 페이지가 없으면 AdSense 심사 통과 불가.

---

## 필요한 값 목록

아래 값들을 각 서비스에서 발급받아 프로젝트 설정 파일에 추가.

| 항목 | 발급처 | 발급 시점 |
|------|--------|-----------|
| GA4 측정 ID (`G-XXXXXXXXXX`) | Google Analytics | 속성 생성 후 즉시 |
| AdSense Publisher ID (`ca-pub-XXXX`) | Google AdSense | 심사 승인 후 |
| AdSense 광고 슬롯 ID | Google AdSense | 광고 단위 생성 후 |
| Google 인증 코드 | Google Search Console | 사이트 등록 후 |
| 네이버 인증 코드 | 네이버 서치어드바이저 | 사이트 등록 후 |

---

## 1. Google Analytics 4 (GA4)

### 측정 ID 발급
1. https://analytics.google.com 접속
2. **관리 → 속성 만들기** → 사이트 이름·URL·시간대(한국) 입력
3. **데이터 스트림 → 웹** → 측정 ID(`G-XXXXXXXXXX`) 복사

### 프로젝트 적용
- 복사한 측정 ID를 프로젝트 설정에 추가: `[G-XXXXXXXXXX]`
- 적용 방식은 프레임워크에 따라 다름 — gtag.js 스크립트 삽입 또는 환경변수 설정

### 확인
- 배포 후 GA4 콘솔 → **실시간** 탭에서 방문자 수신 확인

---

## 2. Google AdSense

### 심사 신청 전 필수 요건
- [ ] 소개(About) 페이지 존재 — 블로그·운영자 정보
- [ ] 연락처(Contact) 페이지 존재 — 이메일 등 노출
- [ ] 개인정보처리방침(Privacy) 페이지 존재 — 쿠키·광고 수집 항목 포함
- [ ] 충분한 콘텐츠 — 최소 20~30개 이상의 글 권장
- [ ] 사이트가 정상 접속되는 상태 (HTTPS)

### 심사 신청
1. https://adsense.google.com 접속
2. **시작하기** → 사이트 URL 입력: `[https://블로그URL]`
3. 심사 승인 메일 수신 후 Publisher ID(`ca-pub-XXXXXXXXXXXXXXXX`) 확인

### 광고 단위 생성 (승인 후)
1. AdSense 콘솔 → **광고 → 광고 단위** → 디스플레이 광고 생성
2. 단위 이름 입력 → **만들기** → 슬롯 ID(`XXXXXXXXXX`) 복사

### 프로젝트 적용
- Publisher ID와 슬롯 ID를 프로젝트 설정에 추가
- AdSense 스크립트(`adsbygoogle.js?client=ca-pub-XXXX`)를 `<head>`에 삽입
- 광고 노출 위치에 `<ins class="adsbygoogle">` 태그 또는 광고 컴포넌트 배치

---

## 3. Google Search Console

### 사이트 등록
1. https://search.google.com/search-console 접속
2. **속성 추가 → URL 접두어** → `[https://블로그URL]` 입력
3. 소유권 확인 방법 → **HTML 태그** 선택
4. 표시된 `<meta name="google-site-verification" content="XXXX">` 의 `content` 값 복사

### 프로젝트 적용
- 복사한 값을 사이트 `<head>` 의 meta 태그로 추가:
  ```
  <meta name="google-site-verification" content="[복사한 값]">
  ```
- 또는 프레임워크의 verification 설정 필드에 값 입력

### 인증 완료 및 sitemap 제출
1. 배포 후 Search Console에서 **인증 확인** 클릭
2. 좌측 메뉴 → **Sitemaps** → 아래 URL 제출:
   ```
   [https://블로그URL]/sitemap.xml
   ```
3. 상태가 **성공**으로 표시되는지 확인

---

## 4. 네이버 서치어드바이저

> 한국어 블로그 필수. 네이버 검색 노출을 위해 구글과 별개로 등록 필요.

### 사이트 등록
1. https://searchadvisor.naver.com 접속 (네이버 계정 로그인)
2. 우측 상단 **웹마스터 도구** → **사이트 등록**
3. `[https://블로그URL]` 입력 후 **확인**
4. 소유확인 방법 → **HTML 태그** 선택
5. 표시된 `<meta name="naver-site-verification" content="XXXX">` 의 `content` 값 복사

### 프로젝트 적용
- 복사한 값을 사이트 `<head>` 의 meta 태그로 추가:
  ```
  <meta name="naver-site-verification" content="[복사한 값]">
  ```

### 인증 완료 및 수집 요청
1. 배포 후 서치어드바이저에서 **소유확인** 클릭
2. 좌측 메뉴 → **요청 → 웹 페이지 수집** → sitemap 제출:
   ```
   [https://블로그URL]/sitemap.xml
   ```
3. 동일 메뉴에서 홈 URL(`[https://블로그URL]`)도 별도 제출 권장

---

## 5. Bing 웹마스터 (선택)

> Bing·Microsoft Edge 검색 노출. Google Search Console 연동으로 간편 등록 가능.

1. https://www.bing.com/webmasters 접속
2. **Google Search Console에서 가져오기** 선택 → 구글 계정 연동 (가장 빠름)
   - 또는 수동: 사이트 추가 → XML 파일 인증
3. sitemap 제출:
   ```
   [https://블로그URL]/sitemap.xml
   ```

---

## 6. 최종 체크리스트

### GA4
- [ ] 속성 생성 → 측정 ID 발급
- [ ] 프로젝트에 gtag 스크립트 또는 측정 ID 설정
- [ ] 배포 후 실시간 탭에서 수신 확인

### AdSense
- [ ] 소개·연락처·개인정보처리방침 페이지 존재 확인
- [ ] 충분한 글 수 확인 (20개 이상 권장)
- [ ] AdSense 심사 신청
- [ ] 승인 후 Publisher ID + 슬롯 ID 프로젝트에 적용
- [ ] 광고 노출 위치 확인

### Google Search Console
- [ ] 사이트 등록 → HTML 태그 인증코드 발급
- [ ] `<head>`에 google-site-verification meta 태그 추가 후 배포
- [ ] 소유권 인증 확인
- [ ] sitemap.xml 제출 → 상태 **성공** 확인

### 네이버 서치어드바이저
- [ ] 사이트 등록 → HTML 태그 인증코드 발급
- [ ] `<head>`에 naver-site-verification meta 태그 추가 후 배포
- [ ] 소유확인 완료
- [ ] sitemap.xml 제출
- [ ] 홈 URL 별도 수집 요청

### Bing 웹마스터 (선택)
- [ ] Google Search Console 연동 또는 수동 등록
- [ ] sitemap.xml 제출

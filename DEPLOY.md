# 서버 배포 가이드

## 서버 정보

| 항목 | 값 |
|------|-----|
| 도메인 | blog.easyhelper.kr |
| 서버 IP | 133.186.144.41 |
| 앱 경로 | /var/www/auction-blog |
| GitHub | https://github.com/devkwak73/auction-blog |

---

## 최초 배포 순서

### 1. 도메인 DNS 설정
도메인 관리 페이지에서 A 레코드 확인:
```
blog.easyhelper.kr  →  133.186.144.41
```

### 2. 서버 접속
```bash
ssh root@133.186.144.41
```

### 3. 저장소 클론
```bash
git clone https://github.com/devkwak73/auction-blog.git /var/www/auction-blog
```

### 4. 세팅 스크립트 실행 전 도메인 수정
```bash
nano /var/www/auction-blog/scripts/setup-server.sh
# 3번째 줄: DOMAIN="blog.easyhelper.kr" 로 변경
```

### 5. 원클릭 세팅 스크립트 실행
```bash
sudo bash /var/www/auction-blog/scripts/setup-server.sh
```

스크립트가 자동으로 처리하는 항목:
- Node.js 20, npm 설치
- PM2 (프로세스 관리자) 설치
- MySQL 설치 + DB/사용자 생성 (비밀번호 자동 생성)
- Nginx 설치 + 리버스 프록시 설정
- Certbot (Let's Encrypt SSL 인증서) 발급
- 저장소 클론 + npm 패키지 설치
- DB 스키마 초기화 (`sql/init.sql`)
- `.env.local` 자동 생성
- Next.js 빌드
- PM2 등록 + 부팅 자동 시작
- 크론탭 등록 (평일 오전 9시 자동 글 발행)

### 6. API 키 및 설정 입력
스크립트 완료 후 아래 항목을 직접 입력:
```bash
nano /var/www/auction-blog/.env.local
```

변경할 항목:
```
# 필수
GEMINI_API_KEY=실제_Gemini_API_키
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=실제_hCaptcha_사이트_키
HCAPTCHA_SECRET_KEY=실제_hCaptcha_시크릿_키

# 자동 설정됨 (확인만)
NEXT_PUBLIC_CONTACT_EMAIL=dev.kwak73@gmail.com
NEXT_PUBLIC_GA_ID=G-LQC7MLGKJV

# AdSense 승인 후 주석 해제
# NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
# NEXT_PUBLIC_ADSENSE_SLOT_LIST=1234567890
```

### 7. 키 입력 후 재빌드 & 재시작
```bash
cd /var/www/auction-blog
npm run build
pm2 restart auction-blog
```

---

## 이후 업데이트 배포

코드 변경 사항을 배포할 때:
```bash
cd /var/www/auction-blog
git pull
npm install
npm run build
pm2 restart auction-blog
```

---

## 유용한 명령어

```bash
# 앱 상태 확인
pm2 status

# 실시간 로그
pm2 logs auction-blog

# 글 수동 생성 (즉시 1개 발행)
cd /var/www/auction-blog && npm run generate

# 자동 생성 로그 확인
tail -f /var/www/auction-blog/scripts/generate.log

# Nginx 설정 테스트
nginx -t

# SSL 인증서 갱신 (자동 갱신되지만 수동 테스트 시)
certbot renew --dry-run
```

---

## 자동 글 발행 스케줄

- **주기**: 평일(월~금) 오전 7시
- **분량**: 130개 주제 순서대로 1일 1개
- **기간**: 약 6개월 (기초 43편 → 중급 43편 → 고급 44편)
- **로그**: `/var/www/auction-blog/scripts/generate.log`

크론탭 확인:
```bash
crontab -l
```

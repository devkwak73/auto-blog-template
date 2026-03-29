"use client";

export default function WingBanner() {
  return (
    <div className="wing-banner">

      {/* 상단: 경매도우미 */}
      <a
        href="https://www.easyhelper.kr/"
        target="_blank"
        rel="noopener noreferrer"
        className="wing-card wing-card--dark"
      >
        <div className="wing-card__icon">🏠</div>
        <div className="wing-card__title">경매도우미</div>
        <div className="wing-card__divider" />
        <div className="wing-card__desc">
          AI로 쉽게<br />경매 분석하기
        </div>
        <div className="wing-card__cta">바로가기 →</div>
      </a>

      {/* 하단: 토닥토닥 곁에 */}
      <a
        href="https://play.google.com/store/apps/details?id=com.todak.seniorsafetyguardian&hl=ko"
        target="_blank"
        rel="noopener noreferrer"
        className="wing-card wing-card--light"
      >
        <div className="wing-card__icon">📱</div>
        <div className="wing-card__title">토닥토닥 곁에</div>
        <div className="wing-card__divider" />
        <div className="wing-card__desc">
          시니어 안전<br />안드로이드 앱
        </div>
        <div className="wing-card__cta">무료 다운로드</div>
      </a>

    </div>
  );
}

-- ============================================
-- auto-blog PostgreSQL 초기화 스크립트
-- 사용 스택: Vercel + Neon / Vercel + Supabase
-- 파일: sql/init.pg.sql
-- ============================================

-- ──────────────────────────────────────────
-- 글 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  content          TEXT NOT NULL,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  category         VARCHAR(50) DEFAULT 'general',
  thumbnail_url    VARCHAR(500) DEFAULT NULL,
  meta_description VARCHAR(300) DEFAULT NULL,
  keywords         VARCHAR(500) DEFAULT NULL,
  status           VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at     TIMESTAMPTZ DEFAULT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  view_count       INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_status_published ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_slug ON posts (slug);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_updated_at ON posts;
CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────
-- 댓글 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id     INT NOT NULL,
  nickname    VARCHAR(30) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  content     TEXT NOT NULL,
  ip_hash     VARCHAR(64) NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_approved ON comments (post_id, is_approved, created_at DESC);

-- ──────────────────────────────────────────
-- 좋아요 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id      INT NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT uk_post_visitor UNIQUE (post_id, visitor_hash),
  CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ──────────────────────────────────────────
-- 스팸 로그 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS spam_logs (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_address   VARCHAR(45) NOT NULL,
  trigger_type VARCHAR(20) NOT NULL CHECK (trigger_type IN ('honeypot', 'rate_limit', 'captcha_fail')),
  request_data TEXT DEFAULT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_created ON spam_logs (ip_address, created_at DESC);

-- ──────────────────────────────────────────
-- Rate Limit 추적 테이블
-- (PostgreSQL은 MEMORY 엔진 없음 → 일반 테이블 사용)
-- ──────────────────────────────────────────
CREATE UNLOGGED TABLE IF NOT EXISTS rate_limits (
  ip_address   VARCHAR(45) NOT NULL,
  endpoint     VARCHAR(50) NOT NULL,
  hit_count    INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (ip_address, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_window ON rate_limits (window_start);

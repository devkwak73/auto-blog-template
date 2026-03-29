-- ============================================
-- auction-blog DB 초기화 스크립트
-- 파일: sql/init.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS auction_blog
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE auction_blog;

-- ──────────────────────────────────────────
-- 글 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  content          LONGTEXT NOT NULL,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  category         VARCHAR(50) DEFAULT 'general',
  thumbnail_url    VARCHAR(500) DEFAULT NULL,
  meta_description VARCHAR(300) DEFAULT NULL,
  keywords         VARCHAR(500) DEFAULT NULL,
  status           ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
  published_at     DATETIME DEFAULT NULL,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  view_count       INT DEFAULT 0,

  INDEX idx_status_published (status, published_at DESC),
  INDEX idx_category (category),
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
-- 댓글 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  post_id     INT NOT NULL,
  nickname    VARCHAR(30) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  content     TEXT NOT NULL,
  ip_hash     VARCHAR(64) NOT NULL,
  is_approved TINYINT(1) DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_post_approved (post_id, is_approved, created_at DESC),
  CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
-- 좋아요 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  post_id      INT NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_post_visitor (post_id, visitor_hash),
  CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
-- 스팸 로그 테이블
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS spam_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  ip_address   VARCHAR(45) NOT NULL,
  trigger_type ENUM('honeypot', 'rate_limit', 'captcha_fail') NOT NULL,
  request_data TEXT DEFAULT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_ip_created (ip_address, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
-- Rate Limit 추적 테이블 (MEMORY 엔진)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_address   VARCHAR(45) NOT NULL,
  endpoint     VARCHAR(50) NOT NULL,
  hit_count    INT DEFAULT 1,
  window_start DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (ip_address, endpoint),
  INDEX idx_window (window_start)
) ENGINE=MEMORY;

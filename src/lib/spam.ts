import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const RATE_LIMIT = Number(process.env.COMMENT_RATE_LIMIT) || 3;
const RATE_WINDOW = Number(process.env.RATE_LIMIT_WINDOW) || 60; // 초

export function checkHoneypot(body: Record<string, unknown>): boolean {
  // "website" 필드에 값이 있으면 봇으로 판정
  return Boolean(body.website);
}

export async function logSpam(
  ipAddress: string,
  triggerType: "honeypot" | "rate_limit" | "captcha_fail",
  requestData?: string
): Promise<void> {
  try {
    await pool.query(
      "INSERT INTO spam_logs (ip_address, trigger_type, request_data) VALUES (?, ?, ?)",
      [ipAddress, triggerType, requestData || null]
    );
  } catch {
    // 로그 실패는 무시
  }
}

export async function checkRateLimit(
  ipAddress: string,
  endpoint: string
): Promise<{ limited: boolean; requireCaptcha: boolean }> {
  try {
    // 현재 윈도우 내 hit 확인
    const [[row]] = await pool.query<RowDataPacket[]>(
      `SELECT hit_count, window_start FROM rate_limits WHERE ip_address = ? AND endpoint = ?`,
      [ipAddress, endpoint]
    );

    const now = new Date();

    if (row) {
      const windowStart = new Date(row.window_start);
      const diffSeconds = (now.getTime() - windowStart.getTime()) / 1000;

      if (diffSeconds > RATE_WINDOW) {
        // 윈도우 만료 → 카운터 초기화
        await pool.query(
          `UPDATE rate_limits SET hit_count = 1, window_start = NOW() WHERE ip_address = ? AND endpoint = ?`,
          [ipAddress, endpoint]
        );
        return { limited: false, requireCaptcha: false };
      }

      // 윈도우 내 hit_count 확인
      if (row.hit_count >= RATE_LIMIT) {
        await logSpam(ipAddress, "rate_limit");
        return { limited: true, requireCaptcha: true };
      }

      // 카운터 증가
      await pool.query(
        `UPDATE rate_limits SET hit_count = hit_count + 1 WHERE ip_address = ? AND endpoint = ?`,
        [ipAddress, endpoint]
      );
    } else {
      // 첫 요청 - 신규 레코드 삽입
      await pool.query<ResultSetHeader>(
        `INSERT INTO rate_limits (ip_address, endpoint, hit_count, window_start) VALUES (?, ?, 1, NOW())`,
        [ipAddress, endpoint]
      );
    }

    return { limited: false, requireCaptcha: false };
  } catch {
    // rate limit 테이블 오류 시 통과 허용 (MEMORY 엔진 재시작 등)
    return { limited: false, requireCaptcha: false };
  }
}

export async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  if (!secretKey) return false;

  // 개발용 테스트 키는 항상 통과
  if (secretKey === "0x0000000000000000000000000000000000000000") return true;

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

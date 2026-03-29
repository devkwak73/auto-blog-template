/**
 * 슬러그 생성: 영문/숫자는 그대로, 한국어는 그대로 유지 (URL encode 허용)
 * 특수문자/공백은 하이픈으로 변환, 고유성을 위해 타임스탬프 접미사 추가
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const suffix = Date.now().toString(36);
  return base ? `${base}-${suffix}` : suffix;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export function verifyAdminKey(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === process.env.ADMIN_API_KEY;
}

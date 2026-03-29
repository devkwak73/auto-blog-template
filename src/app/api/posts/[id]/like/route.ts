import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { sha256 } from "@/lib/hash";
import { getClientIp } from "@/lib/seo";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const [[post]] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM posts WHERE id = ?",
      [postId]
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const ip = getClientIp(request);
    const ua = request.headers.get("user-agent") || "";
    const visitorHash = sha256(ip + ua);

    // 좋아요 토글: INSERT 시도 → 중복이면 DELETE
    let liked = false;
    try {
      await pool.query<ResultSetHeader>(
        "INSERT INTO likes (post_id, visitor_hash) VALUES (?, ?)",
        [postId, visitorHash]
      );
      liked = true;
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException & { code: string }).code === "ER_DUP_ENTRY") {
        // 이미 좋아요 → 취소
        await pool.query(
          "DELETE FROM likes WHERE post_id = ? AND visitor_hash = ?",
          [postId, visitorHash]
        );
        liked = false;
      } else {
        throw err;
      }
    }

    const [[{ count }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
      [postId]
    );

    return NextResponse.json({ liked, count });
  } catch (error) {
    console.error("POST /api/posts/[id]/like error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

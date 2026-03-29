import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
import { verifyAdminKey } from "@/lib/seo";
import { RowDataPacket, ResultSetHeader } from "mysql2";

function toMysqlDatetime(value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const [[post]] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM posts WHERE id = ?",
      [postId]
    );

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 조회수 증가
    await pool.query("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [postId]);

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = ["title", "content", "slug", "category", "thumbnail_url", "meta_description", "keywords", "status", "published_at"];
    const updates: string[] = [];
    const values: unknown[] = [];

    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = ?`);
        values.push(field === "published_at" ? toMysqlDatetime(body[field]) : body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(postId);
    await pool.query<ResultSetHeader>(
      `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    // ISR 재생성
    const [[post]] = await pool.query<RowDataPacket[]>("SELECT slug FROM posts WHERE id = ?", [postId]);
    if (post) {
      revalidatePath(`/posts/${post.slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const [[post]] = await pool.query<RowDataPacket[]>("SELECT slug FROM posts WHERE id = ?", [postId]);

    await pool.query("DELETE FROM posts WHERE id = ?", [postId]);

    if (post) {
      revalidatePath(`/posts/${post.slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

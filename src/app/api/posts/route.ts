import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
import { generateSlug, verifyAdminKey } from "@/lib/seo";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ISO 8601 datetime → MySQL DATETIME 형식 변환
function toMysqlDatetime(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const category = searchParams.get("category") || null;
    const offset = (page - 1) * limit;

    let countQuery = "SELECT COUNT(*) as total FROM posts WHERE status = 'published'";
    let dataQuery = `
      SELECT id, title, slug, category, thumbnail_url, meta_description,
             published_at, created_at, view_count
      FROM posts
      WHERE status = 'published'
    `;
    const params: (string | number)[] = [];
    const countParams: (string | number)[] = [];

    if (category) {
      countQuery += " AND category = ?";
      dataQuery += " AND category = ?";
      params.push(category);
      countParams.push(category);
    }

    dataQuery += " ORDER BY published_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [[{ total }]] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const [posts] = await pool.query<RowDataPacket[]>(dataQuery, params);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 });
    }

    const finalSlug = slug || generateSlug(title);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO posts (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        content,
        finalSlug,
        category || "general",
        thumbnail_url || null,
        meta_description || null,
        keywords || null,
        status || "draft",
        toMysqlDatetime(published_at),
      ]
    );

    revalidatePath("/");
    if (status === "published") {
      revalidatePath(`/posts/${finalSlug}`);
    }

    return NextResponse.json({ id: result.insertId, slug: finalSlug }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "slug already exists" }, { status: 409 });
    }
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

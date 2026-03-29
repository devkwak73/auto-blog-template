export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  category: string;
  thumbnail_url: string | null;
  meta_description: string | null;
  keywords: string | null;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
}

export interface Comment {
  id: number;
  post_id: number;
  nickname: string;
  content: string;
  ip_hash: string;
  is_approved: number;
  created_at: string;
}

export interface Like {
  id: number;
  post_id: number;
  visitor_hash: string;
  created_at: string;
}

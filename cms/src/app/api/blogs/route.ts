import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// CORSヘッダー設定
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("id, slug, title, description, category, featured_image, published_at, reading_time")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(100) // 最大100件に制限

  if (error) {
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500, headers: corsHeaders }
    )
  }

  return NextResponse.json(blogs, { headers: corsHeaders })
}

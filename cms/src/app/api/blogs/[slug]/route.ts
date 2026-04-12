import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isValidSlug } from "@/lib/validation"

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // スラッグのバリデーション
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json(
      { error: "無効なスラッグです" },
      { status: 400, headers: corsHeaders }
    )
  }

  const supabase = await createClient()

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !blog) {
    return NextResponse.json(
      { error: "ブログが見つかりません" },
      { status: 404, headers: corsHeaders }
    )
  }

  return NextResponse.json(blog, { headers: corsHeaders })
}

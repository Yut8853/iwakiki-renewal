import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 })
  }

  return NextResponse.json(blog)
}

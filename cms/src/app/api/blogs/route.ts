import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(blogs)
}

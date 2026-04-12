import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BlogForm } from "../blog-form"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !blog) {
    notFound()
  }

  return <BlogForm blog={blog} />
}

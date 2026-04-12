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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">記事を編集</h2>
        <p className="mt-1 text-muted-foreground">
          ブログ記事の内容を編集します
        </p>
      </div>

      <BlogForm blog={blog} />
    </div>
  )
}

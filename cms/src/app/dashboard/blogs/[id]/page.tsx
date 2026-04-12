import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BlogForm } from "../blog-form"
import { Edit2, ArrowLeft, Calendar, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

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
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/blogs"
            className="p-2 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-all mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-[var(--primary)]/10">
                <Edit2 className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Edit Article
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] mb-2">
              記事を編集
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {/* ステータスバッジ */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                blog.published
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {blog.published ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
                {blog.published ? "公開中" : "下書き"}
              </span>
              
              {/* 作成日 */}
              <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Calendar className="h-3 w-3" />
                {new Date(blog.created_at).toLocaleDateString("ja-JP", {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BlogForm blog={blog} />
    </div>
  )
}

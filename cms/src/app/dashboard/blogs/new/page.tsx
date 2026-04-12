import { BlogForm } from "../blog-form"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/blogs"
            className="p-2 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-[var(--primary)]/10">
                <Plus className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                New Article
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              新規記事作成
            </h1>
          </div>
        </div>
      </div>

      <BlogForm />
    </div>
  )
}

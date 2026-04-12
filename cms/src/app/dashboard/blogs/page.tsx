import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "./delete-button"
import { 
  Plus, 
  FileText, 
  Calendar, 
  Link as LinkIcon, 
  Edit2
} from "lucide-react"

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-red-500 font-medium">エラーが発生しました</p>
        <p className="mt-1 text-sm text-red-500/80">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
            ブログ管理
          </h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            記事の作成、編集、公開設定を管理します
          </p>
        </div>
        
        <Link
          href="/dashboard/blogs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          新規作成
        </Link>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {/* テーブル - PC */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    タイトル
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    スラッグ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    ステータス
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    作成日
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[var(--secondary)]">
                          <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/blogs/${blog.id}`}
                            className="font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                          >
                            {blog.title}
                          </Link>
                          {blog.description && (
                            <p className="mt-1 text-sm text-[var(--muted-foreground)] truncate max-w-xs">
                              {blog.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <code className="text-sm text-[var(--muted-foreground)] font-mono">
                          {blog.slug}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                        blog.published
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          blog.published ? "bg-emerald-500" : "bg-amber-500"
                        }`} />
                        {blog.published ? "公開中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(blog.created_at).toLocaleDateString("ja-JP")}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/blogs/${blog.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          編集
                        </Link>
                        <DeleteButton blogId={blog.id} blogTitle={blog.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* カード - モバイル */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/blogs/${blog.id}`}
                      className="font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                      {new Date(blog.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    blog.published
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {blog.published ? "公開" : "下書き"}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/dashboard/blogs/${blog.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    編集
                  </Link>
                  <DeleteButton blogId={blog.id} blogTitle={blog.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-12 text-center">
          <FileText className="h-10 w-10 text-[var(--muted-foreground)] mx-auto" />
          <h3 className="mt-4 font-medium text-[var(--foreground)]">
            記事がまだありません
          </h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            最初の記事を作成して、コンテンツを発信しましょう
          </p>
          <Link
            href="/dashboard/blogs/new"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            記事を作成
          </Link>
        </div>
      )}
    </div>
  )
}

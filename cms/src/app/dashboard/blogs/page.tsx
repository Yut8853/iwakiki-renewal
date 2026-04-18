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

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-12">

      {/* ===================== */}
      {/* ヘッダー */}
      {/* ===================== */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            ブログ管理
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            記事の作成・編集・公開を管理
          </p>
        </div>

        <Link
          href="/dashboard/blogs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          新規作成
        </Link>
      </div>

      {/* ===================== */}
      {/* コンテンツ */}
      {/* ===================== */}
      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] font-semibold">
          Articles
        </h2>

        {blogs && blogs.length > 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">

            {/* テーブル */}
            <div className="overflow-x-auto">
              <table className="w-full">

                {/* ヘッダー */}
                <thead className="bg-[var(--secondary)]/60">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-medium uppercase text-[var(--muted-foreground)]">
                      記事
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase text-[var(--muted-foreground)]">
                      スラッグ
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase text-[var(--muted-foreground)]">
                      状態
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase text-[var(--muted-foreground)]">
                      作成日
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase text-[var(--muted-foreground)]">
                      操作
                    </th>
                  </tr>
                </thead>

                {/* ボディ */}
                <tbody className="divide-y divide-[var(--border)]">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-[var(--secondary)]/40 transition"
                    >
                      {/* タイトル */}
                      <td className="px-6 py-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-[var(--secondary)]">
                            <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                          </div>

                          <div className="space-y-1 min-w-0">
                            <Link
                              href={`/dashboard/blogs/${blog.id}`}
                              className="font-medium text-[var(--foreground)] hover:text-[var(--primary)]"
                            >
                              {blog.title}
                            </Link>

                            {blog.description && (
                              <p className="text-sm text-[var(--muted-foreground)] truncate max-w-sm">
                                {blog.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* スラッグ */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <LinkIcon className="h-3.5 w-3.5" />
                          <code>{blog.slug}</code>
                        </div>
                      </td>

                      {/* ステータス */}
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {blog.published ? "公開中" : "下書き"}
                        </span>
                      </td>

                      {/* 日付 */}
                      <td className="px-6 py-6 text-sm text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(blog.created_at).toLocaleDateString("ja-JP")}
                        </div>
                      </td>

                      {/* 操作 */}
                      <td className="px-6 py-6">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/blogs/${blog.id}`}
                            className="px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--secondary)]"
                          >
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
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-14 text-center">
            <FileText className="h-10 w-10 text-[var(--muted-foreground)] mx-auto" />
            <p className="mt-4 text-[var(--muted-foreground)]">
              記事がありません
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
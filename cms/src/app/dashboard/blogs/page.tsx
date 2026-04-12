import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "./delete-button"
import { Plus, FileText, Calendar, Link as LinkIcon, Edit2, ChevronRight } from "lucide-react"

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 animate-in fade-in">
        <div className="flex items-center gap-3 text-destructive">
          <div className="rounded-full bg-destructive/10 p-2">⚠️</div>
          <p className="font-semibold">エラーが発生しました: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* ヘッダーセクション */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">ブログ管理</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            コンテンツの作成と管理をここから行います。公開設定やURLスラッグの管理が可能です。
          </p>
        </div>
        <Link
          href="/dashboard/blogs/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          新規作成
        </Link>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="grid gap-4">
          {/* PC版：リッチなテーブル（カード風） */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">記事タイトル</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">URLスラッグ</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">ステータス</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">作成日時</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="group transition-colors hover:bg-muted/20">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <Link
                          href={`/dashboard/blogs/${blog.id}`}
                          className="font-bold text-foreground hover:underline decoration-primary underline-offset-4"
                        >
                          {blog.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-mono bg-muted/50 w-fit px-2 py-1 rounded">
                        <LinkIcon className="h-3 w-3" />
                        {blog.slug}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                          blog.published
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${blog.published ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                        {blog.published ? "公開中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(blog.created_at).toLocaleDateString("ja-JP", { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/blogs/${blog.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-sm transition-all hover:bg-muted"
                        >
                          <Edit2 className="h-3 w-3" />
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

          {/* モバイル版：スタックカード形式 */}
          <div className="md:hidden space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm active:scale-[0.98] transition-transform">
                 <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        blog.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {blog.published ? "公開中" : "下書き"}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{new Date(blog.created_at).toLocaleDateString("ja-JP")}</p>
                 </div>
                 <h3 className="font-bold text-lg mb-4 line-clamp-1">{blog.title}</h3>
                 <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Link href={`/dashboard/blogs/${blog.id}`} className="text-xs font-bold bg-muted px-4 py-2 rounded-lg">編集</Link>
                        <DeleteButton blogId={blog.id} blogTitle={blog.title} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-20 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
             <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">記事がまだありません</h3>
          <p className="mt-2 text-muted-foreground">魅力的なストーリーを世界に発信しましょう。</p>
          <Link
            href="/dashboard/blogs/new"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:shadow-xl hover:shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            最初の記事を作成
          </Link>
        </div>
      )}
    </div>
  )
}
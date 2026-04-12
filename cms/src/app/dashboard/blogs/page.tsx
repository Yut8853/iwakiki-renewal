import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "./delete-button"
import { 
  Plus, 
  FileText, 
  Calendar, 
  Link as LinkIcon, 
  Edit2, 
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ExternalLink
} from "lucide-react"

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-8 animate-fade-in">
        <div className="flex items-center gap-4 text-[var(--destructive)]">
          <div className="p-3 rounded-xl bg-[var(--destructive)]/10">
            <span className="text-2xl">!</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">エラーが発生しました</h3>
            <p className="text-sm opacity-80">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[var(--primary)]/10">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Content Management
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            ブログ管理
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-md">
            記事の作成・編集・公開設定をここから管理できます。
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* 検索バー */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] w-full sm:w-64">
            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="記事を検索..."
              className="bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none flex-1"
            />
          </div>
          
          {/* フィルターボタン */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)] transition-all">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">フィルター</span>
          </button>
          
          {/* 新規作成ボタン */}
          <Link
            href="/dashboard/blogs/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white text-sm font-semibold shadow-lg shadow-[var(--primary)]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            新規作成
          </Link>
        </div>
      </div>

      {blogs && blogs.length > 0 ? (
        <>
          {/* PC版：リッチなテーブル */}
          <div className="hidden lg:block rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--secondary)]/30">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    記事タイトル
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    スラッグ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    ステータス
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    作成日
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {blogs.map((blog, index) => (
                  <tr 
                    key={blog.id} 
                    className="group transition-colors hover:bg-[var(--secondary)]/30 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-[var(--secondary)] group-hover:bg-[var(--primary)]/10 transition-all duration-300">
                          <FileText className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/blogs/${blog.id}`}
                            className="font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors block truncate max-w-xs"
                          >
                            {blog.title}
                          </Link>
                          {blog.description && (
                            <p className="text-xs text-[var(--muted-foreground)] truncate max-w-xs mt-0.5">
                              {blog.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <code className="px-2.5 py-1 rounded-lg bg-[var(--secondary)] text-xs font-mono text-[var(--muted-foreground)]">
                          {blog.slug}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                        blog.published
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          blog.published ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                        }`} />
                        {blog.published ? "公開中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.created_at).toLocaleDateString("ja-JP", { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        {blog.published && (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                            title="プレビュー"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/dashboard/blogs/${blog.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--secondary)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
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

          {/* タブレット・モバイル版：カード形式 */}
          <div className="lg:hidden space-y-3">
            {blogs.map((blog, index) => (
              <div 
                key={blog.id} 
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      blog.published
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${blog.published ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                      {blog.published ? "公開中" : "下書き"}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <Link href={`/dashboard/blogs/${blog.id}`}>
                    <h3 className="font-bold text-lg text-[var(--foreground)] mb-2 line-clamp-2 hover:text-[var(--primary)] transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  {blog.description && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4">
                      {blog.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="h-3 w-3" />
                      <span className="font-mono">{blog.slug}</span>
                    </div>
                    <span className="text-[var(--border)]">|</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.created_at).toLocaleDateString("ja-JP")}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex border-t border-[var(--border)] divide-x divide-[var(--border)]">
                  <Link 
                    href={`/dashboard/blogs/${blog.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    編集
                  </Link>
                  {blog.published && (
                    <a
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      表示
                    </a>
                  )}
                  <div className="flex-1 flex items-center justify-center">
                    <DeleteButton blogId={blog.id} blogTitle={blog.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* 空の状態 */
        <div className="rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50 p-12 lg:p-20 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)]/10 to-[var(--gradient-end)]/10 flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-[var(--primary)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            記事がまだありません
          </h3>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            最初のブログ記事を作成して、コンテンツの発信を始めましょう。
          </p>
          <Link
            href="/dashboard/blogs/new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-bold shadow-xl shadow-[var(--primary)]/25 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--primary)]/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            最初の記事を作成
          </Link>
        </div>
      )}
    </div>
  )
}

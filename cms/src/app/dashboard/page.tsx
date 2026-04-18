import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { 
  FileText, 
  CheckCircle2, 
  FileEdit, 
  Plus, 
  ArrowRight,
  Clock
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { count: blogCount } = await supabase
    .from("blogs")
    .select("*", { count: "exact", head: true })

  const { count: publishedCount } = await supabase
    .from("blogs")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  const { count: draftCount } = await supabase
    .from("blogs")
    .select("*", { count: "exact", head: true })
    .eq("published", false)

  const { data: recentBlogs } = await supabase
    .from("blogs")
    .select("id, title, published, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { 
      label: "総記事数", 
      value: blogCount ?? 0, 
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      label: "公開中", 
      value: publishedCount ?? 0, 
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      label: "下書き", 
      value: draftCount ?? 0, 
      icon: FileEdit,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ]

  return (
    <div className="space-y-12">

      {/* ===================== */}
      {/* ヘッダー */}
      {/* ===================== */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          ダッシュボード
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          コンテンツの概要と最近の更新を確認できます
        </p>
      </div>

      {/* ===================== */}
      {/* 概要 */}
      {/* ===================== */}
      <section className="space-y-6">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          Overview
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <p className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== */}
      {/* コンテンツ */}
      {/* ===================== */}
      <section className="space-y-6">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          Content
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* 最近の記事 */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">

              {/* header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h3 className="font-medium text-[var(--foreground)]">
                    最近の記事
                  </h3>
                </div>

                <Link 
                  href="/dashboard/blogs"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  すべて表示
                </Link>
              </div>

              {/* list */}
              <div className="divide-y divide-[var(--border)]">
                {recentBlogs && recentBlogs.length > 0 ? (
                  recentBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/dashboard/blogs/${blog.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-[var(--secondary)]/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--foreground)] truncate">
                          {blog.title}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {new Date(blog.created_at).toLocaleDateString("ja-JP")}
                        </p>
                      </div>

                      <div className="ml-4 flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          blog.published
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {blog.published ? "公開" : "下書き"}
                        </span>

                        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <FileText className="h-8 w-8 text-[var(--muted-foreground)] mx-auto" />
                    <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                      記事がまだありません
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-7">
              <h3 className="font-medium text-[var(--foreground)]">
                クイックアクション
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                新しい記事を作成するか、既存の記事を管理します
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/dashboard/blogs/new"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition"
                >
                  <Plus className="h-4 w-4" />
                  新規記事を作成
                </Link>

                <Link
                  href="/dashboard/blogs"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--secondary)] transition"
                >
                  記事一覧を表示
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
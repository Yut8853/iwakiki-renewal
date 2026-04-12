import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { 
  FileText, 
  CheckCircle2, 
  FileEdit, 
  Plus, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Zap,
  Sparkles
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

  // 最新の記事を取得
  const { data: recentBlogs } = await supabase
    .from("blogs")
    .select("id, title, published, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { 
      label: "総記事数", 
      value: blogCount ?? 0, 
      href: "/dashboard/blogs",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/20",
      bgIcon: "bg-blue-500/10",
      textIcon: "text-blue-400"
    },
    { 
      label: "公開中", 
      value: publishedCount ?? 0, 
      href: "/dashboard/blogs", 
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20",
      bgIcon: "bg-emerald-500/10",
      textIcon: "text-emerald-400"
    },
    { 
      label: "下書き", 
      value: draftCount ?? 0, 
      href: "/dashboard/blogs", 
      icon: FileEdit,
      gradient: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
      bgIcon: "bg-amber-500/10",
      textIcon: "text-amber-400"
    },
  ]

  return (
    <div className="space-y-8">
      {/* ウェルカムヒーロー */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] border border-[var(--border)] p-8 lg:p-10">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--primary)]/20 to-purple-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                  <Zap className="h-3.5 w-3.5 text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-[var(--primary)]">Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">Active</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[var(--foreground)]">
                おかえりなさい
              </h1>
              <p className="text-[var(--muted-foreground)] max-w-md text-sm lg:text-base leading-relaxed">
                現在 <span className="text-[var(--foreground)] font-semibold">{publishedCount ?? 0}</span> 件の記事が公開されています。
                今日も素晴らしいコンテンツを作成しましょう。
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/blogs/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold shadow-lg shadow-[var(--primary)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                新規記事を作成
              </Link>
              <Link
                href="/dashboard/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] font-semibold transition-all duration-300 hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)]"
              >
                記事一覧
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 transition-all duration-500 hover:border-[var(--border-hover)] hover:shadow-xl ${stat.glow} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* グラデーション背景ホバー */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            {/* アイコンとトレンド */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgIcon} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-6 w-6 ${stat.textIcon}`} />
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">+12%</span>
              </div>
            </div>
            
            {/* 数値とラベル */}
            <div className="relative">
              <p className="text-4xl font-black text-[var(--foreground)] tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
                {stat.label}
              </p>
            </div>
            
            {/* ボトムアクセント */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Link>
        ))}
      </div>

      {/* 2カラムレイアウト */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 最近の記事 */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                <Clock className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="font-bold text-[var(--foreground)]">最近の記事</h2>
                <p className="text-xs text-[var(--muted-foreground)]">直近5件の記事</p>
              </div>
            </div>
            <Link 
              href="/dashboard/blogs"
              className="text-xs font-semibold text-[var(--primary)] hover:underline underline-offset-4"
            >
              すべて表示
            </Link>
          </div>
          
          <div className="divide-y divide-[var(--border)]">
            {recentBlogs && recentBlogs.length > 0 ? (
              recentBlogs.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/dashboard/blogs/${blog.id}`}
                  className="flex items-center justify-between p-4 hover:bg-[var(--secondary)]/50 transition-colors group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2 rounded-lg bg-[var(--secondary)] group-hover:bg-[var(--primary)]/10 transition-colors">
                      <FileText className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                        {blog.title}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {new Date(blog.created_at).toLocaleDateString("ja-JP", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      blog.published
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {blog.published ? "公開" : "下書き"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-[var(--muted-foreground)]" />
                </div>
                <p className="text-[var(--muted-foreground)] text-sm">記事がまだありません</p>
              </div>
            )}
          </div>
        </div>

        {/* クイックアクション */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] border border-[var(--border)] p-6 group hover:border-[var(--primary)]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] shadow-lg shadow-[var(--primary)]/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">新規作成</h3>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-5 leading-relaxed">
              新しいブログ記事の執筆を開始します。下書きはいつでも保存可能です。
            </p>
            <Link
              href="/dashboard/blogs/new"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold text-sm shadow-lg shadow-[var(--primary)]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30"
            >
              <Plus className="h-4 w-4" />
              エディタを開く
            </Link>
          </div>

          <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 group hover:border-[var(--border-hover)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[var(--secondary)]">
                <FileText className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">記事の管理</h3>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-5 leading-relaxed">
              既存の記事を編集・削除したり、公開設定を変更できます。
            </p>
            <Link
              href="/dashboard/blogs"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] font-semibold text-sm border border-[var(--border)] transition-all duration-300 hover:bg-[var(--card-hover)] group-hover:border-[var(--border-hover)]"
            >
              記事一覧へ
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

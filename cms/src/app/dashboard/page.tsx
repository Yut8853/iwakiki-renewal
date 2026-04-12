import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { 
  FileText, 
  CheckCircle2, 
  FileEdit, 
  Plus, 
  ArrowRight, 
  LayoutDashboard,
  BarChart3
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

  const stats = [
    { 
      label: "総記事数", 
      value: blogCount ?? 0, 
      href: "/dashboard/blogs",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "公開中の記事", 
      value: publishedCount ?? 0, 
      href: "/dashboard/blogs", 
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    { 
      label: "下書き保存", 
      value: draftCount ?? 0, 
      href: "/dashboard/blogs", 
      icon: FileEdit,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in duration-500">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              おかえりなさい！
            </h2>
            <p className="mt-2 text-slate-400 max-w-md font-medium">
              現在 {publishedCount ?? 0} 件の記事が公開されています。今日も新しいコンテンツを作成しましょう。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/blogs/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              新規記事を書く
            </Link>
          </div>
        </div>
        {/* 背景の装飾用グラデーション */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* 統計カードセクション */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-1 transition-all hover:shadow-xl hover:shadow-muted/50"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl ${stat.bgColor} ${stat.color} p-3 transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <BarChart3 className="h-4 w-4 text-muted/30" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-foreground tracking-tighter">
                    {stat.value}
                  </p>
                  <span className="text-xs font-bold text-muted-foreground">件</span>
                </div>
              </div>
            </div>
            {/* カード下部のアクセント線 */}
            <div className={`h-1 w-full ${stat.color.replace('text', 'bg')} opacity-20`} />
          </Link>
        ))}
      </div>

      {/* クイックアクション/ショートカット */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-8 flex flex-col justify-between group">
          <div>
            <h3 className="text-xl font-bold mb-2">コンテンツ作成</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              エディタを開いて、新しいブログ記事の執筆を開始します。下書きはいつでも保存可能です。
            </p>
          </div>
          <Link
            href="/dashboard/blogs/new"
            className="flex items-center gap-2 text-sm font-black text-primary group-hover:gap-4 transition-all"
          >
            エディタを開く <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 flex flex-col justify-between group">
          <div>
            <h3 className="text-xl font-bold mb-2">記事の整理</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              過去の記事を編集したり、公開ステータスの変更、不要な記事の削除を一括で行えます。
            </p>
          </div>
          <Link
            href="/dashboard/blogs"
            className="flex items-center gap-2 text-sm font-black text-foreground group-hover:gap-4 transition-all"
          >
            記事一覧へ移動 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
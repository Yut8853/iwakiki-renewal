import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

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
    { label: "総記事数", value: blogCount ?? 0, href: "/dashboard/blogs" },
    { label: "公開中", value: publishedCount ?? 0, href: "/dashboard/blogs?status=published" },
    { label: "下書き", value: draftCount ?? 0, href: "/dashboard/blogs?status=draft" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">ダッシュボード</h2>
        <p className="mt-1 text-muted-foreground">
          ブログコンテンツを管理します
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/dashboard/blogs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          新規記事を作成
        </Link>
        <Link
          href="/dashboard/blogs"
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          記事一覧を見る
        </Link>
      </div>
    </div>
  )
}

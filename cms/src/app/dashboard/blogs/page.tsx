import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "./delete-button"

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive">エラーが発生しました: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ブログ管理</h2>
          <p className="mt-1 text-muted-foreground">
            ブログ記事の作成・編集・削除を行います
          </p>
        </div>
        <Link
          href="/dashboard/blogs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          新規作成
        </Link>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  タイトル
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  スラッグ
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  ステータス
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  作成日
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.map((blog) => (
                <tr key={blog.id} className="bg-card hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/blogs/${blog.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {blog.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {blog.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        blog.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.published ? "公開中" : "下書き"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(blog.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/blogs/${blog.id}`}
                        className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
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
      ) : (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">まだブログ記事がありません</p>
          <Link
            href="/dashboard/blogs/new"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            最初の記事を作成
          </Link>
        </div>
      )}
    </div>
  )
}

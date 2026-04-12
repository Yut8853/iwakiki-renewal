"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Blog {
  id: string
  title: string
  slug: string
  description: string
  content: string
  featured_image: string | null
  category: string | null
  published: boolean
  published_at: string | null
}

export function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: blog?.title ?? "",
    slug: blog?.slug ?? "",
    description: blog?.description ?? "",
    content: blog?.content ?? "",
    featured_image: blog?.featured_image ?? "",
    category: blog?.category ?? "",
    published: blog?.published ?? false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    const data = {
      ...formData,
      featured_image: formData.featured_image || null,
      category: formData.category || null,
      published_at: formData.published ? new Date().toISOString() : null,
    }

    if (blog) {
      const { error: updateError } = await supabase
        .from("blogs")
        .update(data)
        .eq("id", blog.id)

      if (updateError) {
        setError("更新に失敗しました: " + updateError.message)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error: insertError } = await supabase.from("blogs").insert(data)

      if (insertError) {
        setError("作成に失敗しました: " + insertError.message)
        setIsSubmitting(false)
        return
      }
    }

    router.push("/dashboard/blogs")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  タイトル <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="記事のタイトル"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  スラッグ <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="url-friendly-slug"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  URLに使用される識別子です（例: my-blog-post）
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  説明文 <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="記事の概要"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  本文（Markdown） <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  required
                  rows={20}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Markdown形式で記事を書きます..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-medium text-foreground">公開設定</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      published: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-foreground"
                >
                  公開する
                </label>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  カテゴリ
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="カテゴリ名"
                />
              </div>

              <div>
                <label
                  htmlFor="featured_image"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  アイキャッチ画像URL
                </label>
                <input
                  type="url"
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_image: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting
                ? "保存中..."
                : blog
                  ? "更新する"
                  : "作成する"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

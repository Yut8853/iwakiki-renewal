"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// カテゴリ
const categories = [
  { value: "news", label: "お知らせ" },
  { value: "column", label: "コラム" },
  { value: "property", label: "物件情報" },
  { value: "lifestyle", label: "暮らし" },
]

export function BlogForm({ blog }: { blog?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
  }

  const generateUniqueSlug = async (title: string) => {
    const base = generateSlug(title) || `post-${Date.now()}`
    let slug = base
    let count = 1

    while (true) {
      const { data } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (!data) break

      slug = `${base}-${count}`
      count++
    }

    return slug
  }

  const [formData, setFormData] = useState({
    title: blog?.title ?? "",
    slug: blog?.slug ?? "",
    description: blog?.description ?? "",
    content: blog?.content ?? "",
    featured_image: blog?.featured_image ?? "",
    category: blog?.category ?? "",
    published: blog?.published ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        featured_image: formData.featured_image || null,
        category: formData.category || null,
        published: formData.published,
        published_at: formData.published
          ? (blog?.published_at ?? new Date().toISOString())
          : null,
      }

      if (blog?.id) {
        // 編集
        const { error } = await supabase
          .from("blogs")
          .update({
            ...payload,
            slug: blog.slug, // 編集時は既存slugを維持
          })
          .eq("id", blog.id)

        if (error) throw error
      } else {
        // 新規作成
        const finalSlug = await generateUniqueSlug(formData.title)

        const { error } = await supabase
          .from("blogs")
          .insert({
            ...payload,
            slug: finalSlug,
          })

        if (error) throw error
      }

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (err: any) {
      console.log(err)
      setError(err.message || "保存に失敗しました")
      setIsSubmitting(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm"

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/blogs"
          className="p-2 rounded-lg hover:bg-[var(--secondary)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-semibold">
          {blog ? "記事を編集" : "新規記事"}
        </h1>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <input
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value
                setFormData({
                  ...formData,
                  title,
                  slug: blog ? formData.slug : generateSlug(title),
                })
              }}
              placeholder="タイトル"
              className="text-3xl font-bold w-full bg-transparent outline-none"
            />

            <div className="text-sm text-gray-400">
              /blog/{blog ? blog.slug : formData.slug || "your-slug"}
            </div>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="説明"
              className={inputClass}
            />

            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={20}
              placeholder="本文"
              className={inputClass}
            />
          </div>

          <div className="space-y-6">
            <div className="border p-4 space-y-4 rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    published: !prev.published,
                  }))
                }
                className={`w-full border p-2 rounded-lg ${
                  formData.published
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-black"
                }`}
              >
                {formData.published ? "公開中" : "下書き"}
              </button>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className={inputClass}
              >
                <option value="">カテゴリ選択</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <input
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                placeholder="画像URL"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
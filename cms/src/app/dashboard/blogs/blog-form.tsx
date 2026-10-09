"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { imageMarkdown, insertBodyImage } from "@/lib/article-images"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// カテゴリ
const categories = [
  { value: "news", label: "お知らせ" },
  { value: "column", label: "コラム" },
  { value: "property", label: "売買・成約" },
  { value: "lifestyle", label: "地域の活動" },
  { value: "rental", label: "賃貸" },
  { value: "vacation", label: "貸別荘" },
]

export function BlogForm({ blog }: { blog?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const [imagePanelOpen, setImagePanelOpen] = useState(false)
  const [bodyImageUrl, setBodyImageUrl] = useState("")
  const [bodyImageDescription, setBodyImageDescription] = useState("")
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageNotice, setImageNotice] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [previewFailed, setPreviewFailed] = useState(false)
  const insertionRange = useRef<{start: number; end: number} | null>(null)

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

  const openImagePanel = () => {
    const body = bodyRef.current
    insertionRange.current = { start: body?.selectionStart ?? formData.content.length, end: body?.selectionEnd ?? formData.content.length }
    setImagePanelOpen(true)
    setImageError(null)
    setImageNotice("")
  }

  const previewImage = () => {
    try {
      imageMarkdown(bodyImageUrl, bodyImageDescription)
      setPreviewUrl(new URL(bodyImageUrl.trim()).href)
      setPreviewFailed(false)
      setImageError(null)
    } catch (err) { setImageError(err instanceof Error ? err.message : "画像URLを確認してください。") }
  }

  const insertImage = () => {
    try {
      const markdown = imageMarkdown(bodyImageUrl, bodyImageDescription)
      const range = insertionRange.current ?? { start: formData.content.length, end: formData.content.length }
      const result = insertBodyImage(formData.content, range.start, range.end, markdown)
      setFormData(previous => ({ ...previous, content: result.content }))
      setImagePanelOpen(false)
      setBodyImageUrl("")
      setBodyImageDescription("")
      setPreviewUrl("")
      setImageError(null)
      setImageNotice("本文に画像を挿入しました。記事を保存すると反映されます。")
      requestAnimationFrame(() => {
        bodyRef.current?.focus()
        bodyRef.current?.setSelectionRange(result.cursor, result.cursor)
      })
    } catch (err) { setImageError(err instanceof Error ? err.message : "画像を挿入できませんでした。") }
  }

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

            <section className="space-y-3" aria-labelledby="body-label">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label id="body-label" htmlFor="article-body" className="font-semibold">本文</label>
                <button type="button" onClick={openImagePanel} aria-expanded={imagePanelOpen} aria-controls="body-image-panel" className="rounded-lg border px-4 py-2 text-sm" disabled={isSubmitting}>
                  ＋ 本文に画像を追加
                </button>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">画像を入れたい位置をクリックしてから追加してください。複数枚を文章の間に挿入できます。</p>
              <textarea
                id="article-body"
                ref={bodyRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                onSelect={(e) => { insertionRange.current = { start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd } }}
                rows={20}
                placeholder="本文（Markdown形式）"
                className={inputClass}
                disabled={isSubmitting}
              />
              {imagePanelOpen && <div id="body-image-panel" className="space-y-4 rounded-xl border bg-[var(--card)] p-5">
                <h2 className="font-semibold">本文に挿入する画像</h2>
                <p className="text-sm text-[var(--muted-foreground)]">公開画像のURLを指定してください。アイキャッチ画像とは別に保存されます。</p>
                <label className="block space-y-2"><span className="text-sm">画像URL</span>
                  <input type="url" value={bodyImageUrl} onChange={e => { setBodyImageUrl(e.target.value); setPreviewUrl(""); setImageError(null) }} placeholder="https://example.com/photo.jpg" className={inputClass} />
                </label>
                <label className="block space-y-2"><span className="text-sm">画像の説明（代替テキスト）</span>
                  <input value={bodyImageDescription} onChange={e => setBodyImageDescription(e.target.value)} placeholder="例：明るいリビングと庭の様子" className={inputClass} />
                </label>
                {imageError && <p role="alert" className="text-sm text-red-600">{imageError}</p>}
                {previewUrl && !previewFailed && <img src={previewUrl} alt={bodyImageDescription || "挿入する画像のプレビュー"} className="max-h-64 max-w-full rounded-lg object-contain" onError={() => setPreviewFailed(true)} />}
                {previewUrl && previewFailed && <p role="status" className="text-sm text-red-600">画像を表示できません。URLと公開設定を確認してください。</p>}
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={previewImage} disabled={!bodyImageUrl.trim() || isSubmitting} className="rounded-lg border px-4 py-2 disabled:opacity-50">画像を確認</button>
                  <button type="button" onClick={insertImage} disabled={!bodyImageUrl.trim() || isSubmitting} className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50">本文に挿入</button>
                  <button type="button" onClick={() => setImagePanelOpen(false)} className="rounded-lg border px-4 py-2">キャンセル</button>
                </div>
              </div>}
              <p role="status" className="text-sm text-[var(--muted-foreground)]">{imageNotice}</p>
              <p className="text-xs text-[var(--muted-foreground)]">画像は ![説明](画像URL) の形式で入ります。この行を移動・削除すると、画像の位置変更・削除ができます。</p>
            </section>
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

              <label className="block space-y-2"><span className="text-sm">アイキャッチ画像（一覧・記事上部）</span>
              <input
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                placeholder="アイキャッチ画像のURL"
                className={inputClass}
              />
              </label>
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
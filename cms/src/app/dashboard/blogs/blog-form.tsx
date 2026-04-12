"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { validateBlogInput } from "@/lib/validation"
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

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
  const [success, setSuccess] = useState(false)

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
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .trim()
      .slice(0, 200)
    
    return slug || `post-${Date.now()}`
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
    setSuccess(false)

    const validation = validateBlogInput({
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      content: formData.content,
      featured_image: formData.featured_image || null,
      category: formData.category || null,
      published: formData.published,
    })

    if (!validation.isValid) {
      setError(validation.errors.join("\n"))
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()

    if (!blog || blog.slug !== formData.slug) {
      const { data: existingBlog } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", formData.slug)
        .single()

      if (existingBlog) {
        setError("このスラッグは既に使用されています")
        setIsSubmitting(false)
        return
      }
    }

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
        setError("更新に失敗しました")
        setIsSubmitting(false)
        return
      }
    } else {
      const { error: insertError } = await supabase.from("blogs").insert(data)

      if (insertError) {
        setError("作成に失敗しました")
        setIsSubmitting(false)
        return
      }
    }

    setSuccess(true)
    setTimeout(() => {
      router.push("/dashboard/blogs")
      router.refresh()
    }, 500)
  }

  const inputClass = "w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors"

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/blogs"
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--muted-foreground)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
            {blog ? "記事を編集" : "新規記事を作成"}
          </h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            {blog ? "記事の内容を更新します" : "新しいブログ記事を作成します"}
          </p>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-500">エラー</p>
            <p className="mt-1 text-sm text-red-500/80 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* 成功メッセージ */}
      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <p className="font-medium text-emerald-500">保存しました</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* メインエリア */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="font-medium text-[var(--foreground)] mb-5">基本情報</h2>
              
              <div className="space-y-5">
                {/* タイトル */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-[var(--foreground)]">
                    タイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    className={inputClass}
                    placeholder="記事のタイトルを入力"
                  />
                </div>

                {/* スラッグ */}
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium text-[var(--foreground)]">
                    スラッグ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--muted-foreground)]">/blog/</span>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      required
                      className={`${inputClass} font-mono text-sm`}
                      placeholder="url-slug"
                    />
                  </div>
                </div>

                {/* 説明文 */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-[var(--foreground)]">
                    説明文 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className={inputClass}
                    placeholder="記事の概要を入力"
                  />
                </div>
              </div>
            </div>

            {/* 本文 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-medium text-[var(--foreground)]">本文</h2>
                <span className="text-xs text-[var(--muted-foreground)] px-2 py-1 rounded bg-[var(--secondary)]">
                  Markdown
                </span>
              </div>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                required
                rows={16}
                className={`${inputClass} font-mono text-sm leading-relaxed`}
                placeholder="本文をMarkdown形式で入力..."
              />
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 公開設定 */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="font-medium text-[var(--foreground)] mb-5">公開設定</h2>
              
              <div className="space-y-5">
                {/* 公開トグル */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--secondary)]">
                  <div className="flex items-center gap-3">
                    {formData.published ? (
                      <Eye className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-[var(--muted-foreground)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {formData.published ? "公開" : "下書き"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      formData.published ? "bg-emerald-500" : "bg-[var(--border)]"
                    }`}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.published ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {/* カテゴリ */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-[var(--foreground)]">
                    カテゴリ
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className={inputClass}
                    placeholder="カテゴリを入力"
                  />
                </div>

                {/* アイキャッチ画像 */}
                <div className="space-y-2">
                  <label htmlFor="featured_image" className="text-sm font-medium text-[var(--foreground)]">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      アイキャッチ画像
                    </div>
                  </label>
                  <input
                    type="url"
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                    className={inputClass}
                    placeholder="画像URLを入力"
                  />
                  {formData.featured_image && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-[var(--border)]">
                      <img
                        src={formData.featured_image}
                        alt="プレビュー"
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* アクション */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {blog ? "更新" : "作成"}
                  </>
                )}
              </button>
              <Link
                href="/dashboard/blogs"
                className="flex items-center justify-center w-full py-3 rounded-lg border border-[var(--border)] text-[var(--foreground)] font-medium hover:bg-[var(--secondary)] transition-colors"
              >
                キャンセル
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

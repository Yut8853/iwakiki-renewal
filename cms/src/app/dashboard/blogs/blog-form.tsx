"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { validateBlogInput } from "@/lib/validation"
import { 
  Save, 
  X, 
  FileText, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Tag, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Type,
  AlignLeft,
  Code,
  Settings2
} from "lucide-react"

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

  const inputBaseClass = "w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* エラーメッセージ */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-4 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[var(--destructive)]">エラー</p>
            <p className="text-sm text-[var(--destructive)]/80 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* 成功メッセージ */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="font-semibold text-emerald-400">保存しました。リダイレクト中...</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* メインコンテンツエリア */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報カード */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-[var(--border)] bg-[var(--secondary)]/30">
              <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                <Type className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">基本情報</h3>
            </div>
            
            <div className="p-6 space-y-5">
              {/* タイトル */}
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                  タイトル
                  <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className={`${inputBaseClass} text-lg font-semibold`}
                  placeholder="魅力的な記事タイトルを入力"
                />
              </div>

              {/* スラッグ */}
              <div className="space-y-2">
                <label htmlFor="slug" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <LinkIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
                  スラッグ
                  <span className="text-[var(--destructive)]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">/blog/</span>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    required
                    className={`${inputBaseClass} pl-14 font-mono text-sm`}
                    placeholder="url-friendly-slug"
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  URLに使用される識別子です。英数字とハイフンのみ推奨。
                </p>
              </div>

              {/* 説明文 */}
              <div className="space-y-2">
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <AlignLeft className="h-4 w-4 text-[var(--muted-foreground)]" />
                  説明文
                  <span className="text-[var(--destructive)]">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className={inputBaseClass}
                  placeholder="記事の概要を簡潔に記述（SEO対策にも重要）"
                />
              </div>
            </div>
          </div>

          {/* 本文エディター */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--secondary)]/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                  <Code className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">本文</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Markdown形式で記述</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="px-2 py-1 rounded-md bg-[var(--secondary)] font-mono">Markdown</span>
              </div>
            </div>
            
            <div className="p-6">
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                required
                rows={20}
                className={`${inputBaseClass} font-mono text-sm leading-relaxed resize-none`}
                placeholder="# 見出し&#10;&#10;本文をここに記述します...&#10;&#10;- リスト項目1&#10;- リスト項目2&#10;&#10;**太字** や *斜体* も使用できます。"
              />
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 公開設定カード */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden sticky top-24">
            <div className="flex items-center gap-3 p-5 border-b border-[var(--border)] bg-[var(--secondary)]/30">
              <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                <Settings2 className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">公開設定</h3>
            </div>
            
            <div className="p-6 space-y-5">
              {/* 公開トグル */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  {formData.published ? (
                    <Eye className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-[var(--muted-foreground)]" />
                  )}
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">
                      {formData.published ? "公開" : "下書き"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formData.published ? "記事は公開されます" : "記事は非公開です"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                    formData.published 
                      ? "bg-emerald-500" 
                      : "bg-[var(--border)]"
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    formData.published ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* カテゴリ */}
              <div className="space-y-2">
                <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Tag className="h-4 w-4 text-[var(--muted-foreground)]" />
                  カテゴリ
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className={inputBaseClass}
                  placeholder="テクノロジー"
                />
              </div>

              {/* アイキャッチ */}
              <div className="space-y-2">
                <label htmlFor="featured_image" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <ImageIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
                  アイキャッチ画像
                </label>
                <input
                  type="url"
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                  className={inputBaseClass}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featured_image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--secondary)]">
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

            {/* アクションボタン */}
            <div className="p-5 border-t border-[var(--border)] bg-[var(--secondary)]/30 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold shadow-lg shadow-[var(--primary)]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {blog ? "更新する" : "作成する"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] font-semibold transition-all duration-200 hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)]"
              >
                <X className="h-4 w-4" />
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

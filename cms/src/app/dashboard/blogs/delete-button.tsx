"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react"

export function DeleteButton({
  blogId,
  blogTitle,
}: {
  blogId: string
  blogTitle: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("blogs").delete().eq("id", blogId)

    if (error) {
      alert("削除に失敗しました")
      setIsDeleting(false)
      setShowConfirm(false)
      return
    }

    router.refresh()
  }

  return (
    <>
      {/* トリガー */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden md:inline">削除</span>
      </button>

      {/* モーダル */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* 背景 */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />

          {/* 本体 */}
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl animate-fade-in">

            {/* ヘッダー */}
            <div className="flex items-start justify-between px-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  記事を削除
                </h3>
              </div>

              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 rounded-lg hover:bg-[var(--secondary)] transition"
              >
                <X className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="px-6 pt-4 space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                この操作は元に戻せません。本当に削除しますか？
              </p>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {blogTitle}
                </p>
              </div>
            </div>

            {/* フッター */}
            <div className="flex gap-3 px-6 py-6 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--secondary)] transition disabled:opacity-50"
              >
                キャンセル
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    削除中...
                  </>
                ) : (
                  "削除する"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
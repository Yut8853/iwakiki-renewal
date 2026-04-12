"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react"

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
      alert("削除に失敗しました: " + error.message)
      setIsDeleting(false)
      setShowConfirm(false)
      return
    }

    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--destructive)] bg-[var(--destructive)]/10 hover:bg-[var(--destructive)]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">{isDeleting ? "削除中..." : "削除"}</span>
      </button>

      {/* 確認モーダル */}
      {showConfirm && (
        <>
          {/* オーバーレイ */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setShowConfirm(false)}
          />
          
          {/* モーダル */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4 animate-fade-in">
            <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden">
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--destructive)]/10">
                    <AlertTriangle className="h-5 w-5 text-[var(--destructive)]" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--foreground)]">記事を削除</h3>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* コンテンツ */}
              <div className="p-6">
                <p className="text-[var(--muted-foreground)] mb-4">
                  以下の記事を削除してもよろしいですか？この操作は取り消せません。
                </p>
                <div className="p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
                  <p className="font-semibold text-[var(--foreground)] line-clamp-2">{blogTitle}</p>
                </div>
              </div>
              
              {/* フッター */}
              <div className="flex gap-3 p-5 border-t border-[var(--border)] bg-[var(--secondary)]/30">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl bg-[var(--secondary)] border border-[var(--border)] font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--card-hover)] disabled:opacity-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--destructive)] font-semibold text-white transition-all hover:bg-[var(--destructive)]/90 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      削除中...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      削除する
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

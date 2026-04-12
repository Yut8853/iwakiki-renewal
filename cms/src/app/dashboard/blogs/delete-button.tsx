"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2, X } from "lucide-react"

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
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden md:inline">削除</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          />
          
          <div className="relative bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[var(--foreground)]">記事を削除</h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              >
                <X className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>
            </div>
            
            <p className="text-sm text-[var(--muted-foreground)] mb-2">
              以下の記事を削除してもよろしいですか？
            </p>
            <p className="text-sm font-medium text-[var(--foreground)] p-3 rounded-lg bg-[var(--secondary)] mb-6">
              {blogTitle}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    削除中...
                  </>
                ) : (
                  "削除"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

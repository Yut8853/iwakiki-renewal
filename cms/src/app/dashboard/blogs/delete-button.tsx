"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function DeleteButton({
  blogId,
  blogTitle,
}: {
  blogId: string
  blogTitle: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`「${blogTitle}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    const { error } = await supabase.from("blogs").delete().eq("id", blogId)

    if (error) {
      alert("削除に失敗しました: " + error.message)
      setIsDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
    >
      {isDeleting ? "削除中..." : "削除"}
    </button>
  )
}

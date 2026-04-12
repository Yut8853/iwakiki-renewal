"use client"

import { useState } from "react"
import { login } from "./actions"
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-4 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-5 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0" />
          <p className="text-sm font-medium text-[var(--destructive)]">{error}</p>
        </div>
      )}
      
      {/* メールアドレス */}
      <div className="space-y-3">
        <label htmlFor="email" className="block text-sm font-semibold text-[var(--foreground)]">
          メールアドレス
        </label>
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] pl-14 pr-5 py-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
            placeholder="admin@example.com"
          />
        </div>
      </div>

      {/* パスワード */}
      <div className="space-y-3">
        <label htmlFor="password" className="block text-sm font-semibold text-[var(--foreground)]">
          パスワード
        </label>
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] pl-14 pr-14 py-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ログインボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="relative w-full flex items-center justify-center gap-3 py-4 mt-2 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold text-base shadow-lg shadow-[var(--primary)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
      >
        {/* ホバー時のシマー効果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
        
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            ログイン中...
          </>
        ) : (
          <>
            ログイン
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  )
}

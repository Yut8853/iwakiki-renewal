import { LoginForm } from "./login-form"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-4 overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* グラデーションオーブ */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/5 rounded-full blur-3xl" />
        
        {/* グリッドパターン */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--foreground) 1px, transparent 1px),
              linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* ロゴ・ヘッダー */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-[var(--primary)]/30">
              I
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] blur-xl opacity-50 -z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)] mb-2">
            IWAKIKI CMS
          </h1>
          <p className="text-[var(--muted-foreground)]">
            コンテンツ管理システムにログイン
          </p>
        </div>

        {/* ログインカード */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <LoginForm />
        </div>

        {/* テストアカウント情報 */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                テストアカウント
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Email</span>
                <code className="px-2 py-1 rounded-md bg-[var(--secondary)] text-xs font-mono text-[var(--foreground)]">
                  admin@iwakiki.com
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Password</span>
                <code className="px-2 py-1 rounded-md bg-[var(--secondary)] text-xs font-mono text-[var(--foreground)]">
                  admin123
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <p className="mt-8 text-center text-xs text-[var(--muted-foreground)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Powered by IWAKIKI
        </p>
      </div>
    </div>
  )
}

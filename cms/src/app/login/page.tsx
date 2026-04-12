import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
            IWAKIKI CMS
          </h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            管理画面にログイン
          </p>
        </div>

        {/* ログインフォーム */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8">
          <LoginForm />
        </div>

        {/* テストアカウント */}
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            テストアカウント
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Email</span>
              <code className="px-2 py-1 rounded bg-[var(--secondary)] text-[var(--foreground)] font-mono text-xs">
                admin@iwakiki.com
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Password</span>
              <code className="px-2 py-1 rounded bg-[var(--secondary)] text-[var(--foreground)] font-mono text-xs">
                admin123
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

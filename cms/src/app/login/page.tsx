import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">iwakiki CMS</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              ブログ管理システムにログイン
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <p className="text-center text-xs text-[var(--muted-foreground)]">
              テストアカウント
            </p>
            <p className="mt-1 text-center text-xs text-[var(--muted-foreground)]">
              admin@iwakiki.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

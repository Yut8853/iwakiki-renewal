"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Menu,
  X,
  Plus
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/dashboard/blogs", label: "ブログ管理", icon: FileText },
  ]

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* サイドバー - PC版 */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]">
        {/* ロゴエリア */}
        <div className="flex h-16 items-center px-6 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              I
            </div>
            <span className="text-base font-semibold text-[var(--foreground)]">
              IWAKIKI CMS
            </span>
          </Link>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* ログアウト */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </button>
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6">
          {/* モバイルメニュー */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <Menu className="h-5 w-5 text-[var(--foreground)]" />
          </button>
          
          {/* PC: 空白 */}
          <div className="hidden lg:block" />

          {/* 新規作成ボタン */}
          <Link
            href="/dashboard/blogs/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">新規作成</span>
          </Link>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--card)] border-r border-[var(--border)] z-50 lg:hidden animate-slide-in">
            <div className="flex h-16 items-center justify-between px-6 border-b border-[var(--border)]">
              <span className="text-base font-semibold text-[var(--foreground)]">IWAKIKI CMS</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--foreground)]" />
              </button>
            </div>
            
            <nav className="p-4">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "ログアウト中..." : "ログアウト"}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

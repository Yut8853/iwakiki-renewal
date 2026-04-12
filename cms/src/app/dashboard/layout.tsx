"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  User,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Bell,
  Search
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
      <aside className="hidden lg:flex w-72 flex-col border-r border-[var(--border)] bg-[var(--card)] relative overflow-hidden">
        {/* 背景グロー効果 */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--primary)]/5 to-transparent pointer-events-none" />
        
        {/* ロゴエリア */}
        <div className="relative flex h-20 items-center border-b border-[var(--border)] px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[var(--primary)]/20 animate-float">
              I
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] opacity-50 blur-lg -z-10" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[var(--foreground)]">
                IWAKIKI
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                Content Manager
              </span>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            Menu
          </p>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 overflow-hidden animate-fade-in ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--gradient-end)] text-white shadow-lg shadow-[var(--primary)]/25"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* ホバー時のシマー効果 */}
                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
                )}
                <div className="relative flex items-center gap-3">
                  <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                  {item.label}
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-white/70" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ユーザーセクション */}
        <div className="border-t border-[var(--border)] p-4 space-y-3">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-[var(--secondary)]/50 backdrop-blur-sm">
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center text-white font-semibold">
              <User className="h-5 w-5" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--success)] border-2 border-[var(--card)]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-[var(--foreground)] truncate">Administrator</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">admin@iwakiki.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--destructive)] transition-all duration-300 hover:bg-[var(--destructive)]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </button>
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl px-4 lg:px-8 sticky top-0 z-40">
          {/* 左側: モバイルメニュー + 検索 */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors"
            >
              <Menu className="h-5 w-5 text-[var(--foreground)]" />
            </button>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--secondary)] border border-[var(--border)] w-64 lg:w-80">
              <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="検索..."
                className="bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none flex-1"
              />
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)] bg-[var(--card)] rounded border border-[var(--border)]">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* 右側: アクション */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors group">
              <Bell className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--primary)] ring-2 ring-[var(--card)]" />
            </button>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white text-sm font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <Sparkles className="h-4 w-4" />
              新規作成
            </button>
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 overflow-y-auto bg-[var(--background)] p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* モバイルメニューオーバーレイ */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-72 bg-[var(--card)] border-r border-[var(--border)] z-50 lg:hidden animate-slide-in-left">
            {/* ヘッダー */}
            <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center text-white font-black">
                  I
                </div>
                <span className="text-lg font-black text-[var(--foreground)]">IWAKIKI</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--foreground)]" />
              </button>
            </div>
            
            {/* ナビゲーション */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--gradient-end)] text-white"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* ログアウト */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] p-4">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10 disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" />
                {isLoggingOut ? "ログアウト中..." : "ログアウト"}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

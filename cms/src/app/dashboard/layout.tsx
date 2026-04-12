"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Settings, 
  User,
  ChevronRight,
  Menu
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/dashboard/blogs", label: "ブログ管理", icon: FileText },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* サイドバー - PC版 */}
      <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex h-20 items-center border-b border-slate-100 dark:border-slate-800 px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black">I</div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">IWAKIKI <span className="text-primary text-[10px] tracking-normal align-top ml-1">CMS</span></h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-6">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"}`} />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">admin@iwakiki.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <LogOut className="h-5 w-5" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* モバイル用ヘッダー */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <h1 className="text-lg font-black tracking-tighter">IWAKIKI CMS</h1>
          <button className="rounded-lg p-2 hover:bg-slate-100">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* ページの中身 */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-10">
          {/* コンテンツを中央寄せにするコンテナ */}
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
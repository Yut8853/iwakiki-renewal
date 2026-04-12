"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

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
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/dashboard/blogs", label: "ブログ管理" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-foreground">IWAKIKI CMS</h1>
            <nav className="flex gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            ログアウト
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.jsが実行するために、関数名は必ず「middleware」にする必要があります
export async function middleware(request: NextRequest) {
  // すべてのロジック（セッション更新、リダイレクト）をこの中で実行
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 以下のパス*以外*にのみ Middleware を適用する
     * 1. /login, /auth, /api パスを除外（無限ループ防止）
     * 2. 静的ファイル（画像、faviconなど）を除外
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
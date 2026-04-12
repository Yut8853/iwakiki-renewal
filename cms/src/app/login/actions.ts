"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// 入力値のサニタイズ
function sanitizeInput(input: string): string {
  return input.trim().slice(0, 255);
}

// メールアドレスの簡易バリデーション
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function login(formData: FormData) {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  // 型チェック
  if (typeof rawEmail !== "string" || typeof rawPassword !== "string") {
    return { error: "無効な入力です" };
  }

  const email = sanitizeInput(rawEmail);
  const password = rawPassword; // パスワードはtrimしない

  // バリデーション
  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  if (!isValidEmail(email)) {
    return { error: "有効なメールアドレスを入力してください" };
  }

  if (password.length < 6) {
    return { error: "パスワードは6文字以上で入力してください" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // エラーの詳細を隠して一般的なメッセージを返す（セキュリティ対策）
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

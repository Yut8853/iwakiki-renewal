// 入力値のサニタイズ（XSS対策）
export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // 基本的なHTMLタグ除去
}

// スラッグのバリデーション
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 200
}

// URLのバリデーション
export function isValidUrl(url: string): boolean {
  if (!url) return true // 空は許可
  try {
    const parsed = new URL(url)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

// ブログ入力のバリデーション
export interface BlogInput {
  title: string
  slug: string
  description: string
  content: string
  featured_image?: string | null
  category?: string | null
  published?: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateBlogInput(input: BlogInput): ValidationResult {
  const errors: string[] = []

  if (!input.title || input.title.trim().length < 1) {
    errors.push("タイトルは必須です")
  } else if (input.title.length > 200) {
    errors.push("タイトルは200文字以内で入力してください")
  }

  if (!input.slug || !isValidSlug(input.slug)) {
    errors.push("スラッグは英数字とハイフンのみ使用可能です")
  }

  if (!input.description || input.description.trim().length < 1) {
    errors.push("説明文は必須です")
  } else if (input.description.length > 500) {
    errors.push("説明文は500文字以内で入力してください")
  }

  if (!input.content || input.content.trim().length < 1) {
    errors.push("本文は必須です")
  } else if (input.content.length > 100000) {
    errors.push("本文は100,000文字以内で入力してください")
  }

  if (input.featured_image && !isValidUrl(input.featured_image)) {
    errors.push("アイキャッチ画像URLの形式が正しくありません")
  }

  if (input.category && input.category.length > 50) {
    errors.push("カテゴリは50文字以内で入力してください")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

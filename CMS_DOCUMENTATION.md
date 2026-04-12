# iwakiki CMS ドキュメント

## 目次

1. [プロジェクト構成](#プロジェクト構成)
2. [アーキテクチャ概要](#アーキテクチャ概要)
3. [CMS管理画面の使い方](#cms管理画面の使い方)
4. [データベース構造](#データベース構造)
5. [API仕様](#api仕様)
6. [セキュリティ対策](#セキュリティ対策)
7. [開発ガイド](#開発ガイド)
8. [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト構成

```
iwakiki-renewal/
├── frontend/                    # Astroベースのフロントエンド（公開サイト）
│   └── src/
│       ├── pages/
│       │   └── blog/
│       │       └── [slug].astro # ブログ詳細ページ
│       └── content/
│           └── blog/            # 既存のMDファイル（移行元）
│               └── *.md
│
├── cms/                         # Next.jsベースのCMS管理画面
│   └── src/
│       ├── app/
│       │   ├── login/           # ログイン画面
│       │   ├── dashboard/       # 管理ダッシュボード
│       │   │   └── blogs/       # ブログ管理
│       │   └── api/
│       │       └── blogs/       # ブログAPI
│       └── lib/
│           ├── supabase/        # Supabaseクライアント
│           └── validation.ts    # 入力バリデーション
│
└── scripts/                     # データベースマイグレーション
    ├── 001_create_blogs_table.sql
    └── 002_create_test_user.sql
```

---

## アーキテクチャ概要

### Frontend と CMS の関係

```
┌─────────────────┐         ┌─────────────────┐
│    Frontend     │         │      CMS        │
│    (Astro)      │         │   (Next.js)     │
│                 │         │                 │
│  公開ブログ表示  │◄────────│  ブログ管理画面  │
│                 │   API   │                 │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
           ┌─────────────────┐
           │    Supabase     │
           │   (PostgreSQL)  │
           │                 │
           │  - blogs table  │
           │  - auth.users   │
           └─────────────────┘
```

### データフロー

1. **CMS → Supabase**: 管理者がCMSでブログを作成・編集・削除
2. **Supabase → Frontend**: FrontendがAPIまたは直接DBからブログデータを取得
3. **Frontend → ユーザー**: 公開サイトでブログを表示

---

## CMS管理画面の使い方

### ログイン情報（テスト用）

| 項目 | 値 |
|------|-----|
| URL | `/login` |
| メールアドレス | `admin@iwakiki.com` |
| パスワード | `admin123` |

> **警告**: 本番環境では必ずパスワードを変更してください

### 機能一覧

| 画面 | パス | 機能 |
|------|------|------|
| ダッシュボード | `/dashboard` | 統計情報の表示 |
| ブログ一覧 | `/dashboard/blogs` | 記事の一覧・削除 |
| 新規作成 | `/dashboard/blogs/new` | 新規ブログ記事の作成 |
| 編集 | `/dashboard/blogs/[id]` | 既存記事の編集 |

### ブログ記事の項目

| フィールド | 必須 | 説明 |
|-----------|------|------|
| タイトル | ○ | 記事のタイトル（最大200文字） |
| スラッグ | ○ | URLに使用される識別子（英数字・ハイフン） |
| 説明 | ○ | 記事の概要（最大500文字） |
| 本文 | ○ | Markdown形式の本文（最大50,000文字） |
| アイキャッチ画像 | - | 画像URL |
| カテゴリ | - | 記事のカテゴリ |
| 公開 | - | チェックで即時公開 |

---

## データベース構造

### blogs テーブル

```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS) ポリシー

| ポリシー名 | 操作 | 条件 |
|-----------|------|------|
| blogs_select_all | SELECT | 誰でも読み取り可能 |
| blogs_insert_auth | INSERT | 認証ユーザーのみ |
| blogs_update_auth | UPDATE | 認証ユーザーのみ |
| blogs_delete_auth | DELETE | 認証ユーザーのみ |

---

## API仕様

### GET /api/blogs

公開済みブログ記事の一覧を取得

**レスポンス例:**
```json
[
  {
    "id": "uuid",
    "title": "記事タイトル",
    "slug": "article-slug",
    "description": "記事の説明",
    "content": "本文（Markdown）",
    "featured_image": "https://...",
    "category": "カテゴリ",
    "published": true,
    "published_at": "2024-01-01T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/blogs/[slug]

スラッグで特定の公開済み記事を取得

**パラメータ:**
- `slug`: 記事のスラッグ

**レスポンス:**
- 成功: 記事オブジェクト
- 失敗: `{ "error": "Blog not found" }` (404)

---

## セキュリティ対策

### 実装済み対策

| 対策 | 説明 |
|------|------|
| 入力バリデーション | 文字数制限、形式チェック |
| サニタイズ | XSS防止のためのHTMLエスケープ |
| RLS | Supabaseの行レベルセキュリティ |
| 認証必須 | 管理画面はログイン必須 |
| CORS設定 | APIのオリジン制限 |
| セキュリティヘッダー | X-Content-Type-Options, X-Frame-Options |
| エラーメッセージ汎化 | 内部エラー詳細の非公開 |
| スラッグ重複チェック | 同一スラッグの登録防止 |

### 本番環境で追加推奨

1. **パスワード変更**: テストユーザーのパスワードを強力なものに
2. **環境変数設定**: `FRONTEND_URL`を設定してCORSを制限
3. **レート制限**: Supabaseダッシュボードで設定
4. **HTTPS強制**: 本番環境では必須

---

## 開発ガイド

### 新しい管理者ユーザーの追加

Supabaseダッシュボードまたは以下のSQLで追加:

```sql
-- 新しいユーザーを作成
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'newuser@example.com',
  crypt('your-strong-password', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

### 新しいフィールドの追加

1. **データベース変更** (`scripts/`に新しいSQLを追加):
```sql
-- scripts/003_add_new_field.sql
ALTER TABLE blogs ADD COLUMN new_field TEXT;
```

2. **バリデーション更新** (`cms/src/lib/validation.ts`):
```typescript
// validateBlogInput関数に追加
if (input.new_field && input.new_field.length > 100) {
  errors.push("新フィールドは100文字以内で入力してください");
}
```

3. **フォーム更新** (`cms/src/app/dashboard/blogs/blog-form.tsx`):
```tsx
// formDataの初期値に追加
const [formData, setFormData] = useState({
  // ...既存フィールド
  new_field: blog?.new_field || "",
});

// フォームにインプット追加
<input
  type="text"
  value={formData.new_field}
  onChange={(e) => setFormData({ ...formData, new_field: e.target.value })}
/>
```

4. **API更新** (必要に応じて`cms/src/app/api/blogs/route.ts`を更新)

### 新しいコンテンツタイプの追加（例: ニュース）

1. **テーブル作成**:
```sql
-- scripts/004_create_news_table.sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
-- RLSポリシーを追加（blogsと同様）
```

2. **管理画面のコピー**:
   - `cms/src/app/dashboard/blogs/`をコピーして`news/`を作成
   - ファイル内の`blogs`を`news`に置換

3. **サイドバー更新** (`cms/src/app/dashboard/layout.tsx`):
```tsx
<Link href="/dashboard/news">ニュース管理</Link>
```

### Frontendからのデータ取得

Astroでブログデータを取得する例:

```astro
---
// frontend/src/pages/blog/[slug].astro

// CMSのAPIから取得
const CMS_URL = import.meta.env.CMS_URL || 'http://localhost:3000';
const response = await fetch(`${CMS_URL}/api/blogs/${Astro.params.slug}`);
const blog = await response.json();

// または直接Supabaseから取得
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);
const { data: blog } = await supabase
  .from('blogs')
  .select('*')
  .eq('slug', Astro.params.slug)
  .eq('published', true)
  .single();
---

<article>
  <h1>{blog.title}</h1>
  <p>{blog.description}</p>
  <div set:html={marked(blog.content)} />
</article>
```

---

## トラブルシューティング

### ログインできない

1. メールアドレスとパスワードを確認
2. Supabaseダッシュボードでユーザーが存在するか確認
3. `auth.users`テーブルで`email_confirmed_at`がNULLでないか確認

### 記事が保存できない

1. 必須フィールドがすべて入力されているか確認
2. スラッグが重複していないか確認
3. ブラウザのコンソールでエラーを確認
4. Supabase RLSポリシーが正しく設定されているか確認

### APIが403エラーを返す

1. CORS設定を確認（`FRONTEND_URL`環境変数）
2. リクエスト元のオリジンを確認

### 画像が表示されない

1. 画像URLが有効か確認
2. 画像のCORS設定を確認
3. HTTPSを使用しているか確認

---

## 環境変数

### CMS (Next.js)

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトURL | ○ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | ○ |
| `FRONTEND_URL` | フロントエンドURL（CORS用） | - |

### Frontend (Astro)

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `CMS_URL` | CMSのURL | - |
| `SUPABASE_URL` | SupabaseプロジェクトURL | ○ |
| `SUPABASE_ANON_KEY` | Supabase匿名キー | ○ |

---

## 今後の拡張案

- [ ] 画像アップロード機能（Vercel Blob / Supabase Storage）
- [ ] 下書き保存・プレビュー機能
- [ ] タグ機能
- [ ] 検索機能
- [ ] ページネーション
- [ ] 複数ユーザー・権限管理
- [ ] 監査ログ
- [ ] バックアップ・リストア機能

---

*最終更新: 2024年*

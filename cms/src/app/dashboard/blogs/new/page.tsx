import { BlogForm } from "../blog-form"

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">新規記事作成</h2>
        <p className="mt-1 text-muted-foreground">
          新しいブログ記事を作成します
        </p>
      </div>

      <BlogForm />
    </div>
  )
}

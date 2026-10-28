import { supabase } from './supabase';
import { compareArticleOrder, normalizeArticle, type Article } from './blog';
import importedArticles from '../data/imported-articles.json';

// Local previews remain usable when the connected database has no visible posts.
// Never restore unpublished/deleted CMS content on the production site.
function previewArticles() {
  console.warn('[blog] 開発プレビュー: 保存済みの公開記事を表示しています。');
  return {
    posts: importedArticles.filter(row => row.published === true && row.slug)
      .map(normalizeArticle)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || compareArticleOrder(a, b)),
    unavailable: false,
  };
}

export async function getPublishedArticles(): Promise<{ posts: Article[]; unavailable: boolean }> {
  const rows: Record<string, any>[] = [];
  // Supabase limits each response; continue until all published rows have been read.
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from('blogs').select('*')
      .eq('published', true).order('published_at', { ascending: false }).order('slug')
      .range(offset, offset + 499).abortSignal(AbortSignal.timeout(10000));
    if (error) {
      console.error('[blog] 記事を取得できませんでした:', error.message);
      // A failed build must not replace the deployed archive with missing pages.
      if (import.meta.env.PROD) throw new Error('ブログ記事を取得できないためビルドを中止しました。');
      return previewArticles();
    }
    rows.push(...(data ?? []));
    if (!data || data.length < 500) break;
  }
  if (import.meta.env.DEV && rows.length === 0) return previewArticles();
  const posts = rows.filter(row => row.slug).map(normalizeArticle)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || compareArticleOrder(a, b));
  return { posts, unavailable: false };
}

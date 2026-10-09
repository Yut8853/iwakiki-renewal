export const categories: Record<string, string> = {
  news: 'お知らせ', column: 'コラム', property: '売買・成約', lifestyle: '地域の活動', rental: '賃貸', vacation: '貸別荘',
};
export interface Article {
  slug: string; title: string; description: string; content: string;
  category: string; publishedAt: string; modifiedAt?: string; image: string; readingTime: number;
  draft?: boolean; sourceUrl?: string; reviewNotes?: string[];
}
export const categoryLabel = (category: string) => categories[category] || 'その他';
export const articleHref = (slug: string) => `/blog/${encodeURIComponent(slug)}/`;
export function normalizeArticle(row: Record<string, any>): Article {
  const date = new Date(row.published_at || NaN);
  const content = String(row.content ?? '');
  const modified = new Date(row.updated_at || NaN);
  return {
    draft: row.published === false, sourceUrl: row.source_url, reviewNotes: row.review_notes,
    slug: String(row.slug), title: String(row.title || 'タイトルなし'),
    description: String(row.description ?? ''), content,
    category: String(row.category || 'other'),
    publishedAt: Number.isNaN(date.getTime()) ? '' : date.toISOString(),
    modifiedAt: !Number.isNaN(modified.getTime()) && !Number.isNaN(date.getTime()) && modified >= date ? modified.toISOString() : undefined,
    image: row.featured_image || '/blog/default.jpg',
    readingTime: Math.max(1, Math.ceil(content.replace(/<[^>]*>|[#*`>]/g, '').length / 500)),
  };
}
export function formatDate(value: string) {
  return value ? new Date(value).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'long', day: 'numeric' }) : '日付未設定';
}
export interface Filters { q: string; category: string; month: string; year: string; sort: string; page: number }
export const defaultFilters: Filters = { q: '', category: 'all', month: '', year: '', sort: 'newest', page: 1 };
export function readFilters(search: string): Filters {
  const p = new URLSearchParams(search);
  const page = Number(p.get('page'));
  return { q: p.get('q') || '', category: p.get('category') || 'all', month: p.get('month') || '', year: /^\d{4}$/.test(p.get('year') || '') ? p.get('year')! : '', sort: p.get('sort') === 'oldest' ? 'oldest' : 'newest', page: Number.isSafeInteger(page) && page > 0 ? page : 1 };
}
export function filterQuery(filters: Filters) {
  const p = new URLSearchParams();
  for (const key of ['q', 'category', 'month', 'year', 'sort', 'page'] as const) {
    if (filters[key] !== defaultFilters[key]) p.set(key, String(filters[key]));
  }
  return p.toString();
}
const searchable = (s: string) => s.normalize('NFKC').toLocaleLowerCase('ja');
export function selectArticles(posts: Article[], filters: Filters, pageSize = 6) {
  const words = searchable(filters.q).trim().split(/\s+/).filter(Boolean);
  const filtered = posts.filter(p =>
    (filters.category === 'all' || p.category === filters.category) &&
    (!filters.month || articleMonth(p) === filters.month) &&
    (!filters.year || articleYear(p) === filters.year) &&
    words.every(word => searchable(`${p.title} ${p.description} ${p.content}`).includes(word))
  ).sort((a, b) => {
    if (!a.publishedAt) return b.publishedAt ? 1 : a.slug.localeCompare(b.slug);
    if (!b.publishedAt) return -1;
    const dateOrder = a.publishedAt.localeCompare(b.publishedAt);
    return (filters.sort === 'oldest' ? dateOrder : -dateOrder) || compareArticleOrder(a, b);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(filters.page, pages);
  return { posts: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, pages, page };
}
export function articleMonth(post: Article) {
  return post.publishedAt ? new Date(new Date(post.publishedAt).getTime() + 9 * 3600000).toISOString().slice(0, 7) : '';
}
export function relatedArticles(posts: Article[], current: Article) {
  return posts.filter(p => p.slug !== current.slug).sort((a, b) =>
    Number(b.category === current.category) - Number(a.category === current.category) || b.publishedAt.localeCompare(a.publishedAt) || compareArticleOrder(a, b)
  ).slice(0, 3);
}

// Publication year in Japan, matching the original blog archive.
export function articleYear(post: Article) {
  return articleMonth(post).slice(0, 4);
}
import articleOrder from '../data/article-order.json' with { type: 'json' };

const sourceOrder = (slug: string) => (articleOrder as Record<string, number>)[slug] ?? Number.MAX_SAFE_INTEGER;
export const compareArticleOrder = (a: Article, b: Article) =>
  sourceOrder(a.slug) - sourceOrder(b.slug) || a.slug.localeCompare(b.slug);


export const blogPageHref = (page: number) => page <= 1 ? '/blog/' : `/blog/page/${page}/`;

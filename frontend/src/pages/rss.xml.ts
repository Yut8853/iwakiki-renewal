import { getPublishedArticles } from '../libs/blog-server';
import { articleHref, categoryLabel } from '../libs/blog';
import { site, absoluteUrl } from '../libs/seo';
const xml = (value: string) => value.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export async function GET() {
  const { posts } = await getPublishedArticles();
  const items = posts.map(p => `<item><title>${xml(p.title)}</title><link>${xml(absoluteUrl(articleHref(p.slug)))}</link><guid isPermaLink="true">${xml(absoluteUrl(articleHref(p.slug)))}</guid><description>${xml(p.description)}</description><category>${xml(categoryLabel(p.category))}</category>${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}</item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>iwakikiからのお知らせ</title><link>${site.url}/blog/</link><description>${xml(site.description)}</description><language>ja</language><atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

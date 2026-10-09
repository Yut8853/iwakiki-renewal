import { getPublishedArticles } from '../libs/blog-server';
import { articleHref, categoryLabel, formatDate } from '../libs/blog';
import { absoluteUrl } from '../libs/seo';
export async function GET() {
  const { posts } = await getPublishedArticles();
  const clean = (text: string) => text.replace(/[\r\n]+/g, ' ').replace(/[\[\]<>]/g, '');
  return new Response('# iwakikiからのお知らせ\n\n' + posts.map(post =>
    `## [${clean(post.title)}](${absoluteUrl(articleHref(post.slug))})\n\n${formatDate(post.publishedAt)} | ${categoryLabel(post.category)}\n\n${clean(post.description)}\n`
  ).join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}

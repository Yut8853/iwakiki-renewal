import { site } from '../libs/seo';
export function GET() {
  const content = import.meta.env.PUBLIC_SITE_INDEXING === 'false'
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap-index.xml\n`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

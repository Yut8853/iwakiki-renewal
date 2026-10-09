export const site = {
  url: 'https://iwakiki.co.jp', name: '株式会社iwakiki',
  description: '福島県いわき市の不動産会社。売買・賃貸仲介、買取・販売、リノベーション、物件管理、空き家・相続のご相談を承ります。',
  image: '/images/og-image.jpg', logo: '/images/logo.png',
  telephone: '0246-60-8875', email: 'osawa@iwakiki.co.jp',
  instagram: 'https://www.instagram.com/iwakiki.vacation.homes/',
};
export const absoluteUrl = (path: string) => new URL(path, site.url).href;
export function canonicalUrl(path: string) {
  const url = new URL(path, site.url);
  url.search = ''; url.hash = '';
  url.pathname = url.pathname.replace(/\/index\.html$/, '/');
  if (!url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) url.pathname += '/';
  return url.href;
}
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
export interface Breadcrumb { name: string; path: string }
interface ArticleSeo { title: string; publishedAt: string; modifiedAt?: string; category: string }
export function structuredData({ path, title, description, image, breadcrumbs, article, items = [] }: {
  path: string; title: string; description: string; image: string; breadcrumbs: Breadcrumb[];
  article?: ArticleSeo; items?: { title: string; url: string }[];
}) {
  const url = canonicalUrl(path);
  const org = `${site.url}/#organization`, website = `${site.url}/#website`, page = `${url}#webpage`;
  const type = path.startsWith('/about') ? 'AboutPage' : path.startsWith('/contact') ? 'ContactPage' : path.startsWith('/blog') && !article ? 'CollectionPage' : 'WebPage';
  const nodes: Record<string, unknown>[] = [
    { '@type': 'RealEstateAgent', '@id': org, name: site.name, alternateName: 'iwakiki', url: `${site.url}/`, description: site.description,
      logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo), width: 130, height: 29 }, image: absoluteUrl(site.image),
      telephone: site.telephone, email: site.email, sameAs: [site.instagram],
      address: { '@type': 'PostalAddress', streetAddress: '平豊間字合磯218-1', addressLocality: 'いわき市', addressRegion: '福島県', postalCode: '970-0224', addressCountry: 'JP' },
      areaServed: { '@type': 'City', name: 'いわき市' }, contactPoint: { '@type': 'ContactPoint', telephone: site.telephone, email: site.email, contactType: 'お問い合わせ', availableLanguage: 'Japanese', url: absoluteUrl('/contact/') } },
    { '@type': 'WebSite', '@id': website, url: `${site.url}/`, name: site.name, alternateName: 'iwakiki', inLanguage: 'ja-JP', publisher: { '@id': org } },
    { '@type': type, '@id': page, url, name: title, description, inLanguage: 'ja-JP', isPartOf: { '@id': website }, about: { '@id': org },
      primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(image) },
      ...(breadcrumbs.length > 1 ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      ...(article ? { mainEntity: { '@id': `${url}#article` } } : {}) },
  ];
  if (breadcrumbs.length > 1) nodes.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: canonicalUrl(b.path) })) });
  if (article) nodes.push({ '@type': 'BlogPosting', '@id': `${url}#article`, headline: article.title, description, image: [absoluteUrl(image)], url,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}), ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}),
    author: { '@type': 'Organization', '@id': org, name: site.name, url: absoluteUrl('/about/') }, publisher: { '@id': org },
    mainEntityOfPage: { '@id': page }, inLanguage: 'ja-JP', articleSection: article.category });
  if (path.startsWith('/about')) nodes.push({ '@type': 'Person', '@id': `${site.url}/#representative`, name: '大澤 一仁', jobTitle: '代表取締役', worksFor: { '@id': org }, image: absoluteUrl('/images/IMG_1312.jpeg'), url: absoluteUrl('/about/') });
  if (path.startsWith('/services')) {
    for (const [id, name, description] of [['sale', '売買仲介', 'マイホーム購入、土地・不動産売却のご相談を承ります。'], ['rent', '賃貸仲介', 'お部屋探しと賃貸オーナー様のサポートを行います。'], ['management', '物件管理', '入居者対応や建物メンテナンスなどの物件管理を行います。']])
      nodes.push({ '@type': 'Service', '@id': `${url}#${id}`, name, description, provider: { '@id': org }, url: `${url}#${id}`, areaServed: { '@type': 'City', name: 'いわき市' } });
  }
  if (items.length) nodes.push({ '@type': 'ItemList', '@id': `${url}#articles`, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.title, url: absoluteUrl(item.url) })) });
  return { '@context': 'https://schema.org', '@graph': nodes };
}

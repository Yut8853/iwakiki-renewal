import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeArticle,
  selectArticles,
  selectPropertyArticles,
  defaultFilters,
  readFilters,
  filterQuery,
  relatedArticles,
  articleMonth,
  articleHref,
} from '../src/libs/blog.ts';
const article = (slug, category, date, content = '') =>
  normalizeArticle({
    slug,
    title: slug,
    category,
    published_at: date,
    content,
  });
const posts = [
  article('海の住まい', 'property', '2026-03-01', 'リノベーション ABC'),
  article('町会活動', 'news', '2026-02-01'),
  article('春の暮らし', 'lifestyle', '2026-01-31T16:00:00Z'),
];
test('search combines normalized keywords, category and JST month', () => {
  const result = selectArticles(posts, {
    ...defaultFilters,
    q: 'ＡＢＣ リノベーション',
    category: 'property',
    month: '2026-03',
  });
  assert.deepEqual(
    result.posts.map(p => p.slug),
    ['海の住まい']
  );
  assert.equal(articleMonth(posts[2]), '2026-02');
  assert.equal(
    selectArticles(posts, { ...defaultFilters, q: '存在しない記事' }).total,
    0
  );
});
test('pagination clamps stale URLs and resets empty results safely', () => {
  const many = Array.from({ length: 13 }, (_, i) =>
    article(String(i), 'news', `2026-01-${String(i + 1).padStart(2, '0')}`)
  );
  const result = selectArticles(many, { ...defaultFilters, page: 99 });
  assert.equal(result.pages, 3);
  assert.equal(result.page, 3);
  assert.equal(result.posts.length, 1);
  assert.equal(selectArticles([], { ...defaultFilters, page: 99 }).page, 1);
  assert.equal(
    selectArticles(many, { ...defaultFilters, sort: 'oldest' }).posts[0].slug,
    '0'
  );
});
test('filters round-trip Japanese text and reject invalid page input', () => {
  const state = {
    ...defaultFilters,
    q: '海 & 山',
    category: 'property',
    month: '2026-03',
    sort: 'oldest',
    page: 2,
  };
  assert.deepEqual(readFilters(filterQuery(state)), state);
  for (const page of ['-1', 'NaN', '1.5', 'Infinity', '0'])
    assert.equal(readFilters(`page=${page}`).page, 1);
});
test('related articles exclude self, prioritize category, then recency', () => {
  const same = article('同カテゴリ', 'property', '2025-01-01');
  const result = relatedArticles([...posts, same], posts[0]);
  assert.equal(result[0].slug, same.slug);
  assert.ok(result.every(p => p.slug !== posts[0].slug));
});
test('property listings separate sold announcements and sort by publication date', () => {
  const listings = [
    normalizeArticle({
      slug: 'new-old',
      title: 'いわき市の売地 販売開始',
      category: 'property',
      published_at: '2025-01-01',
    }),
    normalizeArticle({
      slug: 'sold',
      title: '土地 ご成約のお知らせ',
      category: 'property',
      published_at: '2025-02-01',
    }),
    normalizeArticle({
      slug: 'new-latest',
      title: '新着物件のご案内',
      category: 'property',
      published_at: '2025-03-01',
    }),
    normalizeArticle({
      slug: 'not-property',
      title: 'ご成約のお知らせ',
      category: 'news',
      published_at: '2025-04-01',
    }),
  ];
  assert.deepEqual(
    selectPropertyArticles(listings, 'new').map(p => p.slug),
    ['new-latest', 'new-old']
  );
  assert.deepEqual(
    selectPropertyArticles(listings, 'new', 'oldest').map(p => p.slug),
    ['new-old', 'new-latest']
  );
  assert.deepEqual(
    selectPropertyArticles(listings, 'sold').map(p => p.slug),
    ['sold']
  );
});
test('database fields map to cards and unsafe slug delimiters are encoded', () => {
  const p = normalizeArticle({
    slug: 'one',
    title: 'タイトル',
    published_at: 'invalid',
    featured_image: '/image.jpg',
    description: '概要',
    content: 'あ'.repeat(1001),
  });
  assert.equal(
    normalizeArticle({ slug: 'no-date', published_at: null }).publishedAt,
    ''
  );
  assert.equal(p.publishedAt, '');
  assert.equal(p.image, '/image.jpg');
  assert.equal(p.description, '概要');
  assert.equal(p.readingTime, 3);
  assert.equal(articleHref('a?b#c'), '/blog/a%3Fb%23c/');
});

test('publication years switch at January 1 in Japan and combine with categories', async () => {
  const { articleYear } = await import('../src/libs/blog.ts');
  const march = article('march', 'property', '2025-12-31T14:59:00Z');
  const april = article('april', 'property', '2025-12-31T15:00:00Z');
  assert.equal(articleYear(march), '2025');
  assert.equal(articleYear(april), '2026');
  assert.equal(
    selectArticles([march, april], {
      ...defaultFilters,
      year: '2025',
      category: 'property',
    }).total,
    1
  );
  const state = { ...defaultFilters, year: '2024', category: 'rental' };
  assert.deepEqual(readFilters(filterQuery(state)), state);
});

test('workbook import preserves 54 distinct articles with complete body images', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const drafts = JSON.parse(
    readFileSync(
      new URL('../src/data/imported-articles.json', import.meta.url),
      'utf8'
    )
  );
  assert.equal(drafts.length, 54);
  assert.equal(new Set(drafts.map(p => p.source_url)).size, 53);
  assert.ok(
    drafts.every(p => p.published === true && p.content && p.description)
  );
  for (const post of drafts) {
    for (const path of post.images) {
      assert.ok(
        post.content.includes(path),
        `${post.slug} missing body image ${path}`
      );
      assert.ok(existsSync(new URL('../public' + path, import.meta.url)), path);
    }
    for (const paragraph of (post.editorial_draft ?? post.original_draft)
      .split('\n\n')
      .filter(Boolean))
      assert.ok(post.content.includes(paragraph));
  }
  assert.equal(
    drafts.find(p => p.slug === 'post-015').published_at.slice(0, 10),
    '2024-12-27'
  );
  assert.equal(
    drafts.filter(p => p.images[0].endsWith('announcement.svg')).length,
    0
  );
  assert.match(drafts.find(p => p.slug === 'sale-013').title, /A号棟/);
  assert.match(drafts.find(p => p.slug === 'sale-013-b').title, /B号棟/);
  const mapping = JSON.parse(
    readFileSync(
      new URL(
        '../../content/iwakiki-articles/reconciliation.json',
        import.meta.url
      ),
      'utf8'
    )
  );
  assert.equal(mapping.length, 54);
  assert.equal(new Set(mapping.map(p => p.slug)).size, 54);
  const normalized = drafts.map(normalizeArticle);
  assert.deepEqual(
    selectArticles(normalized, defaultFilters).posts.map(p => p.slug),
    mapping.slice(0, 6).map(p => p.slug)
  );
  for (const post of drafts)
    assert.ok(
      post.original_image_urls.every(u => !u.includes('/team/')),
      post.slug
    );
});

test('each archive entry resolves to the corresponding detail images or recorded source fallback', async () => {
  const { readFileSync } = await import('node:fs');
  const read = path =>
    JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
  const audit = read('../../content/iwakiki-articles/current-site-audit.json');
  const mapping = read('../../content/iwakiki-articles/reconciliation.json');
  const manifest = read('../../content/iwakiki-articles/images.json');
  const articles = read('../src/data/imported-articles.json');
  for (const entry of mapping) {
    const detail = audit.details.find(d => d.url === entry.detail_url);
    assert.ok(detail, entry.slug);
    const images = detail.sections
      .filter(s =>
        ['section-padding2', 'project-page section-padding2'].includes(s.class)
      )
      .flatMap(s => s.images)
      .filter(i => !i.url.includes('/team/'))
      .map(i => i.url);
    const allowed =
      ['property-040', 'sale-013-b'].includes(entry.slug) || images.length === 0
        ? [audit.entries[entry.order].image]
        : images;
    assert.deepEqual(entry.images, [...new Set(allowed)], entry.slug);
    const article = articles.find(a => a.slug === entry.slug);
    assert.deepEqual(
      article.images,
      entry.images.map(u => manifest[u].path),
      entry.slug
    );
    assert.equal(article.featured_image, article.images[0]);
    assert.ok(article.images.every(p => article.content.includes(p)));
  }
});

import { useEffect, useRef, useState } from 'react';
import { articleHref, blogPageHref, articleMonth, articleYear, categories, categoryLabel, defaultFilters, filterQuery, formatDate, readFilters, selectArticles, type Article, type Filters } from '../../libs/blog';
import styles from './BlogExplorer.module.scss';

export default function BlogExplorer({ posts, unavailable, initialPage = 1 }: { posts: Article[]; unavailable: boolean; initialPage?: number }) {
  const [filters, setFilters] = useState<Filters>({...defaultFilters, page: initialPage});
  const heading = useRef<HTMLHeadingElement>(null);
  const results = selectArticles(posts, filters);
  const years = [...new Set(posts.map(articleYear).filter(Boolean))].sort().reverse();
  const draftCount = posts.filter(post => post.draft).length;
  const months = [...new Set(posts.map(articleMonth).filter(Boolean))].sort().reverse();
  const categoryKeys = [...new Set([...Object.keys(categories), ...posts.map(p => p.category)])];
  useEffect(() => {
    const restore = () => {
      const parsed = readFilters(window.location.search);
      const routePage = Number(window.location.pathname.match(/\/blog\/page\/(\d+)/)?.[1]) || 1;
      setFilters({...parsed, page: new URLSearchParams(window.location.search).has('page') ? parsed.page : routePage});
    };
    restore(); window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  function update(patch: Partial<Filters>, replace = false) {
    const next = { ...filters, page: 1, ...patch };
    setFilters(next);
    const query = filterQuery(next);
    window.history[replace ? 'replaceState' : 'pushState'](null, '', `/blog/${query ? '?' + query : ''}`);
  }
  function goTo(page: number) {
    update({ page }); heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' });
  }
  const reset = () => update(defaultFilters);
  const staticPaging = !filters.q && filters.category === 'all' && !filters.month && !filters.year && filters.sort === 'newest';
  function pageLink(page: number, label: string | number, disabled = false) {
    if (staticPaging && !disabled) return <a href={blogPageHref(page)} aria-label={`${page}ページ目`} aria-current={page === results.page ? 'page' : undefined}>{label}</a>;
    return <button type="button" disabled={disabled} aria-label={`${page}ページ目`} aria-current={page === results.page ? 'page' : undefined} onClick={() => goTo(page)}>{label}</button>;
  }
  return <div className={styles.explorer}>
    {draftCount > 0 && <p className={styles.draftNotice}>加筆案 {draftCount}件を確認中です。下書きはこのローカル画面でのみ表示されます。</p>}
    <div className={styles.toolbar}>
      <label className={styles.search}>キーワード検索
        <input type="search" value={filters.q} onChange={e => update({ q: e.target.value }, true)} placeholder="タイトル・本文から探す" disabled={unavailable} />
      </label>
      <label>公開年<select value={filters.year} onChange={e => update({ year: e.target.value, month: '' })} disabled={unavailable}>
        <option value="">すべての年</option>{years.map(y => <option key={y} value={y}>{y}年</option>)}
      </select></label>
      <label>公開月<select value={filters.month} onChange={e => update({ month: e.target.value })} disabled={unavailable}>
        <option value="">すべての月</option>{months.map(m => <option key={m} value={m}>{m.replace('-', '年')}月</option>)}
      </select></label>
      <label>表示順<select value={filters.sort} onChange={e => update({ sort: e.target.value })} disabled={unavailable}>
        <option value="newest">新しい順</option><option value="oldest">古い順</option>
      </select></label>
    </div>
    <div className={styles.categories} role="group" aria-label="記事カテゴリ">
      {['all', ...categoryKeys].map(key => <button key={key} type="button" aria-pressed={filters.category === key} disabled={unavailable} onClick={() => update({ category: key })}>
        {key === 'all' ? 'すべて' : categoryLabel(key)} <span>{key === 'all' ? posts.length : posts.filter(p => p.category === key).length}</span>
      </button>)}
    </div>
    <div className={styles.layout}>
      <section aria-labelledby="blog-results-title">
        <div className={styles.results}>
          <h2 id="blog-results-title" ref={heading} tabIndex={-1} aria-live="polite">{unavailable ? 'お知らせ' : `${results.total}件の記事`}</h2>
          {!unavailable && filterQuery(filters) && <button type="button" onClick={reset}>条件をクリア</button>}
        </div>
        {unavailable ? <div className={styles.empty} role="status"><h3>記事を読み込めませんでした</h3><p>時間をおいて、もう一度お試しください。</p><button type="button" onClick={() => window.location.reload()}>再読み込み</button><a href="/contact">お問い合わせ</a></div>
        : results.total === 0 ? <div className={styles.empty}><h3>{posts.length ? '条件に合う記事がありません' : 'お知らせは準備中です'}</h3><p>{posts.length ? '別のキーワードやカテゴリでお試しください。' : '公開された記事はこちらに掲載されます。'}</p>{posts.length > 0 && <button type="button" onClick={reset}>すべての記事を見る</button>}</div>
        : <><div className={styles.grid}>{results.posts.map(post => <article key={post.slug} className={styles.card}>
          <a href={articleHref(post.slug)}><img src={post.image} alt="" loading="lazy" onError={e => { e.currentTarget.onerror = null; if (!e.currentTarget.src.endsWith('/blog/default.jpg')) e.currentTarget.src = '/blog/default.jpg'; }} />
            <div className={styles.cardBody}><span className={styles.tag}>{categoryLabel(post.category)}{post.draft ? ' · 加筆案' : ''}</span><div className={styles.meta}><time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time><span>約{post.readingTime}分</span></div><h3>{post.title}</h3><p>{post.description}</p><span className={styles.readMore}>記事を読む →</span></div>
          </a></article>)}</div>
          <nav className={styles.pagination} aria-label="記事一覧のページ送り">
            {pageLink(results.page - 1, '← 前へ', results.page === 1)}
            {Array.from({ length: results.pages }, (_, i) => i + 1).filter(n => n === 1 || n === results.pages || Math.abs(n - results.page) <= 1).map((n, i, visible) => <span key={n}>{i > 0 && n - visible[i - 1] > 1 && <span className={styles.ellipsis}>…</span>}{pageLink(n, n)}</span>)}
            {pageLink(results.page + 1, '次へ →', results.page === results.pages)}
          </nav></>}
      </section>
      <aside className={styles.sidebar}>
        {years.length > 0 && <section><h2>年別アーカイブ</h2><p className={styles.yearHelp}>掲載年から探す</p>{years.map(year => <button className={styles.yearLink} type="button" key={year} aria-pressed={filters.year === year} onClick={() => update({ year: year, month: '' })}>{year}年 <span>{posts.filter(p => articleYear(p) === year).length}件</span></button>)}</section>}
        {!unavailable && posts.length > 0 && <section><h2>新着記事</h2>{posts.slice(0, 3).map(p => <a key={p.slug} className={styles.recent} href={articleHref(p.slug)}><time>{formatDate(p.publishedAt)}</time><span>{p.title}</span></a>)}</section>}
        <section className={styles.contact}><span>CONTACT</span><h2>住まいのこと、<br />お気軽に。</h2><p>売買・賃貸、空き家や相続した不動産のご相談を承ります。</p><a href="/contact">お問い合わせ →</a></section>
      </aside>
    </div>
  </div>;
}

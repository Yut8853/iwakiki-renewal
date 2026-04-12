import { useMemo } from 'react';
import styles from './BlogSidebar.module.scss';

const shuffle = (array: any[]) => {
  return [...array].sort(() => 0.5 - Math.random());
};

export default function BlogSidebar({ posts = [], categories }: any) {
  const randomPosts = useMemo(() => shuffle(posts).slice(0, 3), [posts]);

  const handleCategoryClick = (category: string) => {
    const btn = document.querySelector(`[data-filter="${category}"]`);
    if (btn instanceof HTMLElement) {
      btn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarCard}>
        <input type="text" placeholder="検索..." className={styles.search} />
      </div>

      <div className={styles.sidebarCard}>
        <h3>カテゴリー</h3>
        <ul>
          {Object.entries(categories).map(([key, val]: any) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => handleCategoryClick(key)}
                className={styles.categoryBtn}
              >
                {val.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sidebarCard}>
        <h3>人気記事</h3>

        {randomPosts
          ?.filter(Boolean) // 🔥安全対策
          .map((p: any) => (
            <a key={p.slug} href={`/blog/${p.slug}`} className={styles.popular}>
              
              {/* 🔥ここ修正 */}
              <img
                src={p?.featured_image ?? '/blog/default.jpg'}
                alt={p?.title ?? ''}
              />

              {/* 🔥ここ修正 */}
              <p>{p?.title ?? 'タイトルなし'}</p>

            </a>
          ))}
      </div>

      <div className={styles.sidebarCard}>
        <p>お気軽にご相談ください</p>
        <a href="/contact">お問い合わせ →</a>
      </div>
    </aside>
  );
}
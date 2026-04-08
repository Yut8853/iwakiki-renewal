'use client';

import React, { useRef, useEffect, useState } from 'react';

/**
 * 型定義
 */
interface BlogPost {
  slug: string;
  title: string;
  publishedAt: Date | string;
  category: 'news' | 'column' | 'property' | 'lifestyle';
  image?: string;
  excerpt?: string;
  author: { name: string };
  readingTime?: number;
}

const CATEGORIES = {
  news: { label: 'お知らせ', color: '#06756d' },
  column: { label: 'コラム', color: '#e67e22' },
  property: { label: '物件情報', color: '#3498db' },
  lifestyle: { label: '暮らし', color: '#9b59b6' },
} as const;

/**
 * BlogCard コンポーネント (内部統合)
 */
const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [m, setM] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVis(true), (index % 6) * 60);
          ob.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [index]);

  const info = CATEGORIES[post.category] || { label: 'その他', color: '#666' };
  const date = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <article
      ref={ref as any}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setM({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className={`lp-card ${vis ? 'vis' : ''}`}
      style={{ '--x': `${m.x}px`, '--y': `${m.y}px` } as any}
    >
      <div className="lp-glow" />
      <a href={`/blog/${post.slug}`} className="lp-inner">
        <div className="lp-img">
          <img
            src={`/blog/${post.slug}/${post.image || 'thumbnail.jpg'}`}
            alt=""
            onError={e => (e.currentTarget.src = '/blog/default.jpg')}
          />
          <span className="lp-tag" style={{ background: info.color }}>
            {info.label}
          </span>
        </div>
        <div className="lp-body">
          <time className="lp-date">{date}</time>
          <h3 className="lp-title">{post.title}</h3>
          <p className="lp-exc">{post.excerpt}</p>
        </div>
      </a>
    </article>
  );
};

/**
 * LatestPosts メインコンポーネント
 */
export default function LatestPosts({
  allPosts = [],
}: {
  allPosts: BlogPost[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDate, setActiveDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);

  // カレンダー計算
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();

  // フィルタリング
  const filteredPosts = allPosts.filter(post => {
    const d = new Date(post.publishedAt);
    const catMatch =
      activeCategory === 'all' || post.category === activeCategory;
    const dateMatch =
      !activeDate ||
      (d.getFullYear() === activeDate.year &&
        d.getMonth() + 1 === activeDate.month &&
        d.getDate() === activeDate.day);
    return catMatch && dateMatch;
  });

  const changeMonth = (dir: 'prev' | 'next') => {
    if (dir === 'prev') {
      if (viewMonth === 1) {
        setViewMonth(12);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else {
      if (viewMonth === 12) {
        setViewMonth(1);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    }
  };

  return (
    <section ref={sectionRef} className="lp-section">
      <style>{`
        .lp-section { padding: 100px 0; background: #fff; color: #1a1a1a; font-family: sans-serif; }
        .lp-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .lp-h2 { font-size: 32px; font-weight: 800; margin-bottom: 40px; letter-spacing: -0.02em; }
        
        .lp-filter-bar { display: flex; gap: 10px; margin-bottom: 40px; flex-wrap: wrap; }
        .lp-btn { padding: 8px 20px; border-radius: 100px; border: 1px solid #f0f0f0; background: #fff; cursor: pointer; font-weight: 700; font-size: 13px; transition: 0.3s; color: #888; }
        .lp-btn.active { background: #06756d; color: #fff; border-color: #06756d; }
        
        .lp-layout { display: flex; gap: 40px; flex-direction: column; }
        @media (min-width: 1024px) { .lp-layout { flex-direction: row; } }
        
        .lp-grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .lp-sidebar { width: 100%; }
        @media (min-width: 1024px) { .lp-sidebar { width: 300px; position: sticky; top: 120px; height: fit-content; } }
        
        .lp-card { position: relative; background: #fff; border-radius: 16px; border: 1px solid #f0f0f0; overflow: hidden; transition: 0.4s; opacity: 0; transform: translateY(20px); height: 100%; }
        .lp-card.vis { opacity: 1; transform: translateY(0); }
        .lp-inner { text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%; }
        .lp-img { aspect-ratio: 16/10; overflow: hidden; position: relative; background: #f8f8f8; }
        .lp-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .lp-tag { position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; color: #fff; }
        .lp-body { padding: 20px; flex: 1; }
        .lp-date { font-size: 11px; color: #aaa; font-weight: 700; margin-bottom: 8px; display: block; }
        .lp-title { font-size: 17px; font-weight: 800; margin-bottom: 10px; line-height: 1.4; }
        .lp-exc { font-size: 13px; color: #666; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .lp-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: 0.4s; background: radial-gradient(400px circle at var(--x) var(--y), rgba(6,117,109,0.05), transparent 40%); }
        .lp-card:hover .lp-glow { opacity: 1; }
        .lp-card:hover { transform: translateY(-5px) !important; border-color: #06756d; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .lp-side-block { background: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 20px; padding: 24px; }
        .lp-side-h3 { font-size: 16px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
        
        .lp-cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .lp-cal-nav button { background: none; border: 1px solid #eee; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px; }
        .lp-cal-nav span { font-size: 14px; font-weight: 700; }
        
        .lp-calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
        .lp-cal-h { font-size: 10px; font-weight: 800; color: #ccc; text-align: center; margin-bottom: 8px; }
        .lp-cal-d { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: default; color: #ddd; }
        .lp-cal-d.has { color: #333; cursor: pointer; }
        .lp-cal-d.has:hover { background: #f0f0f0; }
        .lp-cal-d.active { background: #06756d !important; color: #fff !important; }
        
        .lp-reset { width: 100%; margin-top: 20px; padding: 10px; border-radius: 10px; border: 1px dashed #ddd; background: none; color: #aaa; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .lp-reset:hover { color: #06756d; border-color: #06756d; background: #f0fdfa; }
        
        .lp-empty { text-align: center; padding: 60px 0; color: #aaa; grid-column: 1 / -1; }
      `}</style>

      <div className="lp-container">
        <h2 className="lp-h2">お知らせ・コラム</h2>

        <div className="lp-filter-bar">
          <button
            className={`lp-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            すべて
          </button>
          {Object.entries(CATEGORIES).map(([key, info]) => (
            <button
              key={key}
              className={`lp-btn ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {info.label}
            </button>
          ))}
        </div>

        <div className="lp-layout">
          <div className="lp-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))
            ) : (
              <div className="lp-empty">
                条件に一致する記事が見つかりませんでした
              </div>
            )}
          </div>

          <aside className="lp-sidebar">
            <div className="lp-side-block">
              <h3 className="lp-side-h3">カレンダー</h3>
              <div className="lp-cal-nav">
                <button onClick={() => changeMonth('prev')}>‹</button>
                <span>
                  {viewYear}年 {viewMonth}月
                </span>
                <button onClick={() => changeMonth('next')}>›</button>
              </div>

              <div className="lp-calendar">
                {['日', '月', '火', '水', '木', '金', '土'].map(d => (
                  <div key={d} className="lp-cal-h">
                    {d}
                  </div>
                ))}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={'e' + i}></div>
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const hasPost = allPosts.some(p => {
                    const d = new Date(p.publishedAt);
                    return (
                      d.getFullYear() === viewYear &&
                      d.getMonth() + 1 === viewMonth &&
                      d.getDate() === day
                    );
                  });
                  const isActive =
                    activeDate?.year === viewYear &&
                    activeDate?.month === viewMonth &&
                    activeDate?.day === day;
                  return (
                    <div
                      key={day}
                      className={`lp-cal-d ${hasPost ? 'has' : ''} ${isActive ? 'active' : ''}`}
                      onClick={() =>
                        hasPost &&
                        setActiveDate({ year: viewYear, month: viewMonth, day })
                      }
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {(activeDate || activeCategory !== 'all') && (
                <button
                  className="lp-reset"
                  onClick={() => {
                    setActiveDate(null);
                    setActiveCategory('all');
                  }}
                >
                  絞り込み解除
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

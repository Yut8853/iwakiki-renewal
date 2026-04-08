import React, { useRef, useEffect, useState } from 'react';

/** * Single-file condensed version of BlogCard.
 * Styles are injected directly to fix the resolution error and follow the single-file mandate.
 */

export interface BlogPost {
  slug: string;
  title: string;
  publishedAt: Date | string;
  category: 'news' | 'column' | 'property' | 'lifestyle';
  image?: string;
  excerpt?: string;
  author: { name: string };
  readingTime?: number;
}

const CATS = {
  news: { l: 'お知らせ', c: '#06756d' },
  column: { l: 'コラム', c: '#e67e22' },
  property: { l: '物件情報', c: '#3498db' },
  lifestyle: { l: '暮らし', c: '#9b59b6' },
};

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export const BlogCard = ({
  post,
  index,
  variant = 'default',
}: {
  post: BlogPost;
  index: number;
  variant?: string;
}) => {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [m, setM] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVis(true), index * 50);
          ob.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [index]);

  const onM = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setM({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const info = CATS[post.category] || { l: 'その他', c: '#666' };
  const date = fmt(post.publishedAt);
  const img = post.image || '/blog/default.jpg';

  return (
    <>
      <style>{`
        .bc-card { position: relative; background: #fff; border-radius: 16px; border: 1px solid #f0f0f0; overflow: hidden; transition: 0.4s; opacity: 0; transform: translateY(20px); height: 100%; text-decoration: none; color: inherit; display: flex; flex-direction: column; }
        .bc-card.vis { opacity: 1; transform: translateY(0); }
        .bc-card:hover { transform: translateY(-5px); border-color: #06756d; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .bc-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: 0.4s; background: radial-gradient(400px circle at var(--x) var(--y), rgba(6,117,109,0.05), transparent 40%); }
        .bc-card:hover .bc-glow { opacity: 1; }
        .bc-img { aspect-ratio: 16/10; overflow: hidden; background: #eee; position: relative; }
        .bc-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .bc-card:hover img { transform: scale(1.05); }
        .bc-tag { position: absolute; top: 12px; right: 12px; padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; }
        .bc-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .bc-date { font-size: 11px; color: #aaa; margin-bottom: 8px; }
        .bc-title { font-size: 17px; font-weight: 800; margin-bottom: 10px; line-height: 1.4; color: #1a1a1a; }
        .bc-exc { font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .bc-foot { margin-top: auto; padding-top: 15px; border-top: 1px solid #f8f8f8; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; color: #ccc; }
        .bc-feat { display: flex; flex-direction: column; min-height: 350px; border-radius: 24px; }
        @media (min-width: 768px) { .bc-feat { flex-direction: row; } .bc-feat .bc-img { width: 50%; aspect-ratio: auto; } .bc-feat .bc-body { width: 50%; padding: 40px; } }
        .bc-comp { padding: 15px 0; border-bottom: 1px solid #f0f0f0; flex-direction: row; align-items: center; opacity: 0; transform: translateX(-10px); }
        .bc-comp.vis { opacity: 1; transform: translateX(0); }
      `}</style>

      {variant === 'compact' ? (
        <article
          ref={ref as any}
          className={`bc-card bc-comp ${vis ? 'vis' : ''}`}
        >
          <a
            href={`/blog/${post.slug}`}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#eee' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: info.c,
                  display: 'block',
                }}
              >
                {info.l}
              </span>
              <h4 style={{ margin: '2px 0', fontSize: '15px' }}>
                {post.title}
              </h4>
            </div>
            <span style={{ color: '#ddd' }}>→</span>
          </a>
        </article>
      ) : (
        <article
          ref={ref as any}
          className={`bc-card ${variant === 'featured' ? 'bc-feat' : ''} ${vis ? 'vis' : ''}`}
          onMouseMove={onM}
          style={{ '--x': `${m.x}px`, '--y': `${m.y}px` } as any}
        >
          <div className="bc-glow" />
          <a href={`/blog/${post.slug}`} style={{ display: 'contents' }}>
            <div className="bc-img">
              <img
                src={img}
                alt={post.title}
                onError={e => (e.currentTarget.src = '/blog/default.jpg')}
              />
              <span className="bc-tag" style={{ background: info.c }}>
                {info.l}
              </span>
            </div>
            <div className="bc-body">
              <time className="bc-date">{date}</time>
              <h3 className="bc-title">{post.title}</h3>
              <p className="bc-exc">{post.excerpt}</p>
              <div className="bc-foot">
                <span style={{ color: '#888' }}>{post.author.name}</span>
                <span>READ MORE →</span>
              </div>
            </div>
          </a>
        </article>
      )}
    </>
  );
};

export default BlogCard;

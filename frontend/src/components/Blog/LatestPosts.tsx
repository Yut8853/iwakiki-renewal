'use client';

import { useRef, useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import { getLatestPosts, blogCategories } from '../../data/blog';
import styles from './Blog.module.scss';

export function LatestPosts() {
  const sectionRef = useRef<HTMLElement>(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [activeDate, setActiveDate] = useState<number | null>(null);

  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);

  const allPosts = getLatestPosts(999);

  const now = new Date();

  // 🔥 カレンダー計算
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();

  // 🔥 フィルター（カテゴリ × 月 × 日）
  const filteredPosts = allPosts.filter(post => {
    const d = new Date(post.publishedAt);

    return (
      (activeCategory === 'all' || post.category === activeCategory) &&
      (activeMonth === null || d.getMonth() + 1 === activeMonth) &&
      (activeDate === null || d.getDate() === activeDate)
    );
  });

  // Intersection
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsHeaderVisible(true);
        observer.unobserve(entry.target);
      }
    });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filters = [
    { key: 'all', label: 'すべて' },
    ...Object.entries(blogCategories).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  ];

  // 🔥 月切り替え
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
    <section ref={sectionRef} className={styles.latestPosts}>

      <div className={styles.container}>
        <h2>お知らせ・コラム</h2>

        {/* カテゴリ */}
        <div className={styles.filterBar}>
          {filters.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${activeCategory === f.key ? styles.active : ''}`}
              onClick={() => setActiveCategory(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.blogLayout}>

          {/* 記事 */}
          <div className={styles.postsGrid}>
            {filteredPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>

          {/* サイドバー */}
          <aside className={styles.sidebar}>

            <div className={styles.sidebarBlock}>
              <h3>カレンダー</h3>

              {/* 月切り替え */}
              <div className={styles.calendarNav}>
                <button onClick={() => changeMonth('prev')}>‹</button>
                <span>{viewYear}年 {viewMonth}月</span>
                <button onClick={() => changeMonth('next')}>›</button>
              </div>

              <div className={styles.calendar}>
                {['日','月','火','水','木','金','土'].map(d => (
                  <div key={d} className={styles.calendarDay}>{d}</div>
                ))}

                {/* 空白 */}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={'empty'+i}></div>
                ))}

                {/* 日付 */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;

                  const hasPost = allPosts.some(post => {
                    const d = new Date(post.publishedAt);
                    return (
                      d.getFullYear() === viewYear &&
                      d.getMonth() + 1 === viewMonth &&
                      d.getDate() === day
                    );
                  });

                  const isActive = activeDate === day;

                  return (
                    <div
                      key={day}
                      className={`${styles.calendarDate}
                        ${hasPost ? styles.hasPost : ''}
                        ${isActive ? styles.activeDate : ''}`}
                      onClick={() => {
                        setActiveMonth(viewMonth);
                        setActiveDate(day);
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* リセット */}
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setActiveMonth(null);
                  setActiveDate(null);
                }}
              >
                絞り込み解除
              </button>
            </div>

          </aside>
        </div>
      </div>
    </section>
  );
}
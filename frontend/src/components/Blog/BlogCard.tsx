'use client';

import { useRef, useEffect, useState } from 'react';
import type { BlogPost } from '../../data/blog';
import { blogCategories, formatDate } from '../../data/blog';
import styles from './Blog.module.scss';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  variant?: 'default' | 'featured' | 'compact';
}

export function BlogCard({ post, index, variant = 'default' }: BlogCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const categoryInfo = blogCategories[post.category];

  if (variant === 'featured') {
    return (
      <article
        ref={cardRef}
        className={`${styles.featuredCard} ${isVisible ? styles.isVisible : ''}`}
        onMouseMove={handleMouseMove}
        style={
          {
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
          } as React.CSSProperties
        }
      >
        <div className={styles.featuredGlow} />
        <a href={`/blog/${post.slug}`} className={styles.featuredLink}>
          <div className={styles.featuredImage}>
            <div className={styles.imageWrapper}>
              <div
                className={styles.imagePlaceholder}
                style={{ backgroundColor: categoryInfo.color + '15' }}
              >
                <svg viewBox="0 0 100 100" fill="none">
                  <rect
                    x="20"
                    y="20"
                    width="60"
                    height="60"
                    rx="8"
                    stroke={categoryInfo.color}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <circle cx="35" cy="35" r="8" fill={categoryInfo.color} opacity="0.3" />
                  <path
                    d="M25 65 L40 50 L55 60 L75 35"
                    stroke={categoryInfo.color}
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.imageOverlay} />
          </div>
          <div className={styles.featuredContent}>
            <div className={styles.cardMeta}>
              <span
                className={styles.cardCategory}
                style={{ '--category-color': categoryInfo.color } as React.CSSProperties}
              >
                {categoryInfo.label}
              </span>
              <span className={styles.cardDate}>{formatDate(post.publishedAt)}</span>
            </div>
            <h3 className={styles.featuredTitle}>{post.title}</h3>
            <p className={styles.featuredExcerpt}>{post.excerpt}</p>
            <div className={styles.cardFooter}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>{post.author.name.charAt(0)}</div>
                <span className={styles.authorName}>{post.author.name}</span>
              </div>
              <span className={styles.readTime}>{post.readingTime}分で読める</span>
            </div>
          </div>
        </a>
        <div className={styles.cardCorner} data-corner="tl" />
        <div className={styles.cardCorner} data-corner="br" />
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        ref={cardRef}
        className={`${styles.compactCard} ${isVisible ? styles.isVisible : ''}`}
      >
        <a href={`/blog/${post.slug}`} className={styles.compactLink}>
          <span className={styles.compactNum}>{String(index + 1).padStart(2, '0')}</span>
          <div className={styles.compactContent}>
            <span
              className={styles.compactCategory}
              style={{ '--category-color': categoryInfo.color } as React.CSSProperties}
            >
              {categoryInfo.label}
            </span>
            <h4 className={styles.compactTitle}>{post.title}</h4>
            <span className={styles.compactDate}>{formatDate(post.publishedAt)}</span>
          </div>
          <div className={styles.compactArrow}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </a>
      </article>
    );
  }

  return (
    <article
      ref={cardRef}
      className={`${styles.blogCard} ${isVisible ? styles.isVisible : ''}`}
      onMouseMove={handleMouseMove}
      style={
        {
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.cardGlow} />
      <a href={`/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.cardImage}>
          <div
            className={styles.imagePlaceholder}
            style={{ backgroundColor: categoryInfo.color + '10' }}
          >
            <svg viewBox="0 0 100 100" fill="none">
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                rx="8"
                stroke={categoryInfo.color}
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle cx="35" cy="35" r="8" fill={categoryInfo.color} opacity="0.3" />
              <path
                d="M25 65 L40 50 L55 60 L75 35"
                stroke={categoryInfo.color}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div className={styles.cardImageOverlay} />
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardMeta}>
            <span
              className={styles.cardCategory}
              style={{ '--category-color': categoryInfo.color } as React.CSSProperties}
            >
              {categoryInfo.label}
            </span>
            <span className={styles.cardDate}>{formatDate(post.publishedAt)}</span>
          </div>
          <h3 className={styles.cardTitle}>{post.title}</h3>
          <p className={styles.cardExcerpt}>{post.excerpt}</p>
          <div className={styles.cardFooter}>
            <span className={styles.readMore}>
              続きを読む
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

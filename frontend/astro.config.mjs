import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://iwakiki.jp',
  output: 'server', // 🔥これ

  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja-JP',
        },
      },
      filter: (page) => !page.includes('/api/'),
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '~': '/src',
      },
    },
  },

  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
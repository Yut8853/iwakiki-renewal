import { defineConfig } from 'astro/config' // ←これ絶対必要
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://iwakiki.co.jp',
  trailingSlash: 'always',

  // 👇 serverは削除済みでOK
  // output: 'server',

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/404') && !/\.(xml|txt|md)$/.test(page),
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
})
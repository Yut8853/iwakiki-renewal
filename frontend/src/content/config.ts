import { defineCollection, z } from 'astro:content';

// ブログのデータ項目（タイトルや日付など）を定義
const blog = defineCollection({
  type: 'content', // Markdownを使う場合は 'content'
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.date(), // 文字列ではなくDateオブジェクトとして扱える
    category: z.string(),
    image: z.string().default('thumbnail.jpg'), // 画像ファイル名
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      avatar: z.string().optional(),
    }),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().default(5),
  }),
});

export const collections = { blog };

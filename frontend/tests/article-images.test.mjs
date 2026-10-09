import test from 'node:test';
import assert from 'node:assert/strict';
import { marked } from 'marked';
import { imageMarkdown, insertBodyImage } from '../../cms/src/lib/article-images.ts';

test('inserts images between paragraphs and keeps surrounding text', () => {
  const image = imageMarkdown('https://example.com/living-room.jpg', 'リビング');
  const result = insertBodyImage('前の段落\n\n後の段落', 5, 5, image);
  const html = marked.parse(result.content);
  assert.match(html, /alt="リビング"/);
  assert.ok(html.indexOf('前の段落') < html.indexOf('<img'));
  assert.ok(html.indexOf('<img') < html.indexOf('後の段落'));
  assert.equal(result.content.slice(result.cursor), '\n後の段落');
});
test('multiple body images render independently', () => {
  let body = '本文';
  for (const n of [1, 2, 3]) body = insertBodyImage(body, body.length, body.length, imageMarkdown(`https://example.com/${n}.jpg`, `画像${n}`)).content;
  assert.equal((marked.parse(body).match(/<img /g) || []).length, 3);
});
test('escapes descriptions and handles URLs containing parentheses or spaces', () => {
  const html = marked.parse(imageMarkdown('https://example.com/photo (1).jpg', '写真 [外観] <玄関>'));
  assert.match(html, /photo%20\(1\).jpg/);
  assert.equal((html.match(/<img /g) || []).length, 1);
  assert.ok(!html.includes('<玄関>'));
});
test('rejects invalid, unsafe or credential-bearing image URLs', () => {
  for (const url of ['', 'not-a-url', 'javascript:alert(1)', 'data:image/png;base64,abc', 'https://user:password@example.com/image.jpg']) {
    assert.throws(() => imageMarkdown(url, '説明'));
  }
});
test('replaces selected text and preserves the cover field', () => {
  const post = { content: 'before選択after', featured_image: '/cover.jpg' };
  const result = insertBodyImage(post.content, 6, 8, imageMarkdown('https://example.com/body.jpg', ''));
  assert.ok(!result.content.includes('選択'));
  assert.ok(result.content.startsWith('before\n\n'));
  assert.ok(result.content.endsWith('after'));
  assert.equal(post.featured_image, '/cover.jpg');
});

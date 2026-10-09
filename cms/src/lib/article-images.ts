/** Keep images in the existing Markdown body, independent of the cover image. */
export function imageMarkdown(url: string, description: string) {
  let parsed: URL
  try { parsed = new URL(url.trim()) } catch { throw new Error('画像のURLを https:// または http:// から入力してください。') }
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('公開されている画像のURLを入力してください。')
  }
  const alt = description.trim().replace(/[\r\n]+/g, ' ').replace(/([\\\[\]`*_<>])/g, '\\$1')
  const src = parsed.href.replace(/[<>]/g, c => encodeURIComponent(c))
  return `![${alt}](<${src}>)`
}

export function insertBodyImage(content: string, start: number, end: number, markdown: string) {
  const from = Math.min(content.length, Math.max(0, start))
  const to = Math.min(content.length, Math.max(from, end))
  const before = content.slice(0, from)
  const after = content.slice(to)
  const prefix = before ? before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n' : ''
  const insertion = `${prefix}${markdown}\n\n`
  return { content: before + insertion + after, cursor: before.length + insertion.length }
}

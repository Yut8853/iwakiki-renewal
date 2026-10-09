import { site } from '../libs/seo';
export function GET() {
  return new Response(`# 株式会社iwakiki

> 福島県いわき市を拠点とする不動産会社。売買・賃貸仲介、買取・販売、リノベーション、物件管理、空き家・相続のご相談を承ります。

## 会社情報
- 代表取締役：大澤 一仁
- 所在地：〒970-0224 福島県いわき市平豊間字合磯218-1
- 電話：${site.telephone}
- メール：${site.email}
- 営業時間：9:00〜18:00
- 定休日：毎週水曜日、他週1日
- 宅地建物取引業免許：福島県知事（1）第3652号

## 主要ページ
- [会社概要・代表メッセージ](${site.url}/about/)
- [不動産サービス](${site.url}/services/)
- [お知らせ・物件情報・地域の活動](${site.url}/blog/)
- [お問い合わせ](${site.url}/contact/)

## 記事を探す
- [記事索引](${site.url}/articles.md): 公開記事のタイトル・掲載日・概要と詳細ページへのリンク。
- [RSS](${site.url}/rss.xml)
- [サイトマップ](${site.url}/sitemap-index.xml)

## 関連アカウント
- [iwakiki vacation homes Instagram](${site.instagram})
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

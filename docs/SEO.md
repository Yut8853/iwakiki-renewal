# SEO・構造化データ・AI向け情報

本番URLは https://iwakiki.co.jp/ 。生成済みの実装で、本番へのデプロイ・検索エンジンへの送信はまだ行っていません。

## 実装

- `src/libs/seo.ts` と共通Layoutで canonical、description、OGP、Twitterカード、JSON-LDを生成。canonicalはクエリを除き末尾スラッシュを統一。
- RealEstateAgent・WebSite・WebPageをIDで接続。会社概要はAboutPageと代表者Person、お問い合わせはContactPage、サービスはService、記事はBlogPosting、一覧はCollectionPageと表示中の記事のItemList。
- BlogPostingの公開日はSupabaseのpublished_at、更新日は妥当なupdated_atを使用。著者は発信主体の株式会社iwakiki。パンくずには記事タイトルを表示。未確認の評価・料金・営業時間の曜日指定は追加していません。
- OG画像は実在するファイルを参照。固定画像は実寸1024×1024を指定、記事画像に一律1200×630を付ける設定を削除。
- 記事一覧は6件ずつの静的ページ。通常のaリンクで全記事をたどれます。検索・カテゴリ等の絞り込みは従来どおりブラウザで行い、クエリ付きURLは一覧のcanonicalへ集約します。
- robots.txtでCSS・JavaScriptを許可。sitemap-index.xmlとsitemap-0.xmlはビルド時の公開ページから生成し、404や補助ファイルを除外。根拠のないビルド日時のlastmodは削除。
- RSS (`/rss.xml`)、会社情報 (`/llms.txt`)、公開記事索引 (`/articles.md`) を生成。記事索引・RSSはSupabaseの公開記事のみを使用。
- `PUBLIC_SITE_INDEXING=false` で全HTMLをnoindexにし、robots.txtもDisallowにする。既存のSTGワークフローに適用。本番ビルドではこの変数をfalseにしないこと。
- STG配信設定ではHTML・XML・TXT・Markdownをno-cacheにして、更新が長期キャッシュに残ることを防止。

## 旧URLの引き継ぎ

`infra/legacy-redirects.json` と `infra/legacy-redirects.js` に確認済みの旧記事URL・主要ページから新URLへの301転送を用意しました。CloudFront Functions runtime 2.0のviewer-request向けです。**AWSにはまだ適用していません。** 本番の既存ルーティング関数がある場合は統合し、既存のS3向けindex.html書き換えを保持してください。

同一のsale-013.htmlがA号棟・B号棟に使われていたため、旧URLは現在の詳細に対応するA号棟へ転送します。B号棟は `/blog/sale-013-b/` に独立して残しています。post-015.htmlは年末記事、post-016.htmlは新年記事へ対応します。未確認の旧ページを一括でトップへ転送しません。

本番公開時に、存在しないURLは実際の404ステータスで404.htmlを返すよう配信側を設定してください。SPA用の「全404をトップページへ200で転送」設定は使用しません。

## 検証

リポジトリルートから：

```
node --experimental-strip-types --test frontend/tests/*.test.mjs
```

frontendで `pnpm build` 後、ルートで：

```
python3 scripts/verify_seo.py
```

メタデータ・JSON-LDの参照関係・記事画像・公開記事の一覧網羅性・JavaScriptなしでのページ送り・サイトマップ・RSSを検査します。外部のRich Results Testの合格を代替するものではありません。

## 公開後に実施すること

本番デプロイと旧URLの301転送を有効化し、Search Consoleで `https://iwakiki.co.jp/sitemap-index.xml` を送信。主要ページ・記事をURL検査とRich Results Testで確認します。Search Consoleの認証コードや解析IDは提供されていないため、架空のタグは入れていません。

AI検索への掲載には通常のSEOが基礎となり、特別なAI用ファイルや構造化データは必須ではありません。llms.txtは補助的な案内であり、検索順位やAI回答への採用を保証するものではありません。

参考：
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example_cloudfront_functions_redirect_based_on_country_section.html

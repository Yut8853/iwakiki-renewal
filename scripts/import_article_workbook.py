"""Create website articles and a CMS import payload from the supplied workbook extraction."""
import json, re
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / 'content/iwakiki-articles/workbook-source.json').read_text())
image_manifest = json.loads((ROOT / 'content/iwakiki-articles/images.json').read_text())
articles = []
community = {1, 6, 16, 20, 21, 25, 38, 46}
vacation = {26, 28, 36, 39, 40, 41}
labels = {'news': 'お知らせ', 'property': '売買・成約', 'rental': '賃貸', 'lifestyle': '地域の活動', 'vacation': '貸別荘'}
for row in source['2'][4:]:
    number = int(row['A']); source_url = row['B']; slug = source_url.split('/')[-1].removesuffix('.html')
    dates = re.findall(r'(\d{4})年(\d{1,2})月(\d{1,2})日', row['J'])
    year, month, day = map(int, dates[0])
    if slug == 'post-015': year, month, day = 2024, 12, 27
    category = 'property' if any(s in source_url for s in ['/property/', '/sale/']) or number in {44,45} else 'lifestyle' if number in community else 'vacation' if number in vacation else 'rental' if number == 42 else 'news'
    title = row['C']
    if '主見出しは空欄' in title or title in ['ご成約のお知らせ', '緑区中山']:
        subject = row['H'].split(' / ')[-1].split('\n')[0]
        title = f'{subject}｜ご成約のお知らせ'
    if number in {16,20}: title = row['I'].split(' / ')[0]
    urls = list(dict.fromkeys(u.strip() for u in row['F'].splitlines() if u.strip().startswith('https://')))
    images = [image_manifest[u]['path'] for u in urls if image_manifest.get(u, {}).get('path')]
    notes = [row['K']] if row['K'] else []
    if slug == 'sale-013':
        notes.append('参考URLの現在の見出しはA号棟、ExcelはB号棟。タイトル・加筆案・画像は提供されたExcelを優先して保持。要確認。')
    if not images:
        images = ['/blog/imported/announcement.svg']
        notes.append('本文用画像がないため、共通のお知らせイメージを使用。')
    for url in urls:
        if not image_manifest.get(url, {}).get('path'): notes.append('取得できない画像: ' + url)
    paragraphs = [p.strip() for p in row['E'].replace('\\n', '\n').split('\n\n') if p.strip()]
    parts=[]
    for i, paragraph in enumerate(paragraphs):
        parts.append(paragraph)
        if i == 0:
            alt = 'iwakikiからのお知らせのイメージ' if images[0].endswith('.svg') else title + '（元記事の掲載画像）'
            parts.append(f'![{alt}]({images[0]})')
        elif i-1 < len(images)-1:
            parts.append(f'![{title}（掲載画像{i+1}）]({images[i]})')
    placed = max(1, min(len(images),len(paragraphs)))
    for i in range(placed,len(images)): parts.append(f'![{title}（掲載画像{i+1}）]({images[i]})')
    date = f'{year:04}-{month:02}-{day:02}T00:00:00+09:00'
    articles.append({'id': f'workbook-{number}', 'slug': slug, 'title': title, 'description': row['G'], 'content': '\n\n'.join(parts), 'category': category, 'published_at': date, 'featured_image': images[0], 'published': True,
        'published_year': year, 'source_url': source_url, 'source_row': number+4, 'original_title': row['C'], 'original_summary': row['D'], 'original_draft': row['E'], 'original_dates': row['J'], 'original_image_urls': urls, 'images': images, 'review_notes': notes})
assert len(articles)==50 and len({a['slug'] for a in articles})==50
overrides_path = ROOT/'content/iwakiki-articles/source-overrides.json'
if overrides_path.exists():
    overrides = json.loads(overrides_path.read_text())
    articles = list(({a['slug']: a for a in articles} | overrides).values())
articles.sort(key=lambda a: (-int(a['published_at'][:10].replace('-', '')), a.get('source_order', 9999), a['slug']))
(ROOT/'frontend/src/data/imported-articles.json').write_text(json.dumps(articles,ensure_ascii=False,indent=2)+'\n')
fields = ['slug', 'title', 'description', 'content', 'category', 'published_at', 'featured_image', 'published']
(ROOT/'content/iwakiki-articles/cms-import.json').write_text(json.dumps([{k: a[k] for k in fields} for a in articles],ensure_ascii=False,indent=2)+'\n')
receipt_path = ROOT/'content/iwakiki-articles/import-receipt.json'
receipt = json.loads(receipt_path.read_text()) if receipt_path.exists() else None
registration_status = f"- Supabase登録済み：{receipt['verified']}記事（{receipt['registered_at']}）。登録結果は import-receipt.json。本番デプロイは未実施。" if receipt else '- Supabase登録と本番デプロイは未実施。登録用データは cms-import.json。'
report=['# ブログ掲載データ', '', '元資料：iwakiki_記事一覧_加筆案.xlsx「記事本文と加筆案」', '', f'- 現在の記事数：{len(articles)}件。元サイト全記事一覧との対応は reconciliation.json。Excel由来の掲載履歴は workbook-source.json に保持。', '- 元サイトの掲載日に沿って新しい順に表示。公開年・月・カテゴリで絞り込み可能。', f'- {len(articles)}記事を通常の記事としてローカル表示・本番ビルドに含める。', '- 既存本文はExcelの加筆案を使用。追加・更新記事は元サイトの詳細本文に基づいて作成。画像とリンクの補正理由は各記事の確認事項に記録。', registration_status, '- 表示はSupabaseの公開記事が基準。CMSの変更を公開サイトへ反映するには再ビルド・デプロイが必要。', '- 画像ファイルは frontend/public/blog/imported/ に保存。Supabaseには画像の参照パスを登録。', '', '## 公開年・カテゴリ別件数', '', '|公開年|カテゴリ|件数|','|---|---|---|']
for (year, category),count in sorted(Counter((a['published_year'],a['category']) for a in articles).items()):report.append(f'|{year}年|{labels[category]}|{count}|')
report+=['','## 記事一覧と確認事項','']
for a in articles:
    report += [f"### {a['published_year']}年 / {labels[a['category']]} / {a['title']}",f"- 日付：{a['published_at'][:10]}（元資料：{a['original_dates']}）",f"- 元記事：{a['source_url']}",f"- 確認URL：http://localhost:4322/blog/{a['slug']}/",f"- 本文画像：{len(a['images'])}点"]
    report += ['- '+note.replace('\n',' / ') for note in a['review_notes']]
    report+=['']
(ROOT/'content/iwakiki-articles/README.md').write_text('\n'.join(report)+'\n')
print(json.dumps({'articles':len(articles),'years':dict(Counter(a['published_year'] for a in articles)),'categories':dict(Counter(a['category'] for a in articles))},ensure_ascii=False))

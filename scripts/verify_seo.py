"""Validate built metadata, schema graph, crawlable archives and sitemap locally."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, sys, xml.etree.ElementTree as ET
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'frontend/dist'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.meta={};self.links=[];self.anchors=[];self.graph=[];self.json=False;self.title=False;self.title_text='';self.h1=0;self.main=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if tag=='link':self.links.append(a)
  if tag=='a':self.anchors.append(a.get('href',''))
  if tag=='script' and a.get('type')=='application/ld+json':self.json=True
  if tag=='title':self.title=True
  if tag=='h1':self.h1+=1
  if tag=='main':self.main+=1
 def handle_endtag(self,tag):
  if tag=='script':self.json=False
  if tag=='title':self.title=False
 def handle_data(self,text):
  if self.json:self.graph+=json.loads(text)['@graph']
  if self.title:self.title_text+=text
pages={};titles=set();articles=set();listed=set()
for f in root.rglob('*.html'):
 p=Page(f.read_text());canonical=[a['href'] for a in p.links if a.get('rel')=='canonical']
 assert len(canonical)==1,f
 url=canonical[0];pages[url]=p
 assert url.startswith('https://iwakiki.co.jp/'),(f,url)
 assert p.meta.get('description') and p.meta['og:url']==url,f
 assert p.h1==1 and p.main==1,(f,p.h1,p.main)
 assert p.title_text not in titles,('duplicate title',p.title_text)
 titles.add(p.title_text)
 assert p.meta['og:image'].startswith('https://'),f
 image=urlsplit(p.meta['og:image'])
 if image.netloc=='iwakiki.co.jp':assert (root/unquote(image.path.lstrip('/'))).is_file(),(f,image.path)
 assert len({n['@id'] for n in p.graph})==len(p.graph),f
 nodes={n['@type']:n for n in p.graph}
 assert 'RealEstateAgent' in nodes and 'WebSite' in nodes,f
 assert nodes['RealEstateAgent']['sameAs']==['https://www.instagram.com/iwakiki.vacation.homes/']
 if 'BlogPosting' in nodes:
  a=nodes['BlogPosting'];articles.add(url)
  assert a['image'][0]==p.meta['og:image'] and a['datePublished']==p.meta['article:published_time']
  assert nodes['BreadcrumbList']['itemListElement'][-1]['name']==a['headline']
 if 'ItemList' in nodes:
  for item in nodes['ItemList']['itemListElement']:
   listed.add(item['url']);assert urlsplit(item['url']).path in p.anchors,(f,item)
 if f.name!='404.html':assert 'noindex' not in p.meta['robots'],f
 else:assert 'noindex' in p.meta['robots']
assert articles==listed,('archive coverage',articles-listed,listed-articles)
# Follow only ordinary links to archive pages, without executing JavaScript.
seen=set();pending=['https://iwakiki.co.jp/blog/']
while pending:
 u=pending.pop()
 if u in seen:continue
 seen.add(u)
 for href in pages[u].anchors:
  if href.startswith('/blog/page/'):
   target='https://iwakiki.co.jp'+href
   assert target in pages,target
   pending.append(target)
assert {u for u in pages if '/blog/page/' in u}<=seen
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap=set()
for f in root.glob('sitemap-*.xml'):
 if f.name!='sitemap-index.xml':sitemap.update(n.text for n in ET.parse(f).findall('s:url/s:loc',ns))
assert sitemap=={u for u,p in pages.items() if 'noindex' not in p.meta['robots']},sitemap.symmetric_difference(pages)
assert len(ET.parse(root/'rss.xml').findall('./channel/item'))==len(articles)
assert len([u for u in articles if u in (root/'articles.md').read_text()])==len(articles)
assert '/_astro/' not in (root/'robots.txt').read_text()
print(f'PASS: {len(pages)} HTML pages, {len(articles)} article schemas, {len(seen)} crawlable archive pages, metadata, image paths, sitemap and RSS.')

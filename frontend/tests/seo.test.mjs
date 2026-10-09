import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalUrl, structuredData, serializeJsonLd, site } from '../src/libs/seo.ts';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('canonical URLs strip tracking and normalize directory URLs', () => {
  assert.equal(canonicalUrl('/blog/?utm_source=test#section'), 'https://iwakiki.co.jp/blog/');
  assert.equal(canonicalUrl('/about'), 'https://iwakiki.co.jp/about/');
  assert.equal(canonicalUrl('/index.html'), 'https://iwakiki.co.jp/');
});
test('article graph connects publisher, real headline, dates and named breadcrumbs', () => {
  const data = structuredData({path:'/blog/example/', title:'タイトル | iwakiki', description:'概要', image:'/photo.jpg', breadcrumbs:[{name:'ホーム',path:'/'},{name:'お知らせ',path:'/blog/'},{name:'タイトル',path:'/blog/example/'}], article:{title:'タイトル',publishedAt:'2026-09-11T00:00:00+09:00',modifiedAt:'2026-10-09T00:00:00+09:00',category:'お知らせ'}});
  const article = data['@graph'].find(n => n['@type']==='BlogPosting');
  assert.equal(article.headline,'タイトル');
  assert.equal(article.image[0],site.url+'/photo.jpg');
  assert.equal(article.author['@type'],'Organization');
  assert.equal(data['@graph'].find(n => n['@type']==='BreadcrumbList').itemListElement[2].name,'タイトル');
  assert.deepEqual(JSON.parse(serializeJsonLd({text:'</script><script>alert(1)</script>'})),{text:'</script><script>alert(1)</script>'});
  assert.ok(!serializeJsonLd({text:'</script>'}).includes('</script>'));
});
test('legacy redirects cover migrated source URLs without redirect loops', () => {
  const context = vm.createContext({});
  vm.runInContext(readFileSync(new URL('../../infra/legacy-redirects.js', import.meta.url),'utf8'),context);
  const mappings = JSON.parse(readFileSync(new URL('../../infra/legacy-redirects.json', import.meta.url),'utf8'));
  for (const [uri,target] of Object.entries(mappings)) {
    const result=context.handler({request:{uri}});
    assert.equal(result.statusCode,301);assert.equal(result.headers.location.value,target);
    assert.equal(context.handler({request:{uri:target.split('#')[0]}}).uri,target.split('#')[0]);
  }
});

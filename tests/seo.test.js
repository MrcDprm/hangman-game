// Adresler (routes.js), <head> üretimi (seo-head.js) ve sayfa fonksiyonu (api/page.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES } from '../src/words.js';
import { CATEGORY_SLUGS, categoryFromPath, pageMeta, pathFor, SITEMAP_PATHS } from '../src/routes.js';
import { buildHead, injectHead } from '../lib/seo-head.js';
import { renderPage } from '../lib/page-seo.js';
import { GET } from '../api/page.js';

const TEMPLATE = '<!doctype html>\n<html lang="tr">\n  <head>\n    <!-- seo -->\n    <title>x</title>\n    <!-- /seo -->\n  </head>\n  <body>gövde</body>\n</html>';

test('every category has a unique, URL-safe address', () => {
  const slugs = CATEGORIES.map((category) => CATEGORY_SLUGS[category]);
  assert.equal(new Set(slugs).size, CATEGORIES.length);
  assert.ok(slugs.every((slug) => /^[a-z0-9-]+$/.test(slug)));
  assert.equal(SITEMAP_PATHS.length, CATEGORIES.length + 1);
});

test('paths and categories map both ways', () => {
  assert.equal(categoryFromPath('/hayvanlar'), 'animals');
  assert.equal(categoryFromPath('/Yiyecek-ve-Icecek/'), 'food');
  assert.equal(categoryFromPath('/'), null);
  assert.equal(categoryFromPath('/xyz'), null);
  assert.equal(pathFor('science'), '/bilim');
  assert.equal(pathFor(null), '/');
});

test('page titles in both languages', () => {
  assert.equal(pageMeta('animals', 'tr').title, 'Adam Asmaca: Hayvanlar – Ücretsiz Kelime Oyunu');
  assert.equal(pageMeta('animals', 'en').title, 'Hangman: Animals – Free Word Game');
  assert.match(pageMeta(null, 'tr').title, /^Adam Asmaca Oyna/);
});

test('JSON-LD cannot break out of its script tag', () => {
  const head = buildHead({
    origin: 'https://example.com', path: '/', lang: 'tr', title: 't', description: 'd', siteName: 's', image: 'i',
    schemas: [{ name: '</script><script>alert(1)</script>' }],
  });
  assert.ok(!head.includes('</script><script>'));
  assert.match(injectHead(TEMPLATE, head, 'en'), /<html lang="en">/);
});

test('category page: canonical, hreflang and breadcrumb', () => {
  const { status, html } = renderPage(TEMPLATE, 'meslekler', 'en');
  assert.equal(status, 200);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/hangman\.miracdeprem\.com\/meslekler\?lang=en" \/>/);
  assert.match(html, /hreflang="tr" href="https:\/\/hangman\.miracdeprem\.com\/meslekler"/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  assert.deepEqual(schemas.map((s) => s['@type']), ['WebPage', 'BreadcrumbList']);
  assert.equal(schemas[1].itemListElement[1].name, 'Jobs');
});

test('unknown address: 404 and not indexed', () => {
  const { status, html } = renderPage(TEMPLATE, 'bilinmeyen', 'tr');
  assert.equal(status, 404);
  assert.match(html, /noindex/);
  assert.ok(!html.includes('rel="canonical"'));
});

test('page function serves the home page and the sitemap', async () => {
  const home = await GET(new Request('https://x/api/page'));
  assert.equal(home.status, 200);
  const body = await home.text();
  assert.match(body, /GameApplication/);
  assert.match(body, /<title>Adam Asmaca Oyna/);

  const sitemap = await (await GET(new Request('https://x/api/page?sitemap=1'))).text();
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 22);
});

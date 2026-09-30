// Her adres için sayfa HTML'i: şablona o sayfanın başlığı, açıklaması ve yapılandırılmış verisi eklenir.
import { buildHead, buildSitemap, injectHead, localeUrls } from './seo-head.js';
import { translate } from '../src/i18n.js';
import { categoryForSlug, ORIGIN, pageMeta, pathFor, SITEMAP_PATHS } from '../src/routes.js';

const SITE_NAME = { tr: 'Adam Asmaca', en: 'Hangman' };
const IMAGE = `${ORIGIN}/og-image.png`;
const APP_ID = `${ORIGIN}/#app`;
const AUTHOR = { '@type': 'Person', name: 'Miraç Deprem', url: 'https://www.miracdeprem.com' };

function appSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': APP_ID,
    name: SITE_NAME[lang],
    alternateName: SITE_NAME[lang === 'en' ? 'tr' : 'en'],
    url: `${ORIGIN}/`,
    description: pageMeta(null, lang).description,
    applicationCategory: 'GameApplication',
    genre: lang === 'en' ? 'Word game' : 'Kelime oyunu',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
    isAccessibleForFree: true,
    inLanguage: ['tr', 'en'],
    screenshot: IMAGE,
    author: AUTHOR,
    sameAs: ['https://github.com/MrcDprm/hangman-game', 'https://www.miracdeprem.com/projects/adam-asmaca'],
  };
}

function categorySchemas(category, path, lang, meta) {
  const { tr, en } = localeUrls(ORIGIN, path);
  const url = lang === 'en' ? en : tr;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.description,
      url,
      inLanguage: lang === 'en' ? 'en-US' : 'tr-TR',
      isPartOf: { '@id': APP_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME[lang], item: lang === 'en' ? `${ORIGIN}/?lang=en` : `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: translate(lang, `cat_${category}`), item: url },
      ],
    },
  ];
}

/**
 * İstenen adresin HTML'i ve durum kodu. slug boşsa ana sayfa; bilinmeyen adreste oyun yine açılır
 * ama 404 döner ve dizine eklenmez (adres metni sayfaya hiç yazılmaz).
 */
export function renderPage(template, slug, lang) {
  const category = slug ? categoryForSlug(slug) : null;
  const known = !slug || Boolean(category);
  const path = pathFor(category);
  const meta = pageMeta(category, lang);
  const head = buildHead({
    origin: ORIGIN,
    path,
    lang,
    ...meta,
    siteName: SITE_NAME[lang],
    image: IMAGE,
    schemas: category ? categorySchemas(category, path, lang, meta) : [appSchema(lang)],
    index: known,
  });
  return { status: known ? 200 : 404, html: injectHead(template, head, lang) };
}

export const renderSitemap = () => buildSitemap(ORIGIN, SITEMAP_PATHS);

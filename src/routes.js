// Uygulamanın adresleri: her kategori kendi sayfasına sahip (/hayvanlar, /ulkeler …).
// Hem tarayıcı (main.js) hem sunucu fonksiyonu (api/page.js) kullanır; başlıklar iki tarafta aynı olur.
import { CATEGORIES } from './words.js';
import { translate } from './i18n.js';

export const ORIGIN = 'https://hangman.miracdeprem.com';

export const CATEGORY_SLUGS = {
  animals: 'hayvanlar',
  countries: 'ulkeler',
  cities: 'sehirler',
  food: 'yiyecek-ve-icecek',
  jobs: 'meslekler',
  tech: 'teknoloji',
  sports: 'spor',
  nature: 'doga',
  home: 'ev',
  science: 'bilim',
};

const BY_SLUG = new Map(CATEGORIES.map((category) => [CATEGORY_SLUGS[category], category]));

export const categoryForSlug = (slug) => BY_SLUG.get(slug) ?? null;

/** "/hayvanlar" → "animals"; adresi olmayan yol için null. */
export function categoryFromPath(pathname) {
  return categoryForSlug(pathname.replace(/^\/+|\/+$/g, '').toLowerCase());
}

export const pathFor = (category) => (category ? `/${CATEGORY_SLUGS[category]}` : '/');

export const SITEMAP_PATHS = ['/', ...CATEGORIES.map(pathFor)];

const HOME = {
  tr: {
    title: 'Adam Asmaca Oyna – Ücretsiz Türkçe Kelime Oyunu | Miraç Deprem',
    description:
      'Ücretsiz adam asmaca oyunu: 10 kategoride 1.000 Türkçe ve 1.000 İngilizce kelime, ipucu ve seri istatistikleri. Tarayıcıda hemen oyna, üyelik gerekmez.',
  },
  en: {
    title: 'Hangman Game – Play Free Online | Miraç Deprem',
    description:
      'Play hangman online for free: 1,000 English and 1,000 Turkish words in 10 categories, hints and win streaks. No sign-up, right in your browser.',
  },
};

/** Sekme başlığı ve açıklama. category boşsa ana sayfa metni döner. */
export function pageMeta(category, lang) {
  if (!category) return HOME[lang];
  const name = translate(lang, `cat_${category}`);
  return lang === 'en'
    ? {
        title: `Hangman: ${name} – Free Word Game`,
        description: `Play hangman with 100 ${name.toLowerCase()} words: guess the letters, use a hint and build a win streak. Free, no sign-up.`,
      }
    : {
        title: `Adam Asmaca: ${name} – Ücretsiz Kelime Oyunu`,
        description: `${name} kategorisinde 100 kelimeyle adam asmaca oyna: harfleri tahmin et, ipucu kullan, serini büyüt. Ücretsiz, üyelik gerekmez.`,
      };
}
